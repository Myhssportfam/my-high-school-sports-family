import type { NextApiRequest, NextApiResponse } from 'next';
import admin from '../../lib/firebaseAdmin';
import { authenticatedUser, broadcasterProfile, database, LiveError, safeId } from '../../lib/broadcastServer';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 'no-store');
    try {
        if (req.method !== 'POST') {
            res.setHeader('Allow', 'POST');
            return res.status(405).json({ error: 'Method not allowed.' });
        }
        const user = await authenticatedUser(req);
        const { action, ready } = req.body || {};
        const id = safeId(req.body?.roomId, 'room');
        if (!['join', 'leave', 'ready'].includes(action))
            throw new LiveError(400, 'Unknown membership action.');
        const profile = await broadcasterProfile(user.uid);
        const db = database();
        const ref = db.doc(`arenaRooms/${id}`);
        const member = ref.collection('members').doc(user.uid);
        await db.runTransaction(async (tx) => {
            const [snapshot, current] = await Promise.all([tx.get(ref), tx.get(member)]);
            const room = snapshot.data();
            if (!room)
                throw new LiveError(404, 'Arena room not found.');
            const ids: string[] = room.joinedUserIds || [];
            const participants = room.participants || [];
            if (action === 'leave') {
                if (!ids.includes(user.uid)) {
                    tx.delete(member);
                    return;
                }
                if (!['open', 'scheduled', 'full'].includes(room.status))
                    throw new LiveError(409, 'Wait until the match finishes before leaving.');
                const next = ids.filter(uid => uid !== user.uid);
                tx.update(ref, { joinedUserIds: next, participants: participants.filter((p: {
                        userId: string;
                    }) => p.userId !== user.uid), players: next.length, status: room.scheduledTime ? 'scheduled' : 'open' });
                tx.delete(member);
                return;
            }
            if (action === 'ready') {
                if (typeof ready !== 'boolean' || !ids.includes(user.uid) || !['open', 'scheduled', 'full'].includes(room.status))
                    throw new LiveError(409, 'Join an open lobby before setting ready.');
                tx.update(ref, { participants: participants.map((p: {
                        userId: string;
                    }) => p.userId === user.uid ? { ...p, ready } : p) });
                if (current.exists)
                    tx.update(member, { ready });
                else
                    tx.set(member, { uid: user.uid, displayName: profile.broadcaster, photoURL: profile.avatarUrl, state: profile.state, ready, wins: 0, losses: 0, joinedAt: admin.firestore.FieldValue.serverTimestamp() });
                return;
            }
            if (!ids.includes(user.uid) && (!['open', 'scheduled', 'full'].includes(room.status) || !Number.isInteger(room.maxPlayers) || ids.length >= room.maxPlayers))
                throw new LiveError(409, 'This Arena room is full or closed.');
            const participant = { userId: user.uid, displayName: profile.broadcaster, photoURL: profile.avatarUrl, state: profile.state, ready: false };
            if (!ids.includes(user.uid)) {
                const next = [...ids, user.uid];
                tx.update(ref, { joinedUserIds: next, participants: [...participants, participant], players: next.length, status: next.length >= room.maxPlayers ? 'full' : room.scheduledTime ? 'scheduled' : 'open' });
            }
            if (!current.exists)
                tx.set(member, { uid: user.uid, displayName: profile.broadcaster, photoURL: profile.avatarUrl, state: profile.state, ready: false, wins: 0, losses: 0, joinedAt: admin.firestore.FieldValue.serverTimestamp() });
        });
        return res.json({ ok: true });
    }
    catch (error) {
        return res.status(error instanceof LiveError ? error.status : 500).json({ error: error instanceof LiveError ? error.message : 'Could not update Arena membership.' });
    }
}
