const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const moduleObject={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/contentDeletion.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,
  {module:moduleObject,exports:moduleObject.exports,require:()=>({}),Error});
const {removeOwnedContent}=moduleObject.exports;
function fixture(fail=false) {
  const docs=new Map([
    ['users/alice/posts/a',{stateId:'tx',communityPostId:'profile-alice-a'}],
    ['stateFeeds/tx/posts/profile-alice-a',{userId:'alice',authorId:'alice',profileUserId:'alice',profilePostId:'a',activityType:'profilePost'}],
    ['posts/b',{authorId:'bob'}],['coachPosts/b',{authorId:'bob'}],
    ['stateStories/tx/stories/a',{userId:'alice'}],['stateStories/tx/stories/b',{userId:'bob'}],
  ]);
  const commits=[],cleaned=[];
  const db={doc:path=>({path,get:async()=>({exists:docs.has(path),data:()=>docs.get(path)})}),
    batch:()=>{const paths=[];return {delete:ref=>paths.push(ref.path),commit:async()=>{if(fail)throw new Error('Commit failed');commits.push(paths);paths.forEach(path=>docs.delete(path))}}},
    recursiveDelete:async ref=>{cleaned.push(ref.path)},
  };
  return {docs,db,commits,cleaned};
}
test('profile deletion removes profile and matched state copy in one commit',async()=>{
  const f=fixture();await removeOwnedContent(f.db,'alice',{kind:'profile',id:'a'});
  assert.equal(f.commits.length,1);assert.equal(f.commits[0].length,2);
  assert.equal(f.docs.has('users/alice/posts/a'),false);
  assert.equal(f.docs.has('stateFeeds/tx/posts/profile-alice-a'),false);
  assert.equal(f.cleaned.length,2);
});
test('deleting the state copy removes the linked profile post too',async()=>{
  const f=fixture();await removeOwnedContent(f.db,'alice',{kind:'state',stateId:'tx',id:'profile-alice-a'});
  assert.equal(f.docs.has('users/alice/posts/a'),false);assert.equal(f.commits[0].length,2);
});
test('another user cannot delete posts, coach posts, or stories',async()=>{
  const f=fixture();
  for(const [kind,id] of [['post','b'],['coach','b'],['story','b']])
    await assert.rejects(removeOwnedContent(f.db,'alice',{kind,id,stateId:'tx'}),/only delete your own/);
  assert.equal(f.commits.length,0);
});
test('path traversal and unknown content kinds are rejected',async()=>{
  const f=fixture();
  await assert.rejects(removeOwnedContent(f.db,'alice',{kind:'profile',id:'../bob'}),/Invalid/);
  await assert.rejects(removeOwnedContent(f.db,'alice',{kind:'story',id:'a',stateId:'tx/stories'}),/Invalid/);
  await assert.rejects(removeOwnedContent(f.db,'alice',{kind:'anything',id:'a'}),/Choose/);
  assert.equal(f.commits.length,0);
});
test('failed commit leaves both copies intact',async()=>{
  const f=fixture(true);await assert.rejects(removeOwnedContent(f.db,'alice',{kind:'profile',id:'a'}),/Commit failed/);
  assert.equal(f.docs.has('users/alice/posts/a'),true);assert.equal(f.docs.has('stateFeeds/tx/posts/profile-alice-a'),true);
});
test('tampered mirror metadata cannot delete another author’s content',async()=>{
  const f=fixture();f.docs.set('stateFeeds/tx/posts/profile-alice-a',{authorId:'bob',profilePostId:'a',profileUserId:'alice'});
  await removeOwnedContent(f.db,'alice',{kind:'profile',id:'a'});
  assert.equal(f.docs.has('stateFeeds/tx/posts/profile-alice-a'),true);assert.equal(f.commits[0].length,1);
});
test('owned story deletion and retries work without a role requirement',async()=>{
  for(const role of ['athlete','coach','parent','fan','trainer','media','cheerleader','band']) {
    const f=fixture();f.docs.set('users/alice',{role});
    await removeOwnedContent(f.db,'alice',{kind:'story',id:'a',stateId:'tx'});
    const retry=await removeOwnedContent(f.db,'alice',{kind:'story',id:'a',stateId:'tx'});
    assert.equal(retry.deleted,true);assert.equal(f.docs.has('stateStories/tx/stories/b'),true);
  }
});
