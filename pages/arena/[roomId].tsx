import Link from "next/link"
import { useRouter } from "next/router"
import {
  arenaRooms,
  type ArenaRoom,
} from "../../lib/arenaRooms"
import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { doc, setDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"
import {
  ensureArenaRoom,
  joinArenaRoom,
  leaveArenaRoom,
  setArenaMemberReady,
  selectArenaTeam,
  startArenaMatch,
  reportArenaGameResult,
  sendArenaMessage,
  subscribeToArenaMembers,
  subscribeToArenaMessages,
  subscribeToArenaRoom,
  type ArenaMember,
  type ArenaMessage,
  updateArenaRoomStatus,
  subscribeToArenaResults,
  type ArenaGameResult,
  sendArenaChallenge,
subscribeToArenaChallenges,
respondToArenaChallenge,
type ArenaChallenge,
updateArenaChallengeStatus,
endDynastySeason,
startNewDynastySeason,
subscribeToDynastyChampions,
type DynastyChampion,
saveDynastyPowerRankings,
subscribeToDynastyPowerRankings,
type DynastyPowerRankingSnapshot,
} from "../../lib/arenaLive"
import { useUserProfile } from "../../hooks/useUserProfile"
const dynastyTeams = [
  "Alabama",
  "Arizona State",
  "Auburn",
  "Clemson",
  "Colorado",
  "Florida",
  "Florida State",
  "Georgia",
  "LSU",
  "Miami",
  "Michigan",
  "Nebraska",
  "Notre Dame",
  "Ohio State",
  "Oklahoma",
  "Ole Miss",
  "Oregon",
  "Penn State",
  "South Carolina",
  "Tennessee",
  "Texas",
  "Texas A&M",
  "Texas Tech",
  "USC",
  "Utah",
  "Virginia Tech",
  "Washington",
  "Wisconsin",
  "Kansas State",
  "Louisville",
  "Missouri",
  "North Carolina",
]
export default function ArenaRoomPage() {
  const router = useRouter()
  const { roomId, state, action } = router.query
const [teamOneScore, setTeamOneScore] = useState(0)
const [teamTwoScore, setTeamTwoScore] = useState(0)
const stateId =
  typeof state === "string"
    ? state.toLowerCase()
    : ""

const roomIdValue =
  typeof roomId === "string"
    ? roomId
    : ""
const actionValue =
  typeof action === "string"
    ? action.toLowerCase()
    : ""
    const stateNames: Record<string, string> = {
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
}

const stateName =
  stateNames[stateId] || "National"
  const { user } = useAuth()
  
const { profile } = useUserProfile(user?.uid)
const [members, setMembers] = useState<ArenaMember[]>([])
const readyCount = members.filter((member) => member.ready).length

const allPlayersReady =
  members.length > 1 &&
  readyCount === members.length
const [results, setResults] = useState<ArenaGameResult[]>([])
const [messages, setMessages] = useState<ArenaMessage[]>([])
const [messageText, setMessageText] = useState("")
const [notice, setNotice] = useState("")
const [liveRoomStatus, setLiveRoomStatus] = useState<
  "open" | "live" | "ended" | ""
>("")
const [joining, setJoining] = useState(false)
const [challengeOpen, setChallengeOpen] = useState(false)
const [opponentUid, setOpponentUid] = useState("")
const [challengeNotice, setChallengeNotice] = useState("")
const [sending, setSending] = useState(false)
const [challenges, setChallenges] = useState<ArenaChallenge[]>([])
const [selectedTeam, setSelectedTeam] = useState("")
// const [dynastyTab, setDynastyTab] = useState<
//   "standings" | "schedule" | "results" | "playoffs"
//>("standings")
const [dynastyScores, setDynastyScores] = useState<
  Record<
    string,
    {
      homeScore: string
      awayScore: string
      submitted: boolean
    }
  >
>({})
const [savingTeam, setSavingTeam] = useState(false)
const [winnerUid, setWinnerUid] = useState("")
const [loserUid, setLoserUid] = useState("")
const [savingResult, setSavingResult] = useState(false)
const [recentResults, setRecentResults] = useState<any[]>([])
const [dynastyChampions, setDynastyChampions] = useState<DynastyChampion[]>([])
const [dynastyTab, setDynastyTab] = useState<
  "standings" | "schedule" | "results" | "playoffs"
>("standings")
const [savedPowerRankings, setSavedPowerRankings] =
  useState<DynastyPowerRankingSnapshot[]>([])

useEffect(() => {
  if (!roomIdValue) return

  const unsubscribe = subscribeToDynastyChampions(
    roomIdValue,
    setDynastyChampions
  )
  const unsubscribePowerRankings = subscribeToDynastyPowerRankings(
    roomIdValue,
    setSavedPowerRankings
  )

  return () => {
    unsubscribe()
    unsubscribePowerRankings()
  }
}, [roomIdValue])
useEffect(() => {
  if (!roomIdValue) return

  const unsubscribe = subscribeToArenaChallenges(
    roomIdValue,
    setChallenges
  )

  return () => unsubscribe()
}, [roomIdValue])
const incomingChallenges = challenges.filter(
  (challenge: ArenaChallenge) =>
    challenge.opponentUid === user?.uid &&
    challenge.status === "pending"
)

const acceptedChallenges = challenges.filter(
  (challenge: ArenaChallenge) =>
    (challenge.opponentUid === user?.uid ||
      challenge.challengerUid === user?.uid) &&
    challenge.status === "accepted"
)

const liveChallenges = challenges.filter(
  (challenge: ArenaChallenge) =>
    (challenge.opponentUid === user?.uid ||
      challenge.challengerUid === user?.uid) &&
    challenge.status === "live"
)

const completedChallenges = challenges.filter(
  (challenge: ArenaChallenge) =>
    (challenge.opponentUid === user?.uid ||
      challenge.challengerUid === user?.uid) &&
    challenge.status === "completed"
)

const dynastyStandings = [...members]
  .map((member) => {
    const wins = member.wins ?? 0
    const losses = member.losses ?? 0
    const gamesPlayed = wins + losses
    const winPct = gamesPlayed > 0 ? wins / gamesPlayed : 0
    const pointsFor = member.pointsFor ?? 0
const pointsAgainst = member.pointsAgainst ?? 0
const pointDiff = pointsFor - pointsAgainst
    return {
      ...member,
      wins,
      losses,
      gamesPlayed,
      winPct,
    }
  })
  .sort((a, b) => {
    if (b.winPct !== a.winPct) {
      return b.winPct - a.winPct
    }

    if (b.wins !== a.wins) {
      return b.wins - a.wins
    }

    return a.losses - b.losses
  })
  const mostGamesPlayed =
  dynastyStandings.length > 0
    ? [...dynastyStandings].sort(
        (a, b) => (b.gamesPlayed ?? 0) - (a.gamesPlayed ?? 0)
      )[0]
    : null

    const dynastyMVP =
  dynastyStandings.length > 0
    ? [...dynastyStandings]
        .filter((player) => (player.gamesPlayed ?? 0) > 0)
        .sort((a, b) => {
          if (b.winPct !== a.winPct) {
            return b.winPct - a.winPct
          }

          if (b.wins !== a.wins) {
            return b.wins - a.wins
          }

          return a.losses - b.losses
        })[0] ?? null
    : null

    const topWinStreak =
  [...dynastyStandings]
    .filter((player) => player.streak?.startsWith("W"))
    .sort((a, b) => {
      const aStreak = Number(a.streak?.slice(1) ?? 0)
      const bStreak = Number(b.streak?.slice(1) ?? 0)

      return bStreak - aStreak
    })[0] ?? null
    const dynastyTitleLeaders = Object.values(
  dynastyChampions.reduce<
    Record<
      string,
      {
        uid: string
        displayName: string
        championships: number
        wins: number
        losses: number
      }
    >
  >((leaders, champion) => {
    const existing = leaders[champion.uid]

    if (existing) {
      existing.championships += 1

      if (champion.wins > existing.wins) {
        existing.wins = champion.wins
        existing.losses = champion.losses
      }
    } else {
      leaders[champion.uid] = {
        uid: champion.uid,
        displayName: champion.displayName || champion.uid,
        championships: 1,
        wins: champion.wins,
        losses: champion.losses,
      }
    }

    return leaders
  }, {})
).sort((a, b) => {
  if (b.championships !== a.championships) {
    return b.championships - a.championships
  }

  return b.wins - a.wins
})

const dynastyGOAT = dynastyTitleLeaders[0] ?? null

const dynastyChampionshipHistory = [...dynastyChampions].sort((a, b) => {
  const aSeason = Number(a.seasonNumber ?? 0)
  const bSeason = Number(b.seasonNumber ?? 0)

  return bSeason - aSeason
})
const backToBackChampions = dynastyChampionshipHistory.filter(
  (champion, index, history) => {
    const previousChampion = history[index + 1]

    if (!previousChampion) return false

    const currentSeason = Number(champion.seasonNumber ?? 0)
    const previousSeason = Number(previousChampion.seasonNumber ?? 0)

    return (
      champion.uid === previousChampion.uid &&
      currentSeason === previousSeason + 1
    )
  }
)
const threePeatChampions = dynastyChampionshipHistory.filter(
  (champion, index, history) => {
    const previousChampion = history[index + 1]
    const twoSeasonsAgoChampion = history[index + 2]

    if (!previousChampion || !twoSeasonsAgoChampion) return false

    const currentSeason = Number(champion.seasonNumber ?? 0)
    const previousSeason = Number(previousChampion.seasonNumber ?? 0)
    const twoSeasonsAgo = Number(twoSeasonsAgoChampion.seasonNumber ?? 0)

    return (
      champion.uid === previousChampion.uid &&
      champion.uid === twoSeasonsAgoChampion.uid &&
      currentSeason === previousSeason + 1 &&
      previousSeason === twoSeasonsAgo + 1
    )
  }
)
const getChampionshipRun = (uid: string, seasonNumber: number) => {
  let run = 1

  for (let offset = 1; ; offset += 1) {
    const targetSeason = seasonNumber - offset

    const previousChampion = dynastyChampionshipHistory.find(
      (champion) => Number(champion.seasonNumber ?? 0) === targetSeason
    )

    if (!previousChampion || previousChampion.uid !== uid) {
      break
    }

    run += 1
  }

  return run
}
const reigningDynastyChampion =
  dynastyChampionshipHistory.length > 0
    ? dynastyChampionshipHistory[0]
    : null

const reigningChampionRun = reigningDynastyChampion
  ? getChampionshipRun(
      reigningDynastyChampion.uid,
      Number(reigningDynastyChampion.seasonNumber ?? 0)
    )
  : 0
  const currentDynastySeason =
  reigningDynastyChampion
    ? Number(reigningDynastyChampion.seasonNumber ?? 0) + 1
    : 1
  const dynastyTitleChallenger =
  dynastyStandings.find(
    (player) =>
      !reigningDynastyChampion ||
      player.uid !== reigningDynastyChampion.uid
  ) ?? null
  const challengerCanClinch =
  dynastyTitleChallenger &&
  dynastyTitleChallenger.gamesPlayed >= 5 &&
  dynastyTitleChallenger.winPct >= 0.75
  const dynastyPowerRankings = [...dynastyStandings]
  .map((player) => {
    const championships =
      dynastyTitleLeaders.find((leader) => leader.uid === player.uid)
        ?.championships ?? 0

    const streakBonus = player.streak?.startsWith("W")
      ? Number(player.streak.slice(1) || 0) * 2
      : 0

    const powerScore =
      player.winPct * 100 +
      player.wins * 3 +
      championships * 25 +
      streakBonus

    return {
      ...player,
      championships,
      powerScore,
      previousRank: 0,
      rank: 0,
      rankChange: 0,
      isHot:
        player.streak?.startsWith("W") &&
        Number(player.streak.slice(1) || 0) >= 3,
    }
  })
  .sort((a, b) => b.powerScore - a.powerScore)
  .map((player, index) => {
    const rank = index + 1

const savedRanking = savedPowerRankings.find(
  (savedPlayer) => savedPlayer.uid === player.uid
)

const previousRank = savedRanking?.rank ?? rank

const rankChange = previousRank - rank

return {
  ...player,
  rank,
  previousRank,
  rankChange,
    }
  })
  async function handleDynastyStatus(
  status: "open" | "live" | "ended"
) {
  if (!user || typeof roomId !== "string") return

  try {
    setNotice("")

    await updateArenaRoomStatus(roomId, status)

    if (status === "live") {
      setNotice("Dynasty started.")
    } else if (status === "open") {
      setNotice("Dynasty lobby reopened.")
    } else {
        await saveDynastyPowerRankings(
  roomId,
  dynastyPowerRankings.map((player) => ({
    uid: player.uid,
    rank: player.rank,
    powerScore: player.powerScore,
  }))
)
      setNotice("Dynasty ended.")
    }
  } catch (error: any) {
    setNotice(
      error.message || "Could not update Dynasty status."
    )
  }
}
async function handleReportResult() {
  if (typeof roomId !== "string") return

  if (!winnerUid || !loserUid) {
    setNotice("Select a winner and loser.")
    return
  }

  if (winnerUid === loserUid) {
    setNotice("Winner and loser cannot be the same player.")
    return
  }

  try {
    setSavingResult(true)
    setNotice("")

  
await reportArenaGameResult(
  roomId,
  winnerUid,
  loserUid,

)

    setWinnerUid("")
    setLoserUid("")
    setNotice("Game result saved.")
  } catch (error: any) {
    setNotice(error.message || "Could not save game result.")
  } finally {
    setSavingResult(false)
  }
}
async function handleToggleReady() {
  if (!user || typeof roomId !== "string") return

  const currentMember = members.find(
    (member) => member.uid === user.uid
  )

  if (!currentMember) return

  try {
    const nextReady = !currentMember.ready

    await setArenaMemberReady(
      roomId,
      user.uid,
      nextReady
    )

    setNotice(
      nextReady
        ? "You are READY."
        : "You are NOT READY."
    )
  } catch (error: any) {
    setNotice(
      error.message || "Could not update ready status."
    )
  }
}

async function handleStartMatch() {
  if (typeof roomId !== "string") return
  if (!allPlayersReady) return

  try {
    await startArenaMatch(roomId)
    setNotice("Match started!")
  } catch (error: any) {
    setNotice(
      error.message || "Could not start the match."
    )
  }
}
async function handleSelectTeam() {
  if (!user || typeof roomId !== "string" || !selectedTeam) return




  
  const currentMember = members.find(
    (member) => member.uid === user.uid
  )

  const currentTeam = currentMember?.team || ""

  const teamTaken = members.some(
    (member) =>
      member.team === selectedTeam &&
      member.uid !== user.uid
  )

  if (teamTaken) {
    setNotice(`${selectedTeam} has already been claimed.`)
    return
  }

  if (currentTeam === selectedTeam) {
    setNotice(`You already have ${selectedTeam}.`)
    return
  }

  try {
    setSavingTeam(true)
    setNotice("")

    await selectArenaTeam(
      roomId,
      user.uid,
      selectedTeam,
      currentTeam, 
    )

    setNotice(`You selected ${selectedTeam}.`)
  } catch (error: any) {
    setNotice(
      error.message || "Could not select team."
    )
  } finally {
    setSavingTeam(false)
  }
}
const [liveRoom, setLiveRoom] = useState<ArenaRoom | null>(null)
const fallbackRoom = arenaRooms.find((item) => item.id === roomId)
const room = liveRoom || fallbackRoom
useEffect(() => {
  if (!router.isReady || typeof roomId !== "string") {
    return
  }

  const unsubscribe = subscribeToArenaRoom(
    roomId,
    (nextRoom) => {
  if (nextRoom) {
    const syncedRoom = nextRoom as ArenaRoom

    setLiveRoom(syncedRoom)

    setTeamOneScore(
      syncedRoom.teamOneScore ?? 0
    )

    setTeamTwoScore(
      syncedRoom.teamTwoScore ?? 0
    )
  }
}
  )

  return () => unsubscribe()
}, [router.isReady, roomId])
useEffect(() => {
  if (!router.isReady || !room || typeof roomId !== "string") return

  ensureArenaRoom(roomId, {
    title: `${stateName} Arena - ${room.title}`,
    game: room.game,
    matchup: room.matchup,
    host: room.host,
    hostState: stateName !== "National" ? stateName : room.hostState,
    platform: room.platform,
    status: room.status,
    maxPlayers: room.maxPlayers,
  }).catch((error) => {
    console.error(error)
    setNotice(error.message || "Could not prepare the room.")
  })

  const unsubscribeMembers = subscribeToArenaMembers(
    roomId,
    setMembers,
    (error) => setNotice(error.message)
  )

  const unsubscribeMessages = subscribeToArenaMessages(
    roomId,
    setMessages,
    (error) => setNotice(error.message)
  )
const unsubscribeResults = subscribeToArenaResults(
  roomId,
  setResults,
  (error) => {
    console.error("Arena results subscription error:", error)
  }
)
  return () => {
    unsubscribeMembers()
    unsubscribeMessages()
    unsubscribeResults()
  }
}, [router.isReady, roomId])
useEffect(() => {
  if (!router.isReady) return
  if (actionValue !== "join") return
  if (!user || !room) return

  const alreadyJoined = members.some(
    (member) => member.uid === user.uid
  )

  if (alreadyJoined) {
    router.replace(
      `/arena/${roomIdValue}?state=${encodeURIComponent(stateId)}`,
      undefined,
      { shallow: true }
    )
  }
}, [
  router.isReady,
  actionValue,
  user,
  room,
  members,
  roomIdValue,
  stateId,
])
useEffect(() => {
  if (!user) return

  const currentMember = members.find(
    (member) => member.uid === user.uid
  )

  if (currentMember?.team) {
    setSelectedTeam(currentMember.team)
  } else {
    setSelectedTeam("")
  }
}, [members, user])
if (!router.isReady) {
  return <main className="p-10">Loading room...</main>
}
async function handleJoinRoom() {
  if (!user) {
    router.push(`/signin?next=${encodeURIComponent(router.asPath)}`)
    return
  }

  if (!room || typeof roomId !== "string") return

  const isJoined = members.some(
    (member) => member.uid === user.uid
  )

  try {
    setJoining(true)
    setNotice("")

    if (isJoined) {
  await leaveArenaRoom(roomId, user.uid)

  const roomRef = doc(db, "arenaRooms", roomId)

  const nextJoinedUserIds = (room.joinedUserIds || []).filter(
    (id: string) => id !== user.uid
  )

  const nextParticipants = (room.participants || []).filter(
    (participant: any) => participant.userId !== user.uid
  )

  await setDoc(
    roomRef,
    {
      joinedUserIds: nextJoinedUserIds,
      participants: nextParticipants,
      players: nextJoinedUserIds.length,
      status: "open",
    },
    { merge: true }
  )

  setNotice(`You left ${room.title}.`)
  return
}

    await joinArenaRoom(roomId, {
      uid: user.uid,
      displayName:
        user.displayName ||
        user.email?.split("@")[0] ||
        "MHSSF Athlete",
      photoURL: user.photoURL || "",
      state: profile?.state || room.hostState,
    })

    setNotice(`You joined ${room.title}.`)
  } catch (error: any) {
    setNotice(error.message || "Could not update the room.")
  } finally {
    setJoining(false)
  }
}

async function handleSendMessage() {
  if (!user) {
    router.push(`/signin?next=${encodeURIComponent(router.asPath)}`)
    return
  }

  if (typeof roomId !== "string") return

  try {
    setSending(true)
    setNotice("")

    await sendArenaMessage(roomId, {
      uid: user.uid,
      displayName:
        user.displayName ||
        user.email?.split("@")[0] ||
        "MHSSF Athlete",
      photoURL: user.photoURL || "",
      text: messageText,
    })

    setMessageText("")
  } catch (error: any) {
    setNotice(error.message || "Could not send the message.")
  } finally {
    setSending(false)
  }
}
  if (!room) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-white">
        <h1 className="text-3xl font-black">Room not found</h1>
        <p className="mt-3">Room ID: {String(roomId)}</p>

        <Link
          href="/arena"
          className="mt-6 inline-block rounded-xl bg-red-600 px-5 py-3"
        >
          Back to Arena
        </Link>
      </main>
    )
  }
const currentRoomStatus = liveRoomStatus || room.status
  return (
  <main className="min-h-screen bg-[#020814] px-4 py-8 text-white">
    <div className="mx-auto max-w-[1500px]">
      <Link
    href={`/arena/state?state=${stateId}`}
        className="text-sm font-bold text-slate-400 hover:text-white"
      >
        ← Back to Arena
      </Link>
      {room.id === "college-football-27-dynasty" && (
  <div className="mt-4 flex flex-wrap items-center gap-3">
    <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-300">
      Season {Number((room as any).seasonNumber ?? 1)}
    </span>

    <span
      className={
        currentRoomStatus === "live"
          ? "rounded-full bg-green-500/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-green-400"
          : currentRoomStatus === "ended"
          ? "rounded-full bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-red-400"
          : "rounded-full bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-300"
      }
    >
      {currentRoomStatus === "live"
        ? "● Dynasty Live"
        : currentRoomStatus === "ended"
        ? "Season Complete"
        : "Dynasty Open"}
    </span>
  </div>
)}
{currentRoomStatus === "ended" && (
  <section className="mt-6 rounded-3xl border border-yellow-400/30 bg-yellow-500/10 p-6 text-center">
    <div className="text-4xl">🏆</div>

    <p className="mt-2 text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
      Dynasty Champion
    </p>

    <h2 className="mt-2 text-2xl font-black text-white">
      {(room as any).championName ||
        dynastyStandings[0]?.displayName ||
        "Champion"}
    </h2>

    <p className="mt-2 text-sm font-bold text-slate-300">
      {(room as any).championWins ?? dynastyStandings[0]?.wins ?? 0} Wins
      {" • "}
      {(room as any).championLosses ?? dynastyStandings[0]?.losses ?? 0} Losses
    </p>

    <div className="mx-auto mt-4 inline-flex rounded-full border border-yellow-400/30 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-wider text-yellow-300">
      College Football 27 Dynasty Champion
    </div>
  </section>
)}
     {room.id === "college-football-27-dynasty" && (
  <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
          Dynasty Legacy
        </p>

        <h2 className="mt-2 text-2xl font-black">
          🏆 Championship History
        </h2>
      </div>

      <div className="rounded-full bg-yellow-400/10 px-4 py-2 text-sm font-black text-yellow-300">
        {dynastyChampions.length} Champions
      </div>
    </div>

    {dynastyChampions.length === 0 ? (
      <div className="mt-5 rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-400">
        No Dynasty champions yet. Complete the first season to create history.
      </div>
    ) : (
      <div className="mt-5 grid gap-3">
        {dynastyChampions.map((champion) => (
          <div
            key={champion.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400/10 text-2xl">
                🏆
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-yellow-400">
                  Season {champion.seasonNumber}
                </p>

                <p className="text-lg font-black text-white">
                  {champion.displayName || champion.uid}
                </p>
                {(() => {
  const championshipRun = getChampionshipRun(
    champion.uid,
    Number(champion.seasonNumber ?? 0)
  )

  if (championshipRun >= 5) {
    return (
      <span className="mt-2 inline-flex rounded-full border border-purple-400/30 bg-purple-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-purple-300">
        🐐 Legendary Dynasty · {championshipRun} Straight
      </span>
    )
  }

  if (championshipRun === 4) {
    return (
      <span className="mt-2 inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-red-300">
        👑 Dynasty Empire · 4 Straight
      </span>
    )
  }

  if (championshipRun === 3) {
    return (
      <span className="mt-2 inline-flex rounded-full border border-yellow-400/30 bg-yellow-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-yellow-300">
        👑 Three-Peat Dynasty
      </span>
    )
  }

  if (championshipRun === 2) {
    return (
      <span className="mt-2 inline-flex rounded-full border border-orange-400/30 bg-orange-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-orange-300">
        🔥 Back-to-Back Champion
      </span>
    )
  }

  return null
})()}
              <p className="text-lg font-black text-white">
                {champion.wins}-{champion.losses}
              </p>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Champion
              </p>
            </div>
          </div>
          </div>
       ))}
      </div>
    )}
    </section>
  )}
  {/* DYNASTY SEASON AWARDS */}
{room.id === "college-football-27-dynasty" &&
  dynastyStandings.length > 0 && (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
          🏅 Season Awards
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Dynasty Honors
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-yellow-400/30 bg-yellow-500/10 p-4">
          <div className="text-2xl">🏆</div>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-yellow-400">
            Champion
          </p>
          <p className="mt-1 font-black text-white">
            {dynastyStandings[0]?.displayName ||
              dynastyStandings[0]?.uid ||
              "TBD"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-2xl">🥈</div>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Runner-Up
          </p>
          <p className="mt-1 font-black text-white">
            {dynastyStandings[1]?.displayName ||
              dynastyStandings[1]?.uid ||
              "TBD"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-2xl">👑</div>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Best Record
          </p>
          <p className="mt-1 font-black text-white">
            {dynastyStandings[0]?.wins ?? 0}-
            {dynastyStandings[0]?.losses ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-2xl">🔥</div>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Top Streak
          </p>
          <p className="mt-1 font-black text-white">
            {topWinStreak
  ? `${topWinStreak.displayName || topWinStreak.uid} · ${topWinStreak.streak}`
  : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
  <div className="text-2xl">🎮</div>

  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
    Most Games Played
  </p>

  <p className="mt-1 font-black text-white">
    {mostGamesPlayed?.displayName ||
      mostGamesPlayed?.uid ||
      "TBD"}
  </p>

  <p className="mt-1 text-sm font-bold text-slate-400">
    {mostGamesPlayed?.gamesPlayed ?? 0} Games
  </p>
</div>
<div className="rounded-2xl border border-purple-400/30 bg-purple-500/10 p-4">
  <div className="text-2xl">🏆</div>

  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-purple-300">
    Dynasty MVP
  </p>

  <p className="mt-1 font-black text-white">
    {dynastyMVP?.displayName ||
      dynastyMVP?.uid ||
      "TBD"}
  </p>

  <p className="mt-1 text-sm font-bold text-slate-400">
    {dynastyMVP
      ? `${dynastyMVP.wins}-${dynastyMVP.losses} · ${(dynastyMVP.winPct * 100).toFixed(0)}%`
      : "No games played"}
  </p>
</div>
      </div>
    </section>
  )}
  {room.id === "college-football-27-dynasty" &&
  dynastyStandings.length > 0 && (
    <section className="mt-6 rounded-3xl border border-blue-400/20 bg-[#07111e] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-300">
            📊 Season Records
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Dynasty Record Book
          </h2>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-300">
          Season {Number((room as any).seasonNumber ?? 1)}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-2xl">👑</div>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Best Record
          </p>
          <p className="mt-1 font-black text-white">
            {dynastyStandings[0]?.displayName ||
              dynastyStandings[0]?.uid ||
              "TBD"}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-400">
            {dynastyStandings[0]?.wins ?? 0}-
            {dynastyStandings[0]?.losses ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-4">
          <div className="text-2xl">🏆</div>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-purple-300">
            MVP
          </p>
          <p className="mt-1 font-black text-white">
            {dynastyMVP?.displayName || dynastyMVP?.uid || "TBD"}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-400">
            {dynastyMVP
              ? `${(dynastyMVP.winPct * 100).toFixed(0)}% Win Rate`
              : "No games played"}
          </p>
        </div>

        <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4">
          <div className="text-2xl">🔥</div>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-orange-300">
            Longest Win Streak
          </p>
          <p className="mt-1 font-black text-white">
            {topWinStreak?.displayName || topWinStreak?.uid || "TBD"}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-400">
            {topWinStreak?.streak || "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-2xl">🎮</div>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Most Games
          </p>
          <p className="mt-1 font-black text-white">
            {mostGamesPlayed?.displayName ||
              mostGamesPlayed?.uid ||
              "TBD"}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-400">
            {mostGamesPlayed?.gamesPlayed ?? 0} Games
          </p>
        </div>
      </div>
    </section>
  )}
  {room.id === "college-football-27-dynasty" &&
  dynastyTitleLeaders.length > 0 && (
    <section className="mt-6 rounded-3xl border border-yellow-400/20 bg-[#0b1018] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
            🐐 Dynasty Hall of Fame
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            All-Time Dynasty Legends
          </h2>
        </div>

        <div className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-yellow-300">
          {dynastyChampions.length} Total Titles
        </div>
      </div>

      {dynastyGOAT && (
        <div className="mt-5 rounded-2xl border border-yellow-400/30 bg-yellow-500/10 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400/10 text-3xl">
                👑
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-yellow-400">
                  Dynasty GOAT
                </p>

                <p className="mt-1 text-xl font-black text-white">
                  {dynastyGOAT.displayName || dynastyGOAT.uid}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-3xl font-black text-yellow-300">
                {dynastyGOAT.championships}
              </p>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Championships
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 grid gap-3">
        {dynastyTitleLeaders.map((leader, index) => (
          <div
            key={leader.uid}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 text-center text-lg font-black text-slate-300">
                {index === 0 ? "👑" : `#${index + 1}`}
              </div>

              <div>
                <p className="font-black text-white">
                  {leader.displayName || leader.uid}
                </p>

                <p className="text-xs font-bold text-slate-400">
                  Best title record: {leader.wins}-{leader.losses}
                </p>
              </div>
            </div>

            <div className="rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-black text-yellow-300">
              {leader.championships}{" "}
              {leader.championships === 1 ? "Title" : "Titles"}
            </div>
          </div>
        ))}
      </div>
    </section>
  )}
  {room.id === "college-football-27-dynasty" &&
  dynastyChampionshipHistory.length > 0 && (
    <section className="mt-6 rounded-3xl border border-white/10 bg-[#0b1220] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            🏆 Championship History
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Dynasty Season Champions
          </h2>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-300">
          {dynastyChampionshipHistory.length} Seasons
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {dynastyChampionshipHistory.map((champion, index) => (
          <div
            key={`${champion.uid}-${champion.seasonNumber ?? index}`}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-500/10 text-xl">
                🏆
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Season {champion.seasonNumber ?? "—"}
                </p>

                <p className="mt-1 font-black text-white">
                  {champion.displayName || champion.uid}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-black text-white">
                {champion.wins}-{champion.losses}
              </p>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Championship Record
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )}
  {/* DEFENDING DYNASTY CHAMPION */}
{room.id === "college-football-27-dynasty" && reigningDynastyChampion && (
  <section className="mt-6 rounded-3xl border border-yellow-400/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-yellow-400">
          🏆 Defending Champion
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          {reigningDynastyChampion.displayName || reigningDynastyChampion.uid}
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Season {reigningDynastyChampion.seasonNumber} Champion
        </p>
      </div>

      <div className="text-right">
        <div className="text-4xl">🏆</div>

        <p className="mt-2 font-black text-white">
          {reigningDynastyChampion.wins}-{reigningDynastyChampion.losses}
        </p>

        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Championship Record
        </p>
      </div>
    </div>

    {reigningChampionRun >= 2 && (
      <div className="mt-4 inline-flex rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-xs font-black text-yellow-300">
        🔥 {reigningChampionRun} Straight Championships
      </div>
    )}
  </section>
)}
      
      {/* #1 DYNASTY CONTENDER */}
{room.id === "college-football-27-dynasty" && dynastyTitleChallenger && (
  <section className="mt-4 rounded-3xl border border-red-400/30 bg-red-500/10 p-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-red-300">
          🥊 #1 Contender
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          {dynastyTitleChallenger.displayName || dynastyTitleChallenger.uid}
        </h2>

        <p className="mt-1 text-sm font-bold text-slate-400">
          Next in line for the Dynasty crown
        </p>
      </div>

      <div className="text-right">
        <p className="text-3xl font-black text-white">
          {dynastyTitleChallenger.wins}-{dynastyTitleChallenger.losses}
        </p>

        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Current Record
        </p>
      </div>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      <span className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-red-300">
        🎯 Title Challenger
      </span>

      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-300">
        {(dynastyTitleChallenger.winPct * 100).toFixed(0)}% Win Rate
      </span>

      {dynastyTitleChallenger.streak?.startsWith("W") && (
        <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-orange-300">
          🔥 {dynastyTitleChallenger.streak}
        </span>
      )}
    </div>
  </section>
)}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <section>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
            {currentRoomStatus === "live" ? (
  <div>
    <div className="text-8xl">{room.emoji}</div>
    <h2 className="mt-5 text-3xl font-black">
      Dynasty is LIVE
    </h2>
    <p className="mt-2 text-slate-400">
      The College Football 27 Dynasty has started.
    </p>
  </div>
) : currentRoomStatus === "ended" ? (
  <div>
    <div className="text-8xl">🏆</div>
    <h2 className="mt-5 text-3xl font-black">
      Dynasty has ended
    </h2>
    <p className="mt-2 text-slate-400">
      This Dynasty season is complete.
    </p>
  </div>
) : (
  <div>
    <div className="text-8xl">{room.emoji}</div>
    <h2 className="mt-5 text-3xl font-black">
      Room lobby is open
    </h2>
    <p className="mt-2 text-slate-400">
      Join the room and wait for the host to begin.
    </p>
  </div>
)}
 </div>              
                 

          <div className="mt-5 rounded-3xl border border-white/10 bg-[#07111e] p-6">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-red-500">
                  {room.game}
                </p>

               <h1 className="mt-2 text-4xl font-black">
  {stateName && stateName !== "National"
    ? `${stateName} Arena`
    : "National Arena"}
</h1>
                
{stateName !== "National" && (
  <p className="mt-2 text-sm font-bold uppercase tracking-widest text-red-400">
    {room.title}
  </p>
)}
                <p className="mt-2 text-slate-400">
                  {room.matchup}
                </p>
              </div>

              <span
                className={`rounded-xl px-4 py-3 text-sm font-black ${
                  room.status === "live"
                    ? "bg-red-600"
                    : "bg-green-600"
                }`}
              >
                {room.status.toUpperCase()}
              </span>
            </div>
          </div>
        </section>
{room.id === "college-football-27-dynasty" &&
  user?.uid === room.hostUid && (
    <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
      <h3 className="text-lg font-black">
        Commissioner Controls
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        Manage the College Football 27 Dynasty.
      </p>

      <div className="mt-4 grid gap-3">
        <button
          type="button"
          onClick={() => handleDynastyStatus("live")}
          disabled={currentRoomStatus === "live"}
          className="w-full rounded-xl bg-green-600 px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {currentRoomStatus === "live"
            ? "Dynasty Is Live"
            : "Start Dynasty"}
        </button>

        <button
          type="button"
          onClick={() => handleDynastyStatus("open")}
          disabled={currentRoomStatus === "open"}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {currentRoomStatus === "open"
            ? "Lobby Is Open"
            : "Reopen Lobby"}
        </button>

        <button
          type="button"
          onClick={async () => {
  if (dynastyStandings.length === 0) {
    setNotice("Cannot end Dynasty without any players.")
    return
  }

  const champion = dynastyStandings[0]

  try {
    setNotice("")

    await endDynastySeason(
      roomIdValue,
      champion.uid,
      champion.displayName || champion.uid,
      champion.wins,
      champion.losses
    )

    setNotice(
      `🏆 ${champion.displayName || champion.uid} is the Dynasty Champion!`
    )
  } catch (error) {
    console.error(error)
    setNotice("Could not end Dynasty.")
  }
}}
          disabled={currentRoomStatus === "ended"}
          className="w-full rounded-xl bg-red-600 px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {currentRoomStatus === "ended"
            ? "Dynasty Ended"
            : "End Dynasty"}
        </button>
{currentRoomStatus === "ended" && (
  <button
    type="button"
    onClick={async () => {
      try {
        setNotice("Starting new Dynasty season...")

        await startNewDynastySeason(roomIdValue)

        const nextSeason =
          Number((room as any).seasonNumber ?? 1) + 1

        setNotice(`🏈 Season ${nextSeason} is now open!`)
      } catch (error) {
        console.error(error)
        setNotice("Could not start the new Dynasty season.")
      }
    }}
    className="w-full rounded-xl bg-blue-600 px-4 py-3 font-black text-white hover:bg-blue-500"
  >
    🏈 Start Season {Number((room as any).seasonNumber ?? 1) + 1}
  </button>
)}
      </div>
    </div>
  )}

{room.id === "college-football-27-dynasty" && (
  <section className="mt-6 rounded-3xl border border-yellow-500/30 bg-[#07111e] p-5">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-black text-white">
          🏆 Dynasty Standings
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          College Football 27 official rankings
        </p>
      </div>

      <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-400">
        {dynastyStandings.length} Players
      </span>
    </div>

    <div className="mt-5 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
            <th className="px-3 py-3">Rank</th>
            <th className="px-3 py-3">Player</th>
            <th className="px-3 py-3 text-center">W</th>
            <th className="px-3 py-3 text-center">L</th>
            <th className="px-3 py-3 text-center">Games</th>
            <th className="px-3 py-3 text-center">Win %</th>
            <th className="px-3 py-3 text-center">GB</th>
          <th className="px-3 py-3 text-center">Streak</th>
          <th className="px-3 py-3 text-center">Last 5</th>
          </tr>
        </thead>

        <tbody>
  {dynastyStandings.map((member, index) => (
    <tr
      key={member.uid}
      className="border-b border-white/5 text-white"
    >
              <td className="px-3 py-4 font-black">
                {index === 0 ? "👑" : `#${index + 1}`}
              </td>

              <td className="px-3 py-4">
                <div className="flex items-center gap-2 font-bold">
                  <span>{member.displayName || member.uid}</span>

  {index === 0 && (
    <span className="rounded-full bg-yellow-500/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-yellow-400">
      Leader
    </span>
  )}

  {member.streak?.startsWith("W") &&
    Number(member.streak.slice(1)) >= 3 && (
      <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-orange-400">
        🔥 Hot
      </span>
    )}
</div>

                {member.team && (
                  <div className="mt-1 text-xs text-slate-400">
                    {member.team}
                  </div>
                )}
              </td>

              <td className="px-3 py-4 text-center font-black text-green-400">
                {member.wins}
              </td>

              <td className="px-3 py-4 text-center font-black text-red-400">
                {member.losses}
              </td>

              <td className="px-3 py-4 text-center">
                {member.gamesPlayed}
              </td>

              <td className="px-3 py-4 text-center font-black">
                {(member.winPct * 100).toFixed(0)}%
              </td>
              <td className="px-3 py-4 text-center font-bold">
  {index === 0
    ? "-"
    : (
        ((dynastyStandings[0]?.wins ?? 0) - member.wins +
          (member.losses - (dynastyStandings[0]?.losses ?? 0))) /
        2
      ).toFixed(1)}
</td>
              <td className="px-3 py-4 text-center font-black">
                <span
                  className={
                    member.streak?.startsWith("W")
                      ? "inline-flex rounded-full bg-green-500/10 px-2 py-1 text-green-400"
                      : member.streak?.startsWith("L")
                      ? "inline-flex rounded-full bg-red-500/10 px-2 py-1 text-red-400"
                      : "inline-flex rounded-full bg-white/5 px-2 py-1 text-slate-400"
                  }
                >
                  {member.streak || "-"}
                </span>
              </td>
              <td className="px-3 py-4">
  <div className="flex items-center justify-center gap-1">
    {(member.last5 ?? []).map((result, index) => (
      <span
        key={index}
        className={
          result === "W"
            ? "flex h-6 w-6 items-center justify-center rounded-full bg-green-500/15 text-xs font-black text-green-400"
            : "flex h-6 w-6 items-center justify-center rounded-full bg-red-500/15 text-xs font-black text-red-400"
        }
      >
        {result}
      </span>
    ))}

    {(member.last5 ?? []).length === 0 && (
      <span className="text-slate-500">-</span>
    )}
  </div>
</td>
    </tr>
  ))}
              </tbody>
                
             </table>
    </div>

    {dynastyStandings.length === 0 && (
      <div className="py-8 text-center text-sm text-slate-400">
        No Dynasty players yet.
      </div>
    )}
  </section>
)}
        <aside className="space-y-5">
          <section className="rounded-3xl border border-white/10 bg-[#07111e] p-6">
            <h2 className="text-xl font-black">Room details</h2>

            <div className="mt-5 space-y-4 text-sm">
                
              <Detail label="Host" value={room.host} />
              <Detail
  label="State"
  value={stateName !== "National" ? stateName : room.hostState}
/>
              <Detail label="Platform" value={room.platform} />
            <Detail
  label="Players"
  value={`${
    room.participants?.length ??
    room.joinedUserIds?.length ??
    members.length
  }/${room.maxPlayers}`}
/>
              {room.participants && room.participants.length > 0 && (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
      Players in Room
    </div>

    <div className="space-y-2">
      {room.participants.map((participant) => (
        <div
          key={participant.userId}
          className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2"
        >
          <strong className="text-white">
            {participant.displayName}
          </strong>

          <span className="text-sm text-slate-400">
            {participant.state}
          </span>
        </div>
      ))}
    </div>
  </div>
)}
              <Detail
  label="Entry"
  value={room.entryType || room.entry || "Free match"}
/>

<Detail
  label="Stream"
  value={room.platform || room.streamPlatform || "None"}
/>
            </div>

           <button
  type="button"
  onClick={handleJoinRoom}
>
  Join Room
</button>
{room.id === "college-football-27-dynasty" &&
  user?.uid === room.hostUid && (
    <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
      <h3 className="text-lg font-black">
        Commissioner Controls
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        Manage the College Football 27 Dynasty.
      </p>

      <div className="mt-4 grid gap-3">
        <button
          type="button"
          onClick={() => handleDynastyStatus("live")}
          disabled={currentRoomStatus === "live"}
          className="w-full rounded-xl bg-green-600 px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {currentRoomStatus === "live"
            ? "Dynasty Is Live"
            : "Start Dynasty"}
        </button>

        <button
          type="button"
          onClick={() => handleDynastyStatus("open")}
          disabled={currentRoomStatus === "open"}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {currentRoomStatus === "open"
            ? "Lobby Is Open"
            : "Reopen Lobby"}
        </button>

        <button
          type="button"
          onClick={() => handleDynastyStatus("ended")}
          disabled={currentRoomStatus === "ended"}
          className="w-full rounded-xl bg-red-600 px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {currentRoomStatus === "ended"
            ? "Dynasty Ended"
            : "End Dynasty"}
        </button>
      </div>
    </div>
  )}
  <button
  type="button"
  onClick={handleJoinRoom}
  disabled={
    joining ||
    (!members.some((member) => member.uid === user?.uid) &&
      members.length >= room.maxPlayers)
  }
  className="mt-6 w-full rounded-xl bg-red-600 px-5 py-4 font-black text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
>
  {joining
    ? members.some((member) => member.uid === user?.uid)
      ? "Leaving..."
      : "Joining..."
    : members.some((member) => member.uid === user?.uid)
      ? "Leave Room"
      : members.length >= room.maxPlayers
        ? "Room Full"
        : "Join Room"}
</button>
<p className="mt-3 text-center text-sm text-slate-400">
  {members.length}/{room.maxPlayers} players joined
</p>
{room.id === "college-football-27-dynasty" && (
  <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
    <div className="mb-6">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-red-400">
        College Football 27
      </p>

      <h2 className="mt-1 text-2xl font-black text-white">
        Dynasty Headquarters
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        Season 1 • Week 1
      </p>
    </div>

    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white">
      {currentRoomStatus === "ended"
        ? "Dynasty Ended"
        : currentRoomStatus === "live"
          ? "Dynasty Live"
          : "Dynasty Open"}
    </div>
  </div>

  <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
    <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
      <p className="text-xs font-bold uppercase text-slate-400">
        Players
      </p>
      <p className="mt-1 text-2xl font-black text-white">
        {members.length}/{room.maxPlayers}
      </p>
    </div>

    <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
      <p className="text-xs font-bold uppercase text-slate-400">
        Season
      </p>
      <p className="mt-1 text-2xl font-black text-white">
        1
      </p>
    </div>

    <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
      <p className="text-xs font-bold uppercase text-slate-400">
        Week
      </p>
      <p className="mt-1 text-2xl font-black text-white">
        1
      </p>
    </div>

    <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
      <p className="text-xs font-bold uppercase text-slate-400">
        Teams Claimed
      </p>
      <p className="mt-1 text-2xl font-black text-white">
        {members.filter((member) => member.team).length}
      </p>
    </div>
  </div>

  <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
    <button
      type="button"
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-black text-white"
    >
      🏆 Standings
    </button>

    <button
      type="button"
      onClick={() => setDynastyTab("standings")}
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-black text-white"
    >
      📅 Schedule
    </button>

    <button
      type="button"
      onClick={() => setDynastyTab("schedule")}
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-black text-white"
    >
      🎮 Results
    </button>

    <button
      type="button"
      onClick={() => setDynastyTab("playoffs")}
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-black text-white"
    >
      🏆 Playoffs
    </button>

  </div>
  <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 p-4">
  {dynastyTab === "standings" && (
  <div>
    <div className="flex items-center justify-between">
      <h3 className="font-black text-white">
        🏆 Dynasty Standings
      </h3>

      <span className="text-xs font-bold text-slate-400">
        Season 1
      </span>
    </div>

    <div className="mt-4 space-y-2">
      {members.filter((member) => member.team).length === 0 ? (
        <p className="text-sm text-slate-400">
          No dynasty teams have been claimed yet.
        </p>
      ) : (
        members
          .filter((member) => member.team)
          .map((member, index) => (
            <div
              key={member.uid}
              className="grid grid-cols-[40px_1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div className="text-center text-sm font-black text-slate-400">
                #{index + 1}
              </div>

              <div>
                <p className="font-black text-white">
                  {member.team}
                </p>

                <p className="text-xs text-slate-400">
                  {member.displayName || "Player"}
                </p>
              </div>

             <div className="text-right">
  <p className="font-black text-white">
    {member.wins ?? 0}-{member.losses ?? 0}
  </p>

  <p className="text-xs text-slate-400">
    Record
  </p>

  <div className="mt-2 flex justify-end gap-3 text-xs">
    <span className="text-slate-300">
      PF {member.pointsFor ?? 0}
    </span>

    <span className="text-slate-300">
      PA {member.pointsAgainst ?? 0}
    </span>

    <span
      className={
        (member.pointsFor ?? 0) - (member.pointsAgainst ?? 0) > 0
          ? "font-bold text-green-400"
          : (member.pointsFor ?? 0) - (member.pointsAgainst ?? 0) < 0
            ? "font-bold text-red-400"
            : "font-bold text-slate-400"
      }
    >
      DIFF{" "}
      {(member.pointsFor ?? 0) - (member.pointsAgainst ?? 0) > 0 ? "+" : ""}
      {(member.pointsFor ?? 0) - (member.pointsAgainst ?? 0)}
    </span>
  </div>
</div>
            </div>
          ))
      )}
    </div>
  </div>
)}

  {dynastyTab === "schedule" && (
  <div>
    <div className="flex items-center justify-between">
      <h3 className="font-black text-white">
        📅 Week 1 Schedule
      </h3>

      <span className="text-xs font-bold text-slate-400">
        Season 1
      </span>
    </div>

    <div className="mt-4 space-y-3">
      {members.filter((member) => member.team).length < 2 ? (
        <p className="text-sm text-slate-400">
          At least 2 dynasty teams must be claimed before matchups can be created.
        </p>
      ) : (
        members
          .filter((member) => member.team)
          .reduce<Array<[typeof members[number], typeof members[number] | null]>>(
            (matchups, member, index, teams) => {
              if (index % 2 === 0) {
                matchups.push([member, teams[index + 1] ?? null])
              }

              return matchups
            },
            []
          )
          .map(([homeTeam, awayTeam], index) => (
            <div
              key={`${homeTeam.uid}-${awayTeam?.uid ?? "bye"}`}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-red-400">
                  Game {index + 1}
                </span>

                <span className="text-xs font-bold text-slate-400">
                  Week 1
                </span>
              </div>

              <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div>
                  <p className="font-black text-white">
                    {homeTeam.team}
                  </p>
                  <p className="text-xs text-slate-400">
                    {homeTeam.displayName || "Player"}
                  </p>
                </div>

                <div className="text-sm font-black text-red-400">
                  VS
                </div>

                <div className="text-right">
                  {awayTeam ? (
                    <>
                      <p className="font-black text-white">
                        {awayTeam.team}
                      </p>
                      <p className="text-xs text-slate-400">
                        {awayTeam.displayName || "Player"}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-black text-white">
                        BYE
                      </p>
                      <p className="text-xs text-slate-400">
                        No opponent
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
      )}
    </div>
  </div>
)}

 {dynastyTab === "results" && (
  <div>
    <div className="flex items-center justify-between">
      <h3 className="font-black text-white">
        🎮 Week 1 Results
      </h3>

      <span className="text-xs font-bold text-slate-400">
        Season 1
      </span>
    </div>

    <div className="mt-4 space-y-3">
      {members.filter((member) => member.team).length < 2 ? (
        <p className="text-sm text-slate-400">
          At least 2 dynasty teams must be claimed before scores can be entered.
        </p>
      ) : (
        members
          .filter((member) => member.team)
          .reduce<Array<[typeof members[number], typeof members[number] | null]>>(
            (matchups, member, index, teams) => {
              if (index % 2 === 0) {
                matchups.push([member, teams[index + 1] ?? null])
              }
              return matchups
            },
            []
          )
          .map(([homeTeam, awayTeam], index) => {
            const gameId = `${homeTeam.uid}-${awayTeam?.uid ?? "bye"}`
            const savedResult = awayTeam
  ? recentResults.find(
      (result) =>
        (result.winnerUid === homeTeam.uid &&
          result.loserUid === awayTeam.uid) ||
        (result.winnerUid === awayTeam.uid &&
          result.loserUid === homeTeam.uid)
    )
  : undefined

            if (!awayTeam) {
              return (
                <div
                  key={gameId}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="font-black text-white">
                    {homeTeam.team}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Week 1 BYE
                  </p>
                </div>
              )
            }

            return (
              <div
                key={gameId}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-red-400">
                    Game {index + 1}
                  </span>

                  {savedResult?.status === "approved" && (
                    <span className="text-xs font-black text-green-400">
                      FINAL
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div>
                    <p className="font-black text-white">
                      {homeTeam.team}
                    </p>

                    <input
                      type="number"
                      min="0"
                      value={dynastyScores[gameId]?.homeScore ?? ""}
                      disabled={savedResult?.status === "approved"}
                      onChange={(event) =>
                        setDynastyScores((current) => ({
                          ...current,
                          [gameId]: {
                            homeScore: event.target.value,
                            awayScore: current[gameId]?.awayScore ?? "",
                            submitted: false,
                          },
                        }))
                      }
                      className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-center font-black text-white"
                      placeholder="0"
                    />
                  </div>

                  <div className="font-black text-red-400">-</div>

                  <div>
                    <p className="text-right font-black text-white">
                      {awayTeam.team}
                    </p>

                    <input
                      type="number"
                      min="0"
                      value={dynastyScores[gameId]?.awayScore ?? ""}
                      disabled={savedResult?.status === "approved"}
                      onChange={(event) =>
                        setDynastyScores((current) => ({
                          ...current,
                          [gameId]: {
                            homeScore: current[gameId]?.homeScore ?? "",
                            awayScore: event.target.value,
                            submitted: false,
                          },
                        }))
                      }
                      className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-center font-black text-white"
                      placeholder="0"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={
                    savedResult?.status === "approved" ||
                    !dynastyScores[gameId]?.homeScore ||
                    !dynastyScores[gameId]?.awayScore ||
                    Number(dynastyScores[gameId]?.homeScore) === Number(dynastyScores[gameId]?.awayScore)
                  }
                  onClick={async () => {
  if (typeof roomId !== "string") return
  if (!dynastyScores[gameId]?.homeScore || !dynastyScores[gameId]?.awayScore) return

  const homeScore = Number(dynastyScores[gameId]?.homeScore)
  const awayScore = Number(dynastyScores[gameId]?.awayScore)

  if (homeScore === awayScore) {
    setNotice("Dynasty games cannot end in a tie.")
    return
  }

  const winnerUid =
    homeScore > awayScore
      ? homeTeam.uid
      : awayTeam.uid

  const loserUid =
    homeScore > awayScore
      ? awayTeam.uid
      : homeTeam.uid
const winnerScore =
  homeScore > awayScore ? homeScore : awayScore

const loserScore =
  homeScore > awayScore ? awayScore : homeScore
  try {
    await reportArenaGameResult(
      roomId,
      winnerUid,
      loserUid,
      winnerScore,
      loserScore,
      gameId
    )

    setDynastyScores((current) => ({
      ...current,
      [gameId]: {
        ...current[gameId],
        submitted: true,
      },
    }))

    setNotice(
      `${homeTeam.team} ${homeScore} - ${awayScore} ${awayTeam.team} saved as final.`
    )
  } catch (error: any) {
    setNotice(
      error.message || "Could not save the final score."
    )
  }
}}
                  className="mt-4 w-full rounded-xl bg-green-500 px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {dynastyScores[gameId]?.submitted ? "Final Score Saved" : "Submit Final Score"}
                </button>
              </div>
            )
          })
      )}
    </div>
  </div>
)}

  {dynastyTab === "playoffs" && (
    <div>
      <h3 className="font-black text-white">
        🏆 Dynasty Playoffs
      </h3>
      <p className="mt-2 text-sm text-slate-400">
        Playoff bracket and national championship will appear here.
      </p>
    </div>
  )}
</div>
</div>
    <h3 className="text-lg font-black">
      🏈 Choose Your Dynasty Team
    </h3>

    <p className="mt-1 text-sm text-slate-400">
      Claim one team for the College Football 27 Dynasty.
    </p>

    {!members.some((member) => member.uid === user?.uid) ? (
      <p className="mt-4 rounded-xl bg-white/5 p-3 text-sm text-slate-300">
        Join the room before selecting a team.
      </p>
    ) : (
      <>
        <select
          value={selectedTeam}
          onChange={(event) => setSelectedTeam(event.target.value)}
          className="mt-4 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
        >
          <option value="">Select a team...</option>

          {dynastyTeams.map((team) => {
  const claimedBy = members.find(
    (member) => member.team === team
  )

  const isMine = claimedBy?.uid === user?.uid
  const isClaimedByOther = Boolean(claimedBy && !isMine)

  return (
    <option
      key={team}
      value={team}
      disabled={isClaimedByOther}
    >
      {isMine
        ? `${team} — YOUR TEAM`
        : isClaimedByOther
        ? `${team} — CLAIMED by ${claimedBy?.displayName || "Player"}`
        : `${team} — Available`}
    </option>
  )
})}
        </select>

        <button
  type="button"
  onClick={handleSelectTeam}
  disabled={
    savingTeam ||
    !selectedTeam ||
    members.some(
      (member) =>
        member.uid === user?.uid &&
        member.team === selectedTeam
    )
  }
  className="mt-3 w-full rounded-xl bg-green-500 px-4 py-3 font-black text-white transition hover:bg-green-400 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
>
  {savingTeam
  ? "Claiming..."
  : members.some(
      (member) =>
        member.uid === user?.uid &&
        member.team === selectedTeam
    )
  ? "Your Team"
  : members.some(
      (member) =>
        member.uid !== user?.uid &&
        member.team === selectedTeam
    )
  ? "Team Already Claimed"
  : "Claim Team"}
</button>
{members.some((member) => member.uid === user?.uid) && (
  <button
    type="button"
    onClick={handleToggleReady}
    className={`mt-3 w-full rounded-xl px-4 py-3 font-black text-white transition ${
      members.find((member) => member.uid === user?.uid)?.ready
        ? "bg-green-600"
        : "bg-slate-700"
    }`}
  >
    {members.find((member) => member.uid === user?.uid)?.ready
      ? "✅ READY"
      : "NOT READY"}
  </button>
)}
        {members.find((member) => member.uid === user?.uid)?.team && (
          <p className="mt-3 text-center text-sm font-bold text-green-400">
            Your team:{" "}
            {
              members.find(
                (member) => member.uid === user?.uid
              )?.team
            }
          </p>
        )}
      </>
    )}
  </div>
)}
          </section>
    
 
 {/* DYNASTY ROSTER */}
      {room.id === "college-football-27-dynasty" && (
        <section className="mt-6 rounded-3xl border border-white/10 bg-[#07111e] p-6">
 
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">
                🏆 Dynasty Roster
              </h2>
<div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xl font-black">🏆 Dynasty Standings</h3>
      <p className="text-sm text-slate-400">
        Track every claimed team in the College Football 27 Dynasty.
      </p>
    </div>
    <span className="text-sm font-bold text-slate-300">
      {members.filter((member) => member.team).length} teams
    </span>
  </div>

  <div className="mt-4 space-y-3">
    {members.filter((member) => member.team).length === 0 ? (
      <p className="text-sm text-slate-400">
        No teams have been claimed yet.
      </p>
    ) : (
      dynastyStandings
        .filter((member) => member.team)
        .map((member, index) => (
          <div
            key={member.uid}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="font-black text-slate-400">
                #{index + 1}
              </span>

              <div>
                <p className="font-black text-white">
                  {member.team}
                </p>
                <div className="flex items-center gap-2">
  <p className="text-sm text-slate-400">
    {member.displayName}
  </p>

  <span
    className={`text-xs font-black ${
      member.ready ? "text-green-400" : "text-slate-500"
    }`}
  >
    {member.ready ? "✅ READY" : "NOT READY"}
  </span>
</div>
              </div>
            </div>

            <div className="text-right">
  <p className="font-black text-white">
    {member.wins}-{member.losses}
  </p>

  <p className="text-xs text-slate-400">
    {member.gamesPlayed} GP • {(member.winPct * 100).toFixed(0)}%
  </p>
</div>
          </div>
        ))
    )}
  </div>
</div>
              <p className="mt-1 text-sm text-slate-400">
                Players, states, and claimed teams.
              </p>
            </div>

            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">
              {members.length}/{room.maxPlayers}
            </span>
          </div>
{members.length > 0 && (
  <div className="mb-4 rounded-2xl border border-white/10 bg-black/30 p-4">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-slate-400">
          Ready Check
        </p>

        <p className="font-black text-white">
          {readyCount}/{members.length} players ready
        </p>
      </div>

      <div
        className={`rounded-full px-4 py-2 text-sm font-black ${
          allPlayersReady
            ? "bg-green-600 text-white"
            : "bg-slate-700 text-slate-200"
        }`}
      >
        {allPlayersReady ? "✅ MATCH READY" : "WAITING"}
      </div>
    </div>
  </div>
)}
{room.status === "live" && (
  <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-950/30 p-5">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-red-400">
          🔴 LIVE MATCH
        </p>

        <h3 className="mt-1 text-xl font-black text-white">
          {room.title}
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Match is currently in progress
        </p>
        <div className="mt-5 grid grid-cols-2 gap-4">
  <div className="rounded-xl bg-black/30 p-4 text-center">
    <p className="text-sm font-bold text-slate-300">
      {members[0]?.team || "Team 1"}
    </p>

    <p className="my-3 text-4xl font-black text-white">
      {teamOneScore}
    </p>

    <div className="flex justify-center gap-2">
      <button
        type="button"
        onClick={() =>
          setTeamOneScore((score) => Math.max(0, score - 1))
        }
        className="rounded-lg bg-slate-700 px-4 py-2 font-black text-white"
      >
        −
      </button>

      <button
        type="button"
        onClick={() =>
          setTeamOneScore((score) => score + 1)
        }
        className="rounded-lg bg-green-600 px-4 py-2 font-black text-white"
      >
        +
      </button>
    </div>
  </div>

  <div className="rounded-xl bg-black/30 p-4 text-center">
    <p className="text-sm font-bold text-slate-300">
      {members[1]?.team || "Team 2"}
    </p>

    <p className="my-3 text-4xl font-black text-white">
      {teamTwoScore}
    </p>

    <div className="flex justify-center gap-2">
      <button
        type="button"
        onClick={() =>
          setTeamTwoScore((score) => Math.max(0, score - 1))
        }
        className="rounded-lg bg-slate-700 px-4 py-2 font-black text-white"
      >
        −
      </button>

      <button
        type="button"
        onClick={() =>
          setTeamTwoScore((score) => score + 1)
        }
        className="rounded-lg bg-green-600 px-4 py-2 font-black text-white"
      >
        +
      </button>
    </div>
  </div>
</div>
      </div>

      <span className="rounded-full bg-red-600 px-4 py-2 text-sm font-black text-white">
        LIVE
      </span>
    </div>
  </div>
)}
{members.length > 1 && (
  <button
    type="button"
    disabled={!allPlayersReady}
    onClick={handleStartMatch}
    className={`mb-5 w-full rounded-xl px-4 py-3 font-black text-white transition ${
      allPlayersReady
        ? "bg-green-600 hover:bg-green-500"
        : "cursor-not-allowed bg-slate-700 opacity-50"
    }`}
  >
    {allPlayersReady ? "START MATCH" : "WAITING FOR PLAYERS"}
  </button>
)}
          <div className="mt-5 space-y-3">
            {members.length === 0 ? (
              <p className="rounded-xl bg-white/5 p-4 text-center text-sm text-slate-400">
                No players have joined yet.
              </p>
            ) : (
           members.map((member, index) => (
  <div
    key={member.uid}
    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-4"
  >
    <div className="flex min-w-0 items-center gap-3">
      {member.photoURL ? (
        <img
          src={member.photoURL}
          alt={member.displayName}
          className="h-12 w-12 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600 font-black">
          {member.displayName?.charAt(0).toUpperCase() || index + 1}
        </div>
      )}

      <div className="min-w-0">
        <p className="truncate font-black">
          {member.displayName || "MHSSF Athlete"}
        </p>

        <p className="text-sm text-slate-400">
          {member.state || "State not set"}
        </p>

        <p className="mt-1 text-xs font-bold text-green-400">
          ● Joined
        </p>
      </div>
    </div>

    <div className="flex flex-col items-end gap-2">
      <div className="text-right">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Dynasty Team
        </p>

        <p className="font-black text-green-400">
          {member.team || "Unclaimed"}
        </p>
      </div>

      <Link
        href={`/athletes/${member.uid}`}
        className="rounded-lg bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/20"
      >
        View Profile
      </Link>
    </div>
  </div>
))  
            )}
            </div>
            </section>
      )}
      {/* DYNASTY SEASON DASHBOARD */}
{room.id === "college-football-27-dynasty" && (
  <section className="mt-6 rounded-3xl border border-white/10 bg-[#07111e] p-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
          College Football 27 Dynasty
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          🏟️ Dynasty Season Dashboard
        </h2>
<p className="mt-2 text-sm font-black uppercase tracking-wider text-green-400">
  Season {currentDynastySeason}
</p>
        <p className="mt-1 text-sm text-slate-400">
          Live season status, defending champion, standings and title race.
        </p>
      </div>

      <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-200">
        {currentRoomStatus === "live"
          ? "🟢 Season Live"
          : currentRoomStatus === "ended"
          ? "🏁 Season Complete"
          : "🟡 Lobby Open"}
      </span>
    </div>

    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Players
        </p>
        <p className="mt-2 text-2xl font-black text-white">
          {dynastyStandings.length}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Defending Champion
        </p>
        <p className="mt-2 font-black text-white">
          {reigningDynastyChampion?.displayName ||
            reigningDynastyChampion?.uid ||
            "TBD"}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Current #1
        </p>
        <p className="mt-2 font-black text-white">
          {dynastyPowerRankings[0]?.displayName ||
            dynastyPowerRankings[0]?.uid ||
            "TBD"}
        </p>
      </div>

      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4">
  <p className="text-xs font-bold uppercase tracking-wider text-orange-400">
    🥊 Title Challenger
  </p>

  <p className="mt-2 font-black text-white">
    {dynastyTitleChallenger?.displayName ||
      dynastyTitleChallenger?.uid ||
      "TBD"}
      {dynastyTitleChallenger && (
  <p className="mt-1 text-xs font-bold text-slate-400">
    {dynastyTitleChallenger.wins}-{dynastyTitleChallenger.losses}
    {" • "}
    {(dynastyTitleChallenger.winPct * 100).toFixed(0)}% Win Rate
  </p>
)}
  </p>

  <p className="mt-1 text-xs text-slate-400">
    Next in line for the Dynasty Championship
  </p>
</div>
<div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4">
  <p className="text-xs font-bold uppercase tracking-wider text-orange-400">
    🔥 Top Win Streak
  </p>

  <p className="mt-2 font-black text-white">
    {topWinStreak?.displayName || topWinStreak?.uid || "TBD"}
  </p>

  <p className="mt-1 text-xs font-bold text-slate-400">
    {topWinStreak?.streak || "No active streak"}
  </p>
</div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Champion Run
        </p>
        <p className="mt-2 text-2xl font-black text-white">
          {reigningChampionRun}
        </p>
        <p className="text-xs font-bold text-slate-400">
          Straight Titles
        </p>
      </div>
    </div>
    <div className="col-span-full rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div>
      <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
        🏆 Championship Race
      </p>

      <h3 className="mt-2 text-xl font-black text-white">
        Season {currentDynastySeason} Title Picture
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        Current champion versus the leading Dynasty challenger.
      </p>
    </div>

    <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-black text-yellow-300">
      LIVE RACE
    </span>
  </div>

  <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
    <div className="rounded-2xl border border-yellow-500/20 bg-black/20 p-4 text-center">
      <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">
        👑 Defending Champion
      </p>

      <p className="mt-2 text-lg font-black text-white">
        {reigningDynastyChampion?.displayName ||
          reigningDynastyChampion?.uid ||
          "TBD"}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {reigningChampionRun > 0
          ? `${reigningChampionRun} straight title${
              reigningChampionRun === 1 ? "" : "s"
            }`
          : "Waiting for first champion"}
      </p>
    </div>

    <div className="text-center text-2xl font-black text-slate-500">
      VS
    </div>

    <div className="rounded-2xl border border-orange-500/20 bg-black/20 p-4 text-center">
      <p className="text-xs font-bold uppercase tracking-wider text-orange-400">
        🥊 Title Challenger
      </p>

      <p className="mt-2 text-lg font-black text-white">
        {dynastyTitleChallenger?.displayName ||
          dynastyTitleChallenger?.uid ||
          "TBD"}
      </p>

      {dynastyTitleChallenger && (
        <p className="mt-1 text-xs text-slate-400">
          {dynastyTitleChallenger.wins}-{dynastyTitleChallenger.losses}
          {" • "}
          {(dynastyTitleChallenger.winPct * 100).toFixed(0)}% Win Rate
        </p>
      )}
    </div>
  </div>
</div>
  </section>
)}
      {/* DYNASTY POWER RANKINGS */}
{room.id === "college-football-27-dynasty" &&
  dynastyPowerRankings.length > 0 && (
    <section className="mt-6 rounded-3xl border border-white/10 bg-[#0b1220] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            ⚡ Dynasty Power Rankings
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Current Top Players
          </h2>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-300">
          Live Rankings
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {dynastyPowerRankings.slice(0, 5).map((player, index) => (
          <div
            key={player.uid}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 font-black text-white">
                {player.rank === 1 ? "👑" : `#${player.rank}`}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-black text-white">
                    {player.displayName || player.uid}
                  </p>
{player.isHot && (
  <span className="rounded-full bg-orange-500/10 px-2 py-1 text-[10px] font-black uppercase text-orange-300">
    🔥 Hot
  </span>
)}
{player.rankChange > 0 && (
  <span className="rounded-full bg-green-500/10 px-2 py-1 text-[10px] font-black uppercase text-green-300">
    ▲ {player.rankChange}
  </span>
)}

{player.rankChange < 0 && (
  <span className="rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-black uppercase text-red-300">
    ▼ {Math.abs(player.rankChange)}
  </span>
)}

{player.rankChange === 0 && (
  <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-black uppercase text-slate-400">
    — Same
  </span>
)}
                  {reigningDynastyChampion?.uid === player.uid && (
                    <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-[10px] font-black uppercase text-yellow-300">
                      🏆 Champion
                    </span>
                  )}

                  {dynastyTitleChallenger?.uid === player.uid && (
                    <span className="rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-black uppercase text-red-300">
                      🎯 Challenger
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs font-bold text-slate-400">
                  {player.wins}-{player.losses} ·{" "}
                  {(player.winPct * 100).toFixed(0)}% Win Rate
                </p>

                {player.streak && (
                  <p className="mt-1 text-xs font-bold text-orange-300">
                    🔥 {player.streak}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="text-xl font-black text-white">
                {Math.round(player.powerScore)}
              </p>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Power Score
              </p>

              {player.championships > 0 && (
                <p className="mt-1 text-xs font-black text-yellow-300">
                  🏆 {player.championships}{" "}
                  {player.championships === 1 ? "Title" : "Titles"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )}
      {/* RECENT DYNASTY RESULTS */}
{room.id === "college-football-27-dynasty" && (
  <section className="mt-6 rounded-3xl border border-white/10 bg-[#07111e] p-5">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-black">
          🏈 Recent Dynasty Results
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Latest completed games from the College Football 27 Dynasty.
        </p>
      </div>

      <span className="text-sm font-bold text-slate-300">
        {results.length} games
      </span>
    </div>

    <div className="mt-4 space-y-3">
      {results.length === 0 ? (
        <div className="rounded-2xl bg-black/30 p-4 text-sm text-slate-400">
          No games have been reported yet.
        </div>
      ) : (
        results.slice(0, 10).map((result) => (
          <div
            key={result.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4"
          >
            <div>
              <p className="font-black text-green-400">
                🏆 {result.winnerTeam}
              </p>

              <p className="text-sm text-slate-300">
                {result.winnerName}
              </p>
            </div>

            <div className="px-4 text-center">
              <p className="text-xs font-black text-slate-500">
                DEFEATED
              </p>
            </div>

            <div className="text-right">
              <p className="font-black text-red-400">
                {result.loserTeam}
              </p>

              <p className="text-sm text-slate-300">
                {result.loserName}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  </section>
)}
      
      {/* LIVE CHAT — your existing code stays below */}
{/* PLAYER CHALLENGE */}
<section className="mt-6 rounded-3xl border border-red-500/20 bg-[#07111e] p-5">
  <div className="flex items-center justify-between gap-4">
    <div>
      <h2 className="text-xl font-black">⚔️ Challenge Player</h2>
      <p className="mt-1 text-sm text-slate-400">
        Challenge another player in the {stateName} Arena.
      </p>
    </div>

    <button
      type="button"
      onClick={() => setChallengeOpen((current) => !current)}
      className="rounded-xl bg-red-600 px-5 py-3 font-black text-white hover:bg-red-500"
    >
      {challengeOpen ? "Close" : "Find Opponent"}
    </button>
  </div>

  {challengeOpen && (
    <div className="mt-5">
      <label className="text-sm font-bold text-slate-300">
        Choose an opponent
      </label>

      <select
        value={opponentUid}
        onChange={(event) => setOpponentUid(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
      >
        <option value="">Select player...</option>

        {members
          .filter((member) => member.uid !== user?.uid)
          .map((member) => (
            <option key={member.uid} value={member.uid}>
              {member.displayName || member.uid}
            </option>
          ))}
      </select>

      <button
        type="button"
        disabled={!opponentUid}
        onClick={async () => {
  if (!user || !room || !opponentUid) return

  const opponent = members.find(
    (member) => member.uid === opponentUid
  )

  if (!opponent) return

  try {
    setChallengeNotice("")

    await sendArenaChallenge({
      roomId: roomIdValue,
      challengerUid: user.uid,
      challengerName:
        profile?.displayName || user.displayName || "Arena Player",
      opponentUid,
      opponentName:
        opponent.displayName || "Arena Player",
      state: stateName,
      game: room.game,
    })

    setChallengeNotice(
      `Challenge sent to ${opponent.displayName || "player"}!`
    )

    setOpponentUid("")
  } catch (error) {
    console.error(error)

    setChallengeNotice(
      error instanceof Error
        ? error.message
        : "Could not send challenge."
    )
  }
}}
        className="mt-3 w-full rounded-xl bg-red-600 px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Send Challenge ⚔️
      </button>

      {challengeNotice && (
        <p className="mt-3 text-sm font-bold text-green-400">
          {challengeNotice}
        </p>
      )}
    </div>
  )}
</section>
{/* INCOMING CHALLENGES */}
{incomingChallenges.length > 0 && (
  <section className="mt-6 rounded-3xl border border-yellow-400/30 bg-[#07111e] p-5">
    <h2 className="text-xl font-black">
      🔔 Incoming Challenges
    </h2>

    <div className="mt-4 space-y-3">
      {incomingChallenges.map((challenge) => (
        <div
          key={challenge.id}
          className="rounded-2xl border border-white/10 bg-black/30 p-4"
        >
          <p className="font-black text-white">
            {challenge.challengerName} challenged you
          </p>

          <p className="mt-1 text-sm text-slate-400">
            {challenge.game} • {challenge.state}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={async () => {
                try {
                  await respondToArenaChallenge(
                    roomIdValue,
                    challenge.id,
                    "accepted"
                  )

                  setChallengeNotice(
                    `Challenge accepted against ${challenge.challengerName}!`
                  )
                } catch (error) {
                  console.error(error)
                  setChallengeNotice("Could not accept challenge.")
                }
              }}
              className="rounded-xl bg-green-600 px-4 py-3 font-black text-white hover:bg-green-500"
            >
              Accept
            </button>
<button
  type="button"
  onClick={async () => {
    try {
      await respondToArenaChallenge(
        roomIdValue,
        challenge.id,
        "declined"
      )

      setChallengeNotice("Challenge declined.")
    } catch (error) {
      console.error(error)
      setChallengeNotice("Could not decline challenge.")
    }
  }}
  className="rounded-xl bg-red-600 px-4 py-3 font-black text-white hover:bg-red-500"
>
  Decline
</button>
          </div>
        </div>
      ))}
    </div>
  </section>
)}
{/* ACCEPTED MATCHUPS */}
{acceptedChallenges.length > 0 && (
  <section className="mt-6 rounded-3xl border border-green-500/30 bg-[#07111e] p-5">
    <h2 className="text-xl font-black">✅ Accepted Matchup</h2>

    <div className="mt-4 space-y-3">
      {acceptedChallenges.map((challenge) => (
        <div
          key={challenge.id}
          className="rounded-2xl border border-white/10 bg-black/30 p-4"
        >
          <p className="text-sm font-bold uppercase tracking-wide text-green-400">
            Match Ready
          </p>

          <div className="mt-3 flex items-center justify-between gap-4">
            <div className="text-center">
              <p className="font-black text-white">
                {challenge.challengerName}
              </p>
              <p className="text-xs text-slate-400">Challenger</p>
            </div>

            <div className="text-xl font-black text-red-400">
              VS
            </div>

            <div className="text-center">
              <p className="font-black text-white">
                {challenge.opponentName}
              </p>
              <p className="text-xs text-slate-400">Opponent</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/60 p-3">
            <p className="text-sm text-slate-300">
              {challenge.game} • {challenge.state}
            </p>
          </div>

          <button
            type="button"
            onClick={async () => {
  try {
    await updateArenaChallengeStatus(
      roomIdValue,
      challenge.id,
      "live"
    )

    setChallengeNotice(
      `🎮 ${challenge.challengerName} vs ${challenge.opponentName} is LIVE!`
    )
  } catch (error) {
    console.error(error)
    setChallengeNotice("Could not start match.")
  }
}}
            className="mt-4 w-full rounded-xl bg-green-600 px-4 py-3 font-black text-white hover:bg-green-500"
          >
            Start Match 🎮
          </button>
        </div>
      ))}
    </div>
  </section>
  )}
  {/* LIVE MATCHES */}
{liveChallenges.length > 0 && (
  <section className="mt-6 rounded-3xl border border-red-500/40 bg-[#07111e] p-5">
    <h2 className="text-xl font-black text-red-400">
      🔴 Live Match
    </h2>

    <div className="mt-4 space-y-3">
      {liveChallenges.map((challenge) => (
        <div
          key={challenge.id}
          className="rounded-2xl border border-red-500/20 bg-black/30 p-4"
        >
          <p className="text-sm font-black uppercase tracking-wide text-red-400">
            LIVE • MATCH IN PROGRESS
          </p>

          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="font-black text-white">
              {challenge.challengerName}
            </p>

            <span className="text-xl font-black text-red-500">
              VS
            </span>

            <p className="font-black text-white">
              {challenge.opponentName}
            </p>
          </div>

          <p className="mt-3 text-center text-sm text-slate-400">
            {challenge.game} • {challenge.state}
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
  <button
    type="button"
    onClick={async () => {
      try {
        setWinnerUid(challenge.challengerUid)
        setLoserUid(challenge.opponentUid)

        await updateArenaChallengeStatus(
          roomIdValue,
          challenge.id,
          "completed"
        )

        setChallengeNotice(
          `🏆 ${challenge.challengerName} selected as winner. Submit the result below.`
        )
      } catch (error) {
        console.error(error)
        setChallengeNotice("Could not complete match.")
      }
    }}
    className="w-full rounded-xl bg-green-600 px-4 py-3 font-black text-white hover:bg-green-500"
  >
    🏆 {challenge.challengerName} Won
  </button>

  <button
    type="button"
    onClick={async () => {
      try {
        setWinnerUid(challenge.opponentUid)
        setLoserUid(challenge.challengerUid)

        await updateArenaChallengeStatus(
          roomIdValue,
          challenge.id,
          "completed"
        )

        setChallengeNotice(
          `🏆 ${challenge.opponentName} selected as winner. Submit the result below.`
        )
      } catch (error) {
        console.error(error)
        setChallengeNotice("Could not complete match.")
      }
    }}
    className="w-full rounded-xl bg-blue-600 px-4 py-3 font-black text-white hover:bg-blue-500"
  >
    🏆 {challenge.opponentName} Won
  </button>
</div>
        </div>
      ))}
    </div>
  </section>
)}
{/* COMPLETED MATCHES */}
{completedChallenges.length > 0 && (
  <section className="mt-6 rounded-3xl border border-white/10 bg-[#07111e] p-5">
    <h2 className="text-xl font-black">
      🏁 Recent Matches
    </h2>

    <div className="mt-4 space-y-3">
      {completedChallenges.slice(0, 5).map((challenge) => (
        <div
          key={challenge.id}
          className="rounded-2xl border border-white/10 bg-black/30 p-4"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="font-black text-white">
              {challenge.challengerName}
            </p>

            <span className="text-sm font-black text-slate-400">
              VS
            </span>

            <p className="font-black text-white">
              {challenge.opponentName}
            </p>
          </div>

          <p className="mt-2 text-center text-xs font-bold uppercase tracking-wide text-green-400">
            Completed
          </p>

          <p className="mt-1 text-center text-sm text-slate-400">
            {challenge.game} • {challenge.state}
          </p>
        </div>
      ))}
    </div>
  </section>
)}
{/* COMPLETED MATCHES */}
{completedChallenges.length > 0 && (
  <section className="mt-6 rounded-3xl border border-white/10 bg-[#07111e] p-5">
    <h2 className="text-xl font-black">
      🏁 Recent Matches
    </h2>

    <div className="mt-4 space-y-3">
      {completedChallenges.slice(0, 5).map((challenge) => (
        <div
          key={challenge.id}
          className="rounded-2xl border border-white/10 bg-black/30 p-4"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="font-black text-white">
              {challenge.challengerName}
            </p>

            <span className="text-sm font-black text-slate-400">
              VS
            </span>

            <p className="font-black text-white">
              {challenge.opponentName}
            </p>
          </div>

          <p className="mt-2 text-center text-xs font-bold uppercase tracking-wide text-green-400">
            Completed
          </p>

          <p className="mt-1 text-center text-sm text-slate-400">
            {challenge.game} • {challenge.state}
          </p>
        </div>
      ))}
    </div>
  </section>
)}
    {room.id === "college-football-27-dynasty" &&
  liveChallenges.length === 0 &&
  acceptedChallenges.length === 0 && (
  <section className="mt-6 rounded-3xl border border-white/10 bg-[#07111e] p-5">
    <h2 className="text-xl font-black">🏈 Report Game Result</h2>

    <p className="mt-1 text-sm text-slate-400">
      Select the winner and loser. Dynasty records will update automatically.
    </p>

    <div className="mt-4 grid gap-3 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-300">
          Winner
        </label>

        <select
          value={winnerUid}
          onChange={(e) => setWinnerUid(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white"
        >
          <option value="">Select winner</option>

          {members
            .filter((member) => member.team)
            .map((member) => (
              <option key={member.uid} value={member.uid}>
                {member.team} — {member.displayName}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-slate-300">
          Loser
        </label>

        <select
          value={loserUid}
          onChange={(e) => setLoserUid(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white"
        >
          <option value="">Select loser</option>

          {members
            .filter((member) => member.team)
            .map((member) => (
              <option key={member.uid} value={member.uid}>
                {member.team} — {member.displayName}
              </option>
            ))}
        </select>
      </div>
    </div>

    <button
      type="button"
      onClick={handleReportResult}
      disabled={savingResult || !winnerUid || !loserUid}
      className="mt-4 w-full rounded-xl bg-red-600 px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {savingResult ? "Saving Result..." : "Save Game Result"}
    </button>
  </section>
)}
      

          <section className="rounded-3xl border border-white/10 bg-[#07111e] p-6">
            <h2 className="text-xl font-black">Live chat</h2>

            <div className="mt-4 h-64 rounded-2xl bg-black/30 p-4 text-sm text-slate-400">
              <div className="mt-4 h-64 space-y-3 overflow-y-auto rounded-2xl bg-black/30 p-4">
  {messages.length === 0 ? (
    <p className="text-sm text-slate-400">
      No messages yet. Start the conversation.
    </p>
  ) : (
    messages.map((message) => (
      <div key={message.id} className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-700 font-black">
          {message.photoURL ? (
            <img
              src={message.photoURL}
              alt={message.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            message.displayName.charAt(0).toUpperCase()
          )}
        </div>

        <div>
          <p className="text-sm font-black">{message.displayName}</p>
          <p className="text-sm text-slate-300">{message.text}</p>
        </div>
      </div>
    ))
  )}
</div>
            </div>

            <div className="mt-4 flex gap-2">
  <input
    type="text"
    value={messageText}
    onChange={(event) => setMessageText(event.target.value)}
    onKeyDown={(event) => {
      if (event.key === "Enter" && messageText.trim()) {
        handleSendMessage()
      }
    }}
    placeholder="Send a message..."
    maxLength={500}
    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
  />

  <button
    type="button"
    onClick={handleSendMessage}
    disabled={sending || !messageText.trim()}
    className="rounded-xl bg-blue-600 px-4 font-black disabled:cursor-not-allowed disabled:bg-slate-700"
  >
    {sending ? "Sending..." : "Send"}
  </button>
  </div>
            </section>
    </aside>
  </div>
</div>
</main>
)
}

function Detail({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3">
      <span className="text-slate-400">{label}</span>
      <strong>{value}</strong>
    </div>
  )
}