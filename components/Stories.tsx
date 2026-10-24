import React, { useEffect, useState } from 'react'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import Lightbox from './Lightbox'
import {useAuth} from '../hooks/useAuth'
import {deleteContent} from '../lib/deleteContent'

export default function Stories() {
  const {user} = useAuth()
  const [deleting, setDeleting] = useState('')
  const [stories, setStories] = useState<any[]>([])
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        if (!db) return
        const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'), limit(20))
        const snap = await getDocs(q)
        const arr = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
        if (mounted) setStories(arr)
      } catch (e) {
        // ignore
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  if (!stories.length) return null

  return (
    <div className="flex gap-3 overflow-x-auto py-2">
      {stories.map((s, i) => (
        <div key={s.id} className="flex flex-col items-center" onClick={() => setOpenIndex(i)}>
          <img src={s.avatarUrl || '/default-avatar.png'} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" />
          <div className="text-xs mt-1">{s.displayName || 'User'}</div>
          {user && (s.authorId || s.userId) === user.uid && <button className="min-h-11 px-3 text-sm text-red-600" disabled={!!deleting} onClick={async event => {
            event.stopPropagation()
            if (deleting || !window.confirm('Delete this story?')) return
            setDeleting(s.id)
            try {await deleteContent({kind:'legacyStory',id:s.id});setOpenIndex(null);setStories(items => items.filter(item => item.id !== s.id))}
            catch (error) {window.alert(error instanceof Error ? error.message : 'Could not delete story.')}
            finally {setDeleting('')}
          }}>{deleting === s.id ? 'Deleting…' : 'Delete story'}</button>}
        </div>
      ))}

      {openIndex !== null && (
        <Lightbox media={stories.map((s) => ({ url: s.mediaUrl, type: s.mediaType || 'image' }))} startIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </div>
  )
}
