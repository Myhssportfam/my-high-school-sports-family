import { doc, runTransaction, getDoc } from 'firebase/firestore'
import { db } from './firebase'

export async function followSchool(currentUserId: string, schoolId: string) {
  const followerRef = doc(db, 'schools', schoolId, 'followers', currentUserId)
  const followingRef = doc(db, 'users', currentUserId, 'followingSchools', schoolId)
  const schoolRef = doc(db, 'schools', schoolId)
  const currentRef = doc(db, 'users', currentUserId)

  return runTransaction(db, async (tx) => {
    const sSnap = await tx.get(schoolRef)
    if (!sSnap.exists()) throw new Error('School not found')
    const cSnap = await tx.get(currentRef)
    const currentData = cSnap.exists() ? (cSnap.data() as any) : {}
    const schoolData = sSnap.data() as any
    tx.set(followerRef, {
      userId: currentUserId,
      displayName: currentData.displayName || null,
      avatarUrl: currentData.avatarUrl || null,
      createdAt: new Date()
    })
    tx.set(followingRef, {
      schoolId,
      schoolName: schoolData.name || null,
      createdAt: new Date()
    })
    tx.update(schoolRef, { followersCount: (sSnap.data()?.followersCount || 0) + 1 })
    if (cSnap.exists()) {
      tx.update(currentRef, { followingSchoolsCount: (cSnap.data()?.followingSchoolsCount || 0) + 1 })
    }
    return true
  })
}

export async function unfollowSchool(currentUserId: string, schoolId: string) {
  const followerRef = doc(db, 'schools', schoolId, 'followers', currentUserId)
  const followingRef = doc(db, 'users', currentUserId, 'followingSchools', schoolId)
  const schoolRef = doc(db, 'schools', schoolId)
  const currentRef = doc(db, 'users', currentUserId)

  return runTransaction(db, async (tx) => {
    const sSnap = await tx.get(schoolRef)
    if (!sSnap.exists()) throw new Error('School not found')
    tx.delete(followerRef)
    tx.delete(followingRef)
    tx.update(schoolRef, { followersCount: Math.max(0, (sSnap.data()?.followersCount || 1) - 1) })
    const cSnap = await tx.get(currentRef)
    if (cSnap.exists()) {
      tx.update(currentRef, { followingSchoolsCount: Math.max(0, (cSnap.data()?.followingSchoolsCount || 1) - 1) })
    }
    return true
  })
}

export async function isFollowingSchool(currentUserId: string | undefined | null, schoolId: string) {
  if (!currentUserId) return false
  const ref = doc(db, 'users', currentUserId, 'followingSchools', schoolId)
  const snap = await getDoc(ref)
  return snap.exists()
}

export async function followTeam(currentUserId: string, teamId: string) {
  const followerRef = doc(db, 'teams', teamId, 'followers', currentUserId)
  const followingRef = doc(db, 'users', currentUserId, 'followingTeams', teamId)
  const teamRef = doc(db, 'teams', teamId)
  const currentRef = doc(db, 'users', currentUserId)

  return runTransaction(db, async (tx) => {
    const tSnap = await tx.get(teamRef)
    if (!tSnap.exists()) throw new Error('Team not found')
    const cSnap = await tx.get(currentRef)
    const currentData = cSnap.exists() ? (cSnap.data() as any) : {}
    const teamData = tSnap.data() as any
    tx.set(followerRef, {
      userId: currentUserId,
      displayName: currentData.displayName || null,
      avatarUrl: currentData.avatarUrl || null,
      createdAt: new Date()
    })
    tx.set(followingRef, {
      teamId,
      teamName: teamData.name || null,
      createdAt: new Date()
    })
    tx.update(teamRef, { followersCount: (tSnap.data()?.followersCount || 0) + 1 })
    if (cSnap.exists()) {
      tx.update(currentRef, { followingTeamsCount: (cSnap.data()?.followingTeamsCount || 0) + 1 })
    }
    return true
  })
}

export async function unfollowTeam(currentUserId: string, teamId: string) {
  const followerRef = doc(db, 'teams', teamId, 'followers', currentUserId)
  const followingRef = doc(db, 'users', currentUserId, 'followingTeams', teamId)
  const teamRef = doc(db, 'teams', teamId)
  const currentRef = doc(db, 'users', currentUserId)

  return runTransaction(db, async (tx) => {
    const tSnap = await tx.get(teamRef)
    if (!tSnap.exists()) throw new Error('Team not found')
    tx.delete(followerRef)
    tx.delete(followingRef)
    tx.update(teamRef, { followersCount: Math.max(0, (tSnap.data()?.followersCount || 1) - 1) })
    const cSnap = await tx.get(currentRef)
    if (cSnap.exists()) {
      tx.update(currentRef, { followingTeamsCount: Math.max(0, (cSnap.data()?.followingTeamsCount || 1) - 1) })
    }
    return true
  })
}

export async function isFollowingTeam(currentUserId: string | undefined | null, teamId: string) {
  if (!currentUserId) return false
  const ref = doc(db, 'users', currentUserId, 'followingTeams', teamId)
  const snap = await getDoc(ref)
  return snap.exists()
}
