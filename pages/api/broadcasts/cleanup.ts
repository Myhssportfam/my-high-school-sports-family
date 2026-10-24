import type { NextApiRequest, NextApiResponse } from 'next';
import { timingSafeEqual } from 'crypto';
import { announce, database, retireInput } from '../../../lib/broadcastServer';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed.' });
    }
    const expected = process.env.CRON_SECRET;
    const received = req.headers.authorization?.replace(/^Bearer /, '');
    if (!expected || !received || Buffer.byteLength(expected) !== Buffer.byteLength(received) || !timingSafeEqual(Buffer.from(expected), Buffer.from(received)))
        return res.status(401).json({ error: 'Unauthorized.' });
    try {
        const db = database();
        const now = Date.now();
        const stale = await db.collection('liveStreams').where('status', 'in', ['live', 'connecting']).where('heartbeatMs', '<', now - 60000).limit(50).get();
        let ended = 0;
        for (const candidate of stale.docs) {
            if (candidate.data().provider !== 'cloudflare')
                continue;
            const closed = await db.runTransaction(async (tx) => {
                const current = (await tx.get(candidate.ref)).data();
                if (!current || !['live', 'connecting'].includes(current.status) || now - current.heartbeatMs < 60000)
                    return false;
                const lease = db.doc(`broadcastHosts/${current.ownerId}`);
                const lock = (await tx.get(lease)).data();
                tx.update(candidate.ref, { status: 'ended', endedAtMs: now, viewers: 0 });
                if (lock?.sessionId === current.sessionId)
                    tx.set(lease, { activeId: '', heartbeatMs: 0 }, { merge: true });
                return true;
            });
            if (closed) {
                await retireInput(candidate.id);
                await announce(candidate.id, 'ended').catch(() => { });
                ended++;
            }
        }
        const pending = await db.collection('broadcastSecrets').where('cleanupPending', '==', true).limit(50).get();
        for (const item of pending.docs)
            await retireInput(item.id);
        return res.json({ ended, cleanupRetries: pending.size });
    }
    catch {
        return res.status(500).json({ error: 'Broadcast cleanup could not complete.' });
    }
}
