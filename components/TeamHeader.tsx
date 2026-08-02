import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'
import { isFollowingTeam, followTeam, unfollowTeam } from '../lib/follows'

export default function TeamHeader({ team, school }: { team: any; school?: any }) {
  const { user } = useAuth()
  const [following, setFollowing] = useState(false)
  const [loadingFollow, setLoadingFollow] = useState(false)

  useEffect(() => {
    let mounted = true
    if (!user || !team?.id) {
      setFollowing(false)
      return
    }
    ;(async () => {
      try {
        const res = await isFollowingTeam(user.uid, team.id)
        if (mounted) setFollowing(res)
      } catch (e) {}
    })()
    return () => { mounted = false }
  }, [user, team?.id])

  async function toggleFollow() {
    if (!user || !team?.id) return
    setLoadingFollow(true)
    try {
      if (following) {
        await unfollowTeam(user.uid, team.id)
        setFollowing(false)
      } else {
        await followTeam(user.uid, team.id)
        setFollowing(true)
      }
    } catch (e) {
      // ignore
    } finally {
      setLoadingFollow(false)
    }
  }

  return (
    <div className="relative rounded overflow-hidden mb-6">
      <div className="h-28 bg-gradient-to-r from-blue-500 to-indigo-600 w-full flex items-center px-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden">
            {team?.logoUrl ? <img src={team.logoUrl} className="w-full h-full object-cover" /> : <div className="text-xl font-bold text-gray-700">{(team?.name || '').slice(0,2)}</div>}
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-bold">{team?.name}</h2>
            <div className="text-sm opacity-90">{team?.sport} • {school ? <Link href={`/states/${school.stateId}/${school.cityId}/${school.id}`} className="underline">{school.name}</Link> : ''}</div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-white dark:bg-gray-900 border-t flex items-center justify-between">
        <div className="text-sm text-gray-600">Record: {team?.record || '—'}</div>
        <div>
          <button onClick={toggleFollow} disabled={loadingFollow} className={`px-3 py-1 rounded ${following ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white'}`}>
            {following ? 'Following' : 'Follow Team'}
          </button>
        </div>
      </div>
    </div>
  )
}
