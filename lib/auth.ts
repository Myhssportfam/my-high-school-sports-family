import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  signOut as firebaseSignOut,
  browserSessionPersistence,

} from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { UserProfile } from '../types/user'
const defaultUserProfile = (uid: string, displayName: string, role: UserProfile['role'], extra: Partial<UserProfile> = {}): UserProfile => ({
  id: uid,
  displayName,
  role,
  followersCount: 0,
  followingCount: 0,
  createdAt: new Date().toISOString(),
  ...extra
})

export async function signUpWithEmail({ email, password, displayName, role = 'athlete' }: { email: string; password: string; displayName: string; role?: string }) {
  if (!auth || !db) throw new Error('Firebase is not initialized')
  const userCred = await createUserWithEmailAndPassword(auth, email, password)
  const profileName = displayName || userCred.user.email || 'User'

  if (displayName) {
    await updateProfile(userCred.user, { displayName: profileName })
  }

  const profile = defaultUserProfile(userCred.user.uid, profileName, role as UserProfile['role'])

  await setDoc(doc(db, 'users', userCred.user.uid), {
    ...profile,
    email: userCred.user.email,
    createdAt: serverTimestamp()
  })

  return userCred.user
}

export async function signInWithEmail({
  email,
  password,
}: {
  email: string
  password: string
}) {
  if (!auth) {
  throw new Error("Firebase is not initialized")
}



try {
  console.log("Starting Firebase sign-in:", email)

  const signInPromise = signInWithEmailAndPassword(
  auth,
  email.trim(),
  password
)

const timeoutPromise = new Promise<never>((_, reject) => {
  window.setTimeout(() => {
    reject(new Error("Firebase sign-in timed out"))
  }, 10000)
})

const userCred = await Promise.race([
  signInPromise,
  timeoutPromise,
])
console.log("Firebase sign-in completed:", userCred.user.uid)

return userCred.user
  console.log("Firebase sign-in successful:", userCred.user.uid)

  return userCred.user
} catch (error) {
  console.error("Firebase sign-in failed:", error)
  throw error
}
}

export async function signInWithGoogle() {
  if (!auth || !db) throw new Error('Firebase is not initialized')
  const provider = new GoogleAuthProvider()
  const userCred = await signInWithPopup(auth, provider)

  const u = userCred.user
  if (!u.uid) throw new Error('Google sign-in failed')

  const profileRef = doc(db, 'users', u.uid)
  const snap = await getDoc(profileRef)
  const profile = defaultUserProfile(u.uid, u.displayName || u.email || 'User', 'athlete', {
    avatarUrl: u.photoURL || undefined,
    email: u.email || undefined
  })

  await setDoc(profileRef, {
    ...profile,
    createdAt: serverTimestamp()
  }, { merge: true })

  return u
}

export async function updateUserProfile(uid: string, profile: Partial<UserProfile>) {
  if (!db) throw new Error('Firebase is not initialized')
  const ref = doc(db, 'users', uid)
  await setDoc(ref, { ...profile, updatedAt: serverTimestamp() }, { merge: true })
}

export function signOut() {
  if (!auth) throw new Error('Firebase is not initialized')
  return firebaseSignOut(auth)
}
