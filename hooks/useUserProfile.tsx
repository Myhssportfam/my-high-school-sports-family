import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { UserProfile } from '../types/user'

export function useUserProfile(uid?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid || !db) {
      setProfile(null)
      setLoading(false)
      return
    }
    const ref = doc(db, 'users', uid)
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [uid])

  return { profile, loading }
}
