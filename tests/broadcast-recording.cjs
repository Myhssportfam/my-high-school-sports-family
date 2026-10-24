const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const {File} = require('node:buffer');
function fixture() {
  const instances = [];
  class Recorder {
    static isTypeSupported(type) { return type === 'video/mp4'; }
    constructor(stream, options) { this.state = 'inactive'; this.mimeType = options.mimeType; instances.push(this); }
    start() { this.state = 'recording'; }
    emit(text) { this.ondataavailable({data: new Blob([text], {type: this.mimeType})}); }
    stop() { this.state = 'inactive'; queueMicrotask(() => { this.emit('last'); this.onstop(); }); }
  }
  const module = {exports:{}};
  const code = ts.transpileModule(fs.readFileSync('lib/broadcastRecording.ts', 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  vm.runInNewContext(code, {module, exports:module.exports, MediaRecorder:Recorder, File, Blob, setTimeout, clearTimeout, Promise});
  return {record:module.exports.recordBroadcast, instances};
}
test('recording includes final data, uses supported extension, and finish is repeatable', async () => {
  const f = fixture(); const handle = f.record({}, 'workout'); f.instances[0].emit('first');
  const result = await handle.finish(); assert.equal(await result.file.text(), 'firstlast');
  assert.equal(result.file.name, 'workout.mp4'); assert.equal(result.truncated, false);
  assert.equal((await handle.finish()).file, result.file);
});
test('recording byte limit preserves available data without stopping live tracks', async () => {
  const f = fixture(); const handle = f.record({}, 'workout', {maxBytes:4}); f.instances[0].emit('first');
  const result = await handle.finish(); assert.equal(result.truncated, true); assert.equal(await result.file.text(), 'firstlast');
});
test('story timer finalizes a separate playable recording', async () => {
  const f = fixture(); const handle = f.record({}, 'story', {maxMs:1});
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(f.instances[0].state, 'inactive'); assert.equal((await handle.finish()).truncated, false);
});
