import React, { useEffect, useState } from 'react'
import { fetchPostsByAuthor } from '../lib/posts'
import PostCard from './PostCard'

export default function AthletePosts({ athleteId }: { athleteId: string }) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchPostsByAuthor(athleteId)
      .then((p) => mounted && setPosts(p))
      .catch((e) => mounted && setError(e.message || 'Failed to load posts'))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [athleteId])

  if (loading) return <div>Loading posts...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-4">
      {posts.length ? posts.map((p) => <PostCard key={p.id} post={p} />) : <div className="text-sm text-gray-500">No posts yet.</div>}
    </div>
  )
}
