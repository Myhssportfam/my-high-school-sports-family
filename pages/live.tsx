import { useRouter } from "next/router";
import Head from 'next/head'
import Link from 'next/link'
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
updateDoc,
getDocs,
getDoc,
setDoc,
where,
deleteDoc,
} from "firebase/firestore";

import { auth, db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";
type StreamStatus = 'live' | 'scheduled' | 'replay'

type Stream = {
  id: string
  title: string
  broadcaster: string
  school: string
  schoolId?: string
  sport: string
  athleteIds?: string[]
opponent?: string
date?: string
  state?: string
  stateId?: string
  matchup: string
  status: StreamStatus
  viewers?: number
  scheduledTime?: string
  scheduledDate?: string
  duration?: string
  platform: string
createdBy?: string;
streamUrl?: string;
createdAt?: unknown;
ownerId?: string
homeTeam?: string;
awayTeam?: string;
homeScore?: number;
awayScore?: number;
gameClock?: string;
}

const startingStreams: Stream[] = [
  {
    id: 'texas-tigers-baseball',
    title: 'Texas Tigers Varsity Baseball',
    broadcaster: 'Jordan Hill',
    school: 'Texas High School',
    sport: 'Baseball',
    state: 'Texas',
stateId: 'texas',
    matchup: 'Texas Tigers vs. Liberty Eagles',
    status: 'live',
    viewers: 1248,
    platform: 'MHSSF Live',
  },
  {
    id: 'friday-night-football',
    title: 'Friday Night Game of the Week',
    broadcaster: 'MHSSF Sports Network',
    school: 'North Dallas High School',
    sport: 'Football',
    state: 'Texas',
stateId: 'texas',
    matchup: 'North Dallas vs. Southlake',
    status: 'scheduled',
    scheduledTime: 'Friday at 7:30 PM',
    platform: 'YouTube',
  },
  {
    id: 'girls-basketball',
    title: 'Girls Varsity Basketball',
    broadcaster: 'Central High Athletics',
    school: 'Central High School',
    sport: 'Basketball',
    state: 'National',
stateId: 'national',
    matchup: 'Central Panthers vs. Westview',
    status: 'scheduled',
    scheduledTime: 'Saturday at 5:00 PM',
    platform: 'Twitch',
  },
  {
    id: 'championship-replay',
    title: '2026 State Championship Replay',
    broadcaster: 'MHSSF Replay Center',
    school: 'State Championship',
    sport: 'Football',
    state: 'Texas',
stateId: 'texas',
    matchup: 'Texas Championship Final',
    status: 'replay',
    duration: '2:14:38',
    platform: 'MHSSF Replay',
  },
]

function formatViewerCount(viewers = 0) {
  return new Intl.NumberFormat('en-US', {
    notation: viewers >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(viewers)
}
const STATE_NAMES: Record<string, string> = {
  al: "Alabama",
  ak: "Alaska",
  az: "Arizona",
  ar: "Arkansas",
  ca: "California",
  co: "Colorado",
  ct: "Connecticut",
  de: "Delaware",
  fl: "Florida",
  ga: "Georgia",
  hi: "Hawaii",
  id: "Idaho",
  il: "Illinois",
  in: "Indiana",
  ia: "Iowa",
  ks: "Kansas",
  ky: "Kentucky",
  la: "Louisiana",
  me: "Maine",
  md: "Maryland",
  ma: "Massachusetts",
  mi: "Michigan",
  mn: "Minnesota",
  ms: "Mississippi",
  mo: "Missouri",
  mt: "Montana",
  ne: "Nebraska",
  nv: "Nevada",
  nh: "New Hampshire",
  nj: "New Jersey",
  nm: "New Mexico",
  ny: "New York",
  nc: "North Carolina",
  nd: "North Dakota",
  oh: "Ohio",
  ok: "Oklahoma",
  or: "Oregon",
  pa: "Pennsylvania",
  ri: "Rhode Island",
  sc: "South Carolina",
  sd: "South Dakota",
  tn: "Tennessee",
  tx: "Texas",
  ut: "Utah",
  vt: "Vermont",
  va: "Virginia",
  wa: "Washington",
  wv: "West Virginia",
  wi: "Wisconsin",
  wy: "Wyoming",
};
export default function LivePage() {
const router = useRouter();
const { user } = useAuth()
const { profile } = useUserProfile(user?.uid)
const [athleteSearch, setAthleteSearch] = useState("");
const [isFollowingFeatured, setIsFollowingFeatured] = useState(false);
const [athleteResults, setAthleteResults] = useState<any[]>([]);
const [selectedAthleteIds, setSelectedAthleteIds] = useState<string[]>([]);

const queryState =
  typeof router.query.state === "string"
    ? router.query.state
    : "";
const queryStateId =
  typeof router.query.stateId === "string"
    ? router.query.stateId
    : ""

const connectedState = profile?.state || queryState
const connectedStateId = profile?.stateId || queryStateId

  const [activeTab, setActiveTab] = useState<
    'all' | 'live' | 'scheduled' | 'replay'
  >('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
const [streams, setStreams] = useState<Stream[]>([]);
const [streamsLoading, setStreamsLoading] = useState(true);
const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('')
  

const stateFilter =
  typeof router.query.state === "string"
    ? router.query.state.toLowerCase()
    : "";
    const goToStatePage = (path: string) => {
  if (stateFilter) {
    router.push(`${path}?state=${encodeURIComponent(stateFilter)}`);
    return;
  }

  router.push(path);
};
const goToCommunity = () => {
  if (!stateFilter) return;

  router.push(`/states/${stateFilter}`);
};
  const selectedStateName =
  STATE_NAMES[stateFilter] ||
  connectedState ||
  "state";
    const filteredStreams = useMemo(() => {
  let stateFilteredStreams = streams;

  // 1. A state coming from the homepage map takes priority.
  // Example: /live?state=co
  if (stateFilter) {
    stateFilteredStreams = streams.filter((stream) => {
      const streamState = (stream.state || "").toLowerCase();
      const streamStateId = (stream.stateId || "").toLowerCase();

      const isNational =
  streamState === "national" ||
  streamStateId === "national";

return (
  isNational ||
  streamState === stateFilter ||
  streamStateId === stateFilter
);
    });
  }

  // 2. If there is no map state in the URL,
  // preserve the user's connected-state filtering.
  else if (connectedState || connectedStateId) {
    stateFilteredStreams = streams.filter((stream) => {
      const isNational =
        stream.state?.toLowerCase() === "national" ||
        stream.stateId?.toLowerCase() === "national";

      if (isNational) return true;

      const matchesState =
        connectedState &&
        stream.state?.toLowerCase() === connectedState.toLowerCase();

      const matchesStateId =
        connectedStateId &&
        stream.stateId?.toLowerCase() === connectedStateId.toLowerCase();

      return Boolean(matchesState || matchesStateId);
    });
  }
const statusPriority: Record<StreamStatus, number> = {
  live: 0,
  scheduled: 1,
  replay: 2,
}

stateFilteredStreams = [...stateFilteredStreams].sort((a, b) => {
  const statusDifference =
    statusPriority[a.status] - statusPriority[b.status]

  if (statusDifference !== 0) {
    return statusDifference
  }

  if (a.status === "scheduled" && b.status === "scheduled") {
    const aTime = a.scheduledDate
      ? new Date(a.scheduledDate).getTime()
      : Number.MAX_SAFE_INTEGER

    const bTime = b.scheduledDate
      ? new Date(b.scheduledDate).getTime()
      : Number.MAX_SAFE_INTEGER

    return aTime - bTime
  }

  return 0
})
  // 3. Keep your All / Live / Scheduled / Replay tabs working.
  if (activeTab === "all") {
    return stateFilteredStreams;
  }

  return stateFilteredStreams.filter(
    (stream) => stream.status === activeTab
  );
}, [
  streams,
  stateFilter,
  connectedState,
  connectedStateId,
  activeTab,
]);
const featuredStream = useMemo(() => {
  return (
    streams.find((stream) => stream.status === "live") ??
    streams[0] ??
    null
  );
}, [streams]);
const liveNowCount = streams.filter(
  (stream) => stream.status === "live"
).length

const watchingNow = streams
  .filter((stream) => stream.status === "live")
  .reduce((total, stream) => total + (stream.viewers || 0), 0)

const gamesTodayCount = streams.filter((stream) => {
  if (!stream.scheduledDate) return false

  const streamDate = new Date(stream.scheduledDate)
  const today = new Date()

  return (
    streamDate.getFullYear() === today.getFullYear() &&
    streamDate.getMonth() === today.getMonth() &&
    streamDate.getDate() === today.getDate()
  )
}).length
useEffect(() => {
  if (!user?.uid || !featuredStream?.id) {
    setIsFollowingFeatured(false);
    return;
  }

  const userId = user.uid;
  const streamId = featuredStream.id;

  async function checkFollowStatus() {
    const followRef = doc(
      db,
      "users",
      userId,
      "followedBroadcasts",
      streamId
    );

    const followSnap = await getDoc(followRef);

    setIsFollowingFeatured(followSnap.exists());
  }

  checkFollowStatus();
}, [user?.uid, featuredStream?.id]);
useEffect(() => {
  const q = query(
    collection(db, "liveStreams"),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const liveStreams: Stream[] = snapshot.docs.map((doc) => {
  const data = doc.data() as Omit<Stream, "id">;

  return {
    ...data,
    id: doc.id,
  };
});

    setStreams(liveStreams);
    setStreamsLoading(false);
  });

  return () => unsubscribe();
}, []);

async function searchAthletes() {
  const searchTerm = athleteSearch.trim()

  if (!searchTerm) {
    setAthleteResults([])
    return
  }

  try {
    const usersRef = collection(db, "users")

    const snapshot = await getDocs(usersRef)

    const matches = snapshot.docs
      .map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }))
      .filter((athlete: any) => {
        const name = athlete.displayName?.toLowerCase() || ""
        const school = athlete.schoolId?.toLowerCase() || ""
        const sport = Array.isArray(athlete.sports)
          ? athlete.sports.join(" ").toLowerCase()
          : String(athlete.sports || "").toLowerCase()

        const term = searchTerm.toLowerCase()

        return (
          name.includes(term) ||
          school.includes(term) ||
          sport.includes(term)
        )
      })
      .slice(0, 10)

    setAthleteResults(matches)
  } catch (error) {
    console.error("Failed to search athletes:", error)
  }
}
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const title = String(form.get('title') || '').trim()
    const broadcaster = String(form.get('broadcaster') || '').trim()
    const school = String(form.get('school') || '').trim()
    const sport = String(form.get('sport') || '').trim()
    const opponent = String(form.get('opponent') || '').trim()
    const awayTeam = String(form.get("awayTeam") || "").trim()
const homeTeam = String(form.get("homeTeam") || "").trim()

const awayScore = Number(form.get("awayScore") || 0)
const homeScore = Number(form.get("homeScore") || 0)

const gameClock = String(form.get("gameClock") || "").trim()
    const scheduledTime = String(form.get('scheduledTime') || '').trim()
    const platform = String(form.get('platform') || '').trim()
const streamUrl = String(form.get("streamUrl") || "").trim()
    if (!title || !broadcaster || !school || !sport) {
      return
    }

    const newStream: Stream = {
      id: `stream-${Date.now()}`,
      ownerId: user?.uid || "",
createdBy: user?.uid || "",
      title,
      broadcaster,
      school,
      schoolId: profile?.schoolId || "",
      sport,
      streamUrl,
      awayTeam,
homeTeam,
awayScore,
homeScore,
gameClock,
      state: connectedState || "",
stateId: connectedStateId || "",
      matchup: opponent ? `${school} vs. ${opponent}` : school,
      status: 'scheduled',
      scheduledTime: scheduledTime || 'Time to be announced',
      scheduledDate: scheduledTime
  ? new Date(scheduledTime).toISOString()
  : "",
      platform: platform || 'External stream',
    }
if (user?.uid && profile?.state) {
  const displayName =
    profile.displayName ||
    user.displayName ||
    user.email?.split('@')[0] ||
    broadcaster ||
    'Sports Family Member'

  const initials = displayName
    .split(' ')
    .map((name) => name.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const stateFeedId = connectedState
  .toLowerCase()
  .replace(/\s+/g, '-')

  try {
    await addDoc(
      collection(
        db,
        'stateFeeds',
        stateFeedId,
        'posts'
      ),
      {
        authorId: user.uid,
        author: displayName,
        initials,
        photoURL:
          profile.avatarUrl ||
          user.photoURL ||
          '',
        role: `📺 Live Activity • ${connectedState}`,
        message: `${displayName} scheduled "${newStream.title}" for ${newStream.scheduledTime}.`,
        type: 'Update',
        createdAt: 'Just now',
        createdAtMs: Date.now(),
        likes: 0,
        likedBy: [],
        comments: [],
        mediaUrl: '',
        activityType: 'live_scheduled',
        streamId: newStream.id,
      }
    )
  } catch (error) {
    console.error(
      'Scheduled live activity could not be posted:',
      error
    )
  }
}
    
    try {
  setSubmitLoading(true);
const streamToSave = {
  ...newStream,
  athleteIds: selectedAthleteIds,
}
 const streamRef = await addDoc(collection(db, "liveStreams"), {
  ...streamToSave,
  createdAt: serverTimestamp(),
})
if (selectedAthleteIds.length > 0) {
  await addLiveEventToAthleteProfiles(
    selectedAthleteIds,
    {
      id: streamRef.id,
      title: newStream.title || "Live Game",
      sport: newStream.sport || "",
      date: new Date().toISOString(),
      streamUrl: `/live?stream=${streamRef.id}`,
      result: "",
    }
  )
}
  setSuccessMessage("Your stream was added to the live schedule.");
  setIsFormOpen(false);
  event.currentTarget.reset();
} catch (error) {
  console.error("Stream publishing error:", error);
  setSuccessMessage("The stream could not be published.");
} finally {
  setSubmitLoading(false);
}}
async function handleGoLive(stream: Stream) {
  if (!user?.uid) {
    window.alert('Please sign in to go live.')
    return
  }

  try {
    const streamRef = doc(db, 'streams', stream.id)

    await updateDoc(streamRef, {
      status: 'live',
      viewers: 0,
    })

    if (profile?.state) {
      const displayName =
        profile.displayName ||
        user.displayName ||
        user.email?.split('@')[0] ||
        stream.broadcaster ||
        'Sports Family Member'

      const initials = displayName
        .split(' ')
        .map((name) => name.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()

      if (!connectedState) return

const stateFeedId = connectedState
  .toLowerCase()
  .replace(/\s+/g, '-')

      const postsRef = collection(
        db,
        'stateFeeds',
        stateFeedId,
        'posts'
      )

      const scheduledPostQuery = query(
        postsRef,
        where('streamId', '==', stream.id),
        where('activityType', '==', 'live_scheduled')
      )

      const scheduledSnapshot = await getDocs(
        scheduledPostQuery
      )

      if (!scheduledSnapshot.empty) {
        const scheduledPostDoc =
          scheduledSnapshot.docs[0]

        await updateDoc(scheduledPostDoc.ref, {
          role: `🔴 Live Activity • ${connectedState}`,
          message: `${displayName} is LIVE now — ${stream.title}`,
          activityType: 'live_now',
          createdAt: 'Just now',
          createdAtMs: Date.now(),
        })
      } else {
        await addDoc(postsRef, {
          authorId: user.uid,
          author: displayName,
          initials,
          photoURL:
            profile.avatarUrl ||
            user.photoURL ||
            '',
          role: `🔴 Live Activity • ${connectedState}`,
          message: `${displayName} is LIVE now — ${stream.title}`,
          type: 'Update',
          createdAt: 'Just now',
          createdAtMs: Date.now(),
          likes: 0,
          likedBy: [],
          comments: [],
          mediaUrl: '',
          activityType: 'live_now',
          streamId: stream.id,
        })
      }
    }
  } catch (error) {
    console.error(
      'Could not start live stream:',
      error
    )

    window.alert(
      'The stream could not be started. Please try again.'
    )
  }
}
async function handleEndLive(stream: Stream) {
  if (!user?.uid) {
    window.alert('Please sign in first.')
    return
  }

  try {
    const streamRef = doc(db, 'streams', stream.id)

    await updateDoc(streamRef, {
      status: 'replay',
    })

    if (connectedState) {
      const displayName =
        profile?.displayName ||
        user.displayName ||
        user.email?.split('@')[0] ||
        stream.broadcaster ||
        'Sports Family Member'

      const stateFeedId = connectedState
  .toLowerCase()
  .replace(/\s+/g, '-')

      const postsRef = collection(
        db,
        'stateFeeds',
        stateFeedId,
        'posts'
      )

      const livePostQuery = query(
        postsRef,
        where('streamId', '==', stream.id),
        where('activityType', '==', 'live_now')
      )

      const liveSnapshot = await getDocs(livePostQuery)

      if (!liveSnapshot.empty) {
        const livePostDoc = liveSnapshot.docs[0]

        await updateDoc(livePostDoc.ref, {
          role: `▶️ Replay • ${connectedState}`,
          message: `${displayName}'s broadcast "${stream.title}" is now available to replay.`,
          activityType: 'live_replay',
          createdAt: 'Replay available',
          createdAtMs: Date.now(),
        })
      }
    }
  } catch (error) {
    console.error('Could not end live stream:', error)

    window.alert(
      'The live stream could not be ended. Please try again.'
    )
  }
}
async function addLiveEventToAthleteProfiles(
  athleteIds: string[],
  liveEvent: {
    id: string
    title?: string
    sport?: string
    date?: string
    streamUrl?: string
    replayUrl?: string
    opponent?: string
    result?: string
  }
) {
  if (!athleteIds.length) return

  try {
    await Promise.all(
      athleteIds.map(async (athleteId) => {
        const userRef = doc(db, "users", athleteId)
        const userSnap = await getDoc(userRef)

        const existingHistory =
          userSnap.exists() &&
          Array.isArray(userSnap.data().liveHistory)
            ? userSnap.data().liveHistory
            : []

        const alreadyExists = existingHistory.some(
          (event: any) => event.id === liveEvent.id
        )

        const updatedHistory = alreadyExists
          ? existingHistory.map((event: any) =>
              event.id === liveEvent.id
                ? {
                    ...event,
                    ...liveEvent,
                  }
                : event
            )
          : [liveEvent, ...existingHistory]

        await setDoc(
          userRef,
          {
            liveHistory: updatedHistory,
          },
          { merge: true }
        )
      })
    )
  } catch (error) {
    console.error(
      "Failed to connect live event to athlete profiles:",
      error
    )
  }
}
  return (
    <>
      <Head>
        <title>Live Sports | My High School Sports Family</title>
        <meta
          name="description"
          content="Watch live high school sports, athlete broadcasts, school streams, scheduled games, and replays."
        />
      </Head>

      <main className="livePage">
        {stateFilter && (
  <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-red-400">
          🔴 Live • {selectedStateName} Sports Family
        </div>

        <h1 className="text-3xl font-black text-white">
          {selectedStateName} Live
        </h1>

        <p className="mt-1 text-sm text-white/60">
          High school sports streams from across {selectedStateName}.
        </p>
      </div>

      <button
        type="button"
        onClick={goToCommunity}
        className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
      >
        ← Back to {selectedStateName} Sports Family
      </button>
    </div>
  </section>
)}
{stateFilter && (
  <div className="mb-6 flex flex-wrap gap-3">
    <button
      type="button"
      onClick={() => router.push(`/states/${stateFilter}`)}
      className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
    >
      State Community
    </button>

    <button
      type="button"
      onClick={() => goToStatePage("/live")}
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-black text-white"
    >
      Live
    </button>

    <button
      type="button"
      onClick={() => goToStatePage("/athletes")}
      className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
    >
      Athletes
    </button>

    <button
      type="button"
      onClick={() => goToStatePage("/arena")}
      className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
    >
      Arena
    </button>
  </div>
)}
        <section className="hero">
          <div className="heroContent">
            {(connectedState || connectedStateId) && (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 14px",
      marginBottom: "12px",
      borderRadius: "999px",
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.25)",
      fontSize: "14px",
      fontWeight: 700,
      
    }}
  >
    🏠 Connected to {connectedState || connectedStateId} Sports Family
  </div>
)}
            <div className="livePill">
              <span className="pulse" />
              MHSSF LIVE
            </div>

            <h1>
  {stateFilter
    ? `${selectedStateName} Live Sports`
    : "Every game. Every athlete. One sports family."}
</h1>

            <p>
  {stateFilter
    ? `Watch school broadcasts, athlete streams, featured games, scheduled matchups, and championship replays from across ${selectedStateName}.`
    : "Watch school broadcasts, athlete streams, featured games, scheduled matchups, and championship replays."}
</p>
          

            <div className="heroActions">
             <button
  type="button"
  className="watchButton"
  onClick={() => {
  if (featuredStream) {
    router.push(`/live/${featuredStream.id}`)
    return
  }

  document
    .querySelector(".streamDirectory")
    ?.scrollIntoView({ behavior: "smooth" })
}}
>
  {featuredStream ? "▶ Watch featured stream" : "View scheduled streams"}
</button>

              <button
                type="button"
                className="addStreamButton"
                onClick={() => {
                  setSuccessMessage('')
                  setIsFormOpen(true)
                }}
              >
                ＋ Add your stream
              </button>
            </div>

            <div className="heroStats">
              <div>
                <strong>{liveNowCount}</strong>
<span>Live now</span>
              </div>

              <div>
                <strong>{watchingNow.toLocaleString()}</strong>
<span>Watching</span>
              </div>

              <div>
                <strong>{gamesTodayCount}</strong>
<span>Games today</span>
              </div>
            </div>
          </div>
{stateFilter && (
  <div className="mt-6 flex flex-wrap gap-3">
    <button
      type="button"
      onClick={() => setActiveTab("live")}
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-black text-white"
    >
      Live Games
    </button>

    <button
      type="button"
      onClick={() => setActiveTab("scheduled")}
      className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
    >
      Upcoming
    </button>

    <button
      type="button"
      onClick={() => setActiveTab("replay")}
      className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
    >
      Replays
    </button>

    <button
      type="button"
    onClick={() => goToStatePage("/athletes")}
      className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
    >
      Athletes
    </button>

    <button
      type="button"
      onClick={goToCommunity}
      className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
    >
      Schools & Community
    </button>

    <button
      type="button"
      onClick={() => goToStatePage("/arena")}
      className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
    >
      Arena
    </button>
  </div>
)}
          <div className="heroGraphic">
            <div className="broadcastSignal signalOne" />
            <div className="broadcastSignal signalTwo" />

            <div className="phone">
              <div className="phoneScreen">
                <span className="phoneLive">LIVE</span>
                <div className="phonePlay">▶</div>
                <strong>
  {featuredStream?.title || "MHSF Live"}
</strong>

<small>
  {featuredStream
    ? `${(featuredStream.viewers || 0).toLocaleString()} watching`
    : "Live sports from your family"}
</small>
              </div>
            </div>
          </div>
        </section>

        <div className="pageContainer">
          {successMessage && (
            <div className="successMessage">{successMessage}</div>
          )}
{featuredStream && (
          <section className="featuredSection" id="featured-stream">
            <div className="sectionHeading">
              <div>
                <p className="eyebrow">GAME OF THE WEEK</p>
                <h2>Featured live broadcast</h2>
              </div>

              <span className="verified">✓ Verified school broadcast</span>
            </div>

            <div className="featuredGrid">
              <div className="featuredVideo">
                <div className="videoTop">
                  <span className="liveBadge">
                    <span className="smallPulse" />
                    LIVE
                  </span>

                  <span className="viewerBadge">
  ● {(featuredStream?.viewers || 0).toLocaleString()} watching
</span>
                </div>

                <button
  type="button"
  className="largePlay"
  aria-label="Play featured stream"
  disabled={!featuredStream}
  onClick={() => {
    if (!featuredStream) return;
    router.push(`/live/${featuredStream.id}`);
  }}
>
  ▶
</button>
                <div className="scoreboard">
  <div>
    <span>{featuredStream?.awayTeam || "AWAY"}</span>
    <strong>{featuredStream?.awayScore ?? 0}</strong>
  </div>

  <span className="inning">
    {featuredStream?.gameClock || "LIVE"}
  </span>

  <div>
    <strong>{featuredStream?.homeScore ?? 0}</strong>
    <span>{featuredStream?.homeTeam || "HOME"}</span>
  </div>
</div>
              </div>

              <div className="streamInformation">
                <span className="sportBadge">
  {(featuredStream?.sport || "SPORT").toUpperCase()}
</span>

                <h2>{featuredStream?.matchup || "Featured live broadcast"}</h2>

                <p className="streamDescription">
  {featuredStream
    ? `${featuredStream.title} — ${featuredStream.school}`
    : "Featured live broadcast"}
</p>

                <div className="broadcaster">
                  <div className="broadcasterAvatar">JH</div>

                  <div>
                    <strong>{featuredStream?.broadcaster || "MHSF Broadcaster"}</strong>
                    <span>Athlete broadcaster</span>
                  </div>
                </div>

                <div className="streamDetails">
                  <div>
                    <span>School</span>
                    <strong>{featuredStream?.school || "School"}</strong>
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>Texarkana, Texas</strong>
                  </div>

                  <div>
                    <span>Platform</span>
                    <strong>{featuredStream?.platform || "MHSF Live"}</strong>
                  </div>
                </div>

                <div className="featuredActions">
                  <button
  type="button"
  className="primaryAction"
  disabled={!featuredStream}
  onClick={() => {
    if (!featuredStream) return;
    router.push(`/live/${featuredStream.id}`);
  }}
>
  ▶ Watch now
</button>

                  <button
  type="button"
  className="secondaryAction"
  disabled={!featuredStream}
  onClick={async () => {
    if (!featuredStream) return;

    if (!user) {
      router.push("/signin");
      return;
    }

    const followRef = doc(
      db,
      "users",
      user.uid,
      "followedBroadcasts",
      featuredStream.id
    );
if (isFollowingFeatured) {
  await deleteDoc(followRef);
  setIsFollowingFeatured(false);
  return;
}
    await setDoc(
      followRef,
      {
        streamId: featuredStream.id,
        title: featuredStream.title,
        matchup: featuredStream.matchup,
        school: featuredStream.school,
        sport: featuredStream.sport,
        followedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setIsFollowingFeatured(true);
  }}
>
  {isFollowingFeatured ? "♥ Following broadcast" : "♡ Follow broadcast"}
</button>

                 <button
  type="button"
  className="iconAction"
  aria-label="Share broadcast"
  onClick={async () => {
    if (!featuredStream) return;

    const url = `${window.location.origin}/live/${featuredStream.id}`;

    if (navigator.share) {
      await navigator.share({
        title: featuredStream.title,
        text: featuredStream.matchup,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Broadcast link copied!");
    }
  }}
>
  ↗
</button>
                </div>

                {featuredStream?.athleteIds?.[0] && (
  <Link
    href={`/athletes/${featuredStream.athleteIds[0]}`}
    className="athleteProfileLink"
  >
    View athlete profile →
  </Link>
)}
              </div>
            </div>
          </section>
)}
          <section className="streamDirectory">
            <div className="directoryTop">
              <div>
                <p className="eyebrow">STREAM DIRECTORY</p>
                <h2>Live games and upcoming broadcasts</h2>
              </div>

              <button
                type="button"
                className="scheduleButton"
                onClick={() => setIsFormOpen(true)}
              >
                ＋ Schedule a stream
              </button>
            </div>

            <div className="tabs" aria-label="Stream filters">
              {(['all', 'live', 'scheduled', 'replay'] as const).map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={activeTab === tab ? 'activeTab' : ''}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'all'
                    ? 'All streams'
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="streamGrid">
              {filteredStreams.length === 0 && (
  <div
    style={{
      gridColumn: "1 / -1",
      textAlign: "center",
      padding: "40px 20px",
      borderRadius: "18px",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.12)",
    }}
  >
    <h3 style={{ marginBottom: "8px", fontSize: "22px" }}>
    No {selectedStateName} streams are showing right now
    </h3>

    <p style={{ opacity: 0.75, margin: 0 }}>
    National streams and new {selectedStateName} broadcasts will appear
    </p>
  </div>
)}
                {filteredStreams.map((stream, index) => (
                  <article className="streamCard" key={stream.id}>
                  <div
                    className={`thumbnail thumbnail${(index % 4) + 1}`}
                  >
                    <div className="thumbnailTop">
                      <span
                        className={
                          stream.status === 'live'
                            ? 'cardLiveBadge'
                            : stream.status === 'scheduled'
                              ? 'scheduledBadge'
                              : 'replayBadge'
                        }
                      >
                        {stream.status === 'live'
                          ? '● LIVE'
                          : stream.status === 'scheduled'
                            ? '◷ SCHEDULED'
                            : '↻ REPLAY'}
                      </span>

                      {stream.viewers !== undefined && (
                        <span className="cardViewers">
                          {formatViewerCount(stream.viewers)} watching
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="cardPlay"
                      aria-label={`Watch ${stream.title}`}
                    >
                      ▶
                    </button>

                    {stream.duration && (
                      <span className="duration">{stream.duration}</span>
                    )}
                  </div>

                  <div className="streamCardBody">
                    <div className="sportLine">
                      <span>{stream.sport}</span>
                      <small>{stream.platform}</small>
                    </div>
{(stream.state || stream.stateId) && (
  <button
  type="button"
  onClick={() => {
    const targetStateId =
      stream.stateId ||
      stream.state?.toLowerCase().replace(/\s+/g, "-")

    if (!targetStateId || targetStateId === "national") return

    router.push(`/states/${targetStateId}`)
  }}
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "5px 10px",
      marginBottom: "10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 700,
      cursor: stream.stateId === "national" ? "default" : "pointer",
color: "inherit",
      background: "transparent",
border: "1px solid white",
    }}
  >
    📍 {stream.state || stream.stateId}
  </button>
)}
                    <h3>{stream.title}</h3>
                    <p className="matchup">{stream.matchup}</p>

                <div
  className="streamerRow"
  onClick={() => {
    const profileId = stream.ownerId || stream.createdBy

    if (!profileId) return

    router.push(`/athletes/${profileId}`)
  }}
  style={{
    cursor: stream.ownerId || stream.createdBy ? "pointer" : "default",
  }}
>    
                      <div className="miniAvatar">
                        {stream.broadcaster
                          .split(' ')
                          .map((word) => word.charAt(0))
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <button
  type="button"
  onClick={(event) => {
    event.stopPropagation()

    if (!stream.schoolId) return

    router.push(`/schools/${stream.schoolId}`)
  }}
  style={{
    display: "block",
    padding: 0,
    border: "none",
    background: "transparent",
    color: "inherit",
    font: "inherit",
    cursor: stream.schoolId ? "pointer" : "default",
    textAlign: "left",
  }}
>
  {stream.school}
</button>
                        <span>{stream.school}</span>
                      </div>
                    </div>

                    {stream.scheduledTime && (
                      <div className="scheduledTime">
                        ◷ {stream.scheduledTime}
                      </div>
                    )}
                  </div>

                  <div className="cardActions">
  <button
    type="button"
    className="cardButton"
    onClick={() => {
      console.log("Opening stream:", stream.id);
      void router.push(`/live/${stream.id}`);
    }}
  >
    {stream.status === "live"
      ? "Watch Live"
      : stream.status === "replay"
        ? "Watch Replay"
        : "View Stream"}
  </button>
  {stream.status === 'scheduled' &&
  stream.ownerId === user?.uid && (
  <button
    type="button"
    className="cardButton"
    onClick={() => handleGoLive(stream)}
  >
    🔴 Go Live
  </button>
)}
{stream.status === 'live' &&
  stream.ownerId === user?.uid && (
    <button
      type="button"
      className="cardButton"
      onClick={() => handleEndLive(stream)}
    >
      ⏹ End Live
    </button>
  )}
</div>


</article>
))}

</div>
</section>

          <section className="creatorSection">
            <div>
              <p className="eyebrow lightEyebrow">STREAM YOUR GAME</p>
              <h2>Broadcast directly from an athlete profile</h2>

              <p>
                Athletes and schools will be able to schedule games, attach
                YouTube or Twitch links, go live, and automatically appear in
                the MHSSF Live directory.
              </p>

              <button
                type="button"
                className="creatorButton"
                onClick={() => setIsFormOpen(true)}
              >
                Add a stream
              </button>
            </div>

            <div className="creatorSteps">
              <div>
                <span>1</span>
                <strong>Create a broadcast</strong>
                <p>Add the title, sport, opponent, date, and stream link.</p>
              </div>

              <div>
                <span>2</span>
                <strong>Connect your profile</strong>
                <p>The broadcast appears on the athlete and school pages.</p>
              </div>

              <div>
                <span>3</span>
                <strong>Reach the family</strong>
                <p>Followers receive the schedule and live notification.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {isFormOpen && (
        <div
          className="modalBackdrop"
          role="presentation"
          onMouseDown={() => setIsFormOpen(false)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stream-form-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modalHeader">
              <div>
                <p className="eyebrow">ATHLETE STREAMING</p>
                <h2 id="stream-form-title">Add a sports stream</h2>
              </div>

              <button
                type="button"
                className="closeButton"
                onClick={() => setIsFormOpen(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Stream title
                <input
                  name="title"
                  placeholder="Texas Tigers varsity baseball"
                  required
                />
              </label>

              <div className="formGrid">
                <label>
                  Athlete or broadcaster
                  <input
                    name="broadcaster"
                    defaultValue={profile?.displayName || ""}
                    placeholder="Athlete name"
                    required
                  />
                </label>

                <label>
                  School
                  <input
                    name="school"
                    placeholder="Texas High School"
                    required
                  />
                </label>
              </div>

              <div className="formGrid">
                <label>
                  Sport
                  <select name="sport" defaultValue="" required>
                    <option value="" disabled>
                      Select sport
                    </option>
                    <option>Football</option>
                    <option>Basketball</option>
                    <option>Baseball</option>
                    <option>Softball</option>
                    <option>Soccer</option>
                    <option>Volleyball</option>
                    <option>Track and Field</option>
                    <option>Wrestling</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  Opponent
                  <input name="opponent" placeholder="Liberty Eagles" />
                </label>
              </div>

              <div className="formGrid">
                <label>
                  <div className="formGrid">
  <label>
    Away team
    <input
      name="awayTeam"
      placeholder="Liberty Eagles"
    />
  </label>

  <label>
    Home team
    <input
      name="homeTeam"
      placeholder="Texas Tigers"
    />
  </label>
</div>

<div className="formGrid">
  <label>
    Away score
    <input
      name="awayScore"
      type="number"
      min="0"
      defaultValue="0"
    />
  </label>

  <label>
    Home score
    <input
      name="homeScore"
      type="number"
      min="0"
      defaultValue="0"
    />
  </label>
</div>

<label>
  Game clock / inning / quarter
  <input
    name="gameClock"
    placeholder="TOP 5TH, Q3 4:32, 2ND HALF"
  />
</label>
                  Date and time
               <input
  name="scheduledTime"
  type="datetime-local"
/>
                </label>

                <label>
                  Streaming platform
                  <select name="platform" defaultValue="YouTube">
                    <option>YouTube</option>
                    <option>Twitch</option>
                    <option>Facebook Live</option>
                    <option>MHSSF Live</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>

              <label>
                Stream URL
                <input
                  name="streamUrl"
                  type="url"
                  placeholder="https://youtube.com/..."
                />
              </label>

              <p className="formNote">
                This design currently adds the stream to the page in your
                browser. We will connect this form to Firebase after the page
                design is approved.
              </p>
{/* TAG ATHLETES */}
<div className="mt-4">
  <label className="block text-sm font-bold mb-2">
    Tag Athletes
  </label>

  <div className="flex gap-2">
    <input
      type="text"
      value={athleteSearch}
      onChange={(e) => setAthleteSearch(e.target.value)}
      placeholder="Search athlete, school, or sport..."
      className="flex-1 border rounded-lg px-3 py-2 bg-transparent"
    />

    <button
      type="button"
      onClick={searchAthletes}
      className="px-4 py-2 rounded-lg border font-semibold"
    >
      Search
    </button>
  </div>

  {athleteResults.length > 0 && (
    <div className="mt-3 space-y-2">
      {athleteResults.map((athlete: any) => {
        const selected = selectedAthleteIds.includes(athlete.id)

        return (
          <button
            key={athlete.id}
            type="button"
            onClick={() => {
              setSelectedAthleteIds((current) =>
                selected
                  ? current.filter((id) => id !== athlete.id)
                  : [...current, athlete.id]
              )
            }}
            className={`w-full text-left border rounded-xl p-3 ${
              selected ? "ring-2 ring-red-500" : ""
            }`}
          >
            <div className="font-bold">
              {athlete.displayName || "Athlete"}
            </div>

            <div className="text-xs text-gray-500 mt-1">
              {athlete.schoolId || "No school"}{" "}
              {athlete.sports
                ? `• ${
                    Array.isArray(athlete.sports)
                      ? athlete.sports.join(", ")
                      : athlete.sports
                  }`
                : ""}
            </div>

            <div className="text-xs font-semibold mt-2">
              {selected ? "✅ Tagged" : "+ Tag Athlete"}
            </div>
          </button>
        )
      })}
    </div>
  )}

  {selectedAthleteIds.length > 0 && (
    <p className="text-sm font-semibold mt-3">
      ✅ {selectedAthleteIds.length} athlete
      {selectedAthleteIds.length === 1 ? "" : "s"} tagged
    </p>
  )}
</div>
              <div className="modalActions">
                <button
                  type="button"
                  className="cancelButton"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="submitButton">
                  Schedule stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
          background: #f4f6fa;
          color: #111827;
          font-family:
            Inter, Arial, Helvetica, system-ui, -apple-system, sans-serif;
        }

        :global(a) {
          color: inherit;
          text-decoration: none;
        }

        button,
        input,
        select {
          font: inherit;
        }

        .livePage {
          min-height: 100vh;
        }

        .hero {
          min-height: 510px;
          padding: 72px max(6%, calc((100% - 1180px) / 2));
          overflow: hidden;
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
          align-items: center;
          gap: 50px;
          background:
            radial-gradient(
              circle at 85% 30%,
              rgba(37, 99, 235, 0.45),
              transparent 28%
            ),
            radial-gradient(
              circle at 70% 100%,
              rgba(220, 38, 38, 0.36),
              transparent 32%
            ),
            linear-gradient(120deg, #060b17 0%, #111d38 50%, #450b15 100%);
          color: white;
        }

        .heroContent {
          position: relative;
          z-index: 2;
        }

        .livePill {
          width: fit-content;
          padding: 9px 14px;
          border: 1px solid rgba(255, 255, 255, 0.23);
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 9px;
          background: rgba(255, 255, 255, 0.09);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .pulse,
        .smallPulse {
          display: inline-block;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 0 5px rgba(239, 68, 68, 0.18);
        }

        .pulse {
          width: 9px;
          height: 9px;
        }

        .smallPulse {
          width: 7px;
          height: 7px;
        }

        .hero h1 {
          max-width: 750px;
          margin: 24px 0 18px;
          font-size: clamp(42px, 6vw, 72px);
          line-height: 1.02;
          letter-spacing: -0.055em;
        }

        .heroContent > p {
          max-width: 670px;
          margin: 0;
          color: #d4dcec;
          font-size: 18px;
          line-height: 1.7;
        }

        .heroActions {
          margin-top: 30px;
          display: flex;
          gap: 13px;
          flex-wrap: wrap;
        }

        .watchButton,
        .addStreamButton,
        .primaryAction,
        .scheduleButton,
        .creatorButton,
        .submitButton {
          border: 0;
          cursor: pointer;
          font-weight: 850;
        }

        .watchButton,
        .addStreamButton {
          min-height: 50px;
          padding: 0 21px;
          border-radius: 13px;
          display: inline-flex;
          align-items: center;
        }

        .watchButton {
          background: #d73524;
          color: white;
          box-shadow: 0 13px 35px rgba(215, 53, 36, 0.32);
        }

        .addStreamButton {
          border: 1px solid rgba(255, 255, 255, 0.26);
          background: rgba(255, 255, 255, 0.09);
          color: white;
        }

        .heroStats {
          margin-top: 38px;
          display: flex;
          gap: 46px;
          flex-wrap: wrap;
        }

        .heroStats div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .heroStats strong {
          font-size: 27px;
        }

        .heroStats span {
          color: #adb9ce;
          font-size: 12px;
        }

        .heroGraphic {
          min-height: 385px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .phone {
          width: 235px;
          height: 405px;
          padding: 12px;
          position: relative;
          z-index: 3;
          border: 2px solid rgba(255, 255, 255, 0.42);
          border-radius: 35px;
          background: #07101f;
          box-shadow:
            0 40px 90px rgba(0, 0, 0, 0.55),
            0 0 70px rgba(37, 99, 235, 0.18);
          transform: rotate(5deg);
        }

        .phoneScreen {
          height: 100%;
          padding: 19px;
          overflow: hidden;
          border-radius: 25px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          background:
            linear-gradient(rgba(7, 16, 31, 0.1), rgba(7, 16, 31, 0.84)),
            linear-gradient(140deg, #1d4ed8, #111827 52%, #b91c1c);
        }

        .phoneScreen::before {
          content: '';
          width: 85px;
          height: 23px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 0 0 16px 16px;
          background: #07101f;
        }

        .phoneLive {
          position: absolute;
          top: 35px;
          left: 17px;
          padding: 6px 9px;
          border-radius: 7px;
          background: #dc2626;
          font-size: 10px;
          font-weight: 900;
        }

        .phonePlay {
          width: 58px;
          height: 58px;
          margin: auto;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.93);
          color: #b91c1c;
          font-size: 21px;
        }

        .phoneScreen strong {
          font-size: 15px;
        }

        .phoneScreen small {
          margin-top: 5px;
          color: #cbd5e1;
        }

        .broadcastSignal {
          position: absolute;
          border: 1px solid rgba(96, 165, 250, 0.28);
          border-radius: 50%;
        }

        .signalOne {
          width: 320px;
          height: 320px;
        }

        .signalTwo {
          width: 430px;
          height: 430px;
        }

        .pageContainer {
          width: min(1180px, calc(100% - 30px));
          margin: 0 auto;
          padding: 34px 0 75px;
        }

        .successMessage {
          margin-bottom: 22px;
          padding: 15px 18px;
          border: 1px solid #bbf7d0;
          border-radius: 14px;
          background: #f0fdf4;
          color: #166534;
          font-weight: 750;
        }

        .featuredSection,
        .streamDirectory {
          padding: 30px;
          border: 1px solid #e1e5ec;
          border-radius: 24px;
          background: white;
          box-shadow: 0 12px 36px rgba(17, 24, 39, 0.055);
        }

        .sectionHeading,
        .directoryTop {
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .eyebrow {
          margin: 0 0 7px;
          color: #b91c1c;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.16em;
        }

        .sectionHeading h2,
        .directoryTop h2,
        .creatorSection h2 {
          margin: 0;
          font-size: clamp(25px, 4vw, 36px);
          letter-spacing: -0.035em;
        }

        .verified {
          padding: 8px 12px;
          border-radius: 999px;
          background: #ecfdf3;
          color: #15803d;
          font-size: 11px;
          font-weight: 850;
        }

        .featuredGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.75fr);
          gap: 25px;
        }

        .featuredVideo {
          min-height: 445px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          display: grid;
          place-items: center;
          background:
            linear-gradient(rgba(4, 10, 24, 0.15), rgba(4, 10, 24, 0.72)),
            radial-gradient(
              circle at 50% 45%,
              rgba(255, 255, 255, 0.12),
              transparent 22%
            ),
            linear-gradient(135deg, #164e63, #172554 48%, #7f1d1d);
        }

        .featuredVideo::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent 0 79px,
            rgba(255, 255, 255, 0.025) 80px
          );
        }

        .videoTop {
          position: absolute;
          z-index: 2;
          top: 17px;
          left: 17px;
          right: 17px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .liveBadge,
        .viewerBadge {
          padding: 7px 10px;
          border-radius: 8px;
          color: white;
          font-size: 10px;
          font-weight: 900;
        }

        .liveBadge {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #dc2626;
        }

        .viewerBadge {
          background: rgba(4, 10, 24, 0.74);
        }

        .largePlay {
          width: 76px;
          height: 76px;
          position: relative;
          z-index: 2;
          border: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          color: #b91c1c;
          font-size: 27px;
          cursor: pointer;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .scoreboard {
          min-width: 310px;
          padding: 14px 19px;
          position: absolute;
          z-index: 2;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 13px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          background: rgba(4, 10, 24, 0.84);
          color: white;
          backdrop-filter: blur(12px);
        }

        .scoreboard div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .scoreboard div:last-child {
          flex-direction: row-reverse;
        }

        .scoreboard span {
          font-size: 10px;
          font-weight: 850;
        }

        .scoreboard strong {
          font-size: 23px;
        }

        .inning {
          padding: 5px 7px;
          border-radius: 6px;
          background: #b91c1c;
        }

        .streamInformation {
          display: flex;
          flex-direction: column;
        }

        .sportBadge {
          width: fit-content;
          padding: 6px 9px;
          border-radius: 7px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 10px;
          font-weight: 900;
        }

        .streamInformation h2 {
          margin: 17px 0 10px;
          font-size: 29px;
          line-height: 1.15;
          letter-spacing: -0.035em;
        }

        .streamDescription {
          margin: 0 0 20px;
          color: #64748b;
          line-height: 1.6;
        }

        .broadcaster,
        .streamerRow {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .broadcaster {
          padding: 16px 0;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }

        .broadcasterAvatar,
        .miniAvatar {
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          background: linear-gradient(145deg, #111827, #b91c1c);
          color: white;
          font-weight: 900;
        }

        .broadcasterAvatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }

        .broadcaster div:last-child,
        .streamerRow div:last-child {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .broadcaster span,
        .streamerRow span {
          color: #64748b;
          font-size: 11px;
        }

        .streamDetails {
          margin: 15px 0;
        }

        .streamDetails div {
          padding: 9px 0;
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .streamDetails span {
          color: #64748b;
          font-size: 12px;
        }

        .streamDetails strong {
          font-size: 12px;
          text-align: right;
        }

        .featuredActions {
          display: flex;
          gap: 8px;
        }

        .primaryAction,
        .secondaryAction,
        .iconAction {
          min-height: 43px;
          padding: 0 15px;
          border-radius: 11px;
          cursor: pointer;
          font-weight: 800;
        }

        .primaryAction {
          background: #b91c1c;
          color: white;
        }

        .secondaryAction,
        .iconAction {
          border: 1px solid #d1d5db;
          background: white;
          color: #111827;
        }

        .secondaryAction {
          flex: 1;
        }

        .athleteProfileLink {
          margin-top: auto;
          padding-top: 17px;
          color: #b91c1c;
          font-size: 13px;
          font-weight: 850;
        }

        .streamDirectory {
          margin-top: 24px;
        }

        .scheduleButton {
          min-height: 43px;
          padding: 0 17px;
          border-radius: 11px;
          background: #111827;
          color: white;
        }

        .tabs {
          margin-bottom: 23px;
          padding: 5px;
          width: fit-content;
          border-radius: 12px;
          display: flex;
          gap: 4px;
          background: #f1f5f9;
        }

        .tabs button {
          padding: 9px 14px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          font-size: 12px;
          font-weight: 850;
        }

        .tabs .activeTab {
          background: white;
          color: #111827;
          box-shadow: 0 3px 10px rgba(15, 23, 42, 0.08);
        }

        .streamGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .streamCard {
          overflow: hidden;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          background: white;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .streamCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 35px rgba(15, 23, 42, 0.1);
        }

        .thumbnail {
          min-height: 185px;
          padding: 13px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .thumbnail1 {
          background: linear-gradient(145deg, #164e63, #172554, #7f1d1d);
        }

        .thumbnail2 {
          background: linear-gradient(145deg, #052e16, #1d4ed8);
        }

        .thumbnail3 {
          background: linear-gradient(145deg, #78350f, #991b1b);
        }

        .thumbnail4 {
          background: linear-gradient(145deg, #312e81, #111827);
        }

        .thumbnailTop {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          justify-content: space-between;
          gap: 8px;
        }

        .cardLiveBadge,
        .scheduledBadge,
        .replayBadge,
        .cardViewers {
          padding: 5px 8px;
          border-radius: 6px;
          color: white;
          font-size: 9px;
          font-weight: 900;
        }

        .cardLiveBadge {
          background: #dc2626;
        }

        .scheduledBadge {
          background: #1d4ed8;
        }

        .replayBadge {
          background: #475569;
        }

        .cardViewers {
          background: rgba(15, 23, 42, 0.72);
        }

        .cardPlay {
          width: 51px;
          height: 51px;
          border: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.94);
          color: #b91c1c;
          cursor: pointer;
        }

        .duration {
          padding: 4px 7px;
          position: absolute;
          right: 10px;
          bottom: 10px;
          border-radius: 5px;
          background: rgba(15, 23, 42, 0.8);
          color: white;
          font-size: 9px;
        }

        .streamCardBody {
          padding: 16px;
        }

        .sportLine {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          color: #b91c1c;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .sportLine small {
          color: #64748b;
          text-transform: none;
        }

        .streamCard h3 {
          margin: 12px 0 6px;
          font-size: 17px;
          line-height: 1.25;
        }

        .matchup {
          min-height: 36px;
          margin: 0 0 14px;
          color: #64748b;
          font-size: 12px;
        }

        .miniAvatar {
          width: 39px;
          height: 39px;
          border-radius: 50%;
          font-size: 11px;
        }

        .streamerRow strong {
          font-size: 12px;
        }

        .scheduledTime {
          margin-top: 13px;
          padding: 10px;
          border-radius: 9px;
          background: #f8fafc;
          color: #475569;
          font-size: 11px;
          font-weight: 750;
        }

        .cardButton {
          width: 100%;
          min-height: 40px;
          margin-top: 14px;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          font-weight: 800;
        }

        .creatorSection {
          margin-top: 24px;
          padding: 40px;
          border-radius: 24px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 45px;
          background:
            radial-gradient(
              circle at 100% 0,
              rgba(37, 99, 235, 0.34),
              transparent 27%
            ),
            linear-gradient(120deg, #08101e, #16213e 56%, #550f1a);
          color: white;
        }

        .lightEyebrow {
          color: #fca5a5;
        }

        .creatorSection > div:first-child > p:not(.eyebrow) {
          max-width: 540px;
          color: #cbd5e1;
          line-height: 1.65;
        }

        .creatorButton {
          min-height: 45px;
          padding: 0 18px;
          border-radius: 11px;
          background: #dc3d27;
          color: white;
        }

        .creatorSteps {
          display: grid;
          gap: 12px;
        }

        .creatorSteps > div {
          padding: 17px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 15px;
          display: grid;
          grid-template-columns: 38px 1fr;
          gap: 3px 13px;
          background: rgba(255, 255, 255, 0.06);
        }

        .creatorSteps > div > span {
          width: 36px;
          height: 36px;
          grid-row: span 2;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.11);
          font-weight: 900;
        }

        .creatorSteps p {
          margin: 4px 0 0;
          color: #adb9ce;
          font-size: 12px;
        }

        .modalBackdrop {
          padding: 20px;
          position: fixed;
          z-index: 100;
          inset: 0;
          overflow-y: auto;
          display: grid;
          place-items: center;
          background: rgba(3, 7, 18, 0.72);
          backdrop-filter: blur(7px);
        }

        .modal {
          width: min(680px, 100%);
          padding: 27px;
          border-radius: 22px;
          background: white;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.34);
        }

        .modalHeader {
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .modalHeader h2 {
          margin: 0;
        }

        .closeButton {
          width: 37px;
          height: 37px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          font-size: 21px;
        }

        form {
          display: grid;
          gap: 16px;
        }

        .formGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        label {
          display: grid;
          gap: 7px;
          color: #334155;
          font-size: 12px;
          font-weight: 800;
        }

        input,
        select {
          width: 100%;
          min-height: 45px;
          padding: 0 13px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          outline: none;
          color: #111827;
          background: white;
        }

        input:focus,
        select:focus {
          border-color: #b91c1c;
          box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.1);
        }

        .formNote {
          margin: 0;
          padding: 12px;
          border-radius: 10px;
          background: #f8fafc;
          color: #64748b;
          font-size: 11px;
          line-height: 1.55;
        }

        .modalActions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .cancelButton,
        .submitButton {
          min-height: 43px;
          padding: 0 17px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 850;
        }

        .cancelButton {
          border: 1px solid #d1d5db;
          background: white;
        }

        .submitButton {
          background: #b91c1c;
          color: white;
        }

        @media (max-width: 950px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .heroContent {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .heroGraphic {
            display: none;
          }

          .featuredGrid,
          .creatorSection {
            grid-template-columns: 1fr;
          }

          .streamGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .hero {
            min-height: 500px;
            padding: 55px 18px;
          }

          .hero h1 {
            font-size: 43px;
          }

          .heroContent > p {
            font-size: 15px;
          }

          .heroActions {
            width: 100%;
          }

          .watchButton,
          .addStreamButton {
            width: 100%;
            justify-content: center;
          }

          .heroStats {
            justify-content: center;
            gap: 24px;
          }

          .pageContainer {
            width: min(100% - 18px, 1180px);
            padding-top: 14px;
          }

          .featuredSection,
          .streamDirectory {
            padding: 18px;
            border-radius: 18px;
          }

          .sectionHeading,
          .directoryTop {
            display: block;
          }

          .verified,
          .scheduleButton {
            margin-top: 15px;
          }

          .featuredVideo {
            min-height: 300px;
          }

          .scoreboard {
            min-width: calc(100% - 28px);
          }

          .featuredActions {
            flex-wrap: wrap;
          }

          .primaryAction,
          .secondaryAction {
            flex: 1 1 45%;
          }

          .tabs {
            width: 100%;
            overflow-x: auto;
          }

          .tabs button {
            flex: 0 0 auto;
          }

          .streamGrid {
            grid-template-columns: 1fr;
          }

          .creatorSection {
            padding: 25px 19px;
            gap: 26px;
          }

          .formGrid {
            grid-template-columns: 1fr;
          }

          .modal {
            padding: 20px;
          }
        }
      `}</style>
    </>
  )
}