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
    const [now, setNow] = useState(0);
    const [loadError, setLoadError] = useState('');
    const [attempt, setAttempt] = useState(0);
    const video = useRef<HTMLVideoElement>(null);
    const media = useRef<MediaStream | null>(null);
    const session = useRef<VideoSession | null>(null);
    const viewer = useRef<string | null>(null);
    const controller = useRef<AbortController | null>(null);
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);
    const mounted = useRef(true);
    const generation = useRef(0);
    const controls = useBroadcast();
    const leave = useCallback(async () => {
        ++generation.current;
        controller.current?.abort();
        controller.current = null;
        if (timer.current)
            clearInterval(timer.current);
        timer.current = null;
        const current = viewer.current;
        viewer.current = null;
        const connection = session.current;
        session.current = null;
        // Detach everything before awaiting: an old teardown must not reset a new watch.
        media.current = null;
        if (video.current) video.current.srcObject = null;
        if (current)
            void broadcastAction({ action: 'leave', id, viewerId: current }).catch(() => { });
        if (mounted.current) {
            setWatching(false);
            setBusy(false);
        }
        try { await connection?.stop(); } catch { /* Local playback is already detached. */ }
    }, [id]);
    useEffect(() => {
        mounted.current = true;
        setLoaded(false);
        setStream(null);
        setStatus('');
        setLoadError('');
        setNow(Date.now());
        let active = true;
        let request = 0;
        let stopStream: () => void = () => {};
        const stopAuth = onAuthStateChanged(auth, user => {
            if (!active) return;
            const current = ++request;
            stopStream();
            void leave();
            setUid(user?.uid || '');
            setLoaded(false); setStream(null); setStatus(''); setLoadError('');
            stopStream = onSnapshot(doc(db, 'liveStreams', id), snap => {
                if (!active || current !== request) return;
                setStream(snap.exists() ? { ...snap.data(), id: snap.id } as Broadcast : null);
                setLoadError(''); setLoaded(true);
            }, failure => {
                if (!active || current !== request) return;
                console.error('[LivePlayer] Stream subscription failed', {code: failure.code, message: failure.message});
                void leave(); setStream(null); setLoadError('The stream could not be loaded. Please retry.'); setLoaded(true);
            });
        });
        const clock = setInterval(() => setNow(Date.now()), 15000);
        return () => { active = false; ++request; mounted.current = false; stopAuth(); stopStream(); clearInterval(clock); void leave(); };
    }, [id, leave, attempt]);
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
        const request = ++generation.current;
        const isCurrent = () => mounted.current && generation.current === request && !abort.signal.aborted;
        try {
            const joined = await broadcastAction({ action: 'join', id });
            if (!isCurrent()) {
                // This lease belongs to the cancelled request, never to the current player.
                void broadcastAction({action: 'leave', id, viewerId: joined.viewerId}).catch(() => {});
                return;
            }
            viewer.current = joined.viewerId;
            const remote = new MediaStream();
            media.current = remote;
            // Mount the video before negotiation so incoming tracks have a stable target.
            setWatching(true);
            const connected = await connectVideo(joined.playbackUrl, null, remote, abort.signal);
            if (!isCurrent()) {
                try { await connected.stop(); } catch { }
                return;
            }
            session.current = connected;
            if (video.current) {
                video.current.srcObject = remote;
                void video.current.play().catch(() => {if (isCurrent()) setStatus('Press play on the video to watch.');});
            }
            await broadcastAction({ action: 'heartbeat', id, viewerId: joined.viewerId });
            if (!isCurrent()) return;
            setStatus('');
            timer.current = setInterval(() => { if (isCurrent())
                void broadcastAction({ action: 'heartbeat', id, viewerId: joined.viewerId }).catch(() => {if (isCurrent()) {setStatus('This broadcast has ended or the connection was lost.'); void leave();}}); }, 15000);
            connected.pc.onconnectionstatechange = () => { if (isCurrent() && connected.pc.connectionState === 'failed') {
                setStatus('The video connection was lost. Click Watch Live to reconnect.');
                void leave();
            } };
        }
        catch (error) {
            if (!isCurrent()) return;
            await leave();
            if (mounted.current && generation.current === request + 1)
                setStatus(error instanceof Error ? error.message : 'Could not watch live video.');
        }
        finally {
            if (isCurrent())
                setBusy(false);
        }
    }
    if (!loaded)
        return <p className="p-4">Loading live broadcast…</p>;
    if (loadError) return <div role="status" className="p-4"><p>{loadError}</p><button type="button" onClick={() => setAttempt(current => current + 1)}>Retry stream</button></div>;
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
