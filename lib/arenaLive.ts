import { updateStateArenaRecord } from "./lib/stateRankings";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
where,
  type Unsubscribe,
} from "firebase/firestore"

import { auth, db } from "./firebase"

export type ArenaMember = {
  uid: string
  team?: string
  ready?: boolean
  wins?: number
  losses?: number
  pointsFor?: number
pointsAgainst?: number
  streak?: string
  last5?: ("W" | "L")[]
  displayName: string
  photoURL: string
  state: string
  joinedAt?: unknown
}

export type ArenaChallenge = {
  id: string
  roomId: string
  challengerUid: string
  challengerName: string
  opponentUid: string
  opponentName: string
  state: string
  game: string
  status: "pending" | "accepted" | "declined" | "live" | "completed"
  createdAt?: unknown
}
export type ArenaGameResult = {
  id: string
  winnerUid: string
  loserUid: string
  winnerName: string
  loserName: string
  winnerTeam: string
  loserTeam: string
  status?: "pending" | "approved" | "rejected"
  createdAt?: unknown
}
export async function sendArenaChallenge({
  roomId,
  challengerUid,
  challengerName,
  opponentUid,
  opponentName,
  state,
  game,
}: {
  roomId: string
  challengerUid: string
  challengerName: string
  opponentUid: string
  opponentName: string
  state: string
  game: string
}) {
  if (!roomId) throw new Error("Missing room ID.")
  if (!challengerUid) throw new Error("Missing challenger.")
  if (!opponentUid) throw new Error("Choose an opponent.")

  await addDoc(
    collection(db, "arenaRooms", roomId, "challenges"),
    {
      roomId,
      challengerUid,
      challengerName,
      opponentUid,
      opponentName,
      state,
      game,
      status: "pending",
      createdAt: serverTimestamp(),
    }
  )
}

export function subscribeToArenaChallenges(
  roomId: string,
  onChange: (challenges: ArenaChallenge[]) => void
): Unsubscribe {
  const challengesQuery = query(
    collection(db, "arenaRooms", roomId, "challenges"),
    orderBy("createdAt", "desc")
  )

  return onSnapshot(challengesQuery, (snapshot) => {
    const challenges = snapshot.docs.map((challengeDoc) => ({
      id: challengeDoc.id,
      ...(challengeDoc.data() as Omit<ArenaChallenge, "id">),
    }))

    onChange(challenges)
  })
}

export async function respondToArenaChallenge(
  roomId: string,
  challengeId: string,
  status: "accepted" | "declined"
) {
  await updateDoc(
    doc(db, "arenaRooms", roomId, "challenges", challengeId),
    {
      status,
    }
  )
}
export async function updateArenaChallengeStatus(
  roomId: string,
  challengeId: string,
  status: "accepted" | "declined" | "live" | "completed"
) {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized.")
  }

  await updateDoc(
    doc(db, "arenaRooms", roomId, "challenges", challengeId),
    {
      status,
      updatedAt: serverTimestamp(),
    }
  )
}
export function subscribeToArenaResults(
  roomId: string,
  onChange: (results: ArenaGameResult[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized.")
  }

  const resultsQuery = query(
    collection(db, "arenaRooms", roomId, "results"),
    orderBy("createdAt", "desc")
  )

  return onSnapshot(
    resultsQuery,
    (snapshot) => {
      const results: ArenaGameResult[] = snapshot.docs.map((resultDocument) => ({
  id: resultDocument.id,
  ...(resultDocument.data() as Omit<ArenaGameResult, "id">),
}))

      onChange(results)
    },
    (error) => {
      onError?.(error)
    }
  )
}
export type ArenaMessage = {
  id: string
  uid: string
  displayName: string
  photoURL: string
  text: string
  createdAt?: unknown
}

/**
 * Creates the room document if it does not already exist.
 */
export async function ensureArenaRoom(roomId: string, _roomData: {
  title: string
  game: string
  matchup: string
  host: string
  hostState: string
  platform: string
  status: string
  maxPlayers: number
}) {
  const snapshot = await getDoc(doc(db, "arenaRooms", roomId))
  if (!snapshot.exists()) throw new Error("This room has not been created yet.")
}

export async function updateArenaRoomStatus(roomId: string, status: "open" | "live" | "ended") {
  if (status === "live") return startArenaMatch(roomId)
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error("Sign in to manage this room.")
  const ref = doc(db, "arenaRooms", roomId)
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref)
    if (!snapshot.exists() || snapshot.data().ownerId !== uid) throw new Error("Only the host can manage this room.")
    const room = snapshot.data()
    if (room.status === status) return
    if (room.entryType !== "Online Dynasty" || status !== "open" || room.status !== "ended") {
      throw new Error("Use the match and season controls to change the room status.")
    }
    transaction.update(ref, { status: "open" })
  })
}

export function subscribeToArenaRoom(
  roomId: string,
  onChange: (data: Record<string, any> | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(doc(db, "arenaRooms", roomId), snapshot => {
    onChange(snapshot.exists() ? { ...snapshot.data(), id: snapshot.id } : null)
  }, error => onError?.(error))
}

export async function joinArenaRoom(roomId: string, member: {
  uid: string
  displayName: string
  photoURL?: string
  state?: string
}) {
  if (auth.currentUser?.uid !== member.uid) throw new Error("Sign in to join the room.")
  const roomRef = doc(db, "arenaRooms", roomId)
  const memberRef = doc(db, "arenaRooms", roomId, "members", member.uid)
  await runTransaction(db, async transaction => {
    const roomSnap = await transaction.get(roomRef)
    if (!roomSnap.exists()) throw new Error("Room not found.")
    const room = roomSnap.data()
    const ids: string[] = room.joinedUserIds || []
    const existingMember = await transaction.get(memberRef)
    if (ids.includes(member.uid) && existingMember.exists()) return
    if (!ids.includes(member.uid) && !["open", "scheduled", "full"].includes(room.status)) throw new Error("This lobby is closed.")
    if (!ids.includes(member.uid) && (!Number.isInteger(room.maxPlayers) || ids.length >= room.maxPlayers)) throw new Error("This room is full.")
    const joinedUserIds = ids.includes(member.uid) ? ids : [...ids, member.uid]
    const participant = {
      userId: member.uid,
      displayName: member.displayName || "MHSSF Athlete",
      state: member.state || "",
      photoURL: member.photoURL || "",
      ready: false,
    }
    if (!ids.includes(member.uid)) {
      transaction.update(roomRef, {
        joinedUserIds,
        players: joinedUserIds.length,
        participants: [...(room.participants || []), participant],
        status: joinedUserIds.length >= room.maxPlayers ? "full" : room.scheduledTime ? "scheduled" : "open",
      })
    }
    transaction.set(memberRef, {
      uid: member.uid,
      displayName: participant.displayName,
      photoURL: participant.photoURL,
      state: participant.state,
      ready: false,
      wins: 0,
      losses: 0,
      joinedAt: serverTimestamp(),
    })
  })
}

export async function leaveArenaRoom(roomId: string, uid: string) {
  if (auth.currentUser?.uid !== uid) throw new Error("Sign in to leave the room.")
  const roomRef = doc(db, "arenaRooms", roomId)
  const memberRef = doc(db, "arenaRooms", roomId, "members", uid)
  await runTransaction(db, async transaction => {
    const snapshot = await transaction.get(roomRef)
    if (!snapshot.exists()) throw new Error("Room not found.")
    const room = snapshot.data()
    if (!["open", "scheduled", "full"].includes(room.status)) throw new Error("This lobby is closed.")
    const ids: string[] = room.joinedUserIds || []
    if (!ids.includes(uid)) return
    const joinedUserIds = ids.filter(id => id !== uid)
    transaction.update(roomRef, {
      joinedUserIds,
      players: joinedUserIds.length,
      participants: (room.participants || []).filter((p: any) => p.userId !== uid),
      status: joinedUserIds.length >= room.maxPlayers ? "full" : room.scheduledTime ? "scheduled" : "open",
    })
    transaction.delete(memberRef)
  })
  return { success: true, roomId, uid }
}

export async function setArenaMemberReady(roomId: string, uid: string, ready: boolean) {
  if (auth.currentUser?.uid !== uid) throw new Error("Sign in to change your ready status.")
  const roomRef = doc(db, "arenaRooms", roomId)
  const memberRef = doc(db, "arenaRooms", roomId, "members", uid)
  await runTransaction(db, async transaction => {
    const [roomSnap, memberSnap] = await Promise.all([transaction.get(roomRef), transaction.get(memberRef)])
    const room = roomSnap.data()
    if (!room || !["open", "scheduled", "full"].includes(room.status) || !room.joinedUserIds?.includes(uid) || !memberSnap.exists()) {
      throw new Error("Join an open lobby first.")
    }
    transaction.update(roomRef, {
      participants: room.participants.map((p: any) => p.userId === uid ? { ...p, ready } : p),
    })
    transaction.update(memberRef, { ready })
  })
}

export async function startArenaMatch(roomId: string) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error("Sign in to start the match.")
  const ref = doc(db, "arenaRooms", roomId)
  await runTransaction(db, async transaction => {
    const snapshot = await transaction.get(ref)
    const room = snapshot.data()
    if (!room || room.ownerId !== uid || !room.joinedUserIds?.includes(uid)) throw new Error("Only the participating host can start the match.")
    if (!["open", "scheduled", "full"].includes(room.status)) throw new Error("This lobby is closed.")
    if (!Array.isArray(room.participants) || room.participants.length < (room.entryType === "Team match" ? 4 : 2)
        || !room.participants.every((p: any) => p.ready === true)) throw new Error("All players must be ready.")
    transaction.update(ref, { status: "live" })
  })
}

function validateArenaScores(one: number, two: number) {
  if (![one, two].every(score => Number.isSafeInteger(score) && score >= 0 && score <= 100000)) {
    throw new Error("Scores must be whole numbers between 0 and 100000.")
  }
}

export async function updateArenaScore(roomId: string, teamOneScore: number, teamTwoScore: number) {
  validateArenaScores(teamOneScore, teamTwoScore)
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error("Sign in to update scores.")
  const ref = doc(db, "arenaRooms", roomId)
  await runTransaction(db, async transaction => {
    const snapshot = await transaction.get(ref)
    if (!snapshot.exists() || snapshot.data().ownerId !== uid || snapshot.data().status !== "live") {
      throw new Error("Only the host of a live match can update scores.")
    }
    transaction.update(ref, { teamOneScore, teamTwoScore })
  })
}

export async function endArenaMatch(roomId: string, teamOneScore: number, teamTwoScore: number) {
  validateArenaScores(teamOneScore, teamTwoScore)
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error("Sign in before submitting a result.")
  const ref = doc(db, "arenaRooms", roomId)
  const stateResult = await runTransaction(db, async transaction => {
    const snapshot = await transaction.get(ref)
    if (!snapshot.exists()) throw new Error("Room not found.")
    const room = snapshot.data()
    if (room.ownerId !== uid || room.status !== "live") throw new Error("Only the host can finish a live match.")
    const ids: string[] = room.joinedUserIds || []
    const size = room.entryType === "Team match" ? 4 : 2
    if (ids.length !== size || new Set(ids).size !== size) throw new Error("A result needs two players, or four for a team match.")
    const winner = teamOneScore === teamTwoScore ? "tie" : teamOneScore > teamTwoScore ? "teamOne" : "teamTwo"
    transaction.update(ref, {
      status: "completed", resultVersion: 2,
      teamOneScore, teamTwoScore, winner,
      teamOneUids: ids.slice(0, size / 2), teamTwoUids: ids.slice(size / 2),
      endedAt: serverTimestamp(),
    })
    if (size !== 2 || winner === "tie") return null
    const firstState = String(room.participants?.find((p: any) => p.userId === ids[0])?.state || "")
    const secondState = String(room.participants?.find((p: any) => p.userId === ids[1])?.state || "")
    return winner === "teamOne" ? [firstState, secondState] : [secondState, firstState]
  })
  if (stateResult?.[0] && stateResult?.[1] && stateResult[0] !== stateResult[1]) {
    try {
      await updateStateArenaRecord(stateResult[0], stateResult[1])
    } catch (error) {
      console.error("Arena match saved, but state rankings could not be updated:", error)
    }
  }
}

export type ArenaLeaderboardPlayer = {
  uid: string
  name: string
  profileImage: string 
  state: string
  school: string
  sport: string 
  arenaWins: number
  arenaLosses: number
  arenaTies: number
  gamesPlayed: number
  winPercentage: number
  arenaStreak: string
}

export async function getArenaLeaderboard(): Promise<
  ArenaLeaderboardPlayer[]
> {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized.")
  }

  const usersRef = collection(db, "users")
  const usersSnap = await Promise.race([
  getDocs(usersRef),
  new Promise<never>((_, reject) => {
    setTimeout(
      () => reject(new Error("Arena leaderboard timed out.")),
      8000
    );
  }),
]);
  const completedSnap = await getDocs(query(collection(db, "arenaRooms"), where("status", "==", "completed")))

  const leaderboard: ArenaLeaderboardPlayer[] = usersSnap.docs.map(
    (userDoc) => {
      const data = userDoc.data()

      const wins = Number(data.arenaWins ?? 0)
      const losses = Number(data.arenaLosses ?? 0)
      const ties = Number(data.arenaTies ?? 0)

      const gamesPlayed = wins + losses + ties

      const winPercentage =
        gamesPlayed > 0
          ? Math.round((wins / gamesPlayed) * 1000) / 10
          : 0

      return {
        uid: userDoc.id,
        profileImage:
  data.profileImage ||
  data.photoURL ||
  data.avatarUrl ||
  "",
        name:
          data.displayName ||
          data.name ||
          data.username ||
          "Arena Player",
        state: data.state || "Unknown",
        school:
  data.school ||
  data.schoolName ||
  data.highSchool ||
  "",

sport:
  data.sport ||
  data.primarySport ||
  "",
        arenaWins: wins,
        arenaLosses: losses,
        arenaTies: ties,
        gamesPlayed,
        winPercentage,
        arenaStreak: data.arenaStreak || "",
      }
    }
  )

  const byUid = new Map<string, ArenaLeaderboardPlayer>(leaderboard.map(player => [player.uid, player]))
  for (const roomDoc of completedSnap.docs) {
    const room = roomDoc.data()
    if (room.resultVersion !== 2 || !Array.isArray(room.teamOneUids) || !Array.isArray(room.teamTwoUids)) continue
    const ids: string[] = [...room.teamOneUids, ...room.teamTwoUids]
    if (![2, 4].includes(ids.length) || new Set(ids).size !== ids.length) continue
    for (const uid of ids) {
      let player = byUid.get(uid)
      if (!player) {
        const participant = room.participants?.find((p: any) => p.userId === uid)
        player = {
          uid, name: participant?.displayName || "Arena Player", profileImage: "",
          state: participant?.state || "Unknown", school: "", sport: "",
          arenaWins: 0, arenaLosses: 0, arenaTies: 0, gamesPlayed: 0,
          winPercentage: 0, arenaStreak: "",
        }
        byUid.set(uid, player)
      }
      const ownScore = room.teamOneUids.includes(uid) ? room.teamOneScore : room.teamTwoScore
      const otherScore = room.teamOneUids.includes(uid) ? room.teamTwoScore : room.teamOneScore
      const outcome = ownScore === otherScore ? "T" : ownScore > otherScore ? "W" : "L"
      if (outcome === "T") player.arenaTies++
      else if (outcome === "W") player.arenaWins++
      else player.arenaLosses++
      player.gamesPlayed++
      player.winPercentage = Math.round(player.arenaWins / player.gamesPlayed * 1000) / 10
      player.arenaStreak = outcome
    }
  }
  return Array.from(byUid.values())
  .filter((player) => player.gamesPlayed > 0)
  .sort((a, b) => {
    // 1. Most wins
    if (b.arenaWins !== a.arenaWins) {
      return b.arenaWins - a.arenaWins
    }

    // 2. Highest win percentage
    if (b.winPercentage !== a.winPercentage) {
      return b.winPercentage - a.winPercentage
    }

    // 3. Longest current winning streak
    const aWinStreak = a.arenaStreak.startsWith("W")
      ? Number(a.arenaStreak.slice(1)) || 0
      : 0

    const bWinStreak = b.arenaStreak.startsWith("W")
      ? Number(b.arenaStreak.slice(1)) || 0
      : 0

    if (bWinStreak !== aWinStreak) {
      return bWinStreak - aWinStreak
    }

    // 4. Most games played
    if (b.gamesPlayed !== a.gamesPlayed) {
      return b.gamesPlayed - a.gamesPlayed
    }

    // 5. Fewest losses
    return a.arenaLosses - b.arenaLosses
  })
}
export async function selectArenaTeam(
  roomId: string,
  uid: string,
  team: string,
  currentTeam?: string
) {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized.")
  }

  if (!uid) {
    throw new Error("You must be signed in to select a team.")
  }

  const memberRef = doc(
    db,
    "arenaRooms",
    roomId,
    "members",
    uid
  )

  const newTeamRef = doc(
    db,
    "arenaRooms",
    roomId,
    "teams",
    team
  )

  await runTransaction(db, async (transaction) => {
    // Read the new team first
    const newTeamSnapshot = await transaction.get(newTeamRef)
    const memberSnapshot = await transaction.get(memberRef)
    const memberData = memberSnapshot.exists() ? memberSnapshot.data() : {}
    // If somebody else owns this team, block the claim
    if (newTeamSnapshot.exists()) {
      const teamData = newTeamSnapshot.data()

      if (teamData.uid !== uid) {
        throw new Error(`${team} has already been claimed.`)
      }
    }

    // If this player is switching teams, release the old team
    if (currentTeam && currentTeam !== team) {
      const oldTeamRef = doc(
        db,
        "arenaRooms",
        roomId,
        "teams",
        currentTeam
      )

      const oldTeamSnapshot = await transaction.get(oldTeamRef)

      if (
        oldTeamSnapshot.exists() &&
        oldTeamSnapshot.data().uid === uid
      ) {
        transaction.delete(oldTeamRef)
      }
    }

    // Claim the new team
    transaction.set(
      newTeamRef,
      {
        uid,
        team,
        claimedAt: serverTimestamp(),
      },
      { merge: true }
    )

    // Update the player's roster entry
    transaction.set(
  memberRef,
  {
    team,
    wins: memberData.wins ?? 0,
    losses: memberData.losses ?? 0,
    updatedAt: serverTimestamp(),
  },
  { merge: true }
)
  })
}
/**
 * Sends a chat message to the room.
 */
export function subscribeToArenaMembers(
  roomId: string,
  onChange: (members: ArenaMember[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized.")
  }

  const membersRef = collection(
    db,
    "arenaRooms",
    roomId,
    "members"
  )

  return onSnapshot(
    membersRef,
    (snapshot) => {
      const members = snapshot.docs.map((memberDocument) => ({
        ...(memberDocument.data() as ArenaMember),
        uid: memberDocument.id,
      }))

      onChange(members)
    },
    (error) => {
      if (onError) {
        onError(error)
      }
    }
  )
}
export async function sendArenaMessage(
  roomId: string,
  message: {
    uid: string
    displayName: string
    photoURL?: string
    text: string
  }
) {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized.")
  }

  const cleanText = message.text.trim()

  if (!message.uid) {
    throw new Error("You must sign in before sending a message.")
  }

  if (!cleanText) {
    throw new Error("Enter a message first.")
  }

  if (cleanText.length > 500) {
    throw new Error("Messages cannot exceed 500 characters.")
  }

  await addDoc(collection(db, "arenaRooms", roomId, "messages"), {
    uid: message.uid,
    displayName: message.displayName || "MHSSF Athlete",
    photoURL: message.photoURL || "",
    text: cleanText,
    createdAt: serverTimestamp(),
  })
}

/**
 * Watches the room chat in real time.
 */
export async function reportArenaGameResult(
  roomId: string,
  winnerUid: string,
  loserUid: string,
  winnerScore?: number,
  loserScore?: number,
  gameId?: string
) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error("Sign in to report a result.")
  if (!winnerUid || !loserUid || winnerUid === loserUid) throw new Error("Choose two different players.")
  const hasScores = winnerScore !== undefined && loserScore !== undefined
  if (hasScores && (!Number.isSafeInteger(winnerScore ?? NaN) || !Number.isSafeInteger(loserScore ?? NaN)
      || winnerScore! <= loserScore! || winnerScore! > 100000 || loserScore! < 0)) {
    throw new Error("The winner must have a higher valid score.")
  }
  const roomRef = doc(db, "arenaRooms", roomId)
  const winnerRef = doc(db, "arenaRooms", roomId, "members", winnerUid)
  const loserRef = doc(db, "arenaRooms", roomId, "members", loserUid)
  const resultRef = gameId
    ? doc(db, "arenaRooms", roomId, "results", gameId)
    : doc(collection(db, "arenaRooms", roomId, "results"))
  await runTransaction(db, async transaction => {
    const [roomSnap, winnerSnap, loserSnap, resultSnap] = await Promise.all([
      transaction.get(roomRef), transaction.get(winnerRef), transaction.get(loserRef), transaction.get(resultRef),
    ])
    if (!roomSnap.exists() || roomSnap.data().ownerId !== uid) throw new Error("Only the room host can save a result.")
    if (!winnerSnap.exists() || !loserSnap.exists()) throw new Error("Both players must be in the room.")
    if (resultSnap.exists()) throw new Error("This game result was already saved.")
    const winner = winnerSnap.data()
    const loser = loserSnap.data()
    transaction.update(winnerRef, {
      wins: Number(winner.wins || 0) + 1,
      streak: String(winner.streak || "").startsWith("W") ? `W${Number(String(winner.streak).slice(1) || 0) + 1}` : "W1",
      last5: [...(winner.last5 || []), "W"].slice(-5),
      ...(hasScores ? { pointsFor: Number(winner.pointsFor || 0) + winnerScore!, pointsAgainst: Number(winner.pointsAgainst || 0) + loserScore! } : {}),
      updatedAt: serverTimestamp(),
    })
    transaction.update(loserRef, {
      losses: Number(loser.losses || 0) + 1,
      streak: String(loser.streak || "").startsWith("L") ? `L${Number(String(loser.streak).slice(1) || 0) + 1}` : "L1",
      last5: [...(loser.last5 || []), "L"].slice(-5),
      ...(hasScores ? { pointsFor: Number(loser.pointsFor || 0) + loserScore!, pointsAgainst: Number(loser.pointsAgainst || 0) + winnerScore! } : {}),
      updatedAt: serverTimestamp(),
    })
    transaction.set(resultRef, {
      winnerUid, loserUid,
      winnerName: winner.displayName || "Arena Player",
      loserName: loser.displayName || "Arena Player",
      winnerTeam: winner.team || "",
      loserTeam: loser.team || "",
      ...(hasScores ? { winnerScore, loserScore } : {}),
      status: "approved",
      createdAt: serverTimestamp(),
    })
  })
}

export async function approveArenaGameResult(
  roomId: string,
  resultId: string
) {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized.")
  }

  const resultRef = doc(
    db,
    "arenaRooms",
    roomId,
    "results",
    resultId
  )

  await runTransaction(db, async (transaction) => {
    const resultSnapshot = await transaction.get(resultRef)

    if (!resultSnapshot.exists()) {
      throw new Error("Game result does not exist.")
    }

    const resultData = resultSnapshot.data()

    if (resultData.status === "approved") {
      throw new Error("This result has already been approved.")
    }

    const winnerUid = resultData.winnerUid
    const loserUid = resultData.loserUid

    if (!winnerUid || !loserUid) {
      throw new Error("Result is missing winner or loser.")
    }

    const winnerRef = doc(
      db,
      "arenaRooms",
      roomId,
      "members",
      winnerUid
    )

    const loserRef = doc(
      db,
      "arenaRooms",
      roomId,
      "members",
      loserUid
    )

    const winnerSnapshot = await transaction.get(winnerRef)
    const loserSnapshot = await transaction.get(loserRef)

    if (!winnerSnapshot.exists()) {
      throw new Error("Winner is not in this Dynasty.")
    }

    if (!loserSnapshot.exists()) {
      throw new Error("Loser is not in this Dynasty.")
    }

    const winnerData = winnerSnapshot.data()
    const loserData = loserSnapshot.data()

    const winnerWins = Number(winnerData.wins ?? 0)
    const loserLosses = Number(loserData.losses ?? 0)
const winnerStreak = String(winnerData.streak ?? "")
const loserStreak = String(loserData.streak ?? "")

const nextWinnerStreak = winnerStreak.startsWith("W")
  ? `W${Number(winnerStreak.slice(1) || 0) + 1}`
  : "W1"

const nextLoserStreak = loserStreak.startsWith("L")
  ? `L${Number(loserStreak.slice(1) || 0) + 1}`
  : "L1"
  const winnerLast5 = Array.isArray(winnerData.last5)
  ? winnerData.last5
  : []

const loserLast5 = Array.isArray(loserData.last5)
  ? loserData.last5
  : []

const nextWinnerLast5 = [...winnerLast5, "W"].slice(-5)
const nextLoserLast5 = [...loserLast5, "L"].slice(-5)
    transaction.set(
      winnerRef,
      {
  wins: winnerWins + 1,
  streak: nextWinnerStreak,
  last5: nextWinnerLast5,
  updatedAt: serverTimestamp(),
},
      { merge: true }
    )

    transaction.set(
      loserRef,
      {
        losses: loserLosses + 1,
        streak: nextLoserStreak,
        last5: nextLoserLast5,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )

    transaction.set(
      resultRef,
      {
        status: "approved",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
  })
}

export async function rejectArenaGameResult(
  roomId: string,
  resultId: string
) {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized.")
  }

  const resultRef = doc(
    db,
    "arenaRooms",
    roomId,
    "results",
    resultId
  )

  await setDoc(
    resultRef,
    {
      status: "rejected",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}
export function subscribeToArenaMessages(
  roomId: string,
  onChange: (messages: ArenaMessage[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized.")
  }

  const messagesQuery = query(
    collection(db, "arenaRooms", roomId, "messages"),
    orderBy("createdAt", "asc")
  )

  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      const messages = snapshot.docs.map((messageDocument) => ({
        id: messageDocument.id,
        ...(messageDocument.data() as Omit<ArenaMessage, "id">),
      }))

      onChange(messages)
    },
    (error) => {
      console.error("Arena chat listener failed:", error)
      onError?.(error)
    }
  )
}
export async function endDynastySeason(
  roomId: string,
  championUid: string,
  championName: string,
  wins: number,
  losses: number
) {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized.")
  }

  const roomRef = doc(db, "arenaRooms", roomId)

await runTransaction(db, async (transaction) => {
  const roomSnapshot = await transaction.get(roomRef)

  if (!roomSnapshot.exists()) {
    throw new Error("Dynasty room does not exist.")
  }

  const roomData = roomSnapshot.data()
  const seasonNumber = Number(roomData.seasonNumber ?? 1)

  const championHistoryRef = doc(
    db,
    "arenaRooms",
    roomId,
    "champions",
    `season-${seasonNumber}`
  )

  transaction.update(roomRef, {
    status: "ended",
    seasonNumber,
    championUid,
    championName,
    championWins: wins,
    championLosses: losses,
    endedAt: serverTimestamp(),
  })

  transaction.set(championHistoryRef, {
    seasonNumber,
    uid: championUid,
    displayName: championName,
    wins,
    losses,
    wonAt: serverTimestamp(),
  })
})
}
export async function startNewDynastySeason(
  roomId: string
) {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized.")
  }

  const roomRef = doc(db, "arenaRooms", roomId)
  const membersRef = collection(db, "arenaRooms", roomId, "members")

  await runTransaction(db, async (transaction) => {
    const roomSnapshot = await transaction.get(roomRef)

    if (!roomSnapshot.exists()) {
      throw new Error("Dynasty room does not exist.")
    }

    const roomData = roomSnapshot.data()
    const currentSeason = Number(roomData.seasonNumber ?? 1)
    const nextSeason = currentSeason + 1

    const membersSnapshot = await getDocs(membersRef)

    transaction.update(roomRef, {
      status: "open",
      seasonNumber: nextSeason,
      championUid: null,
      championName: null,
      championWins: null,
      championLosses: null,
      endedAt: null,
      startedAt: serverTimestamp(),
    })

    membersSnapshot.docs.forEach((memberDocument) => {
      transaction.update(memberDocument.ref, {
        wins: 0,
        losses: 0,
        streak: "",
        last5: [],
        updatedAt: serverTimestamp(),
      })
    })
  })
}
export type DynastyChampion = {
  id: string
  seasonNumber: number
  uid: string
  displayName: string
  wins: number
  losses: number
  wonAt?: unknown
}

export function subscribeToDynastyChampions(
  roomId: string,
  onChange: (champions: DynastyChampion[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized.")
  }

  const championsQuery = query(
    collection(db, "arenaRooms", roomId, "champions"),
    orderBy("seasonNumber", "desc")
  )

  return onSnapshot(
    championsQuery,
    (snapshot) => {
      const champions = snapshot.docs.map((championDocument) => ({
        id: championDocument.id,
        ...(championDocument.data() as Omit<DynastyChampion, "id">),
      }))

      onChange(champions)
    },
    (error) => {
      console.error("Dynasty champion listener failed:", error)
      onError?.(error)
    }
  )
}
export type DynastyPowerRankingSnapshot = {
  uid: string
  rank: number
  previousRank: number
  powerScore: number
  updatedAt?: unknown
}

export async function saveDynastyPowerRankings(
  roomId: string,
  rankings: Array<{
    uid: string
    rank: number
    powerScore: number
  }>
) {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized.")
  }

  const rankingRefs = rankings.map((player) =>
    doc(db, "arenaRooms", roomId, "powerRankings", player.uid)
  )

  await runTransaction(db, async (transaction) => {
    // Read every player's previous ranking first
    const previousSnapshots = await Promise.all(
      rankingRefs.map((rankingRef) => transaction.get(rankingRef))
    )

    rankingRefs.forEach((rankingRef, index) => {
      const player = rankings[index]

      const previousData = previousSnapshots[index].data() as
        | { rank?: number }
        | undefined

      const previousRank = previousData?.rank ?? player.rank

      transaction.set(
        rankingRef,
        {
          uid: player.uid,
          rank: player.rank,
          previousRank,
          powerScore: player.powerScore,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    })
  })
}

export function subscribeToDynastyPowerRankings(
  roomId: string,
  onChange: (rankings: DynastyPowerRankingSnapshot[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized.")
  }

  const rankingsQuery = query(
    collection(db, "arenaRooms", roomId, "powerRankings"),
    orderBy("rank", "asc")
  )

  return onSnapshot(
    rankingsQuery,
    (snapshot) => {
      const rankings = snapshot.docs.map((rankingDocument) => ({
        ...(rankingDocument.data() as DynastyPowerRankingSnapshot),
        uid: rankingDocument.id,
      }))

      onChange(rankings)
    },
    (error) => {
      console.error("Dynasty power rankings listener failed:", error)
      onError?.(error)
    }
  )
}