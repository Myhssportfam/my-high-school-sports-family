export type UserRole = 'athlete' | 'coach' | 'parent' | 'admin'

export interface UserProfile {
  id: string
  displayName: string
  role: UserRole
  email?: string
  avatarUrl?: string
  profileMediaUrl?: string
profileMediaType?: "image" | "video"
profileMusicUrl?: string
profileMusicName?: string
  coverUrl?: string
  schoolId?: string
 teamId?: string

playstationId?: string
xboxGamertag?: string
eaId?: string

accomplishments?: {
  id: string;
  title: string;
  year?: string;
  description?: string;
  icon?: string;
}[];
  bio?: string
  city?: string
  state?: string
  stateId?: string
stateCommunity?: string
profileSongUrl?: string
profileSongTitle?: string
profileSongArtist?: string
  sports?: string[]
  gradYear?: number
  username?: string
verified?: boolean
achievements?: string[]

activityRole?: string

sportsTimeline?: {
  id: string
  title: string
  subtitle?: string
  icon?: string
  years?: string
  organization?: string
  description?: string
  completed?: boolean
}[]

cheerPosition?: string
cheerSkills?: string[]

danceStyle?: string
danceTeam?: string

bandInstrument?: string
bandSection?: string

coachYears?: string
coachRecord?: string
  height?: string
  weight?: string
  position?: string
  stats?: Record<string, any>
  awards?: Array<{ title: string; year?: number; description?: string }>
  recruiting?: { profileUrl?: string; status?: string; notes?: string }
  recruitingPrivateNotes?: string
  recruitingStatus?: string
  recruitingEmail?: string
recruitingPhone?: string
recruitingContactName?: string
recruitingContactRole?: string
offers?: Array<{
  id: string
  school: string
  offerType?: string
  interestLevel?: string
  officialVisit?: string
  notes?: string
  liveHistory?: Array<{
  id: string
  title?: string
  sport?: string
  date?: string
  streamUrl?: string
  replayUrl?: string
  opponent?: string
  result?: string
}>

arenaAccomplishments?: Array<{
  id: string
  game?: string
  title?: string
  achievement?: string
  date?: string
  state?: string
}>

alumniHistory?: Array<{
  id: string
  school?: string
  sport?: string
  years?: string
  accomplishment?: string
}>

rivalHistory?: Array<{
  id: string
  opponent?: string
  school?: string
  sport?: string
  date?: string
  result?: string
  memory?: string
}>

coachHistory?: Array<{
  id: string
  name?: string
  role?: string
  school?: string
  sport?: string
  years?: string
}>
}>
committedSchool?: string
  followersCount?: number
  followingCount?: number
  createdAt?: string | { toDate: () => Date } | import('firebase/firestore').FieldValue
  updatedAt?: string | { toDate: () => Date } | import('firebase/firestore').FieldValue
}
