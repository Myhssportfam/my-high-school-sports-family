export type UserRole = 'athlete' | 'coach' | 'parent' | 'admin'

export interface UserProfile {
  id: string
  displayName: string
  role: UserRole
  email?: string
  avatarUrl?: string
  coverUrl?: string
  schoolId?: string
  teamId?: string
  bio?: string
  city?: string
  state?: string
  sports?: string[]
  gradYear?: number
  height?: string
  weight?: string
  position?: string
  stats?: Record<string, any>
  awards?: Array<{ title: string; year?: number; description?: string }>
  recruiting?: { profileUrl?: string; status?: string; notes?: string }
  followersCount?: number
  followingCount?: number
  createdAt?: string | { toDate: () => Date } | import('firebase/firestore').FieldValue
  updatedAt?: string | { toDate: () => Date } | import('firebase/firestore').FieldValue
}
