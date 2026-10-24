import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { canonicalState } from '../lib/broadcasts';
import { BroadcastButtons } from '../components/broadcast/BroadcastProvider';
import LiveFeed from '../components/broadcast/LiveFeed';
import LivePlayer from '../components/broadcast/LivePlayer';
type ExternalStream = {
    id: string;
    title: string;
    provider?: string;
    state?: string;
    stateId?: string;
    status: string;
};
export default function LivePage() {
    const router = useRouter();
    const stateFilter = typeof router.query.state === 'string' ? router.query.state : '';
    const stateId = typeof router.query.stateId === 'string' ? router.query.stateId : stateFilter;
    const local = canonicalState(stateFilter, stateId);
    const selected = typeof router.query.stream === 'string' ? router.query.stream : '';
    const [external, setExternal] = useState<ExternalStream[]>([]);
    useEffect(() => onSnapshot(query(collection(db, 'liveStreams'), orderBy('createdAt', 'desc'), limit(50)), snapshot => {
        setExternal(snapshot.docs.map(item => ({ ...item.data(), id: item.id } as ExternalStream)).filter(item => !item.provider && ['live', 'scheduled', 'replay'].includes(item.status)));
    }, () => { }), []);
    return <><Head><title>Live | My High School Sports Family</title><meta name="description" content="Go live with your camera, stream your screen, schedule a workout, and watch your Sports Family."/></Head>
    <main className="mx-auto max-w-7xl px-4 py-8"><p className="text-xs font-black uppercase tracking-widest text-red-600">Sports Family Live</p><h1 className="mt-2 text-3xl font-black">{local ? `${local.state} Live` : 'Share your live workout'}</h1>
      <p className="mt-3">One tap to Go Live or Stream. Allow your camera or select your screen, and your broadcast starts automatically.</p>
      <p className="mt-2 text-sm text-slate-500">Your broadcast appears on your athlete profile and in your profile’s state community. Keep the tab open while broadcasting.</p>
      <BroadcastButtons prominent />
      {selected && <LivePlayer key={selected} id={selected}/>}
      <LiveFeed stateId={local?.stateId} state={local?.state} inline/>
      <LiveFeed stateId={local?.stateId} state={local?.state} section="week" inline/>
      <LiveFeed stateId={local?.stateId} state={local?.state} section="trending" inline/>
      {external.length > 0 && <section className="my-6"><h2 className="text-xl font-bold">Other Streams</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{external.filter(stream => !local || canonicalState(stream.state, stream.stateId)?.stateId === local.stateId).map(stream => <Link key={stream.id} href={`/live/${stream.id}`} className="rounded-xl border p-4"><strong>{stream.title}</strong><p>{stream.status} · {stream.state}</p></Link>)}</div></section>}
    </main></>;
}
