import { useCallback, useEffect, useRef, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { Broadcast, isBroadcastLive } from '../../lib/broadcasts';
import { broadcastAction, connectVideo, VideoSession } from '../../lib/broadcastClient';
import { useBroadcast } from './BroadcastProvider';
import ShareButton from '../ShareButton';
export default function LivePlayer({ id }: {
    id: string;
}) {
    const [stream, setStream] = useState<Broadcast | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [uid, setUid] = useState('');
    const [status, setStatus] = useState('');
    const [watching, setWatching] = useState(false);
    const [busy, setBusy] = useState(false);
    const [now, setNow] = useState(Date.now());
    const video = useRef<HTMLVideoElement>(null);
    const media = useRef<MediaStream | null>(null);
    const session = useRef<VideoSession | null>(null);
    const viewer = useRef<string | null>(null);
    const controller = useRef<AbortController | null>(null);
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);
    const mounted = useRef(true);
    const controls = useBroadcast();
    const leave = useCallback(async () => {
        controller.current?.abort();
        controller.current = null;
        if (timer.current)
            clearInterval(timer.current);
        timer.current = null;
        const current = viewer.current;
        viewer.current = null;
        const connection = session.current;
        session.current = null;
        await connection?.stop();
        media.current = null;
        if (current)
            void broadcastAction({ action: 'leave', id, viewerId: current }).catch(() => { });
        if (mounted.current) {
            setWatching(false);
            setBusy(false);
        }
    }, [id]);
    useEffect(() => {
        mounted.current = true;
        setLoaded(false);
        setStream(null);
        const unsub = onSnapshot(doc(db, 'liveStreams', id), snap => { setStream(snap.exists() ? { ...snap.data(), id: snap.id } as Broadcast : null); setLoaded(true); }, () => { setStatus('The stream could not be loaded.'); setLoaded(true); });
        const clock = setInterval(() => setNow(Date.now()), 15000);
        return () => { mounted.current = false; unsub(); clearInterval(clock); void leave(); };
    }, [id, leave]);
    useEffect(() => onAuthStateChanged(auth, user => { setUid(user?.uid || ''); if (!user)
        void leave(); }), [leave]);
    useEffect(() => { if (video.current)
        video.current.srcObject = media.current; }, [watching]);
    useEffect(() => { void leave(); }, [stream?.sessionId, stream?.status, leave]);
    const live = stream ? isBroadcastLive(stream, now) : false;
    useEffect(() => { if (!live)
        void leave(); }, [live, leave]);
    async function watch() {
        if (!uid) {
            setStatus('Please sign in to watch this broadcast.');
            return;
        }
        if (controller.current)
            return;
        setBusy(true);
        setStatus('Connecting…');
        const abort = new AbortController();
        controller.current = abort;
        try {
            const joined = await broadcastAction({ action: 'join', id });
            viewer.current = joined.viewerId;
            if (abort.signal.aborted) {
                await leave();
                return;
            }
            const remote = new MediaStream();
            media.current = remote;
            // Mount the video before negotiation so incoming tracks have a stable target.
            setWatching(true);
            session.current = await connectVideo(joined.playbackUrl, null, remote, abort.signal);
            if (abort.signal.aborted) {
                await leave();
                return;
            }
            if (video.current) {
                video.current.srcObject = remote;
                void video.current.play().catch(() => setStatus('Press play on the video to watch.'));
            }
            await broadcastAction({ action: 'heartbeat', id, viewerId: joined.viewerId });
            setStatus('');
            timer.current = setInterval(() => { if (viewer.current)
                void broadcastAction({ action: 'heartbeat', id, viewerId: viewer.current }).catch(() => { setStatus('This broadcast has ended or the connection was lost.'); void leave(); }); }, 15000);
            session.current.pc.onconnectionstatechange = () => { if (session.current?.pc.connectionState === 'failed') {
                setStatus('The video connection was lost. Click Watch Live to reconnect.');
                void leave();
            } };
        }
        catch (error) {
            await leave();
            if (mounted.current)
                setStatus(error instanceof Error ? error.message : 'Could not watch live video.');
        }
        finally {
            if (mounted.current)
                setBusy(false);
        }
    }
    if (!loaded)
        return <p className="p-4">Loading live broadcast…</p>;
    if (!stream)
        return <p className="p-4">Broadcast not found.</p>;
    const ownSchedule = stream.status === 'scheduled' && stream.ownerId === uid;
    return <section className="livePlayer">
    <h2>{stream.title}</h2><p>{stream.broadcaster} · {stream.state}{stream.roomId ? ' · Arena' : ''}</p>
    {live && <><div className="actions"><span>🔴 Live · {stream.viewers || 0} watching</span><button disabled={busy || watching} onClick={() => void watch()}>{watching ? 'Watching Live' : '▶ Watch Live'}</button>{(watching || busy) && <button onClick={() => void leave()}>Leave</button>}</div>{watching && <video ref={video} controls autoPlay playsInline/>}</>}
    {!live && <p>{stream.status === 'scheduled' ? `Scheduled: ${new Date(stream.scheduledDate || '').toLocaleString()}` : stream.status === 'connecting' ? 'The athlete is connecting their broadcast…' : 'This broadcast has ended or is offline. No replay was recorded.'}</p>}
    {ownSchedule && <div className="actions"><button disabled={controls.busy || !!controls.hostingId} onClick={() => void controls.start('camera', { id, title: stream.title, roomId: stream.roomId })}>🔴 Go Live</button><button disabled={controls.busy || !!controls.hostingId} onClick={() => void controls.start('screen', { id, title: stream.title, roomId: stream.roomId })}>Stream</button></div>}
    <div className="actions"><ShareButton title={stream.title} url={typeof location === 'undefined' ? '' : `${location.origin}/live/${id}`}/></div>
    {status && <p role="status">{status}</p>}
    <style jsx>{`.livePlayer{padding:20px;border-radius:16px;background:#071b33;color:white;border:1px solid #415670}h2{font-size:22px;font-weight:800}p{margin:10px 0;line-height:1.5}.actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:14px 0}button{padding:10px 16px;border-radius:10px;background:#b91c32;color:white;font:inherit;border:0;cursor:pointer}button:disabled{opacity:.5}video{width:100%;max-height:65dvh;background:black;border-radius:10px}`}</style>
  </section>;
}
