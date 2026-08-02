import { collection, getDocs, query, where, limit, orderBy, doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { Post } from './schemas'

export async function fetchStates() {
  const col = collection(db, 'states')
  const q = query(col, orderBy('name'), limit(200))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchCities(stateId: string) {
  const col = collection(db, 'cities')
  const q = query(col, where('stateId', '==', stateId), orderBy('name'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchSchoolsByState(stateId: string, limitCount = 12) {
  const col = collection(db, 'schools')
  const q = query(col, where('stateId', '==', stateId), orderBy('followersCount', 'desc'), limit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchAthletesByState(stateId: string, limitCount = 12) {
  const col = collection(db, 'users')
  const q = query(col, where('state', '==', stateId), orderBy('followersCount', 'desc'), limit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchSchools(stateId: string, cityId: string) {
  const col = collection(db, 'schools')
  const q = query(col, where('stateId', '==', stateId), where('cityId', '==', cityId), orderBy('name'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchTeams(schoolId: string) {
  const col = collection(db, 'teams')
  const q = query(col, where('schoolId', '==', schoolId), orderBy('name'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchSchool(schoolId: string) {
  const ref = doc(db, 'schools', schoolId)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...(snap.data() as any) } : null
}

export async function fetchRoster(schoolId: string, limitCount = 100) {
  const col = collection(db, 'users')
  const q = query(col, where('schoolId', '==', schoolId), orderBy('displayName'), limit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchCoaches(schoolId: string, limitCount = 20) {
  const col = collection(db, 'users')
  const q = query(col, where('schoolId', '==', schoolId), where('role', '==', 'coach'), orderBy('displayName'), limit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchSchedule(schoolId: string, limitCount = 50) {
  const col = collection(db, 'schedules')
  const q = query(col, where('schoolId', '==', schoolId), orderBy('date', 'asc'), limit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchPostsBySchool(schoolId: string, limitCount = 20) {
  const col = collection(db, 'posts')
  const q = query(col, where('schoolId', '==', schoolId), orderBy('createdAt', 'desc'), limit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchTeam(teamId: string) {
  const ref = doc(db, 'teams', teamId)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...(snap.data() as any) } : null
}

export async function fetchRosterByTeam(teamId: string, limitCount = 100) {
  const col = collection(db, 'users')
  const q = query(col, where('teamId', '==', teamId), orderBy('displayName'), limit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchScheduleByTeam(teamId: string, limitCount = 50) {
  const col = collection(db, 'schedules')
  const q = query(col, where('teamId', '==', teamId), orderBy('date', 'asc'), limit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchPostsByTeam(teamId: string, limitCount = 20) {
  const col = collection(db, 'posts')
  const q = query(col, where('teamId', '==', teamId), orderBy('createdAt', 'desc'), limit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchAthlete(athleteId: string) {
  const ref = doc(db, 'users', athleteId)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...(snap.data() as any) } : null
}

export async function fetchState(stateId: string) {
  const ref = doc(db, 'states', stateId)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...(snap.data() as any) } : null
}

export async function countSchoolsInState(stateId: string) {
  const col = collection(db, 'schools')
  const q = query(col, where('stateId', '==', stateId))
  const snap = await getDocs(q)
  return snap.size
}

export async function fetchHighlightsByState(stateId: string, limitCount = 6) {
  const col = collection(db, 'highlights')
  const q = query(col, where('stateId', '==', stateId), orderBy('createdAt', 'desc'), limit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fetchFeed(limitCount = 20): Promise<Post[]> {
  const col = collection(db, 'posts')
  const q = query(col, orderBy('createdAt', 'desc'), limit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Post[]
}

export async function fetchAthleteById(athleteId: string) {
  const athleteRef = doc(db, 'users', athleteId)
  const athleteSnap = await getDoc(athleteRef)

  if (!athleteSnap.exists()) {
    return null
  }

  return {
    id: athleteSnap.id,
    ...(athleteSnap.data() as Record<string, unknown>),
  }
}
  