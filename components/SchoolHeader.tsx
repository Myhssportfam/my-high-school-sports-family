import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { isFollowingSchool, followSchool, unfollowSchool } from '../lib/follows'

export default function SchoolHeader({ school }: { school: any }) {
  const { user } = useAuth()
  const [following, setFollowing] = useState(false)
  const [loadingFollow, setLoadingFollow] = useState(false)

  useEffect(() => {
    let mounted = true
    if (!user || !school?.id) {
      setFollowing(false)
      return
    }
    ;(async () => {
      try {
        const res = await isFollowingSchool(user.uid, school.id)
        if (mounted) setFollowing(res)
      } catch (e) {}
    })()
    return () => { mounted = false }
  }, [user, school?.id])

  async function toggleFollow() {
    if (!user || !school?.id) return
    setLoadingFollow(true)
    try {
      if (following) {
        await unfollowSchool(user.uid, school.id)
        setFollowing(false)
      } else {
        await followSchool(user.uid, school.id)
        setFollowing(true)
      }
    } catch (e) {
      // ignore for now
    } finally {
      setLoadingFollow(false)
    }
  }

  return (
    <div className="relative rounded overflow-hidden mb-6">
      <div className="h-44 bg-gray-200 dark:bg-gray-800 w-full flex items-center justify-center">
        {school?.coverUrl ? <img src={school.coverUrl} className="w-full h-full object-cover" /> : <div className="text-2xl text-gray-600">{school?.name}</div>}
      </div>
      <div className="p-4 bg-white dark:bg-gray-900 border-t flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={school?.logoUrl || '/default-school.png'} className="w-20 h-20 object-cover rounded" />
          <div>
            <h2 className="text-2xl font-bold">{school?.name}</h2>
            <div className="text-sm text-gray-600">{school?.city}, {school?.state}</div>
          </div>
        </div>
        <div>
          <button onClick={toggleFollow} disabled={loadingFollow} className={`px-3 py-1 rounded ${following ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white'}`}>
            {following ? 'Following' : 'Follow School'}
          </button>
        </div>
      </div>
    </div>
  )
}
