import {
  collection, addDoc, serverTimestamp, query, orderBy, limit, startAfter, getDocs, doc, getDoc,
  runTransaction, increment, where, setDoc, deleteDoc, onSnapshot
} from 'firebase/firestore'
import { db } from './firebase'

function requireDb() {
  if (!db) throw new Error('Firebase is not configured. Add your values to .env.local and restart the development server.')
  return db
}

export async function createPost({ author, profile, content, media = [], sport, state }: any) {
  const firestore = requireDb()
  const payload = {
    authorId: author.uid,
    content: content || '',
    media,
    sport: sport || null,
    state: state || profile?.state || null,
    school: profile?.school || profile?.schoolName || null,
    likesCount: 0,
    commentsCount: 0,
    reshareCount: 0,
    createdAt: serverTimestamp(),
    author: {
      id: author.uid,
      displayName: profile?.displayName || author.displayName || author.email || 'MHSF Member',
      avatarUrl: profile?.avatarUrl || profile?.photoURL || author.photoURL || null,
      schoolId: profile?.schoolId || null,
      school: profile?.school || profile?.schoolName || null,
      city: profile?.city || null,
      state: profile?.state || null,
      sport: profile?.primarySport || profile?.sport || null,
    },
  }
  const docRef = await addDoc(collection(firestore, 'posts'), payload)
  return docRef.id
}

export function subscribeToRecentPosts(callback: (posts: any[]) => void, onError?: (error: Error) => void, limitCount = 20) {
  const firestore = requireDb()
  const feedQuery = query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'), limit(limitCount))
  return onSnapshot(feedQuery, (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
  }, (error) => onError?.(error))
}

export async function fetchPostsPage(limitCount = 10, startAfterDoc?: any) {
  const firestore = requireDb()
  const postsCol = collection(firestore, 'posts')
  const q = startAfterDoc
    ? query(postsCol, orderBy('createdAt', 'desc'), startAfter(startAfterDoc), limit(limitCount))
    : query(postsCol, orderBy('createdAt', 'desc'), limit(limitCount))
  return getDocs(q)
}

export async function fetchPostsPageByAuthors(authorIds: string[] = [], limitCount = 10) {
  const firestore = requireDb()
  if (!authorIds.length) return fetchPostsPage(limitCount)
  const uniqueIds = Array.from(new Set(authorIds)).slice(0, 30)
  const results: any[] = []
  for (let index = 0; index < uniqueIds.length; index += 10) {
    const q = query(collection(firestore, 'posts'), where('authorId', 'in', uniqueIds.slice(index, index + 10)), orderBy('createdAt', 'desc'), limit(limitCount))
    const snapshot = await getDocs(q)
    results.push(...snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
  }
  results.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
  return { docs: results.slice(0, limitCount).map((item) => ({ id: item.id, data: () => item })) }
}

export async function createReshare(originalPostId: string, user: any, comment?: string) {
  const firestore = requireDb()
  const originalRef = doc(firestore, 'posts', originalPostId)
  const newRef = doc(collection(firestore, 'posts'))
  return runTransaction(firestore, async (tx) => {
    const original = await tx.get(originalRef)
    if (!original.exists()) throw new Error('Original post not found')
    tx.set(newRef, {
      authorId: user.uid, content: comment || '', media: [], likesCount: 0, commentsCount: 0, reshareCount: 0,
      createdAt: serverTimestamp(), reshareOf: originalPostId,
      author: { id: user.uid, displayName: user.displayName || user.email || 'MHSF Member', avatarUrl: user.photoURL || null },
    })
    tx.update(originalRef, { reshareCount: increment(1) })
    return newRef.id
  })
}

export async function deletePost(postId: string, userId: string) {
  const firestore = requireDb()
  const postRef = doc(firestore, 'posts', postId)
  return runTransaction(firestore, async (tx) => {
    const snapshot = await tx.get(postRef)
    if (!snapshot.exists()) throw new Error('Post not found')
    if (snapshot.data().authorId !== userId) throw new Error('You can only delete your own posts.')
    tx.delete(postRef)
  })
}

export async function toggleLike(postId: string, userId: string): Promise<{ liked: boolean }> {
  const firestore = requireDb()
  const likeRef = doc(firestore, 'posts', postId, 'likes', userId)
  const postRef = doc(firestore, 'posts', postId)
  const userLikeRef = doc(firestore, 'userLikes', userId, 'likes', postId)
  return runTransaction(firestore, async (tx) => {
    const likeSnapshot = await tx.get(likeRef)
    const postSnapshot = await tx.get(postRef)
    if (!postSnapshot.exists()) throw new Error('Post not found')
    if (likeSnapshot.exists()) {
      tx.delete(likeRef)
      tx.delete(userLikeRef)
      tx.update(postRef, { likesCount: increment(-1) })
      return { liked: false }
    }
    tx.set(likeRef, { userId, createdAt: serverTimestamp() })
    tx.set(userLikeRef, { postId, createdAt: serverTimestamp() })
    tx.update(postRef, { likesCount: increment(1) })
    const authorId = postSnapshot.data().authorId
    if (authorId && authorId !== userId) {
      tx.set(doc(firestore, 'notifications', authorId, 'items', `${postId}_like_${userId}`), { type: 'like', from: userId, postId, createdAt: serverTimestamp(), read: false })
    }
    return { liked: true }
  })
}

export async function hasUserLiked(postId: string, userId: string) {
  return (await getDoc(doc(requireDb(), 'posts', postId, 'likes', userId))).exists()
}

export async function fetchUserLikes(userId: string) {
  try {
    const snapshot = await getDocs(collection(requireDb(), 'userLikes', userId, 'likes'))
    return new Set(snapshot.docs.map((item) => item.id))
  } catch { return new Set<string>() }
}

export async function addComment(postId: string, user: any, text: string) {
  const firestore = requireDb()
  const commentRef = doc(collection(firestore, 'posts', postId, 'comments'))
  const postRef = doc(firestore, 'posts', postId)
  await runTransaction(firestore, async (tx) => {
    const postSnapshot = await tx.get(postRef)
    if (!postSnapshot.exists()) throw new Error('Post not found')
    tx.set(commentRef, {
      authorId: user.uid, text, createdAt: serverTimestamp(),
      author: { id: user.uid, displayName: user.displayName || user.email || 'MHSF Member', avatarUrl: user.photoURL || null },
    })
    tx.update(postRef, { commentsCount: increment(1) })
    const authorId = postSnapshot.data().authorId
    if (authorId && authorId !== user.uid) {
      tx.set(doc(collection(firestore, 'notifications', authorId, 'items')), { type: 'comment', from: user.uid, postId, text, createdAt: serverTimestamp(), read: false })
    }
  })
}

export function subscribeToComments(postId: string, callback: (comments: any[]) => void, limitCount = 30) {
  const q = query(collection(requireDb(), 'posts', postId, 'comments'), orderBy('createdAt', 'asc'), limit(limitCount))
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))))
}

export async function fetchComments(postId: string, limitCount = 30) {
  const q = query(collection(requireDb(), 'posts', postId, 'comments'), orderBy('createdAt', 'asc'), limit(limitCount))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function toggleSave(postId: string, userId: string) {
  const saveRef = doc(requireDb(), 'userSaves', userId, 'saves', postId)
  if ((await getDoc(saveRef)).exists()) { await deleteDoc(saveRef); return { saved: false } }
  await setDoc(saveRef, { postId, createdAt: serverTimestamp() })
  return { saved: true }
}

export async function hasUserSaved(postId: string, userId: string) {
  return (await getDoc(doc(requireDb(), 'userSaves', userId, 'saves', postId))).exists()
}

export async function fetchPostsByAuthor(authorId: string, limitCount = 20) {
  const q = query(collection(requireDb(), 'posts'), where('authorId', '==', authorId), orderBy('createdAt', 'desc'), limit(limitCount))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}
