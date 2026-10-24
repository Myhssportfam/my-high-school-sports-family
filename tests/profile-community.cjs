const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(name, imports) {
  const module = {exports:{}};
  const code = ts.transpileModule(fs.readFileSync(name, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  vm.runInNewContext(code, {module,exports:module.exports,require:(id) => imports[id],Date});
  return module.exports;
}
const states = load('lib/stateCommunities.ts', {});
const broadcasts = load('lib/broadcasts.ts', {'./stateCommunities':states});
function fixture(fail = false) {
  const writes=[]; let commits=0;
  const api=load('lib/profileCommunityPosts.ts', {
    './firebase':{db:{}}, './broadcasts':broadcasts,
    'firebase/firestore':{doc:(_, ...parts) => parts.join('/'),serverTimestamp:() => 'timestamp',writeBatch:() => ({set:(ref,data) => writes.push({ref,data}),commit:async () => {commits++;if(fail) throw new Error('Permission denied');}})}
  });
  return {api,writes,get commits(){return commits;}};
}
const input={user:{uid:'athlete-1',displayName:'Test Athlete'},profile:{state:'Texas'},id:'123-0',mediaUrl:'https://example.com/video.mp4',type:'video',caption:'Practice'};
test('profile photo/video publishes matching profile and canonical state records in one commit', async () => {
  const f=fixture(); await f.api.publishProfileCommunityPost(input);
  assert.equal(f.commits,1); assert.equal(f.writes.length,2);
  assert.equal(f.writes[0].ref,'users/athlete-1/posts/123-0');
  assert.equal(f.writes[1].ref,'stateFeeds/tx/posts/profile-athlete-1-123-0');
  assert.equal(f.writes[0].data.mediaUrl,f.writes[1].data.mediaUrl);
  assert.equal(f.writes[0].data.caption,f.writes[1].data.message);
  assert.equal(f.writes[1].data.type,'Video');
  assert.equal(f.api.profileCommunityState({stateId:'CO'}).stateId,'co');
});
test('missing or unknown state prevents either database write', async () => {
  const f=fixture(); await assert.rejects(f.api.publishProfileCommunityPost({...input,profile:{state:'Unknown'}}), /Choose your state/);
  assert.equal(f.writes.length,0); assert.equal(f.commits,0);
});
test('failed atomic commit is surfaced instead of claiming the post succeeded', async () => {
  const f=fixture(true); await assert.rejects(f.api.publishProfileCommunityPost(input), /Permission denied/);
  assert.equal(f.commits,1);
});
