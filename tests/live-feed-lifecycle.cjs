const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { stripTypeScriptTypes } = require('node:module');
const vm = require('node:vm');
const source = readFileSync(join(__dirname, '../components/broadcast/LiveFeed.tsx'), 'utf8');
const body = source.slice(source.indexOf('    useEffect(() => {') + '    useEffect(() => {'.length, source.indexOf('    }, [athleteId'));
const code = stripTypeScriptTypes(`function mount() { ${body} }`, { mode: 'strip' });
function harness(scope = {}) {
  const state = { streams: [{ id: 'old' }], selected: 'old', error: 'old', loading: false };
  const listeners = [];
  let authCallback, stopAuth = 0, stoppedClock = 0;
  const context = {
    ...{ athleteId: undefined, roomId: undefined, arenaOnly: false, communityId: undefined }, ...scope,
    setStreams: x => state.streams = x, setSelected: x => state.selected = x,
    setError: x => state.error = x, setLoading: x => state.loading = x,
    setNow: x => state.now = x, Date, auth: {}, db: {},
    console: { error: (...args) => state.diagnostic = args },
    where: (...args) => args, orderBy: (...args) => ['orderBy', ...args], limit: n => ['limit', n],
    collection: (_, name) => name, query: (...args) => args,
    onAuthStateChanged: (_, cb) => { authCallback = cb; return () => stopAuth++; },
    onSnapshot: (query, next, error) => {
      const item = { query, next, error, stopped: 0 };
      listeners.push(item); return () => item.stopped++;
    },
    setInterval: () => 7, clearInterval: id => { assert.equal(id, 7); stoppedClock++; },
  };
  vm.createContext(context); vm.runInContext(code, context);
  const cleanup = context.mount();
  return { state, listeners, changeAuth: () => authCallback(), cleanup,
    cleanupCounts: () => [stopAuth, stoppedClock] };
}
const docs = [{ id: 'new', data: () => ({ provider: 'cloudflare', title: 'Workout' }) },
  { id: 'other', data: () => ({ provider: 'other' }) }];
const h = harness({ athleteId: 'owner-a' });
assert.equal(h.listeners.length, 0, 'wait for restored authentication');
assert.equal(h.state.streams.length, 0, 'remove previous scope before waiting');
h.changeAuth();
assert(h.listeners[0].query.some(part => Array.isArray(part) && part.join() === 'ownerId,==,owner-a'));
h.listeners[0].next({ docs });
assert.equal(h.state.streams.length, 1); assert.equal(h.state.streams[0].id, 'new');
assert.equal(h.state.loading, false);
h.listeners[0].error({ code: 'permission-denied', message: 'Missing or insufficient permissions.' });
assert.equal(h.state.streams.length, 0); assert.equal(h.state.selected, '');
assert.match(h.state.error, /signing in/);
assert.equal(h.state.diagnostic[1].code, 'permission-denied');
h.changeAuth();
assert.equal(h.listeners.length, 2, 'sign-in restarts terminal listener');
assert.equal(h.listeners[0].stopped, 1);
assert.equal(h.state.error, ''); assert.equal(h.state.loading, true);
h.listeners[0].next({ docs });
assert.equal(h.state.streams.length, 0, 'ignore queued snapshots from old authentication');
h.listeners[1].next({ docs }); assert.equal(h.state.streams.length, 1);
h.cleanup(); assert.equal(h.listeners[1].stopped, 1);
assert.deepEqual(h.cleanupCounts(), [1, 1]);
h.listeners[1].error({ code: 'unavailable', message: 'Offline' });
assert.equal(h.state.error, '', 'unmount ignores late error');
const retry = harness(); retry.changeAuth();
retry.listeners[0].error({ code: 'unavailable', message: 'Network unavailable' });
assert.match(retry.state.error, /retry/); retry.cleanup();
const remount = harness(); remount.changeAuth(); remount.listeners[0].next({ docs: [] });
assert.equal(remount.state.loading, false); assert.equal(remount.state.error, '');
assert.equal(remount.state.streams.length, 0); remount.cleanup();
const indexes = JSON.parse(readFileSync(join(__dirname, '../LIVE_INDEXES_REFERENCE.json'), 'utf8'));
assert.equal(indexes.indexes.filter(i => i.collectionGroup === 'liveStreams').length, 6);
for (const name of ['schools', 'users', 'cities']) assert(indexes.indexes.some(i => i.collectionGroup === name));
console.log('PASS: auth restoration, scope isolation, filtering, error diagnostics, reconnect, late callbacks, cleanup, empty results, and preserved indexes.');
