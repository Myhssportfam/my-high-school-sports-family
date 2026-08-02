import React, { useEffect, useMemo, useState } from 'react'
import PostCard from './PostCard'
import { subscribeToRecentPosts, fetchUserLikes } from '../lib/posts'
import { useAuth } from '../hooks/useAuth'

export default function Feed() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<any[]>([])
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'state' | 'recruiting'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    try {
      return subscribeToRecentPosts((nextPosts) => {
        setPosts(nextPosts)
        setLoading(false)
      }, (err) => {
        setError(err.message)
        setLoading(false)
      }, 30)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user) { setLikedPosts(new Set()); return }
    fetchUserLikes(user.uid).then(setLikedPosts)
  }, [user])

  const visiblePosts = useMemo(() => posts.filter((post) => {
    if (filter === 'recruiting') return /recruit|offer|coach|highlight/i.test(`${post.content || ''} ${post.sport || ''}`)
    if (filter === 'state') return Boolean(post.state || post.author?.state)
    return true
  }), [posts, filter])

  if (loading) return <div className="feed-loading">{[1, 2, 3].map((item) => <div className="feed-skeleton" key={item}><span /><div><i /><i /></div></div>)}</div>

  return (
    <div className="social-feed">
      <div className="feed-tabs" role="tablist" aria-label="Feed filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Latest</button>
        <button className={filter === 'state' ? 'active' : ''} onClick={() => setFilter('state')}>State Communities</button>
        <button className={filter === 'recruiting' ? 'active' : ''} onClick={() => setFilter('recruiting')}>Recruiting</button>
      </div>
      {error && <div className="feed-message error"><strong>Feed unavailable.</strong><span>{error}</span></div>}
      {!error && visiblePosts.length === 0 && <div className="feed-message"><strong>Be the first to post.</strong><span>Share a highlight, score, or sports update with the MHSF community.</span></div>}
      <div className="space-y-5">
        {visiblePosts.map((post) => <PostCard key={post.id} post={post} initialLiked={likedPosts.has(post.id)} />)}
      </div>
    </div>
  )
}
