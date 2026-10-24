import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Broadcast, canonicalState, isBroadcastLive, rankBroadcasts } from '../../lib/broadcasts';
import LivePlayer from './LivePlayer';
import ShareButton from '../ShareButton';
export default function LiveFeed({ stateId, state, athleteId, roomId, section = 'live', heading, inline = false, arenaOnly = false }: {
    stateId?: string;
    state?: string;
    athleteId?: string;
    roomId?: string;
    section?: 'live' | 'week' | 'trending';
    heading?: string;
    inline?: boolean;
    arenaOnly?: boolean;
}) {
    const [streams, setStreams] = useState<Broadcast[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState(Date.now());
    const [selected, setSelected] = useState('');
    const communityId = canonicalState(state, stateId)?.stateId;
    useEffect(() => {
        setLoading(true);
        setSelected('');
        const scope = athleteId ? where('ownerId', '==', athleteId) : roomId ? where('roomId', '==', roomId) : arenaOnly ? where('isArena', '==', true) : communityId ? where('stateId', '==', communityId) : null;
        const filters = [where('status', 'in', ['live', 'scheduled', 'connecting']), ...(scope ? [scope] : []), orderBy('createdAt', 'desc'), limit(100)];
        const unsubscribe = onSnapshot(query(collection(db, 'liveStreams'), ...filters), snapshot => {
            setStreams(snapshot.docs.map(item => ({ ...item.data(), id: item.id } as Broadcast)).filter(item => item.provider === 'cloudflare'));
            setError('');
            setLoading(false);
        }, () => { setError('Live broadcasts could not load. Check the live Firestore rules and indexes.'); setLoading(false); });
        const clock = setInterval(() => setNow(Date.now()), 15000);
        return () => { unsubscribe(); clearInterval(clock); };
    }, [athleteId, roomId, arenaOnly, communityId]);
    const shown = rankBroadcasts(streams, section, now).slice(0, section === 'live' ? 8 : 6);
    return <section className="liveFeed"><h2>{heading || (section === 'week' ? 'Live of the Week' : section === 'trending' ? 'Trending Athletes · Live' : 'Live & Scheduled Streams')}</h2>
    {loading ? <p>Loading broadcasts…</p> : error ? <p role="status">{error}</p> : !shown.length ? <p>{section === 'live' ? 'No live or scheduled broadcasts yet.' : 'No athletes are broadcasting right now.'}</p> : null}
    <div className="cards">{shown.map(stream => <article key={stream.id}><div className="badge">{isBroadcastLive(stream, now) ? '🔴 LIVE' : '📅 SCHEDULED'}</div><h3>{stream.title}</h3><Link href={`/athletes/${stream.ownerId}`}>{stream.broadcaster}</Link><p>{stream.state}{stream.roomId ? ' · Arena' : ''}</p><p>{stream.status === 'scheduled' ? new Date(stream.scheduledDate || '').toLocaleString() : `${stream.viewers || 0} watching`}</p>
      <div className="actions">{inline ? <button onClick={() => setSelected(current => current === stream.id ? '' : stream.id)}>{selected === stream.id ? 'Close player' : stream.status === 'scheduled' ? 'View Schedule' : 'Watch Live'}</button> : <Link className="watch" href={`/live/${stream.id}`}>{stream.status === 'scheduled' ? 'View Schedule' : 'Watch Live'}</Link>}<ShareButton title={stream.title} url={typeof location === 'undefined' ? '' : `${location.origin}/live/${stream.id}`}/></div>
    </article>)}</div>{inline && selected && <div className="inlinePlayer"><LivePlayer id={selected}/></div>}
    <style jsx>{`.liveFeed{margin:24px 0;padding:18px;border:1px solid #53677e;border-radius:16px;background:#071b33;color:white;min-width:0}h2{font-size:20px;font-weight:800;margin-bottom:12px}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:12px}article{border:1px solid #415670;border-radius:12px;padding:14px;background:#0d2845}h3{font-size:17px;font-weight:700;margin:8px 0;overflow-wrap:anywhere}p{font-size:14px;margin:8px 0;color:#cbd5e1}.badge{font-size:11px;font-weight:800;letter-spacing:.08em}.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;align-items:center}button{background:#b91c32;color:white;padding:10px 14px;border-radius:8px;border:0;font:inherit;cursor:pointer}.inlinePlayer{margin-top:16px}`}</style>
  </section>;
}
