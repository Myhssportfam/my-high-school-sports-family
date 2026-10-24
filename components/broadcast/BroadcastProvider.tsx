import { createContext, useCallback, FormEvent, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { broadcastAction, connectVideo, VideoSession } from '../../lib/broadcastClient';
import { BroadcastContext, BroadcastMode } from '../../lib/broadcasts';
import ShareButton from '../ShareButton';
import { recordBroadcast, RecordingHandle } from '../../lib/broadcastRecording';
import EndedBroadcast, { EndedRecording } from './EndedBroadcast';
type Controls = {
    start: (mode: BroadcastMode, context?: BroadcastContext & {
        id?: string;
    }) => Promise<void>;
    schedule: (context?: BroadcastContext) => void;
    busy: boolean;
    hostingId: string;
};
const Context = createContext<Controls | null>(null);
export function useBroadcast() { const controls = useContext(Context); if (!controls)
    throw new Error('BroadcastProvider is missing.'); return controls; }
export default function BroadcastProvider({ children }: {
    children: ReactNode;
}) {
    const [ended, setEnded] = useState<EndedRecording | null>(null);
    const capture = useRef<{ full?: RecordingHandle; story?: RecordingHandle; id: string; ownerId: string; title: string } | null>(null);
    const [busy, setBusy] = useState(false);
    const [hostingId, setHostingId] = useState('');
    const [title, setTitle] = useState('');
    const [notice, setNotice] = useState('');
    const [scheduleContext, setScheduleContext] = useState<BroadcastContext | null>(null);
    const [preview, setPreview] = useState<MediaStream | null>(null);
    const video = useRef<HTMLVideoElement>(null);
    const dialog = useRef<HTMLDivElement>(null);
    const controller = useRef<AbortController | null>(null);
    const tracks = useRef<MediaStream | null>(null);
    const session = useRef<VideoSession | null>(null);
    const record = useRef<{
        id: string;
        sessionId: string;
    } | null>(null);
    const heartbeat = useRef<ReturnType<typeof setInterval> | null>(null);
    const mounted = useRef(true);
    const starting = useRef(false);
    const stopping = useRef(false);
    const audioContext = useRef<AudioContext | null>(null);
    const sourceTracks = useRef<MediaStreamTrack[]>([]);
    const end = useCallback(async () => {
        if (stopping.current)
            return;
        stopping.current = true;
        controller.current?.abort();
        const savedCapture = capture.current;
        capture.current = null;
        const fullResult = savedCapture?.full?.finish();
        const storyResult = savedCapture?.story?.finish();
        tracks.current?.getTracks().forEach(track => track.stop());
        tracks.current = null;
        sourceTracks.current.forEach(track => track.stop());
        sourceTracks.current = [];
        const mix = audioContext.current;
        audioContext.current = null;
        void mix?.close().catch(() => { });
        if (heartbeat.current)
            clearInterval(heartbeat.current);
        heartbeat.current = null;
        const current = record.current;
        record.current = null;
        const connection = session.current;
        session.current = null;
        await connection?.stop();
        let failure = '';
        if (current)
            await broadcastAction({ action: 'end', ...current }).catch(() => { failure = 'Capture stopped. The server did not confirm the end; the live listing will expire shortly.'; });
        const [full, story] = await Promise.all([fullResult, storyResult]);
        if (mounted.current) {
            if (savedCapture) setEnded({ id: savedCapture.id, ownerId: savedCapture.ownerId, title: savedCapture.title, file: full?.file || null, story: story?.file || null, truncated: !!full?.truncated });
            setHostingId('');
            setPreview(null);
            setBusy(false);
            if (failure)
                setNotice(failure);
        }
        stopping.current = false;
    }, []);
    useEffect(() => {
        mounted.current = true;
        const unsub = onAuthStateChanged(auth, user => { if (!user && (record.current || starting.current))
            void end(); });
        const unload = () => { if (record.current) {
            void broadcastAction({ action: 'end', ...record.current });
            tracks.current?.getTracks().forEach(track => track.stop());
        } };
        const before = (event: BeforeUnloadEvent) => { if (record.current || starting.current || capture.current) {
            event.preventDefault();
            event.returnValue = '';
        } };
        window.addEventListener('pagehide', unload);
        window.addEventListener('beforeunload', before);
        return () => { mounted.current = false; unsub(); window.removeEventListener('pagehide', unload); window.removeEventListener('beforeunload', before); void end(); };
    }, [end]);
    useEffect(() => {
        if (!ended) return;
        const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [ended]);
    useEffect(() => { if (video.current)
        video.current.srcObject = preview; }, [preview]);
    useEffect(() => {
        if (!scheduleContext)
            return;
        const previous = document.activeElement as HTMLElement | null;
        dialog.current?.querySelector<HTMLInputElement>('input')?.focus();
        const keys = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !busy)
                setScheduleContext(null);
            if (event.key === 'Tab') {
                const items = dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled)');
                if (!items?.length)
                    return;
                const first = items[0], last = items[items.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                }
                else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener('keydown', keys);
        return () => { document.removeEventListener('keydown', keys); previous?.focus(); };
    }, [scheduleContext, busy]);
    async function start(mode: BroadcastMode, context: BroadcastContext & {
        id?: string;
    } = {}) {
        if (ended || stopping.current) {
            setNotice('Save or close your previous recording before starting another.');
            return;
        }
        if (starting.current || record.current) {
            setNotice('End your current broadcast before starting another.');
            return;
        }
        if (!auth.currentUser) {
            setNotice('Sign in to go live.');
            return;
        }
        starting.current = true;
        setBusy(true);
        setNotice('');
        const abort = new AbortController();
        controller.current = abort;
        let stage = 'Camera or screen access';
        try {
            if (!navigator.mediaDevices)
                throw new Error('Live capture needs HTTPS or localhost and camera permissions.');
            if (mode === 'screen' && !navigator.mediaDevices.getDisplayMedia)
                throw new Error('Screen streaming is unavailable in this browser. Use Go Live for your camera.');
            // Screen capture must be invoked in the click gesture, before any network request.
            if (mode === 'screen')
                audioContext.current = new AudioContext();
            const media = mode === 'screen' ? await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }) : await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: true });
            tracks.current = media;
            sourceTracks.current = media.getTracks();
            if (abort.signal.aborted) {
                media.getTracks().forEach(track => track.stop());
                return;
            }
            if (mode === 'screen') {
                const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
                sourceTracks.current.push(...mic.getTracks());
                if (abort.signal.aborted) {
                    mic.getTracks().forEach(track => track.stop());
                    throw new Error('Broadcast cancelled.');
                }
                const system = media.getAudioTracks();
                if (system.length && audioContext.current) {
                    const mix = audioContext.current;
                    const output = mix.createMediaStreamDestination();
                    mix.createMediaStreamSource(new MediaStream(system)).connect(output);
                    mix.createMediaStreamSource(mic).connect(output);
                    system.forEach(track => media.removeTrack(track));
                    output.stream.getAudioTracks().forEach(track => media.addTrack(track));
                    await mix.resume();
                }
                else
                    mic.getAudioTracks().forEach(track => media.addTrack(track));
            }
            if (mounted.current)
                setPreview(media);
            media.getVideoTracks()[0].onended = () => { void end(); };
            stage = 'Create broadcast';
            const created = await broadcastAction({ action: 'start', mode, ...context });
            record.current = { id: created.id, sessionId: created.sessionId };
            if (abort.signal.aborted) {
                await end();
                return;
            }
            stage = 'Connect live video';
            session.current = await connectVideo(created.publishUrl, media, null, abort.signal);
            if (abort.signal.aborted) {
                await end();
                return;
            }
            stage = 'Confirm broadcast is live';
            const ready = await broadcastAction({ action: 'ready', ...record.current });
            const recordingTitle = context.title || 'Your live broadcast';
            const saved = { id: created.id, ownerId: auth.currentUser!.uid, title: recordingTitle, full: undefined as RecordingHandle | undefined, story: undefined as RecordingHandle | undefined };
            capture.current = saved;
            try {
                saved.full = recordBroadcast(media, `live-${created.id}`);
                saved.story = recordBroadcast(media, `live-${created.id}-story`, { maxMs: 15000, maxBytes: 10 * 1024 * 1024 });
            } catch { setNotice('You are live, but recording is unavailable in this browser.'); }
            setHostingId(created.id);
            setTitle(context.title || 'Your live broadcast');
            if (ready.warning)
                setNotice(ready.warning);
            session.current.pc.onconnectionstatechange = () => { if (session.current?.pc.connectionState === 'failed') {
                setNotice('The broadcast connection was lost. Please start again.');
                void end();
            } };
            heartbeat.current = setInterval(() => {
                if (record.current)
                    void broadcastAction({ action: 'heartbeat', ...record.current }).catch(() => { setNotice('The broadcast could not stay connected. Please start again.'); void end(); });
            }, 15000);
        }
        catch (error) {
            await end().catch(() => {});
            if (mounted.current)
                setNotice(`${stage}: ${error instanceof Error ? error.message : 'Could not start live video.'}`);
        }
        finally {
            starting.current = false;
            if (mounted.current)
                setBusy(false);
        }
    }
    async function saveSchedule(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy)
            return;
        const form = new FormData(event.currentTarget);
        setBusy(true);
        setNotice('');
        try {
            const raw = String(form.get('date'));
            const date = new Date(raw);
            if (!raw || !Number.isFinite(date.getTime()) || date.getTime() <= Date.now())
                throw new Error('Choose a future date and time.');
            const saved = await broadcastAction({ action: 'schedule', ...scheduleContext, title: String(form.get('title') || ''), date: date.toISOString() });
            setScheduleContext(null);
            setNotice(saved.warning || 'Scheduled. Open the stream and click Go Live or Stream when you are ready.');
        }
        catch (error) {
            setNotice(error instanceof Error ? error.message : 'Could not save the schedule.');
        }
        finally {
            setBusy(false);
        }
    }
    return <Context.Provider value={{ start, schedule: context => { setNotice(''); setScheduleContext(context || {}); }, busy, hostingId }}>
    {children}
    {ended && <EndedBroadcast recording={ended} onClose={() => setEnded(null)}/>}
    {(preview || busy && starting.current) && <aside className="liveDock" aria-label="Your live broadcast"><strong>{hostingId ? '🔴 You are LIVE' : 'Connecting your stream…'}</strong>
      {preview && <video ref={video} autoPlay playsInline muted/>}
      <p>Keep this tab open while broadcasting.</p><div className="buttons">{hostingId && <><Link href={`/live/${hostingId}`}>Open stream</Link><ShareButton title={title} url={typeof location === 'undefined' ? '' : `${location.origin}/live/${hostingId}`}/></>}<button onClick={() => void end()}>{hostingId ? 'End Live' : 'Cancel'}</button></div>
    </aside>}
    {notice && !scheduleContext && <div className="liveNotice" role="status"><span>{notice}</span><button aria-label="Dismiss live message" onClick={() => setNotice('')}>×</button></div>}
    {scheduleContext && <div className="liveBackdrop" onMouseDown={() => { if (!busy)
            setScheduleContext(null); }}><div ref={dialog} className="liveDialog" role="dialog" aria-modal="true" aria-labelledby="schedule-title" onMouseDown={e => e.stopPropagation()}>
      <h2 id="schedule-title">Schedule Live</h2><form onSubmit={saveSchedule}><label>Stream title<input name="title" defaultValue={scheduleContext.title || ''} placeholder="My live workout" required maxLength={140}/></label><label>Date and time<input name="date" type="datetime-local" required/></label><p>Time uses your device’s timezone. Return to start the broadcast when you’re ready.</p>{notice && <p role="alert">{notice}</p>}<div className="buttons"><button type="button" disabled={busy} onClick={() => setScheduleContext(null)}>Cancel</button><button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Schedule Live'}</button></div></form>
    </div></div>}
    <style jsx>{`
      .liveDock {position:fixed;bottom:16px;right:16px;z-index:80;background:#081b33;color:white;border:1px solid #55718d;border-radius:16px;padding:16px;width:min(340px,calc(100vw - 32px));max-height:75dvh;overflow:auto;box-sizing:border-box;box-shadow:0 8px 40px #0008}
      video{width:100%;max-height:180px;background:black;border-radius:8px;margin:8px 0}.buttons{display:flex;gap:8px;flex-wrap:wrap;align-items:center}button{background:#b91c32;color:white;border:0;border-radius:8px;padding:10px 14px;font:inherit;cursor:pointer}button:disabled{opacity:.6}.liveNotice{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:110;width:min(580px,calc(100vw - 32px));padding:16px;border-radius:12px;background:#081b33;color:white;box-shadow:0 4px 30px #0006;display:flex;gap:12px;align-items:center;box-sizing:border-box}
      .liveBackdrop{position:fixed;inset:0;z-index:120;display:grid;place-items:center;background:#0009;padding:16px}.liveDialog{width:100%;max-width:440px;max-height:calc(100dvh - 32px);overflow:auto;background:white;color:#111827;border-radius:18px;padding:24px;box-sizing:border-box}h2{font-size:24px;font-weight:800}label{display:block;margin:16px 0;font-weight:700}input{width:100%;padding:12px;border:1px solid #aaa;border-radius:8px;color:#111827;background:white;box-sizing:border-box;margin-top:8px;font:inherit}p{font-size:14px;line-height:1.5;margin:10px 0}
    `}</style>
  </Context.Provider>;
}
export function BroadcastButtons({ context = {}, athleteId, prominent = false }: {
    context?: BroadcastContext;
    athleteId?: string;
    prominent?: boolean;
}) {
    const controls = useBroadcast();
    const [uid, setUid] = useState('');
    const [startingMode, setStartingMode] = useState<BroadcastMode | null>(null);
    useEffect(() => onAuthStateChanged(auth, user => setUid(user?.uid || '')), []);
    if (athleteId && uid !== athleteId)
        return null;
    async function quickStart(mode: BroadcastMode) {
        if (startingMode || controls.busy || controls.hostingId) return;
        setStartingMode(mode);
        try { await controls.start(mode, context); }
        finally { setStartingMode(null); }
    }
    if (prominent) return <div className="my-5" aria-label="Start or schedule a broadcast">
      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" disabled={!!startingMode || controls.busy || !!controls.hostingId} className="min-h-20 rounded-2xl bg-red-700 px-6 py-4 text-left text-white shadow-md hover:bg-red-800 disabled:opacity-50" onClick={() => void quickStart('camera')}>
          <span className="block text-2xl font-black">{startingMode === 'camera' ? 'Starting…' : '🔴 Go Live'}</span>
          <span className="mt-1 block text-sm">Broadcast your camera now</span>
        </button>
        <button type="button" disabled={!!startingMode || controls.busy || !!controls.hostingId} className="min-h-20 rounded-2xl bg-blue-800 px-6 py-4 text-left text-white shadow-md hover:bg-blue-900 disabled:opacity-50" onClick={() => void quickStart('screen')}>
          <span className="block text-2xl font-black">{startingMode === 'screen' ? 'Starting…' : 'Stream'}</span>
          <span className="mt-1 block text-sm">Share your screen now</span>
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" disabled={controls.busy || !!startingMode} className="min-h-12 rounded-xl border border-slate-400 px-5 py-3 font-bold disabled:opacity-50" onClick={() => controls.schedule(context)}>Schedule Live</button>
        <span className="text-sm text-slate-500">Plan a broadcast for later.</span>
      </div>
      {controls.hostingId && <p role="status" className="mt-3 font-bold text-red-600">You are live. Use End Live when you’re finished.</p>}
    </div>;
    return <div className="flex flex-wrap gap-2 my-4"><button type="button" disabled={controls.busy || !!controls.hostingId} className="rounded-xl bg-red-700 px-4 py-3 font-bold text-white disabled:opacity-50" onClick={() => void controls.start('camera', context)}>🔴 Go Live</button><button type="button" disabled={controls.busy || !!controls.hostingId} className="rounded-xl bg-blue-800 px-4 py-3 font-bold text-white disabled:opacity-50" onClick={() => void controls.start('screen', context)}>Stream</button><button type="button" disabled={controls.busy} className="rounded-xl border border-slate-400 px-4 py-3 font-bold" onClick={() => controls.schedule(context)}>Schedule Live</button></div>;
}
