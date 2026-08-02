import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { followUser, unfollowUser, isFollowingUser } from '../lib/users'

export default function AthleteHeader({ profile, onFollowChange }: { profile: any; onFollowChange?: (following: boolean) => void }) {
  const { user } = useAuth()
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    if (!user || !profile?.id) {
      setFollowing(false)
      return
    }
    ;(async () => {
      try {
        const res = await isFollowingUser(user.uid, profile.id)
        if (mounted) setFollowing(res)
      } catch (e) {}
    })()
    return () => { mounted = false }
  }, [user, profile?.id])

  async function toggleFollow() {
    if (!user) return alert('Sign in to follow')
    setLoading(true)
    try {
      if (following) {
        await unfollowUser(user.uid, profile.id)
        setFollowing(false)
        onFollowChange && onFollowChange(false)
      } else {
        await followUser(user.uid, profile.id)
        setFollowing(true)
        onFollowChange && onFollowChange(true)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded bg-white dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <img src={profile.avatarUrl || '/default-avatar.png'} className="w-24 h-24 rounded-full object-cover" />
        <div>
          <div className="text-2xl font-bold">{profile.displayName}</div>
          <div className="text-sm text-gray-500">{[profile.schoolName || profile.schoolId, profile.city, profile.state].filter(Boolean).join(' · ')}</div>
          <div className="mt-2 text-sm">{profile.bio}</div>
          <div className="mt-3 flex gap-3">
            <button onClick={toggleFollow} disabled={loading} className="px-3 py-1 border rounded">
              {following ? 'Following' : 'Follow'}
            </button>
            <a href={`mailto:${profile.email}`} className="px-3 py-1 border rounded">Message</a>
          </div>
        </div>
      </div>
    </div>
  )
}
