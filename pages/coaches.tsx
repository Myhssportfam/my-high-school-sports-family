import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ShareButton from '../components/ShareButton';
import {deleteContent} from '../lib/deleteContent';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, runTransaction, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { uploadFile } from '../lib/storage';
import { COACH_TOPICS, CoachTopic, isCoach, validateCoachPost } from '../lib/coaches';
type CoachPost = {id: string; authorId: string; author: string; title: string; content: string; topic: CoachTopic; sport: string; state: string; media: {url: string; type: string}[]; repostOf?: string; likesCount?: number; createdAt?: {toDate: () => Date}};
const panel = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900';
const field = 'w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-white';
const button = 'rounded-lg bg-blue-800 px-4 py-3 font-bold text-white disabled:opacity-50';
export default function CoachesCorner() {
  const router = useRouter();
  const [sharedPost, setSharedPost] = useState<CoachPost | null>(null);
  const {user, loading: authLoading} = useAuth();
  const {profile, loading: profileLoading} = useUserProfile(user?.uid);
  const coach = isCoach(profile);
  const [posts, setPosts] = useState<CoachPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [joining, setJoining] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState<CoachTopic>('Discussion');
  const [sport, setSport] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [feedLimit, setFeedLimit] = useState(20);
  const lock = useRef(false);
  const picker = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!user) { setPosts([]); setLoading(false); return; }
    setLoading(true);
    return onSnapshot(query(collection(db, 'coachPosts'), orderBy('createdAt', 'desc'), limit(feedLimit)), snap => {
      setPosts(snap.docs.map(item => ({...item.data(), id:item.id} as CoachPost))); setLoading(false); setFeedError('');
    }, error => { console.error('Coaches feed:', error); setFeedError('Coaches Corner could not load. Please try again shortly.'); setLoading(false); });
  }, [user, feedLimit]);
  useEffect(() => { const urls = files.map(file => URL.createObjectURL(file)); setPreviews(urls); return () => urls.forEach(url => URL.revokeObjectURL(url)); }, [files]);
  async function join() {
    if (!user || joining) return;
    setJoining(true); setMessage('');
    try { if (!profile) throw new Error('Complete your profile first.'); await updateDoc(doc(db, 'users', user.uid), {coachesCorner:true}); setMessage('Welcome to Coaches Corner.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not join. Try again.'); }
    finally { setJoining(false); }
  }
  function choose(next: FileList | null) {
    const selected = Array.from(next || []);
    try { validateCoachPost('Upload', 'Upload', topic, selected); setFiles(selected); setMessage(''); }
    catch (error) { setMessage((error as Error).message); if (picker.current) picker.current.value = ''; }
  }
  async function publish(event: FormEvent) {
    event.preventDefault(); if (!user || !coach || lock.current) return;
    lock.current = true; setBusy(true); setMessage('');
    try {
      validateCoachPost(title, content, topic, files);
      const media = [];
      for (const [index, file] of files.entries()) {
        const name = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
        const url = await uploadFile(file, `posts/${user.uid}/coach-${Date.now()}-${index}-${name}`, percent => setMessage(`Uploading file ${index + 1} of ${files.length}: ${percent}%`));
        media.push({url, type:file.type.startsWith('video/') ? 'video' : 'image'});
      }
      await addDoc(collection(db, 'coachPosts'), {authorId:user.uid, author:profile?.displayName || user.displayName || 'Coach', title:title.trim(), content:content.trim(), topic, sport:sport.trim(), state:profile?.state || '', media, likesCount:0, createdAt:serverTimestamp()});
      setTitle(''); setContent(''); setFiles([]); if (picker.current) picker.current.value = ''; setMessage('Your post is shared with Coaches Corner.');
    } catch (error) { console.error('Coach post:', error); setMessage(error instanceof Error ? error.message : 'Your post could not be shared. Try again.'); }
    finally { lock.current = false; setBusy(false); }
  }
  useEffect(() => {
    setSharedPost(null);
    const id = router.query.post;
    if (!user || typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(id)) return;
    return onSnapshot(doc(db, 'coachPosts', id), snap => {
      if (snap.exists()) setSharedPost({...snap.data(), id:snap.id} as CoachPost);
      else setMessage('This shared post is no longer available.');
    }, () => setMessage('The shared post could not load.'));
  }, [user, router.query.post]);
  const orderedPosts = sharedPost ? [sharedPost, ...posts.filter(post => post.id !== sharedPost.id)] : posts;
  const shown = orderedPosts.filter(post => (filter === 'All' || post.topic === filter) && `${post.title} ${post.content} ${post.author} ${post.sport} ${post.state}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="site-shell py-8 text-slate-900 dark:text-white">
    <Head><title>Coaches Corner | My High School Sports Family</title></Head>
    <section className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-red-900 p-6 text-white sm:p-10">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-200">My High School Sports Family</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">Coaches Corner</h1><p className="mt-3 max-w-2xl text-blue-100">Connect with coaches. Talk player development, share camp opportunities, and bring your coaching ideas to the family.</p>
      {!user && !authLoading && <div className="mt-5 flex flex-wrap gap-3"><Link href="/signin" className={button}>Coach sign in</Link><Link href="/signup?role=coach" className="rounded-lg bg-red-700 px-4 py-3 font-bold">Create coach account</Link></div>}
    </section>
    {authLoading ? <p className="my-6" role="status">Loading your account…</p> : !user ? <p className="my-6">Sign in to read posts and connect with the coaching community.</p> : <div className="mt-6 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className={panel}><h2 className="text-xl font-bold">Share with coaches</h2>
          {profileLoading ? <p className="my-4">Loading profile…</p> : !coach ? <div className="space-y-3 mt-3"><p>Coach accounts can publish posts and join discussions.</p><p className="text-sm">If you also coach, join here using your existing account.</p><button className={button} disabled={joining || !profile} onClick={() => void join()}>{joining ? 'Joining…' : 'I’m a coach — join'}</button>{!profile && <Link href="/profile" className="block underline">Complete your profile</Link>}</div> : <form onSubmit={publish} className="space-y-3 mt-4">
            <label className="block">Topic<select className={field} value={topic} disabled={busy} onChange={event => setTopic(event.target.value as CoachTopic)}>{COACH_TOPICS.map(item => <option key={item}>{item}</option>)}</select></label>
            <label className="block">Title<input className={field} value={title} disabled={busy} maxLength={140} required onChange={event => setTitle(event.target.value)} placeholder={topic === 'Camps' ? 'Summer skills camp' : topic === 'Players' ? 'Player spotlight' : 'What’s working for your team?'}/></label>
            <label className="block">Post<textarea className={field} rows={5} value={content} disabled={busy} maxLength={2000} required onChange={event => setContent(event.target.value)} placeholder={topic === 'Camps' ? 'Add dates, location, ages, cost, and registration details…' : 'Share coaching ideas, player news, or a question…'}/></label>
            <label className="block">Sport (optional)<input className={field} value={sport} disabled={busy} maxLength={60} onChange={event => setSport(event.target.value)} placeholder="Football, baseball, basketball…"/></label>
            <label className="block">Photos / videos<input ref={picker} className="mt-1 w-full" type="file" accept="image/*,video/*" multiple disabled={busy} onChange={event => choose(event.target.files)}/></label>
            <p className="text-sm text-slate-500 dark:text-slate-400">Up to four files, each under 50 MB.</p>
            <div className="grid grid-cols-2 gap-2">{previews.map((url, index) => <div key={url}>{files[index]?.type.startsWith('video/') ? <video src={url} controls playsInline className="w-full rounded-lg"/> : <img src={url} alt={`Selected upload ${index+1}`} className="h-24 w-full rounded-lg object-cover"/>}<button type="button" disabled={busy} className="text-sm underline" onClick={() => setFiles(current => current.filter((_, i) => i !== index))}>Remove</button></div>)}</div>
            <button className="w-full rounded-lg bg-red-700 px-4 py-3 font-bold text-white disabled:opacity-50" disabled={busy}>{busy ? 'Sharing…' : 'Share post'}</button>
          </form>}
          {message && <p className="mt-3 text-sm break-words" role="status">{message}</p>}
        </div>
        <div className={panel}><h2 className="font-bold">One coaching community</h2><p className="mt-2 text-sm">Discussion: questions, strategies, and experience.</p><p className="mt-2 text-sm">Players: achievements, development, and recruiting updates.</p><p className="mt-2 text-sm">Camps: dates, locations, and opportunities.</p></div>
      </aside>
      <section className="min-w-0 space-y-4" aria-label="Coach posts"><div className={panel}><h2 className="mb-3 text-xl font-bold">Around the corner</h2><div className="flex flex-wrap gap-2">{['All', ...COACH_TOPICS].map(item => <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)} className={filter === item ? button : 'rounded-lg border px-4 py-3'}>{item}</button>)}</div><input className={`${field} mt-3`} value={search} onChange={event => setSearch(event.target.value)} placeholder="Search loaded posts by coach, sport, state, or topic" aria-label="Search loaded coach posts"/></div>
        {loading && <p role="status">Loading posts…</p>}{feedError && <p role="alert">{feedError}</p>}{!loading && !feedError && !shown.length && <div className={panel}>{posts.length ? 'No matching posts. Try another search or topic.' : 'The corner is open. Share the first coaching conversation, player spotlight, or camp.'}</div>}
        {shown.map(post => <CoachCard key={post.id} post={post} canReply={coach} userId={user.uid} name={profile?.displayName || user.displayName || 'Coach'}/>)}
        {posts.length >= feedLimit && <button className={button} onClick={() => setFeedLimit(current => current + 20)}>Load more posts</button>}
      </section>
    </div>}
  </div>;
}
function CoachCard({post, canReply, userId, name}: {post:CoachPost; canReply:boolean; userId:string; name:string}) {
  const [open, setOpen] = useState(false);
  const [original, setOriginal] = useState<CoachPost | null>(null);
  const [originalMissing, setOriginalMissing] = useState(false);
  const [reposting, setReposting] = useState(false);
  const repostLock = useRef(false);
  useEffect(() => {
    if (!post.repostOf) return;
    return onSnapshot(doc(db, 'coachPosts', post.repostOf), snap => { setOriginal(snap.exists() ? {...snap.data(), id:snap.id} as CoachPost : null); setOriginalMissing(!snap.exists()); }, () => setOriginalMissing(true));
  }, [post.repostOf]);
  async function repost() {
    if (!canReply || repostLock.current) return;
    repostLock.current = true; setReposting(true); setError('');
    try {
      const sourceId = post.repostOf || post.id;
      const source = doc(db, 'coachPosts', sourceId), target = doc(db, 'coachPosts', `repost-${userId}-${sourceId}`);
      await runTransaction(db, async tx => {
        const [sourceSnap, existing] = await Promise.all([tx.get(source), tx.get(target)]);
        if (!sourceSnap.exists()) throw new Error('The original post is no longer available.');
        if (existing.exists()) throw new Error('You have already reposted this conversation.');
        const data = sourceSnap.data();
        tx.set(target, {authorId:userId, author:name, title:`Repost: ${data.title}`.slice(0,140), content:'Shared with the coaching community.', topic:data.topic, sport:data.sport || '', state:data.state || '', media:[], likesCount:0, repostOf:sourceId, createdAt:serverTimestamp()});
      });
      setError('Reposted to Coaches Corner.');
    } catch (error) {setError(error instanceof Error ? error.message : 'Could not repost. Try again.');}
    finally {repostLock.current = false; setReposting(false);}
  }
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const likeLock = useRef(false);
  useEffect(() => onSnapshot(doc(db, 'coachPosts', post.id, 'likes', userId), snap => setLiked(snap.exists()), () => setError('Your like could not load.')), [post.id, userId]);
  async function toggleLike() {
    if (likeLock.current) return;
    likeLock.current = true; setLiking(true); setError('');
    try {
      const parent = doc(db, 'coachPosts', post.id), like = doc(db, 'coachPosts', post.id, 'likes', userId);
      await runTransaction(db, async tx => {
        const [postSnap, likeSnap] = await Promise.all([tx.get(parent), tx.get(like)]);
        if (!postSnap.exists()) throw new Error('Post deleted.');
        const count = postSnap.data().likesCount || 0;
        if (likeSnap.exists()) { tx.delete(like); tx.update(parent, {likesCount:Math.max(0, count - 1)}); }
        else { tx.set(like, {userId, createdAt:serverTimestamp()}); tx.update(parent, {likesCount:count + 1}); }
      });
    } catch { setError('Your like could not be saved. Try again.'); }
    finally {likeLock.current = false; setLiking(false);}
  }
  const [replies, setReplies] = useState<{id:string; authorId:string; author:string; text:string}[]>([]);
  const [text, setText] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const lock = useRef(false);
  useEffect(() => { if (!open) return; return onSnapshot(query(collection(db, 'coachPosts', post.id, 'comments'), orderBy('createdAt', 'asc')), snap => setReplies(snap.docs.map(item => ({...item.data(), id:item.id} as typeof replies[number]))), () => setError('Replies could not load. Try again.')); }, [open, post.id]);
  async function reply(event:FormEvent) {
    event.preventDefault(); if (!canReply || !text.trim() || lock.current) return;
    lock.current = true; setBusy(true); setError('');
    try { await addDoc(collection(db, 'coachPosts', post.id, 'comments'), {authorId:userId, author:name, text:text.trim(), createdAt:serverTimestamp()}); setText(''); }
    catch { setError('Your reply could not be sent. Try again.'); } finally { lock.current = false; setBusy(false); }
  }
  async function remove(path:string[]) {
    if (lock.current || !window.confirm('Delete this item?')) return;
    lock.current = true; setBusy(true); setError('');
    try { if (path.length === 1) await deleteContent({kind:'coach',id:path[0]}); else await deleteDoc(doc(db, 'coachPosts', ...path)); } catch { setError('Could not delete. Try again.'); }
    finally {lock.current = false; setBusy(false);}
  }
  return <article id={`coach-post-${post.id}`} className={panel}>
    <div className="flex flex-wrap items-center justify-between gap-2"><span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900">{post.topic}</span>{post.authorId === userId && <button disabled={busy} onClick={() => void remove([post.id])} className="text-sm text-red-600 underline">Delete post</button>}</div>
    <h3 className="mt-3 text-xl font-bold break-words">{post.title}</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400"><Link href={`/athletes/${post.authorId}`} className="underline">{post.author}</Link>{post.state && ` · ${post.state}`}{post.sport && ` · ${post.sport}`}{post.createdAt?.toDate && ` · ${post.createdAt.toDate().toLocaleDateString()}`}</p>
    <p className="mt-4 whitespace-pre-wrap break-words">{post.content}</p>
    {post.repostOf && <div className="mt-4 rounded-xl border p-4">{original ? <><Link className="font-bold underline" href={`/coaches?post=${original.id}`}>Originally shared by {original.author}</Link><h4 className="mt-2 font-bold">{original.title}</h4><p className="mt-2 whitespace-pre-wrap break-words">{original.content}</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{original.media?.map((media,index) => media.type === 'video' ? <video key={index} src={media.url} controls playsInline preload="metadata" className="max-h-96 w-full rounded-xl bg-black"/> : <img key={index} src={media.url} alt={`${original.title}, photo ${index+1}`} loading="lazy" className="max-h-96 w-full rounded-xl object-contain"/>)}</div></> : <p>{originalMissing ? 'The original post is no longer available.' : 'Loading original post…'}</p>}</div>}<div className="mt-4 grid gap-3 sm:grid-cols-2">{post.media?.map((media, index) => media.type === 'video' ? <video key={index} src={media.url} controls playsInline preload="metadata" className="max-h-96 w-full rounded-xl bg-black"/> : <img key={index} src={media.url} alt={`${post.title}, photo ${index+1}`} loading="lazy" className="max-h-96 w-full rounded-xl object-contain"/>)}</div>
    <div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" disabled={liking} aria-pressed={liked} onClick={() => void toggleLike()} className="rounded-lg border px-3 py-2 font-bold disabled:opacity-50">{liked ? '♥ Liked' : '♡ Like'} · {post.likesCount || 0}</button><button type="button" disabled={!canReply || reposting || originalMissing} onClick={() => void repost()} className="rounded-lg border px-3 py-2 font-bold disabled:opacity-50">{reposting ? 'Reposting…' : '↻ Repost'}</button><ShareButton title={post.title} subject="post" url={typeof location === 'undefined' ? '' : `${location.origin}/coaches?post=${post.id}`}/></div>
    <button className="mt-4 font-bold text-blue-700 dark:text-blue-300" aria-expanded={open} onClick={() => setOpen(current => !current)}>{open ? 'Hide conversation' : 'Join conversation'}</button>
    {open && <div className="mt-4 space-y-3 border-t pt-4">{!replies.length && <p className="text-sm">No replies yet.</p>}{replies.map(reply => <div key={reply.id} className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800"><strong>{reply.author}</strong><p className="whitespace-pre-wrap break-words">{reply.text}</p>{reply.authorId === userId && <button disabled={busy} onClick={() => void remove([post.id, 'comments', reply.id])} className="text-sm underline">Delete reply</button>}</div>)}{canReply ? <form onSubmit={reply} className="space-y-2"><label className="block">Your reply<textarea className={field} rows={2} maxLength={500} disabled={busy} required value={text} onChange={event => setText(event.target.value)}/></label><button className={button} disabled={busy || !text.trim()}>{busy ? 'Sending…' : 'Reply'}</button></form> : <p className="text-sm">Join Coaches Corner to reply.</p>}</div>}
    {error && <p className="mt-3" role="alert">{error}</p>}
  </article>;
}
