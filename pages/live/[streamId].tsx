import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"

import { db } from "../../lib/firebase"
import { useAuth } from "../../hooks/useAuth"
type StreamStatus = "live" | "scheduled" | "replay"

type Stream = {
  id: string
  title: string
  broadcaster: string
  school: string
  sport: string
  matchup: string
  status: StreamStatus
  viewers?: number
  scheduledTime?: string
  duration?: string
  platform: string
  state?: string
  createdBy?: string
  streamUrl?: string
  homeTeam?: string
awayTeam?: string
homeScore?: number
awayScore?: number
gameClock?: string
}
type ChatMessage = {
  id: string
  userId: string
  displayName: string
  text: string
  createdAt?: unknown
}
function getYouTubeEmbedUrl(url?: string) {
  if (!url) return ""

  try {
    const parsedUrl = new URL(url)

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.replace("/", "")
      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : ""
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId =
        parsedUrl.searchParams.get("v") ||
        parsedUrl.pathname.split("/").filter(Boolean).pop()

      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : ""
    }
  } catch {
    return ""
  }

  return ""
}

export default function StreamWatchPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { streamId } = router.query

  const [stream, setStream] = useState<Stream | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
const [chatText, setChatText] = useState("")
const isStreamOwner =
  !!user?.uid &&
  !!stream?.createdBy &&
  user.uid === stream.createdBy
  useEffect(() => {
    if (!router.isReady || typeof streamId !== "string") return

    const streamRef = doc(db, "liveStreams", streamId)

    const unsubscribe = onSnapshot(
      streamRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setStream(null)
          setError("This stream could not be found.")
          setLoading(false)
          return
        }

        const data = snapshot.data() as Omit<Stream, "id">

        setStream({
          ...data,
          id: snapshot.id,
        })

        setError("")
        setLoading(false)
      },
      (snapshotError) => {
        console.error("Stream listener error:", snapshotError)
        setError("The stream could not be loaded.")
        setLoading(false)
      }
    )

    return unsubscribe
  }, [router.isReady, streamId])
useEffect(() => {
  if (!router.isReady || typeof streamId !== "string") return

  const messagesRef = collection(
    db,
    "liveStreams",
    streamId,
    "messages"
  )

  const messagesQuery = query(
    messagesRef,
    orderBy("createdAt", "asc")
  )

  const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
    const messages: ChatMessage[] = snapshot.docs.map((messageDoc) => {
      const data = messageDoc.data() as Omit<ChatMessage, "id">

      return {
        ...data,
        id: messageDoc.id,
      }
    })

    setChatMessages(messages)
  })

  return unsubscribe
}, [router.isReady, streamId])
  const embedUrl = useMemo(
    () => getYouTubeEmbedUrl(stream?.streamUrl),
    [stream?.streamUrl]
  )

  if (loading) {
    return <main className="p-8">Loading stream...</main>
  }

  if (!stream || error) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          Stream unavailable
        </h1>

        <p className="mt-2">{error}</p>

        <Link
          href="/live"
          className="mt-6 inline-block rounded-lg bg-black px-4 py-2 text-white"
        >
          Return to MHSF Live
        </Link>
      </main>
    )
  }

  return (
    <>
      <Head>
        <title>{stream.title} | MHSF Live</title>
      </Head>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Link href="/live" className="font-semibold text-red-600">
          ← Back to MHSF Live
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <section>
            <div className="aspect-video overflow-hidden rounded-2xl bg-black">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={stream.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center text-white">
                  <div>
                    <div className="text-5xl">▶</div>

                    <p className="mt-4 text-lg font-semibold">
                      Video player unavailable
                    </p>

                    <p className="mt-2 text-sm text-gray-300">
                      Add a valid YouTube stream URL.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">
                  {stream.status.toUpperCase()}
                </span>

                <span className="text-sm text-gray-600">
                  {(stream.viewers || 0).toLocaleString()} watching
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-bold">
                {stream.title}
              </h1>

              <p className="mt-2 text-lg">{stream.matchup}</p>
<div className="mt-4 flex items-center justify-between rounded-xl border p-4">
  <div className="text-center">
    <p className="text-sm font-semibold">
      {stream.awayTeam || "AWAY"}
    </p>
    <p className="text-2xl font-bold">
      {stream.awayScore ?? 0}
    </p>
  </div>

  <div className="text-center">
    <p className="text-xs font-semibold text-red-600">
      {stream.gameClock || "LIVE"}
    </p>
  </div>

  <div className="text-center">
    <p className="text-2xl font-bold">
      {stream.homeScore ?? 0}
    </p>
    <p className="text-sm font-semibold">
      {stream.homeTeam || "HOME"}
    </p>
  </div>
</div>
{isStreamOwner && (
  <form
    className="mt-4 rounded-xl border p-4"
    onSubmit={async (event) => {
      event.preventDefault()

      if (typeof streamId !== "string") return

      const form = new FormData(event.currentTarget)

      const awayScore = Number(form.get("awayScore") || 0)
      const homeScore = Number(form.get("homeScore") || 0)
      const gameClock = String(form.get("gameClock") || "").trim()

      const streamRef = doc(db, "liveStreams", streamId)

      await updateDoc(streamRef, {
        awayScore,
        homeScore,
        gameClock,
      })
    }}
  >
    <p className="mb-3 font-bold">Update live score</p>

    <div className="grid grid-cols-2 gap-3">
      <label>
        Away score
        <input
          name="awayScore"
          type="number"
          min="0"
          defaultValue={stream.awayScore ?? 0}
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />
      </label>

      <label>
        Home score
        <input
          name="homeScore"
          type="number"
          min="0"
          defaultValue={stream.homeScore ?? 0}
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />
      </label>
    </div>

    <label className="mt-3 block">
      Quarter / inning / clock
      <input
        name="gameClock"
        defaultValue={stream.gameClock || ""}
        placeholder="TOP 5TH or Q3 4:32"
        className="mt-1 w-full rounded-lg border px-3 py-2"
      />
    </label>

    <button
      type="submit"
      className="mt-3 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
    >
      Update score
    </button>
  </form>
)}
{isStreamOwner && (
  <div className="mt-4 rounded-xl border p-4">
    <p className="mb-3 font-bold">Broadcast status</p>

    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={async () => {
          if (typeof streamId !== "string") return

          const streamRef = doc(db, "liveStreams", streamId)

          await updateDoc(streamRef, {
            status: "scheduled",
          })
        }}
        className="rounded-lg border px-4 py-2 font-semibold"
      >
        Scheduled
      </button>
{stream.status === "scheduled" && (
      <button
        type="button"
        onClick={async () => {
          if (typeof streamId !== "string") return

          const streamRef = doc(db, "liveStreams", streamId)

          await updateDoc(streamRef, {
            status: "live",
          })
        }}
        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
      >
        Go Live
      </button>
)}
{stream.status === "live" && (
  <button
    type="button"
    onClick={async () => {
      if (typeof streamId !== "string") return

      const streamRef = doc(db, "liveStreams", streamId)

      await updateDoc(streamRef, {
        status: "replay",
      })
    }}
    className="rounded-lg border px-4 py-2 font-semibold"
  >
    End Broadcast
  </button>
)}
    </div>

    <p className="mt-3 text-sm text-gray-500">
      Current status: {stream.status.toUpperCase()}
    </p>
  </div>
)}
              <div className="mt-5 rounded-xl border p-4">
                <p className="font-bold">{stream.broadcaster}</p>
                <p className="text-sm text-gray-600">
                  {stream.school}
                </p>
                <p className="mt-2 text-sm">
                  {stream.sport} · {stream.platform}
                </p>
              </div>
            </div>
          </section>

          <aside className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold">Live Chat</h2>
<div className="mt-4 min-h-[420px] max-h-[420px] overflow-y-auto rounded-xl border p-3">
  {chatMessages.length === 0 ? (
    <div className="flex min-h-[380px] items-center justify-center text-sm text-gray-500">
      No messages yet. Start the conversation.
    </div>
  ) : (
    <div className="space-y-3">
      {chatMessages.map((message) => (
        <div key={message.id} className="rounded-lg bg-gray-50 p-3">
          <p className="text-sm font-bold">
            {message.displayName}
          </p>

          <p className="mt-1 text-sm">
            {message.text}
          </p>
        </div>
      ))}
    </div>
  )}
</div>

<form
  className="mt-4 flex gap-2"
  onSubmit={async (event) => {
    event.preventDefault()

    const messageText = chatText.trim()

    if (!messageText) return

    if (!user?.uid) {
      router.push("/signin")
      return
    }

    if (typeof streamId !== "string") return

    const messagesRef = collection(
      db,
      "liveStreams",
      streamId,
      "messages"
    )

    await addDoc(messagesRef, {
      userId: user.uid,
      displayName: user.displayName || "MHSF User",
      text: messageText,
      createdAt: serverTimestamp(),
    })

    setChatText("")
  }}
>
  <input
    value={chatText}
    onChange={(event) => setChatText(event.target.value)}
    placeholder={
      user?.uid
        ? "Send a message"
        : "Sign in to chat"
    }
    className="min-w-0 flex-1 rounded-lg border px-3 py-2"
  />

  <button
    type="submit"
    className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
  >
    Send
  </button>
</form>
            
          </aside>
        </div>
      </main>
    </>
  )
}