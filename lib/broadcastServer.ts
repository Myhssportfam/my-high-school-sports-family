import type { NextApiRequest } from 'next';
import admin, { adminDb } from './firebaseAdmin';
import { canonicalState } from './broadcasts';
export class LiveError extends Error {
    constructor(public status: number, message: string) { super(message); }
}
export function database() {
    if (!adminDb)
        throw new LiveError(503, 'The site owner needs to configure Firebase Admin before live streaming is available.');
    return adminDb;
}
export async function authenticatedUser(req: NextApiRequest) {
    database();
    const bearer = req.headers.authorization;
    if (!bearer?.startsWith('Bearer '))
        throw new LiveError(401, 'Please sign in first.');
    try {
        return await admin.auth().verifyIdToken(bearer.slice(7), true);
    }
    catch {
        throw new LiveError(401, 'Your sign-in expired. Please sign in again.');
    }
}
export function safeId(value: unknown, label = 'ID') {
    if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{1,160}$/.test(value))
        throw new LiveError(400, `Invalid ${label}.`);
    return value;
}
export async function broadcasterProfile(uid: string) {
    const data = (await database().doc(`users/${uid}`).get()).data();
    if (!data)
        throw new LiveError(400, 'Create your athlete profile before going live.');
    const state = canonicalState(data.state, data.stateId);
    if (!state)
        throw new LiveError(400, 'Choose your state community on your profile first.');
    return { ...state, broadcaster: String(data.displayName || 'Sports Family Member').slice(0, 100),
        school: String(data.schoolId || ''), avatarUrl: String(data.avatarUrl || ''), sport: String(data.sports?.[0] || 'Workout') };
}
export async function validateRoom(uid: string, roomId?: string) {
    if (!roomId)
        return;
    safeId(roomId, 'room');
    const room = (await database().doc(`arenaRooms/${roomId}`).get()).data();
    if (!room)
        throw new LiveError(404, 'Arena room not found. Create or join a real room first.');
    if (room.ownerId !== uid && !room.joinedUserIds?.includes(uid))
        throw new LiveError(403, 'Join this Arena room before streaming in it.');
}
export function streamConfigured() { return !!(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_STREAM_API_TOKEN); }
export async function streamRequest(path: string, init: RequestInit = {}) {
    if (!streamConfigured())
        throw new LiveError(503, 'Live video is not enabled yet. The site owner needs to connect Cloudflare Stream.');
    const account = process.env.CLOUDFLARE_ACCOUNT_ID!;
    if (!/^[a-fA-F0-9]{32}$/.test(account))
        throw new LiveError(503, 'The Cloudflare account ID is not configured correctly.');
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/stream/live_inputs${path}`, {
        ...init, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CLOUDFLARE_STREAM_API_TOKEN}` },
        signal: AbortSignal.timeout(12000),
    });
    if (init.method === 'DELETE' && response.status === 404)
        return null;
    const result = await response.json();
    if (!response.ok || !result.success)
        throw new LiveError(502, 'The broadcast service could not complete the request. Check the Stream account and token permissions.');
    return result.result;
}
export async function retireInput(id: string) {
    const ref = database().doc(`broadcastSecrets/${id}`);
    const secret = (await ref.get()).data();
    if (!secret?.inputUid)
        return;
    try {
        await streamRequest(`/${encodeURIComponent(secret.inputUid)}`, { method: 'DELETE' });
        await ref.delete();
    }
    catch {
        await ref.set({ cleanupPending: true }, { merge: true });
    }
}
export async function announce(id: string, status: 'scheduled' | 'live' | 'ended') {
    const db = database();
    const stream = (await db.doc(`liveStreams/${id}`).get()).data();
    if (!stream?.stateId)
        return;
    const ref = db.doc(`stateFeeds/${stream.stateId}/posts/live-${id}`);
    const existing = await ref.get();
    await ref.set({ userId: stream.ownerId, authorId: stream.ownerId, author: stream.broadcaster,
        initials: stream.broadcaster.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase(),
        photoURL: stream.avatarUrl || '', role: `${status === 'scheduled' ? '📅 Scheduled Live' : status === 'live' ? '🔴 Live Activity' : 'Live Ended'} • ${stream.state}`,
        message: status === 'scheduled' ? `${stream.broadcaster} scheduled "${stream.title}" for ${new Date(stream.scheduledDate).toLocaleString('en-US', { timeZone: 'UTC' })} UTC.`
            : status === 'live' ? `${stream.broadcaster} is LIVE with "${stream.title}".` : `${stream.broadcaster}'s broadcast "${stream.title}" has ended.`,
        type: 'Update', createdAt: 'Just now', createdAtMs: Date.now(), activityType: `live_${status === 'live' ? 'now' : status}`,
        streamId: id, streamUrl: stream.streamUrl, roomId: stream.roomId || '', mediaUrl: '',
        ...(!existing.exists ? { likes: 0, likedBy: [], comments: [] } : {}),
    }, { merge: true });
}
