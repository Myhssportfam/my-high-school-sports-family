/**
 * Firestore collection and document shape stubs for MHSF.
 * Expand these as features are implemented.
 */

export const COLLECTIONS = {
  users: 'users',
  schools: 'schools',
  teams: 'teams',
  posts: 'posts',
  stories: 'stories',
  reels: 'reels',
  messages: 'messages',
  notifications: 'notifications',
  events: 'events',
  stats: 'stats'
} as const

// Example Post schema
import type { FieldValue, Timestamp } from 'firebase/firestore'

export interface Post {
  id?: string
  authorId: string
  author?: {
    id: string
    displayName?: string
    avatarUrl?: string | null
    schoolId?: string | null
    city?: string | null
    state?: string | null
  }
  content?: string
  media?: Array<{ url: string; type: 'image' | 'video' }>
  likesCount?: number
  commentsCount?: number
  createdAt?: string | Timestamp | FieldValue
  reshareOf?: string
  reshareCount?: number
}
