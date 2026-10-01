import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  if (!auth) {
    setUser(null)
    setLoading(false)
    return
  }

  const loadingTimeout = window.setTimeout(() => {
    console.warn("Firebase auth listener timed out")
    setUser(auth.currentUser)
    setLoading(false)
  }, 5000)

  const unsub = onAuthStateChanged(
    auth,
    (firebaseUser) => {
      window.clearTimeout(loadingTimeout)
      setUser(firebaseUser)
      setLoading(false)
    },
    (error) => {
      window.clearTimeout(loadingTimeout)
      console.error("Firebase auth listener error:", error)
      setUser(null)
      setLoading(false)
    }
  )

  return () => {
    window.clearTimeout(loadingTimeout)
    unsub()
  }
}, [])

  return { user, loading }
}
