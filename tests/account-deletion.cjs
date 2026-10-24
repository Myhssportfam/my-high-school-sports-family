const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, imports = {}) {
  const module = {exports:{}};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,
    {module,exports:module.exports,require:id=>imports[id],Date,Number,Error,Promise,process:{env:{NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:'test'}},console:{error(){}}});
  return module.exports;
}
const deletion = load('lib/accountDeletion.ts');
function fixture() {
  const documents = new Map([
    ['users/alice',{displayName:'Alice'}],['users/alice/posts/photo',{userId:'alice'}],
    ['users/alice/following/bob',{}],['users/bob/followers/alice',{}],['users/bob',{followersCount:2}],
    ['users/bob/posts/keep',{userId:'bob'}],['posts/a',{authorId:'alice'}],['posts/a/comments/bob',{authorId:'bob'}],
    ['posts/b',{authorId:'bob'}],['coachPosts/a',{authorId:'alice'}],['coachPosts/b',{authorId:'bob'}],
    ['stateFeeds/tx/posts/a',{userId:'alice'}],['stateFeeds/tx/posts/b',{userId:'bob'}],
    ['stateStories/co/stories/a',{userId:'alice'}],['liveStreams/a',{ownerId:'alice'}],
    ['statePosts/a',{userId:'alice',stateId:'tx'}],['statePosts/b',{userId:'bob',stateId:'tx'}],
    ['notifications/alice/items/a',{}],['notifications/bob/items/a',{}],
  ]);
  const operations=[];
  const snap=path=>({id:path.split('/').pop(),ref:db.doc(path),exists:documents.has(path),get:field=>documents.get(path)?.[field],data:()=>documents.get(path)});
  const db={
    doc:path=>({path,id:path.split('/').pop(),get:async()=>snap(path),collection:name=>db.collection(`${path}/${name}`),delete:async()=>{documents.delete(path)}}),
    collection:path=>({
      get:async()=>({docs:[...documents.keys()].filter(key=>key.startsWith(path+'/')&&key.split('/').length===path.split('/').length+1).map(snap)}),
      listDocuments:async()=>[...new Set([...documents.keys()].filter(key=>key.startsWith(path+'/')).map(key=>key.split('/').slice(0,path.split('/').length+1).join('/')))].map(key=>db.doc(key)),
      where:(field,_,uid)=>({limit:()=>({get:async()=>{const docs=[...documents.keys()].filter(key=>key.startsWith(path+'/')&&key.split('/').length===path.split('/').length+1&&documents.get(key)[field]===uid).map(snap);return {docs,empty:!docs.length}}}),get:async()=>({docs:[...documents.keys()].filter(key=>key.startsWith(path+'/')&&documents.get(key)[field]===uid).map(snap)})}),
    }),
    recursiveDelete:async ref=>{operations.push(`delete:${ref.path}`);for(const key of documents.keys())if(key===ref.path||key.startsWith(ref.path+'/'))documents.delete(key)},
    runTransaction:async fn=>fn({get:async ref=>snap(ref.path),delete:ref=>documents.delete(ref.path),update:(ref,data)=>documents.set(ref.path,{...documents.get(ref.path),...data})}),
  };
  const dependencies={deleteMedia:async prefix=>operations.push(`media:${prefix}`),retireLiveInput:async id=>operations.push(`live:${id}`),deleteAuthUser:async uid=>operations.push(`auth:${uid}`)};
  return {db,documents,operations,dependencies};
}
test('confirmation and recent authentication are both required',()=>{
  const now=600000;
  assert.throws(()=>deletion.requireDeletionConfirmation({confirmation:'yes'},600,now),/Type DELETE/);
  assert.throws(()=>deletion.requireDeletionConfirmation({confirmation:'DELETE'},299,now),/Verify/);
  assert.throws(()=>deletion.requireDeletionConfirmation({confirmation:'DELETE'},NaN,now),/Verify/);
  deletion.requireDeletionConfirmation({confirmation:'DELETE'},590,now);
});
test('deletion removes owned nested data across states, preserves another account, deletes auth last',async()=>{
  const f=fixture();await deletion.deleteAccountData(f.db,'alice',f.dependencies);
  assert.equal(f.documents.has('users/alice/posts/photo'),false);
  assert.equal(f.documents.has('posts/a/comments/bob'),false);
  assert.equal(f.documents.has('stateFeeds/tx/posts/a'),false);
  assert.equal(f.documents.has('stateStories/co/stories/a'),false);
  assert.equal(f.documents.has('statePosts/a'),false);
  assert.equal(f.documents.has('statePosts/b'),true);
  assert.ok(f.operations.includes('media:state-posts/tx/alice/'));
  assert.equal(f.documents.has('users/bob/posts/keep'),true);
  assert.equal(f.documents.has('coachPosts/b'),true);
  assert.equal(f.documents.has('stateFeeds/tx/posts/b'),true);
  assert.equal(f.documents.get('users/bob').followersCount,1);
  assert.equal(f.operations.at(-1),'auth:alice');
  assert.ok(f.operations.indexOf('live:a')<f.operations.indexOf('delete:liveStreams/a'));
});
test('storage cleanup cannot match a neighboring UID',()=>{
  for(const prefix of deletion.accountMediaPrefixes('alice')) {assert.ok(prefix.endsWith('/alice/'));assert.equal(`${prefix.slice(0,-1)}2/file`.startsWith(prefix),false)}
  assert.throws(()=>deletion.accountMediaPrefixes('alice/bob'),/Invalid/);
});
test('media or live cleanup failure keeps authentication and profile for retry',async()=>{
  for(const dependency of ['deleteMedia','retireLiveInput']) {
    const f=fixture();f.dependencies[dependency]=async()=>{throw new Error('Unavailable')};
    await assert.rejects(deletion.deleteAccountData(f.db,'alice',f.dependencies),/Unavailable/);
    assert.equal(f.documents.has('users/alice'),true);
    assert.equal(f.operations.includes('auth:alice'),false);
  }
});
test('repeating cleanup does not decrement follower counts twice',async()=>{
  const f=fixture();await deletion.deleteAccountData(f.db,'alice',f.dependencies);await deletion.deleteAccountData(f.db,'alice',f.dependencies);
  assert.equal(f.documents.get('users/bob').followersCount,1);
});
test('API rejects missing tokens, stale sign-in, and wrong confirmation before cleanup',async()=>{
  for(const [authorization,authTime,confirmation,expected] of [[undefined,Date.now()/1000,'DELETE',401],['Bearer ok',1,'DELETE',401],['Bearer ok',Date.now()/1000,'no',400]]) {
    let cleaned=false;
    const handler=load('pages/api/account/delete.ts',{
      '../../../lib/firebaseAdmin':{default:{auth:()=>({verifyIdToken:async()=>({uid:'alice',auth_time:authTime})})},adminDb:{}},
      '../../../lib/accountDeletion':{...deletion,deleteAccountData:async()=>{cleaned=true}},'../../../lib/broadcastServer':{},
    }).default;
    const res={setHeader(){},status(code){this.code=code;return this},json(data){this.data=data}};
    await handler({method:'POST',headers:{authorization},body:{confirmation,uid:'bob'}},res);
    assert.equal(res.code,expected);assert.equal(cleaned,false);
  }
});
test('API selects only verified UID even when a different UID is supplied',async()=>{
  let selected;
  const handler=load('pages/api/account/delete.ts',{
    '../../../lib/firebaseAdmin':{default:{auth:()=>({verifyIdToken:async()=>({uid:'alice',auth_time:Date.now()/1000})}),storage:()=>({bucket:()=>({})})},adminDb:{doc:()=>({delete:async()=>{}}),runTransaction:async fn=>fn({get:async()=>({get:()=>0}),set(){}})}},
    '../../../lib/accountDeletion':{...deletion,deleteAccountData:async(_,uid)=>{selected=uid}},'../../../lib/broadcastServer':{},
  }).default;
  const res={setHeader(){},status(code){this.code=code;return this},json(){}};
  await handler({method:'POST',headers:{authorization:'Bearer ok'},body:{confirmation:'DELETE',uid:'bob'}},res);
  assert.equal(res.code,200);assert.equal(selected,'alice');
});
