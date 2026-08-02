import React, { useEffect, useState } from 'react'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'

export default function Reels() {
  const [reels, setReels] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        if (!db) return
        // Fetch posts that contain video media
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50))
        const snap = await getDocs(q)
        const arr = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
        const videos = arr.filter((p) => (p.media || []).some((m: any) => m.type === 'video'))
        if (mounted) setReels(videos)
      } catch (e) {
        // ignore
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (!reels.length) return <div className="p-4">No reels yet</div>

  return (
    <div className="space-y-4">
      {reels.map((r) => (
        <div key={r.id} className="w-full h-[60vh] bg-black flex items-center justify-center">
          <video src={r.media[0].url} controls className="max-h-full" />
        </div>
      ))}
    </div>
  )
}
