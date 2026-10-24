import { useEffect, useRef, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { canonicalState } from '../../lib/broadcasts';
import { uploadFile } from '../../lib/storage';
import ShareButton from '../ShareButton';
export type EndedRecording = { id: string; ownerId: string; title: string; file: File | null; story: File | null; truncated: boolean };
export default function EndedBroadcast({ recording, onClose }: { recording: EndedRecording; onClose: () => void }) {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [caption, setCaption] = useState(recording.title);
  const [posted, setPosted] = useState(false);
  const [storied, setStoried] = useState(false);
  const [postUrl, setPostUrl] = useState('');
  const uploads = useRef<Record<string, string>>({});
  const lock = useRef(false);
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preview = recording.file ? URL.createObjectURL(recording.file) : '';
    setUrl(preview);
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLElement>('button')?.focus();
    return () => { if (preview) URL.revokeObjectURL(preview); previous?.focus(); };
  }, [recording]);
  function save() {
    if (!url || !recording.file) return;
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = recording.file.name; anchor.click();
    setMessage('Download requested. Keep this screen open until your video is saved.');
  }
  async function share() {
    if (!recording.file) return;
    try {
      if (navigator.canShare?.({ files: [recording.file] })) await navigator.share({ title: recording.title, files: [recording.file] });
      else { save(); setMessage('Save the video, then upload it to Instagram, Facebook, or your chosen app.'); }
    } catch (error) { if (!(error instanceof Error && error.name === 'AbortError')) setMessage('Sharing could not open. Use Save video instead.'); }
  }
  async function publish(kind: 'post' | 'story') {
    if (lock.current) return;
    lock.current = true; setBusy(kind); setMessage('');
    try {
      const user = auth.currentUser;
      if (!user || user.uid !== recording.ownerId) throw new Error('Sign in to the account that made this recording.');
      const file = kind === 'story' ? recording.story : recording.file;
      if (!file) throw new Error('No recording is available.');
      if (file.size >= 50 * 1024 * 1024) throw new Error('This recording exceeds the 50 MB upload limit. Save it and upload a shorter clip.');
      const profile = (await getDoc(doc(db, 'users', user.uid))).data();
      const state = canonicalState(profile?.state, profile?.stateId);
      if (!state) throw new Error('Choose your state community in your profile first.');
      if (!uploads.current[kind]) uploads.current[kind] = await uploadFile(file, `posts/${user.uid}/live-${recording.id}-${kind}.${file.type.includes('mp4') ? 'mp4' : 'webm'}`, percent => setMessage(`Uploading ${percent}%`));
      const mediaUrl = uploads.current[kind];
      const name = profile?.displayName || user.displayName || 'Sports Family Member';
      if (kind === 'story') {
        await setDoc(doc(db, 'stateStories', state.stateId, 'stories', `live-${recording.id}`), {
          userId: user.uid, userName: name, avatarUrl: profile?.photoURL || profile?.avatarUrl || user.photoURL || '',
          mediaUrl, mediaType: 'video', createdAt: serverTimestamp(), expiresAt: Date.now() + 86400000, views: [], likes: [],
        });
        setStoried(true); setMessage('Your 15-second clip is in your state story for 24 hours.');
      } else {
        await setDoc(doc(db, 'stateFeeds', state.stateId, 'posts', `replay-${recording.id}`), {
          userId: user.uid, authorId: user.uid, author: name, initials: name.slice(0, 2).toUpperCase(),
          photoURL: profile?.photoURL || profile?.avatarUrl || user.photoURL || '', role: `${state.state} Sports Family`,
          message: caption.trim(), type: 'Video', mediaUrl, createdAt: 'Just now', createdAtMs: Date.now(), likes: 0, comments: [],
        });
        setPosted(true); setPostUrl(`${location.origin}/states/${state.stateId}`); setMessage('Video posted to your state community.');
      }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Upload failed. Your recording is still here; try again or save it.'); }
    finally { lock.current = false; setBusy(''); }
  }
  return <div className="fixed inset-0 z-[130] grid place-items-center bg-black/70 p-4"><div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="ended-title" className="w-full max-w-lg max-h-[calc(100dvh-32px)] overflow-auto rounded-2xl bg-white p-5 text-slate-900" onKeyDown={event => {
    if (event.key === 'Tab') {
      const items = dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input,a[href],video');
      if (!items?.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }}>
    <h2 id="ended-title" className="text-xl font-bold">Your broadcast ended</h2>
    {url ? <video src={url} controls playsInline className="my-3 max-h-60 w-full rounded-lg bg-black"/> : <p className="my-3">A recording could not be created in this browser.</p>}
    {recording.truncated && <p className="my-3">Recording stopped early because of a recording limit or error. The available portion is shown above.</p>}
    <label className="block my-3">Caption<input className="mt-1 w-full rounded-lg border p-2" value={caption} maxLength={2000} onChange={event => setCaption(event.target.value)}/></label>
    <div className="flex flex-wrap gap-2">
      <button disabled={!url || !!busy} onClick={save} className="rounded-lg bg-blue-800 p-3 text-white">Save video</button>
      <button disabled={!url || !!busy || posted} onClick={() => void publish('post')} className="rounded-lg bg-red-700 p-3 text-white">{posted ? 'Posted ✓' : 'Post to community'}</button>
      <button disabled={!recording.story || !!busy || storied} onClick={() => void publish('story')} className="rounded-lg bg-blue-800 p-3 text-white">{storied ? 'Story added ✓' : 'Add to story'}</button>
      <button disabled={!url || !!busy} onClick={() => void share()} className="rounded-lg border p-3">Share video</button>
      {postUrl && <ShareButton title={recording.title} url={postUrl}/>}
    </div>
    <p className="my-3 text-sm">Stories use the first 15 seconds. Save before closing; recordings are kept in this tab until you close this screen. Community uploads support videos under 50 MB.</p>
    {message && <p role="status" className="my-3">{message}</p>}
    <button disabled={!!busy} onClick={() => { if (window.confirm('Close and discard the recording from this tab? Save or post it first if you want to keep it.')) onClose(); }} className="rounded-lg border p-2">Close</button>
  </div></div>;
}
