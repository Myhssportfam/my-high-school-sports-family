import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'
import { followUser, unfollowUser, isFollowingUser } from '../lib/users'

export default function CoachCard({ coach }: { coach: any }) {
  const { user } = useAuth()
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    if (!user || !coach?.id) {
      setFollowing(false)
      return
    }
    ;(async () => {
      try {
        const res = await isFollowingUser(user.uid, coach.id)
        if (mounted) setFollowing(res)
      } catch (e) {}
    })()
    return () => { mounted = false }
  }, [user, coach?.id])

  async function toggleFollow() {
    if (!user) return alert('Sign in to follow')
    setLoading(true)
    try {
      if (following) {
        await unfollowUser(user.uid, coach.id)
        setFollowing(false)
      } else {
        await followUser(user.uid, coach.id)
        setFollowing(true)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-3 border rounded bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <img src={coach.avatarUrl || '/default-avatar.png'} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1">
          <div className="font-semibold">{coach.displayName}</div>
          <div className="text-sm text-gray-500">{coach.title || 'Coach'}</div>
        </div>
        <div>
          <button onClick={toggleFollow} disabled={loading} className={`px-2 py-1 rounded text-sm ${following ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white'}`}>
            {following ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>
    </div>
  )
}
