import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { fetchAthleteById } from '../../../lib/data'
import { auth, db } from '../../../lib/firebase'
import { uploadFile } from '../../../lib/storage'
import { doc, getDoc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
export default function AthleteProfilePage() {
  const router = useRouter()

  const athleteId =
    typeof router.query.athleteId === 'string'
      ? router.query.athleteId
      : null

  const [athlete, setAthlete] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)
  const [followers, setFollowers] = useState(248)
  const [postCount, setPostCount] = useState(0)

const [followingCount, setFollowingCount] = useState(0)
const [activeTab, setActiveTab] = useState('Posts')
const [savedPosts, setSavedPosts] = useState<any[]>([])
const [loadingSavedPosts, setLoadingSavedPosts] = useState(false)
useEffect(() => {
  if (activeTab !== 'Saved') return

  setLoadingSavedPosts(true)

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setSavedPosts([])
      setLoadingSavedPosts(false)
      return
    }

    try {
      const savedRef = doc(
        db,
        'homePosts',
        'main-feed-post',
        'savedBy',
        user.uid
      )

      const savedSnap = await getDoc(savedRef)

      if (!savedSnap.exists()) {
        setSavedPosts([])
        setLoadingSavedPosts(false)
        return
      }

      const postRef = doc(db, 'homePosts', 'main-feed-post')
      const postSnap = await getDoc(postRef)

      if (postSnap.exists()) {
        setSavedPosts([
          {
            id: postSnap.id,
            ...postSnap.data(),
          },
        ])
      } else {
        setSavedPosts([])
      }
    } catch (error) {
      console.error('Error loading saved posts:', error)
      setSavedPosts([])
    } finally {
      setLoadingSavedPosts(false)
    }
  })

  return () => unsubscribe()
}, [activeTab])
const [profileSongUrl, setProfileSongUrl] = useState('')
const [profileSongTitle, setProfileSongTitle] = useState('')
const [profileSongArtist, setProfileSongArtist] = useState('')
const [profileSongFile, setProfileSongFile] = useState<File | null>(null)
const [uploadingSong, setUploadingSong] = useState(false)
const profileUid =
  typeof athlete?.uid === 'string'
    ? athlete.uid
    : typeof athlete?.userId === 'string'
      ? athlete.userId
      : null
const [selectedHighlight, setSelectedHighlight] = useState<{
  id: number
  label: string
  icon: string
  description: string
} | null>(null)
const profileTabs = [
  'Posts',
  'Photos',
  'Videos',
  'Highlights',
  'Recruiting',
  'Live',
  'Saved',
  'Tagged',
]


 const storyHighlights = [
  {
   id: 1,
label: 'Photos',
icon: '📸',
image: '/stories/photos.jpg',
description: 'Game-day photos, team pictures, and athlete moments.',
  },
  {
    id: 2,
    label: 'Videos',
    icon: '🎥',
    image: '/stories/videos.jpg',
    description: 'Highlight clips, workouts, interviews, and game film.',
  },
  {
    id: 3,
    label: 'Awards',
    icon: '🏆',
    image: '/stories/awards.jpg',
    description: 'Awards, championships, honors, and achievements.',
  },
  {
    id: 4,
    label: 'Stats',
    icon: '📊',
    image: '/stories/stats.jpg',
    description: 'Season statistics, game results, and performance updates.',
  },
  {
    id: 5,
    label: 'Recruiting',
    icon: '🎓',
    image: '/stories/recruiting.jpg',
    description: 'Offers, college interest, visits, and recruiting updates.',
  },
]

function showPreviousHighlight() {
  if (!selectedHighlight) return

  const currentIndex = storyHighlights.findIndex(
    (highlight) => highlight.id === selectedHighlight.id
  )

  const previousIndex =
    currentIndex === 0 ? storyHighlights.length - 1 : currentIndex - 1

  setSelectedHighlight(storyHighlights[previousIndex])
}

function showNextHighlight() {
  if (!selectedHighlight) return

  const currentIndex = storyHighlights.findIndex(
    (highlight) => highlight.id === selectedHighlight.id
  )

  const nextIndex =
    currentIndex === storyHighlights.length - 1 ? 0 : currentIndex + 1
const profilePosts = [
  {
    id: 1,
    author: athleteName,
    time: "2 hours ago",
    text: "Blessed to get the win tonight! Proud of my teammates. One game at a time.",
    likes: 284,
    comments: 43,
  },
  {
    id: 2,
    author: athleteName,
    time: "1 day ago",
    text: "Early morning workout before school. Staying locked in.",
    likes: 196,
    comments: 18,
  },
  {
    id: 3,
    author: athleteName,
    time: "3 days ago",
    text: "Thank you to everyone supporting my journey. Bigger things coming.",
    likes: 412,
    comments: 67,
  },
]
  setSelectedHighlight(storyHighlights[nextIndex])
} 
useEffect(() => {
    if (!router.isReady || !athleteId) {
      return
    } 

    async function loadAthlete() {
      try {
        setIsLoading(true)
        setLoadError('')

        const result = (await fetchAthleteById(
          athleteId as string
        )) as Record<string, unknown> | null

        if (!result) {
  const fallbackAthletes: Record<string, any> = {
    'jordan-williams': {
  id: 'jordan-williams',
  displayName: 'Jordan Williams',
  firstName: 'Jordan',
  lastName: 'Williams',
  bio: 'Dallas Central wide receiver representing the Texas Sports Family.',
  stateId: 'texas',
  city: 'Dallas',
  school: 'Dallas Central High School',
  sport: 'Football',
  position: 'Wide Receiver',
  graduationYear: 2027,
  statLabel: 'Receiving yards',
  statValue: '1,124',
  state: 'Texas',
  grade: 'Class of 2027',
},
    'athlete-1': {
      id: 'athlete-1',
      displayName: 'Marcus Johnson',
      firstName: 'Marcus',
      lastName: 'Johnson',
      jerseyNumber: 7,
      position: 'Quarterback',
      grade: 'Senior',
      height: `6'2"`,
      weight: '205 lbs',
      schoolName: 'Houston Central High School',
      city: 'Houston',
      state: 'TX',
      sport: 'Football',
      sports: ['Football'],
      gpa: '3.7',
      followersCount: 2840,
      offers: 6,
      verified: true,
      bio: 'Senior quarterback and team captain focused on leadership, academics, and winning.',
    },
    'athlete-2': {
      id: 'athlete-2',
      displayName: 'Jaylen Carter',
      jerseyNumber: 3,
      position: 'Running Back',
      grade: 'Junior',
      height: `5'11"`,
      weight: '190 lbs',
      schoolName: 'Houston Central High School',
      city: 'Houston',
      state: 'TX',
      sport: 'Football',
      sports: ['Football'],
      followersCount: 1760,
    },
    'athlete-3': {
      id: 'athlete-3',
      displayName: 'Darius Williams',
      jerseyNumber: 11,
      position: 'Wide Receiver',
      grade: 'Senior',
      height: `6'1"`,
      weight: '185 lbs',
      schoolName: 'Houston Central High School',
      city: 'Houston',
      state: 'TX',
      sport: 'Football',
      sports: ['Football'],
      followersCount: 2210,
    },
    'athlete-4': {
      id: 'athlete-4',
      displayName: 'Chris Thompson',
      jerseyNumber: 55,
      position: 'Linebacker',
      grade: 'Senior',
      height: `6'0"`,
      weight: '220 lbs',
      schoolName: 'Houston Central High School',
      city: 'Houston',
      state: 'TX',
      sport: 'Football',
      sports: ['Football'],
      followersCount: 1430,
    },
  }

  const fallbackAthlete =
    fallbackAthletes[athleteId as string]

  if (!fallbackAthlete) {
    setAthlete(null)
    setLoadError('Athlete profile not found.')
    return
  }

  setAthlete(fallbackAthlete)
  
  setLoadError('')
  return
}

        setAthlete(result)
if (typeof result.profileSongUrl === 'string') {
  setProfileSongUrl(result.profileSongUrl)
}

if (typeof result.profileSongTitle === 'string') {
  setProfileSongTitle(result.profileSongTitle)
}

if (typeof result.profileSongArtist === 'string') {
  setProfileSongArtist(result.profileSongArtist)
}
        const followersCount = result.followersCount

        if (typeof followersCount === 'number') {
          setFollowers(followersCount)
        }
      } catch (error) {
        console.error('Unable to load athlete:', error)
        setAthlete(null)
        setLoadError('We could not load this athlete profile.')
      } finally {
        setIsLoading(false)
      }
    }

    loadAthlete()
  }, [router.isReady, athleteId])

    async function loadAthlete() {
      try {
        setIsLoading(true)
        setLoadError('')

   const result = (await fetchAthleteById(
  athleteId as string
)) as Record<string, unknown> | null 

        if (!result) {
          setAthlete(null)
          setLoadError('Athlete profile not found.')
          return
        }

        setAthlete(result)

       const followersCount = result.followersCount

if (typeof followersCount === 'number') {
  setFollowers(followersCount)
}
        
      } catch (error) {
        console.error('Unable to load athlete:', error)
        setAthlete(null)
        setLoadError('We could not load this athlete profile.')
      } finally {
        setIsLoading(false)
      }
    }


  

  function handleFollow() {
    setIsFollowing((current) => {
      setFollowers((count) => (current ? count - 1 : count + 1))
      return !current
    })
  }
async function handleUploadProfileSong() {
  const user = auth.currentUser

  if (!user) {
    alert('You must be signed in to add profile music.')
    return
  }

  if (!profileSongFile) {
    alert('Choose an audio file first.')
    return
  }

  if (!profileUid) {
    alert('This athlete profile is not connected to a user account yet.')
    return
  }

  if (user.uid !== profileUid) {
    alert('You can only change music on your own profile.')
    return
  }

  try {
    setUploadingSong(true)

    const path = `profile-music/${profileUid}/${Date.now()}-${profileSongFile.name}`

    const songUrl = await uploadFile(profileSongFile, path)

    await setDoc(
      doc(db, 'users', profileUid),
      {
        profileSongUrl: songUrl,
        profileSongTitle: profileSongTitle.trim(),
        profileSongArtist: profileSongArtist.trim(),
        profileSongUpdatedAt: serverTimestamp(),
      },
      { merge: true }
    )

    setProfileSongUrl(songUrl)
    setProfileSongFile(null)

    alert('Profile music added!')
  } catch (error) {
    console.error('Failed to upload profile music:', error)
    alert('Profile music could not be uploaded.')
  } finally {
    setUploadingSong(false)
  }
}
  if (isLoading) {
    return <main className="page">Loading athlete profile...</main>
  }

  
  
  

   

    const isOwnProfile =
  !!auth.currentUser &&
  !!profileUid &&
  auth.currentUser.uid === profileUid
if (loadError || !athlete) {
  
    return (
      <main className="page">
        <div className="container">
          <section className="card">
            <h2>Athlete profile unavailable</h2>
            <p>{loadError || 'Athlete profile not found.'}</p>
          </section>
        </div>
      </main>
    )
  }
  const athleteName =
  typeof athlete?.displayName === 'string'
    ? athlete.displayName
    : 'Athlete'
    const athleteInitials = athleteName
const profilePosts = [
  {
    id: 1,
    author: athleteName,
    time: '2 hours ago',
    text: 'Blessed to get the win tonight! Proud of my teammates. One game at a time.',
    likes: 284,
    comments: 43,
  },
  {
    id: 2,
    author: athleteName,
    time: '1 day ago',
    text: 'Early morning workout before school. Staying locked in.',
    likes: 196,
    comments: 18,
  },
  {
    id: 3,
    author: athleteName,
    time: '3 days ago',
    text: 'Thank you to everyone supporting my journey. Bigger things coming.',
    likes: 412,
    comments: 67,
  },
]

  return (
    <>
      <Head>
        <title>{`${athleteName} | My High School Sports Family`}</title>
      </Head>

      <main className="page">
        

        <div className="container">
          <section className="profile">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
  <div className="flex items-start gap-5">
    <div className="shrink-0">
      <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-red-600 bg-black">
        {typeof athlete?.avatarUrl === 'string' && athlete.avatarUrl ? (
          <img
            src={athlete.avatarUrl}
            alt={athleteName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-black text-white">
            {athleteInitials || 'A'}
          </div>
        )}
      </div>
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-black text-white">
          {athleteName}
        </h1>

        <span
          title="Verified Sports Family profile"
          className="text-lg text-blue-400"
        >
          ✓
        </span>
      </div>

      <p className="mt-1 text-sm text-slate-400">
        @{athleteId}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div><p className="text-xl font-black text-white">
  {profilePosts.length}
</p>
          
          <p className="text-xs text-slate-400">Posts</p>
        </div>

        <div>
          <p className="text-xl font-black text-white">
            {followers}
          </p>
          <p className="text-xs text-slate-400">Followers</p>
        </div>

        <div>
          <p className="text-xl font-black text-white">
  {followingCount}
</p>
          <p className="text-xs text-slate-400">Following</p>
        </div>
      </div>
    </div>
  </div>

  <div className="mt-5">
    <p className="font-bold text-white">
      Athlete
    </p>

    <p className="mt-2 text-sm text-slate-300">
      {typeof athlete?.sport === 'string'
        ? athlete.sport
        : 'Sports'}
      {' • '}
      {typeof athlete?.position === 'string'
        ? athlete.position
        : 'Athlete'}
    </p>

    <p className="mt-1 text-sm text-slate-400">
      {typeof athlete?.schoolName === 'string'
        ? athlete.schoolName
        : 'High School Athlete'}
    </p>

    <p className="mt-1 text-sm font-semibold text-red-400">
      {typeof athlete?.state === 'string'
        ? `${athlete.state} Sports Family`
        : 'Sports Family'}
    </p>
  </div>

  <div className="mt-5 grid grid-cols-2 gap-3">
    <button
      type="button"
      onClick={handleFollow}
      className={`rounded-xl px-4 py-3 font-bold ${
        isFollowing
          ? 'border border-white/20 bg-white/10 text-white'
          : 'bg-red-600 text-white'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>

    <button
      type="button"
      onClick={() =>
        router.push(`/messages?user=${athleteId}`)
      }
      className="rounded-xl border border-white/20 px-4 py-3 font-bold text-white"
    >
      Message
    </button>
  </div>
</div>
<div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
  <div className="flex items-center justify-between gap-3">
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        🎵 Profile Music
      </p>

      <p className="mt-1 font-bold text-white">
        {profileSongTitle || 'No song added'}
      </p>

      {profileSongArtist && (
        <p className="text-sm text-slate-400">
          {profileSongArtist}
        </p>
      )}
    </div>
  </div>

  {profileSongUrl && (
    <audio
      controls
      src={profileSongUrl}
      className="mt-4 w-full"
    />
  )}
  {profileSongUrl && (
  <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-xl">
        🎵
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-white">
          {profileSongTitle || 'Profile Song'}
        </p>

        <p className="truncate text-sm text-slate-400">
          {profileSongArtist || 'Artist'}
        </p>
      </div>
    </div>

    <audio
      controls
      preload="metadata"
      src={profileSongUrl}
      className="mt-3 w-full"
    />
  </div>
)}
{isOwnProfile && (
  <div className="mt-4 grid gap-3">
    <input
      type="text"
      value={profileSongTitle}
      onChange={(e) => setProfileSongTitle(e.target.value)}
      placeholder="Song title"
      className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"
    />

    <input
      type="text"
      value={profileSongArtist}
      onChange={(e) => setProfileSongArtist(e.target.value)}
      placeholder="Artist"
      className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"
    />

    <input
      type="file"
      accept="audio/*"
      onChange={(e) =>
        setProfileSongFile(e.target.files?.[0] || null)
      }
      className="text-sm text-slate-300"
    />

    <button
      type="button"
      onClick={handleUploadProfileSong}
      disabled={!profileSongFile || uploadingSong}
      className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white disabled:opacity-50"
    >
      {uploadingSong ? 'Uploading...' : 'Add Music'}
    </button>
  </div>
)}
</div>
                <p>
  {typeof athlete?.sport === 'string' ? athlete.sport : 'Sport'} •{' '}
  {typeof athlete?.position === 'string' ? athlete.position : 'Position'}
</p>
  <p>
  {typeof athlete?.schoolName === 'string'
    ? athlete.schoolName
    : typeof athlete?.school === 'string'
      ? athlete.school
      : 'School unavailable'}
  {' • '}

  {typeof athlete?.city === 'string'
    ? athlete.city
    : 'City unavailable'}
  {' • '}

  {typeof athlete?.state === 'string'
    ? athlete.state
    : typeof athlete?.stateId === 'string'
      ? athlete.stateId.charAt(0).toUpperCase() + athlete.stateId.slice(1)
      : 'State unavailable'}
  {' • '}

  {typeof athlete?.grade === 'string'
    ? athlete.grade
    : typeof athlete?.graduationYear === 'number'
      ? `Class of ${athlete.graduationYear}`
      : 'Class unavailable'}
</p>


                <p className="bio">
  {typeof athlete?.bio === 'string'
    ? athlete.bio
    : 'Athlete bio unavailable.'}
                </p>
              
          </section>
         <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-6">
  <div className="flex gap-6 overflow-x-auto">

    {storyHighlights.map((highlight) => (
      <button
        key={highlight.id}
        type="button"
        onClick={() => setSelectedHighlight(highlight)}
        className="flex min-w-[90px] flex-col items-center"
      >
        <div className="rounded-full bg-gradient-to-br from-red-600 via-blue-600 to-red-700 p-[3px]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl">
            {highlight.icon}
          </div>
        </div>

        <span className="mt-2 text-sm font-semibold">
          {highlight.label}
        </span>
      </button>
    ))}

  </div>
</section> 
{selectedHighlight && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
    <div className="relative w-full max-w-md overflow-visible rounded-3xl bg-red-500">
    
        <div className="h-full w-2/3 rounded-full bg-white" />
      </div>

     <button
  type="button"
  onClick={() => setSelectedHighlight(null)}
  className="absolute right-5 top-8 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl font-bold text-white shadow-lg"
  aria-label="Close story"
>
  ×
</button>
<button
  type="button"
  onClick={showPreviousHighlight}
  className="absolute bottom-24 left-0 top-20 z-[9999] w-1/2 bg-red-500/30"
  aria-label="Previous highlight"
></button>

<button
  type="button"
  onClick={showNextHighlight}
  className="absolute bottom-24 right-0 top-20 z-[9999] w-1/2 bg-green-500/30"
  aria-label="Next highlight"
></button>



  


      <div className="relative z-10 flex min-h-[620px] flex-col justify-between p-7 pt-16">
        <button
  type="button"
  onClick={showPreviousHighlight}
  className="absolute bottom-24 left-0 top-20 z-[9999] w-1/3 bg-red-500/40"
  aria-label="Previous highlight"
>
</button>
<button
  type="button"
  onClick={showNextHighlight}
  className="absolute bottom-24 right-0 top-20 z-[9999] w-1/3 bg-red-500/40"
  aria-label="Next highlight"
>
</button>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-red-700 font-black">
            {athleteInitials}
          </div>

          <div>
            <p className="font-bold">{athleteName}</p>
            <p className="text-sm text-white/70">Athlete highlight</p>
          </div>
        </div>

        <div className="text-center">
          <div className="text-8xl">{selectedHighlight.icon}</div>

          <h2 className="mt-6 text-3xl font-black">
            {selectedHighlight.label}
          </h2>

          
         <div className="flex items-center gap-3">
  <input
    type="text"
    placeholder="Reply to story..."
    className="min-w-0 flex-1 rounded-full border border-white/40 bg-white/10 px-5 py-3 text-white placeholder:text-white/70 outline-none"
  />

  <button
    type="button"
    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-xl transition hover:bg-white/30"
    aria-label="React to story"
  >
    ❤️
  </button>
</div>
</div>
</div>
</div>
)} 
<section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
  <div className="overflow-x-auto border-b border-gray-200">
    <div className="flex min-w-max">
      {profileTabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-4 text-sm font-bold transition ${
            activeTab === tab
              ? 'border-b-4 border-red-600 text-red-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
{selectedHighlight && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
    <div className="relative flex min-h-[600px] w-full max-w-md flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-800 to-red-800 p-7 pt-16 text-white shadow-2xl">
      <div className="absolute left-4 right-4 top-4 h-1 rounded-full bg-white/30">
        <div className="h-full w-2/3 rounded-full bg-white" />
      </div>

      <button
        type="button"
        onClick={() => setSelectedHighlight(null)}
        className="absolute right-5 top-7 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-2xl"
        aria-label="Close story"
      >
        ×
      </button>

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-red-700 font-black">
          {athleteInitials}
        </div>

        <div>
          <p className="font-bold">{athleteName}</p>
          <p className="text-sm text-white/70">Athlete highlight</p>
        </div>
      </div>

      <div className="text-center">
        <div className="text-8xl">{selectedHighlight.icon}</div>

        <h2 className="mt-6 text-3xl font-black">
          {selectedHighlight.label}
        </h2>

        <p className="mt-3 text-white/80">
          {selectedHighlight.description}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Reply to story..."
          className="min-w-0 flex-1 rounded-full border border-white/40 bg-white/10 px-5 py-3 text-white outline-none placeholder:text-white/60"
        />

        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15"
        >
          ❤️
        </button>
      </div>
    </div>
  </div>
)}
  <div className="p-6">
    {activeTab === 'Saved' && (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-gray-900">
      Saved Posts
    </h3>

    {loadingSavedPosts ? (
      <p className="text-sm text-gray-500">
        Loading saved posts...
      </p>
    ) : savedPosts.length === 0 ? (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="font-semibold text-gray-900">
          No saved posts yet
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Posts you save will appear here.
        </p>
      </div>
    ) : (
      savedPosts.map((post) => (
        <div
          key={post.id}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="p-5">
            <p className="font-bold text-gray-900">
              Saved from Home Feed
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Great team win tonight! All glory to God. 🙏
            </p>

            <p className="mt-1 text-sm font-medium text-blue-600">
              #TeamFirst #BuiltDifferent
            </p>

            <div className="mt-4 flex gap-6 border-t border-gray-100 pt-4 text-sm text-gray-600">
              <span>♥ {post.likeCount || 0} Likes</span>
              <span>💬 {post.comments?.length || 0} Comments</span>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
)}
    {activeTab === 'Posts' && (
      <div className="space-y-6">

  {profilePosts.map((post) => (

    <div
  key={post.id}
  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md"
>
  <div className="flex items-center gap-3 p-4">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-700 text-lg font-bold text-white">
      {athleteInitials}
    </div>

    <div className="flex-1">
      <h3 className="font-bold">{post.author}</h3>
      <p className="text-sm text-gray-500">{post.time}</p>
    </div>
  </div>

  <div className="flex h-72 items-center justify-center bg-gradient-to-r from-blue-900 via-blue-600 to-red-700">
    <div className="text-center text-white">
      <div className="text-6xl">🏈</div>
      <h2 className="mt-4 text-2xl font-black">GAME DAY</h2>
      <p className="mt-2">{athleteName}</p>
    </div>
  </div>

  <div className="p-5">
    <p className="text-gray-700">{post.text}</p>

    <div className="mt-5 flex flex-wrap justify-between gap-4 text-gray-600">
      <button type="button">❤️ {post.likes}</button>
      <button type="button">💬 {post.comments}</button>
      <button type="button">🔁 Share</button>
      <button type="button">🔖 Save</button>
    </div>
  </div>
</div>

  ))}

</div>
      
    )}

    {activeTab === 'Highlights' && (
      <div>
        <h2 className="text-xl font-black">Highlights</h2>
        <p className="mt-2 text-gray-600">
          Featured plays and highlight reels will appear here.
        </p>
      </div>
    )}

    {activeTab === 'Photos' && (
      <div>
        <h2 className="text-xl font-black">Photos</h2>
        <p className="mt-2 text-gray-600">
          Athlete photos and game-day galleries will appear here.
        </p>
      </div>
    )}

    {activeTab === 'Videos' && (
      <div>
        <h2 className="text-xl font-black">Videos</h2>
        <p className="mt-2 text-gray-600">
          Interviews, workouts, and game videos will appear here.
        </p>
      </div>
    )}

    {activeTab === 'Stats' && (
      <div>
        <h2 className="text-xl font-black">Season Stats</h2>
        <p className="mt-2 text-gray-600">
          Athlete performance and season statistics will appear here.
        </p>
      </div>
    )}

    {activeTab === 'Recruiting' && (
      <div>
        <h2 className="text-xl font-black">Recruiting Profile</h2>
        <p className="mt-2 text-gray-600">
          Offers, interest, visits, commitments, and recruiting information
          will appear here.
        </p>
      </div>
    )}

    {activeTab === 'Awards' && (
      <div>
        <h2 className="text-xl font-black">Awards and Honors</h2>
        <p className="mt-2 text-gray-600">
          Championships, honors, rankings, and achievements will appear here.
        </p>
      </div>
    )}
  </div>
</section>
          <div className="grid">
            <section className="card">
              <p className="label">ATHLETE OVERVIEW</p>
              <h2>Player information</h2>

              <div className="stats">
  <div>
    <span>Height</span>
    <strong>
      {typeof athlete?.height === 'string' ? athlete.height : '—'}
    </strong>
  </div>

  <div>
    <span>Weight</span>
    <strong>
      {typeof athlete?.weight === 'string' ? athlete.weight : '—'}
    </strong>
  </div>

  <div>
    <span>Position</span>
    <strong>
      {typeof athlete?.position === 'string' ? athlete.position : '—'}
    </strong>
  </div>

  <div>
    <span>Class</span>
    <strong>
      {typeof athlete?.grade === 'string' ? athlete.grade : '—'}
    </strong>
  </div>
</div>  
            </section>

            <section className="card recruiting">
              <p className="label">RECRUITING PROFILE</p>
              <h2>Open to recruiting</h2>

              <p>
                Available to communicate with verified college coaches and
                recruiting programs.
              </p>

              <button type="button" className="contact">
                Contact athlete
              </button>
            </section>

            <section className="card highlights">
              <p className="label">FEATURED MEDIA</p>
              <h2>Highlights</h2>

              <div className="video">
                <button type="button" aria-label="Play highlight">
                  ▶
                </button>
                <strong>2026 Season Highlights</strong>
              </div>
            </section>

            <section className="card">
              <p className="label">ACHIEVEMENTS</p>
              <h2>Honors</h2>

              <ul>
                <li>🏆 All-District Selection</li>
                <li>⭐ Team Captain</li>
                <li>📚 Academic Honor Roll</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
          background: #f3f5f8;
          color: #111827;
          font-family: Arial, Helvetica, sans-serif;
        }

        :global(a) {
          color: inherit;
          text-decoration: none;
        }

        .page {
          min-height: 100vh;
        }

        .header {
          min-height: 76px;
          padding: 14px 4%;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand span:last-child {
          display: flex;
          flex-direction: column;
        }

        .brand small {
          margin-top: 3px;
          color: #991b1b;
          font-size: 9px;
          letter-spacing: 1px;
        }

        .logo {
          padding: 13px;
          border-radius: 10px;
          background: linear-gradient(135deg, #111827, #b91c1c);
          color: white;
          font-size: 12px;
          font-weight: 900;
        }

        nav {
          display: flex;
          gap: 24px;
          font-size: 14px;
          font-weight: 700;
        }

        .join,
        .follow,
        .contact {
          border: 0;
          border-radius: 999px;
          background: #b91c1c;
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        .join {
          padding: 12px 18px;
        }

        .container {
          width: min(1150px, calc(100% - 30px));
          margin: 30px auto 70px;
        }

        .profile,
        .card {
          overflow: hidden;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          background: white;
          box-shadow: 0 12px 32px rgba(17, 24, 39, 0.06);
        }

        .cover {
          min-height: 220px;
          padding: 25px;
          background: linear-gradient(120deg, #111827, #1d4ed8, #b91c1c);
          color: white;
          text-align: right;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .profileBody {
          display: flex;
          gap: 28px;
          padding: 0 34px 32px;
        }

        .avatar {
          width: 150px;
          height: 150px;
          margin-top: -65px;
          flex: 0 0 auto;
          border: 7px solid white;
          border-radius: 50%;
          background: linear-gradient(135deg, #111827, #b91c1c);
          color: white;
          display: grid;
          place-items: center;
          font-size: 42px;
          font-weight: 900;
          overflow: hidden;
        }

        .identity {
          flex: 1;
          padding-top: 22px;
        }

        .nameRow {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        h1 {
          margin: 0;
          font-size: 40px;
        }

        h2 {
          margin: 8px 0;
        }

        p {
          color: #6b7280;
        }

        .bio {
          max-width: 700px;
          line-height: 1.6;
        }

        .buttons {
          display: flex;
          gap: 9px;
        }

        .buttons button,
        .contact {
          min-height: 42px;
          padding: 0 19px;
        }

        .message,
        .following {
          border: 1px solid #d1d5db;
          border-radius: 999px;
          background: white;
          font-weight: 800;
          cursor: pointer;
        }

        .following {
          color: #15803d;
        }

        .counts {
          display: flex;
          gap: 30px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .counts div {
          display: flex;
          gap: 7px;
        }

        .counts span {
          color: #6b7280;
        }

        .grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 22px;
          margin-top: 22px;
        }

        .card {
          padding: 25px;
        }

        .label {
          margin: 0;
          color: #b91c1c;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 22px;
        }

        .stats div {
          padding: 18px;
          border-radius: 14px;
          background: #f3f4f6;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stats span {
          color: #6b7280;
          font-size: 12px;
        }

        .contact {
          width: 100%;
          margin-top: 15px;
        }

        .video {
          min-height: 260px;
          margin-top: 20px;
          border-radius: 16px;
          background: linear-gradient(135deg, #1d4ed8, #111827, #b91c1c);
          color: white;
          display: grid;
          place-items: center;
        }

        .video button {
          width: 60px;
          height: 60px;
          border: 0;
          border-radius: 50%;
          background: white;
          color: #b91c1c;
          font-size: 22px;
          cursor: pointer;
        }

        ul {
          padding-left: 22px;
          line-height: 2.2;
        }

        @media (max-width: 850px) {
          nav {
            display: none;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .profileBody {
            display: block;
            padding: 0 20px 25px;
          }

          .avatar {
            width: 110px;
            height: 110px;
            font-size: 30px;
          }

          .nameRow {
            display: block;
          }

          .buttons {
            margin: 16px 0;
          }

          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  )
}