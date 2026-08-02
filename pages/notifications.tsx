import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

export default function NotificationsPage() {
  const { user, loading } = useAuth()
  const [items, setItems] = React.useState<any[]>([])

  React.useEffect(() => {
    if (!user) return
    let mounted = true
    ;(async () => {
      const q = query(collection(db, 'notifications', user.uid, 'items'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      const arr = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
      if (mounted) setItems(arr)
    })()
    return () => { mounted = false }
  }, [user])

  if (loading) return <div className="container py-8">Loading...</div>
  if (!user) return <div className="container py-8">Please sign in to see notifications</div>

  async function markRead(id: string) {
    if (!user) return
    try {
      await updateDoc(doc(db, 'notifications', user.uid, 'items', id), { read: true })
      setItems((s) => s.map((it) => it.id === id ? { ...it, read: true } : it))
    } catch (e) {}
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <div className="mt-4 space-y-2">
        {items.length === 0 && <div className="text-gray-500">No notifications</div>}
        {items.map((it) => (
          <div key={it.id} className={`p-3 border rounded ${it.read ? 'bg-white/50' : 'bg-blue-50'}`}>
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{it.type}</div>
                <div className="text-sm">From: {it.from}</div>
                <div className="text-sm">{it.postId}</div>
              </div>
              {!it.read && <button onClick={() => markRead(it.id)} className="px-2 py-1 border rounded">Mark read</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
