import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import admin from '../../../lib/firebaseAdmin';
import { announce, authenticatedUser, broadcasterProfile, database, LiveError, retireInput, safeId, streamConfigured, streamRequest, validateRoom } from '../../../lib/broadcastServer';
export const config = { api: { bodyParser: { sizeLimit: '16kb' } } };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 'no-store');
    try {
        if (!['GET', 'POST'].includes(req.method || '')) {
            res.setHeader('Allow', 'GET, POST');
            return res.status(405).json({ error: 'Method not allowed.' });
        }
        const user = await authenticatedUser(req);
        const db = database();
        if (req.method === 'GET')
            return res.json({ ready: streamConfigured() });
        const body = req.body || {};
        if (body.action === 'schedule' || body.action === 'start') {
            const profile = await broadcasterProfile(user.uid);
            const roomId = body.roomId ? safeId(body.roomId, 'room') : '';
            await validateRoom(user.uid, roomId);
            const mode = body.mode === 'screen' ? 'screen' : 'camera';
            const title = typeof body.title === 'string' ? body.title.trim().slice(0, 140) : '';
            const sport = typeof body.sport === 'string' ? body.sport.trim().slice(0, 60) : profile.sport;
            if (body.action === 'schedule') {
                const date = new Date(body.date);
                if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now())
                    throw new LiveError(400, 'Choose a future date and time.');
                const ref = db.collection('liveStreams').doc();
                // Rate-limit scheduling per authenticated user across server instances.
                await db.runTransaction(async (tx) => {
                    const rateRef = db.doc(`broadcastHosts/${user.uid}`);
                    const rate = (await tx.get(rateRef)).data();
                    if (Date.now() - (rate?.lastScheduleMs || 0) < 10000)
                        throw new LiveError(429, 'Wait a few seconds before scheduling another broadcast.');
                    tx.set(rateRef, { lastScheduleMs: Date.now() }, { merge: true });
                    tx.set(ref, { ...profile, ownerId: user.uid, createdBy: user.uid, athleteIds: [user.uid], provider: 'cloudflare', broadcastMode: mode,
                        title: title || `${profile.broadcaster}'s live workout`, sport, roomId, isArena: !!roomId, status: 'scheduled',
                        scheduledDate: date.toISOString(), scheduledTime: date.toISOString(),
                        platform: 'MHSSF Live', matchup: roomId ? 'Arena broadcast' : 'Live workout',
                        streamUrl: `/live/${ref.id}`, createdAt: admin.firestore.FieldValue.serverTimestamp(), createdAtMs: Date.now(), viewers: 0, peakViewers: 0 });
                });
                const warning = await announce(ref.id, 'scheduled').then(() => undefined).catch(() => 'Scheduled, but the community announcement could not be posted.');
                return res.json({ id: ref.id, warning });
            }
            if (!streamConfigured())
                throw new LiveError(503, 'Live video is not enabled yet. The site owner needs to connect Cloudflare Stream.');
            const ref = body.id ? db.doc(`liveStreams/${safeId(body.id, 'stream')}`) : db.collection('liveStreams').doc();
            const lock = db.doc(`broadcastHosts/${user.uid}`);
            const sessionId = randomUUID();
            let scheduled = false;
            let staleId = '';
            await db.runTransaction(async (tx) => {
                const [current, lease] = await Promise.all([tx.get(ref), tx.get(lock)]);
                const stream = current.data();
                const active = lease.data();
                if (Date.now() - (active?.lastStartMs || 0) < 10000)
                    throw new LiveError(429, 'Wait a few seconds before starting again.');
                if (active?.activeId && Date.now() - (active.heartbeatMs || 0) < 60000)
                    throw new LiveError(409, 'You already have a live broadcast. End it before starting another.');
                if (body.id && (!stream || stream.ownerId !== user.uid || stream.status !== 'scheduled' || stream.provider !== 'cloudflare'))
                    throw new LiveError(403, 'Only the owner can start this scheduled broadcast.');
                if (stream?.roomId && stream.roomId !== roomId)
                    throw new LiveError(400, 'Open the scheduled broadcast from its Arena room or watch page.');
                scheduled = !!stream;
                if (active?.activeId && active.activeId !== ref.id) {
                    staleId = active.activeId;
                    tx.update(db.doc(`liveStreams/${active.activeId}`), { status: 'ended', viewers: 0, endedAtMs: Date.now() });
                }
                tx.set(lock, { activeId: ref.id, sessionId, heartbeatMs: Date.now(), lastStartMs: Date.now() }, { merge: true });
                tx.set(ref, { ...profile, ownerId: user.uid, createdBy: user.uid, athleteIds: [user.uid], provider: 'cloudflare', broadcastMode: mode,
                    title: stream?.title || title || `${profile.broadcaster}'s live workout`, sport: stream?.sport || sport, roomId, isArena: !!roomId,
                    status: 'connecting', sessionId, heartbeatMs: Date.now(), platform: 'MHSSF Live',
                    matchup: roomId ? 'Arena broadcast' : 'Live workout', streamUrl: `/live/${ref.id}`, viewers: 0, peakViewers: 0,
                    ...(!stream ? { createdAt: admin.firestore.FieldValue.serverTimestamp(), createdAtMs: Date.now() } : {}),
                }, { merge: true });
            });
            if (staleId) {
                await retireInput(staleId);
                await announce(staleId, 'ended').catch(() => { });
            }
            let input: {
                uid: string;
                webRTC: {
                    url: string;
                };
                webRTCPlayback: {
                    url: string;
                };
            } | null = null;
            try {
                input = await streamRequest('', { method: 'POST', body: JSON.stringify({ meta: { name: `MHSSF ${ref.id}` }, recording: { mode: 'off' }, enabled: true }) });
                if (!input?.uid || !input.webRTC?.url || !input.webRTCPlayback?.url)
                    throw new LiveError(502, 'The broadcast service did not return WebRTC endpoints.');
                for (const url of [input.webRTC.url, input.webRTCPlayback.url]) {
                    const parsed = new URL(url);
                    if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.cloudflarestream.com'))
                        throw new LiveError(502, 'Invalid broadcast service endpoint.');
                }
                // Private publish credential is never stored on the publicly readable stream.
                await db.doc(`broadcastSecrets/${ref.id}`).set({ inputUid: input.uid, publishUrl: input.webRTC.url, sessionId, ownerId: user.uid });
                await ref.update({ playbackUrl: input.webRTCPlayback.url });
                return res.json({ id: ref.id, sessionId, publishUrl: input.webRTC.url });
            }
            catch (error) {
                if (input?.uid) {
                    try {
                        await streamRequest(`/${encodeURIComponent(input.uid)}`, { method: 'DELETE' });
                        await db.doc(`broadcastSecrets/${ref.id}`).delete();
                    }
                    catch {
                        await db.doc(`broadcastSecrets/${ref.id}`).set({ inputUid: input.uid, ownerId: user.uid, sessionId, cleanupPending: true }, { merge: true });
                    }
                }
                await db.runTransaction(async (tx) => {
                    const lease = (await tx.get(lock)).data();
                    if (lease?.sessionId === sessionId) {
                        tx.set(lock, { activeId: '', heartbeatMs: 0 }, { merge: true });
                        tx.update(ref, { status: scheduled ? 'scheduled' : 'failed' });
                    }
                });
                throw error;
            }
        }
        const id = safeId(body.id, 'stream');
        const ref = db.doc(`liveStreams/${id}`);
        const stream = (await ref.get()).data();
        if (!stream || stream.provider !== 'cloudflare')
            throw new LiveError(404, 'Broadcast not found.');
        if (body.action === 'join') {
            if (stream.status !== 'live' || Date.now() - stream.heartbeatMs > 60000)
                throw new LiveError(409, 'This broadcast is not live right now.');
            const viewerId = randomUUID();
            await ref.collection('viewers').doc(viewerId).set({ uid: user.uid, sessionId: stream.sessionId, lastSeenMs: 0 });
            return res.json({ viewerId, sessionId: stream.sessionId, playbackUrl: stream.playbackUrl });
        }
        if (body.viewerId) {
            const viewer = ref.collection('viewers').doc(safeId(body.viewerId, 'viewer'));
            const record = (await viewer.get()).data();
            if (!record || record.uid !== user.uid)
                throw new LiveError(403, 'Viewer session not found.');
            if (body.action === 'leave') {
                await viewer.delete();
                return res.json({ ok: true });
            }
            if (body.action === 'heartbeat' && stream.status === 'live' && Date.now() - stream.heartbeatMs < 60000 && record.sessionId === stream.sessionId) {
                await viewer.update({ lastSeenMs: Date.now() });
                return res.json({ ok: true });
            }
            throw new LiveError(409, 'The broadcast has ended.');
        }
        safeId(body.sessionId, 'broadcast session');
        if (stream.ownerId !== user.uid || stream.sessionId !== body.sessionId)
            throw new LiveError(403, 'Only the current broadcaster can manage this stream.');
        if (body.action === 'heartbeat' || body.action === 'ready') {
            if (!['connecting', 'live'].includes(stream.status))
                throw new LiveError(409, 'The broadcast has ended.');
            const count = (await ref.collection('viewers').where('lastSeenMs', '>', Date.now() - 60000).count().get()).data().count;
            const wasLive = stream.status === 'live';
            const next = body.action === 'ready' ? 'live' : stream.status;
            await db.runTransaction(async (tx) => {
                const [currentSnap, leaseSnap] = await Promise.all([tx.get(ref), tx.get(db.doc(`broadcastHosts/${user.uid}`))]);
                const current = currentSnap.data();
                if (!current || leaseSnap.data()?.sessionId !== body.sessionId || current.sessionId !== body.sessionId || !['connecting', 'live'].includes(current.status))
                    throw new LiveError(409, 'The broadcast has ended.');
                tx.update(ref, { heartbeatMs: Date.now(), status: next, viewers: count, peakViewers: Math.max(current.peakViewers || 0, count),
                    ...(body.action === 'ready' && !current.startedAtMs ? { startedAtMs: Date.now() } : {}) });
                tx.set(db.doc(`broadcastHosts/${user.uid}`), { heartbeatMs: Date.now() }, { merge: true });
            });
            const warning = body.action === 'ready' && !wasLive ? await announce(id, 'live').then(() => undefined).catch(() => 'You are live, but the community announcement could not be posted.') : undefined;
            return res.json({ ok: true, warning });
        }
        if (body.action === 'end') {
            await db.runTransaction(async (tx) => {
                const leaseRef = db.doc(`broadcastHosts/${user.uid}`);
                const [currentSnap, leaseSnap] = await Promise.all([tx.get(ref), tx.get(leaseRef)]);
                const current = currentSnap.data();
                if (current?.sessionId !== body.sessionId)
                    throw new LiveError(409, 'This broadcast session has changed.');
                tx.update(ref, { status: 'ended', endedAtMs: Date.now(), viewers: 0 });
                if (leaseSnap.data()?.sessionId === body.sessionId)
                    tx.set(leaseRef, { activeId: '', heartbeatMs: 0 }, { merge: true });
            });
            await retireInput(id);
            await announce(id, 'ended').catch(() => { });
            return res.json({ ok: true });
        }
        throw new LiveError(400, 'Unknown broadcast action.');
    }
    catch (error) {
        return res.status(error instanceof LiveError ? error.status : 500).json({ error: error instanceof LiveError ? error.message : 'Live streaming could not complete the request. Please try again.' });
    }
}
