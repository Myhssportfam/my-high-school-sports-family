import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createReshare, deletePost, hasUserLiked, hasUserSaved, toggleLike, toggleSave } from '../lib/posts'
import { useAuth } from '../hooks/useAuth'
import CommentSection from './CommentSection'
import Lightbox from './Lightbox'

function formatDate(value: any) {
  const date = value?.toDate?.() || (value ? new Date(value) : null)
  if (!date || Number.isNaN(date.getTime())) return 'Just now'
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function PostCard({ post, initialLiked }: { post: any; initialLiked?: boolean }) {
  const { user } = useAuth()
  const [likesCount, setLikesCount] = useState(post.likesCount || 0)
  const [liked, setLiked] = useState(Boolean(initialLiked))
  const [saved, setSaved] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    if (!user || typeof initialLiked === 'boolean') return
    hasUserLiked(post.id, user.uid).then(setLiked).catch(() => {})
  }, [post.id, user, initialLiked])

  useEffect(() => {
    if (!user) return
    hasUserSaved(post.id, user.uid).then(setSaved).catch(() => {})
  }, [post.id, user])

  async function onToggleLike() {
    if (!user) return setError('Sign in to like posts.')
    const previous = liked
    setLiked(!previous)
    setLikesCount((count: number) => Math.max(0, count + (previous ? -1 : 1)))
    try {
      const result = await toggleLike(post.id, user.uid)
      setLiked(result.liked)
    } catch (err: any) {
      setLiked(previous)
      setLikesCount((count: number) => Math.max(0, count + (previous ? 1 : -1)))
      setError(err.message || 'Like could not be saved.')
    }
  }

  async function onShare() {
    setError(null)
    const url = `${window.location.origin}/?post=${post.id}`
    if (navigator.share) {
      try { await navigator.share({ title: 'My High School Sports Family', text: post.content || 'See this post on MHSF', url }); return } catch {}
    }
    if (!user) {
      await navigator.clipboard?.writeText(url)
      setError('Post link copied.')
      return
    }
    setSharing(true)
    try { await createReshare(post.id, user); setError('Post shared to the MHSF feed.') }
    catch (err: any) { setError(err.message || 'Post could not be shared.') }
    finally { setSharing(false) }
  }

  async function onDelete() {
    if (!user || user.uid !== post.authorId) return
    if (!window.confirm('Delete this post?')) return
    try { await deletePost(post.id, user.uid); setDeleted(true) }
    catch (err: any) { setError(err.message || 'Post could not be deleted.') }
  }

  if (deleted) return null
  const displayName = post.author?.displayName || 'MHSF Member'
  const meta = [post.author?.school, post.author?.city, post.author?.state].filter(Boolean).join(' · ')
  const media = Array.isArray(post.media) ? post.media : []

  return (
    <article className="social-post">
      <header className="post-header">
        <Link href={post.authorId ? `/athlete/${post.authorId}` : '#'} className="post-author">
          {post.author?.avatarUrl ? <img src={post.author.avatarUrl} alt="" /> : <span>{displayName[0].toUpperCase()}</span>}
          <div><strong>{displayName}</strong><small>{meta || 'My High School Sports Family'} · {formatDate(post.createdAt)}</small></div>
        </Link>
        <div className="post-tags">
          {post.sport && <span>🏅 {post.sport}</span>}
          {post.state && <span>📍 {post.state}</span>}
          {user?.uid === post.authorId && <button onClick={onDelete} title="Delete post">•••</button>}
        </div>
      </header>

      {post.content && <p className="post-content">{post.content}</p>}

      {media.length > 0 && <div className={`post-media media-count-${Math.min(media.length, 4)}`}>
        {media.slice(0, 4).map((item: any, index: number) => <button key={`${item.url}-${index}`} onClick={() => { setLightboxIndex(index); setLightboxOpen(true) }}>
          {item.type === 'video' ? <video src={item.url} controls preload="metadata" /> : <img src={item.url} alt={`Post media ${index + 1}`} />}
          {index === 3 && media.length > 4 && <span className="more-media">+{media.length - 4}</span>}
        </button>)}
      </div>}

      <div className="post-stats">
        <span>{likesCount ? `❤️ ${likesCount}` : 'Be the first to like'}</span>
        <button onClick={() => setCommentsOpen(true)}>{post.commentsCount || 0} comments</button>
      </div>

      <div className="post-actions">
        <button className={liked ? 'active' : ''} onClick={onToggleLike}>{liked ? '❤️ Liked' : '♡ Like'}</button>
        <button onClick={() => setCommentsOpen((value) => !value)}>💬 Comment</button>
        <button onClick={onShare} disabled={sharing}>↗ {sharing ? 'Sharing…' : 'Share'}</button>
        <button className={saved ? 'active' : ''} onClick={async () => {
          if (!user) return setError('Sign in to save posts.')
          try { setSaved((await toggleSave(post.id, user.uid)).saved) } catch (err: any) { setError(err.message) }
        }}>{saved ? '🔖 Saved' : '🔖 Save'}</button>
      </div>

      {error && <div className={`post-notice ${error.includes('copied') || error.includes('shared') ? 'success' : ''}`}>{error}</div>}
      <CommentSection postId={post.id} initiallyOpen={commentsOpen} />
      {lightboxOpen && <Lightbox media={media} startIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />}
    </article>
  )
}
