import { doc, runTransaction, getDoc, collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from './firebase'

export async function followUser(currentUserId: string, targetUserId: string) {
  const followerRef = doc(db, 'users', targetUserId, 'followers', currentUserId)
  const followingRef = doc(db, 'users', currentUserId, 'following', targetUserId)
  const targetRef = doc(db, 'users', targetUserId)
  const currentRef = doc(db, 'users', currentUserId)

  return runTransaction(db, async (tx) => {
    const tSnap = await tx.get(targetRef)
    if (!tSnap.exists()) throw new Error('Target user not found')
    const cSnap = await tx.get(currentRef)
    const currentData = cSnap.exists() ? (cSnap.data() as any) : {}
    const targetData = tSnap.data() as any
    // create follower and following entries with denormalized profile snapshots
    tx.set(followerRef, {
      userId: currentUserId,
      displayName: currentData.displayName || null,
      avatarUrl: currentData.avatarUrl || null,
      createdAt: new Date()
    })
    tx.set(followingRef, {
      userId: targetUserId,
      displayName: targetData.displayName || null,
      avatarUrl: targetData.avatarUrl || null,
      createdAt: new Date()
    })
    // increment counters
    tx.update(targetRef, { followersCount: (tSnap.data()?.followersCount || 0) + 1 })
    if (cSnap.exists()) {
      tx.update(currentRef, { followingCount: (cSnap.data()?.followingCount || 0) + 1 })
    }
    return true
  })
}

export async function unfollowUser(currentUserId: string, targetUserId: string) {
  const followerRef = doc(db, 'users', targetUserId, 'followers', currentUserId)
  const followingRef = doc(db, 'users', currentUserId, 'following', targetUserId)
  const targetRef = doc(db, 'users', targetUserId)
  const currentRef = doc(db, 'users', currentUserId)

  return runTransaction(db, async (tx) => {
    const tSnap = await tx.get(targetRef)
    if (!tSnap.exists()) throw new Error('Target user not found')
    tx.delete(followerRef)
    tx.delete(followingRef)
    tx.update(targetRef, { followersCount: Math.max(0, (tSnap.data()?.followersCount || 1) - 1) })
    const cSnap = await tx.get(currentRef)
    if (cSnap.exists()) {
      tx.update(currentRef, { followingCount: Math.max(0, (cSnap.data()?.followingCount || 1) - 1) })
    }
    return true
  })
}

export async function fetchFollowers(userId: string, limitCount = 50) {
  const col = collection(db, 'users', userId, 'followers')
  const q = query(col, orderBy('createdAt', 'desc'), limit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchFollowersPaginated(userId: string, limitCount = 20, startAfterId?: string) {
  const col = collection(db, 'users', userId, 'followers')
  let q
  if (startAfterId) {
    const startRef = doc(db, 'users', userId, 'followers', startAfterId)
    const startSnap = await getDoc(startRef)
    if (startSnap.exists()) {
      q = query(col, orderBy('createdAt', 'desc'), startAfter(startSnap), limit(limitCount))
    } else {
      q = query(col, orderBy('createdAt', 'desc'), limit(limitCount))
    }
  } else {
    q = query(col, orderBy('createdAt', 'desc'), limit(limitCount))
  }
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchFollowingPaginated(userId: string, limitCount = 20, startAfterId?: string) {
  const col = collection(db, 'users', userId, 'following')
  let q
  if (startAfterId) {
    const startRef = doc(db, 'users', userId, 'following', startAfterId)
    const startSnap = await getDoc(startRef)
    if (startSnap.exists()) {
      q = query(col, orderBy('createdAt', 'desc'), startAfter(startSnap), limit(limitCount))
    } else {
      q = query(col, orderBy('createdAt', 'desc'), limit(limitCount))
    }
  } else {
    q = query(col, orderBy('createdAt', 'desc'), limit(limitCount))
  }
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function searchFollowersServer(targetUserId: string, q: string, limit = 50, startAfterId?: string) {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000'
  const resp = await fetch(`${base}/followers/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetUserId, q, limit, startAfterId })
  })
  if (!resp.ok) throw new Error('search request failed')
  return resp.json()
}

export async function fetchFollowing(userId: string, limitCount = 50) {
  const col = collection(db, 'users', userId, 'following')
  const q = query(col, orderBy('createdAt', 'desc'), limit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchUserById(userId: string) {
  const ref = doc(db, 'users', userId)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...(snap.data() as any) } : null
}

export async function isFollowingUser(currentUserId: string | undefined | null, targetUserId: string) {
  if (!currentUserId) return false
  const ref = doc(db, 'users', currentUserId, 'following', targetUserId)
  const snap = await getDoc(ref)
  return snap.exists()
}
