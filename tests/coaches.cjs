const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const moduleFixture = {exports:{}};
const code = ts.transpileModule(fs.readFileSync('lib/coaches.ts', 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
vm.runInNewContext(code, {module:moduleFixture, exports:moduleFixture.exports});
const {isCoach, validateCoachPost} = moduleFixture.exports;
test('coach participation handles missing profiles and preserves dual roles', () => {
  assert.equal(isCoach(null), false);
  assert.equal(isCoach({role:'athlete'}), false);
  assert.equal(isCoach({role:'coach'}), true);
  assert.equal(isCoach({role:'athlete', coachesCorner:true}), true);
  assert.equal(isCoach({coachesCorner:'true'}), false);
});
test('posts accept supported mixed media and text at the allowed boundaries', () => {
  assert.doesNotThrow(() => validateCoachPost('T'.repeat(140), 'C'.repeat(2000), 'Camps', [
    {type:'image/jpeg',size:50*1024*1024-1}, {type:'video/mp4',size:2048},
    {type:'image/png',size:2048}, {type:'video/webm',size:2048}
  ]));
});
test('invalid posts are rejected before uploading', () => {
  assert.throws(() => validateCoachPost(' ', 'Body', 'Players', []), /title/);
  assert.throws(() => validateCoachPost('Title', ' ', 'Players', []), /post/);
  assert.throws(() => validateCoachPost('Title', 'C'.repeat(2001), 'Players', []), /post/);
  assert.throws(() => validateCoachPost('Title', 'Body', 'Unknown', []), /topic/);
  assert.throws(() => validateCoachPost('Title', 'Body', 'Players', [{type:'application/pdf',size:100}]), /photos or videos/);
  assert.throws(() => validateCoachPost('Title', 'Body', 'Players', [{type:'video/mp4',size:50*1024*1024}]), /smaller/);
  assert.throws(() => validateCoachPost('Title', 'Body', 'Players', Array(5).fill({type:'image/jpeg',size:100})), /four/);
});
