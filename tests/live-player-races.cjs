const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {stripTypeScriptTypes} = require('node:module');
const vm = require('node:vm');
const source = readFileSync('components/broadcast/LivePlayer.tsx', 'utf8');
const leaveBody = source.split('const leave = useCallback(async () => {')[1].split('    }, [id]);')[0];
const watchBody = source.slice(source.indexOf('    async function watch()'), source.indexOf('    if (!loaded)'));
const code = stripTypeScriptTypes(`async function leave() {${leaveBody}}\n${watchBody}`);
const deferred = () => {let resolve, reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return {promise,resolve,reject}};
function harness() {
  const joins=[], connections=[], actions=[], intervals=[];
  const state={};const ref=current=>({current});
  const ctx={id:'stream-a', uid:'alice', controller:ref(null), timer:ref(null), viewer:ref(null),
    session:ref(null), media:ref(null), video:ref({srcObject:null,play:()=>Promise.resolve()}),
    mounted:ref(true),generation:ref(0),AbortController,MediaStream:class {},Error,
    setWatching:x=>state.watching=x,setBusy:x=>state.busy=x,setStatus:x=>state.status=x,
    clearInterval:x=>{x.cleared=true},setInterval:fn=>{const x={fn};intervals.push(x);return x},
    broadcastAction:input=>{actions.push(input);if(input.action==='join'){const d=deferred();joins.push(d);return d.promise}return Promise.resolve({})},
    connectVideo:()=>{const d=deferred();connections.push(d);return d.promise},
  };
  vm.createContext(ctx);vm.runInContext(code,ctx);
  return {ctx,state,joins,connections,actions,intervals};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const connected=()=>({stopped:0,pc:{connectionState:'connected'},async stop(){this.stopped++}});
test('late join cannot replace or leave the new viewer',async()=>{
  const h=harness();const first=h.ctx.watch();await h.ctx.leave();const second=h.ctx.watch();
  h.joins[1].resolve({viewerId:'new',playbackUrl:'new-url'});await tick();
  const live=connected();h.connections[0].resolve(live);await second;
  h.joins[0].resolve({viewerId:'old',playbackUrl:'old-url'});await first;
  assert.equal(h.ctx.viewer.current,'new');assert.equal(live.stopped,0);
  assert(h.actions.some(a=>a.action==='leave'&&a.viewerId==='old'));
  assert(!h.actions.some(a=>a.action==='leave'&&a.viewerId==='new'));
  await h.ctx.leave();
});
test('late video negotiation stops only its own connection',async()=>{
  const h=harness();const first=h.ctx.watch();h.joins[0].resolve({viewerId:'old',playbackUrl:'old'});await tick();
  await h.ctx.leave();const second=h.ctx.watch();h.joins[1].resolve({viewerId:'new',playbackUrl:'new'});await tick();
  const fresh=connected();h.connections[1].resolve(fresh);await second;
  const stale=connected();h.connections[0].resolve(stale);await first;
  assert.equal(stale.stopped,1);assert.equal(fresh.stopped,0);assert.equal(h.ctx.session.current,fresh);
  assert.equal(h.state.watching,true);await h.ctx.leave();
});
test('old asynchronous stop cannot clear new playback state',async()=>{
  const h=harness();const stop=deferred();h.ctx.session.current={stop:()=>stop.promise};h.ctx.viewer.current='old';
  const leaving=h.ctx.leave();const watching=h.ctx.watch();h.joins[0].resolve({viewerId:'new',playbackUrl:'new'});await tick();
  h.connections[0].resolve(connected());await watching;stop.resolve();await leaving;
  assert.equal(h.state.watching,true);assert.equal(h.ctx.viewer.current,'new');await h.ctx.leave();
});
test('late heartbeat failure cannot close a replacement connection',async()=>{
  const h=harness();const first=h.ctx.watch();h.joins[0].resolve({viewerId:'old',playbackUrl:'old'});await tick();
  h.connections[0].resolve(connected());await first;const oldTimer=h.intervals[0];
  await h.ctx.leave();const before=h.actions.length;oldTimer.fn();assert.equal(h.actions.length,before);
});
test('subscription errors have a visible retry path rather than not-found',()=>{
  assert(source.indexOf('if (loadError)') < source.indexOf('if (!stream)'));
  assert(source.includes('current !== request'));
});
