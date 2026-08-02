import { useEffect, useState} from 'react'
import { useRouter } from 'next/router'
import { athletes } from '../../../lib/athletes'

export default function AthleteProfilePage() {
  const router = useRouter()
const [isFollowing, setIsFollowing] = useState(false)
const [followers, setFollowers] = useState(248)
const [messageOpen, setMessageOpen] = useState(false)
const [messageText, setMessageText] = useState('')
const [messageSent, setMessageSent] = useState(false)
  const athleteId =
    typeof router.query.athleteId === 'string'
      ? router.query.athleteId
      : ''
useEffect(() => {
  if (!router.isReady || !athleteId) return

  const savedFollowing = localStorage.getItem(
    `following-${athleteId}`
  )

  const savedFollowers = localStorage.getItem(
    `followers-${athleteId}`
  )

  if (savedFollowing !== null) {
    setIsFollowing(savedFollowing === 'true')
  }

  if (savedFollowers !== null) {
    setFollowers(Number(savedFollowers))
  }
}, [router.isReady, athleteId])
  const athlete = athletes.find((item) => item.id === athleteId)

  if (!router.isReady) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <p className="text-lg font-semibold text-slate-600">
            Loading athlete profile...
          </p>
        </div>
      </main>
    )
  }

  if (!athlete) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-red-600">
              Athlete not found
            </p>

            <h1 className="mt-3 text-3xl font-black text-slate-900">
              We could not find this athlete profile.
            </h1>

            <button
              type="button"
              onClick={() => router.back()}
              className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    )
  }

  const fullName = `${athlete.firstName} ${athlete.lastName}`

  const initials =
    `${athlete.firstName.charAt(0)}${athlete.lastName.charAt(0)}`.toUpperCase()

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-8 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20"
          >
            ← Back to athletes
          </button>

          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl border-4 border-white/20 bg-red-600 text-4xl font-black shadow-2xl">
                {initials}
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-300">
                  My High School Sports Family
                </p>

                <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                  {fullName}
                </h1>

                <p className="mt-3 text-lg text-slate-300">
                  {athlete.position} · {athlete.sport}
                </p>

                <p className="mt-1 text-slate-400">
                  {athlete.school} · {athlete.city}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
                    Class of {athlete.graduationYear}
                  </span>

                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold capitalize">
                    {athlete.stateId}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-wider text-red-300">
                Recruiting Profile
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Athlete information
              </h2>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-2xl font-black">{athlete.statValue}</p>
                  <p className="mt-1 text-xs text-slate-300">
                    {athlete.statLabel}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-2xl font-black">
                    {athlete.graduationYear}
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    Graduation year
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
 <button
  type="button"
  onClick={() => {
  const nextFollowing = !isFollowing
  const nextFollowers = nextFollowing
    ? followers + 1
    : Math.max(0, followers - 1)

  setIsFollowing(nextFollowing)
  setFollowers(nextFollowers)

  localStorage.setItem(
    `following-${athleteId}`,
    String(nextFollowing)
  )

  localStorage.setItem(
    `followers-${athleteId}`,
    String(nextFollowers)
  )
}}
  className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
    isFollowing
      ? "bg-white text-slate-900 hover:bg-slate-200"
      : "bg-red-600 text-white hover:bg-red-700"
  }`}
>
  {isFollowing ? "Following" : "Follow"}
</button>

<button
  type="button"
 onClick={() => {
  setMessageOpen(true)
  setMessageSent(false)
}} 
  className="rounded-xl border border-slate-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
>
  Message
</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-red-600">
              Athlete overview
            </p>

            <h2 className="mt-2 text-2xl font-black">
              About {athlete.firstName}
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              {fullName} is a {athlete.sport} athlete from {athlete.city},{' '}
              {athlete.stateId}. {athlete.firstName} plays{' '}
              {athlete.position} for {athlete.school} and is part of the
              graduating class of {athlete.graduationYear}.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-red-600">
                  Performance
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Athlete statistics
                </h2>
              </div>

              <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-700">
                Current season
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-500">
                  {athlete.statLabel}
                </p>
                <p className="mt-2 text-3xl font-black">
                  {athlete.statValue}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-500">
                  Position
                </p>
                <p className="mt-2 text-xl font-black">
                  {athlete.position}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-500">
                  Sport
                </p>
                <p className="mt-2 text-xl font-black">{athlete.sport}</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-red-600">
              Highlights
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Videos and top plays
            </h2>

            <div className="mt-6 flex min-h-56 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-2xl text-white">
                  ▶
                </div>

                <p className="mt-4 font-bold text-slate-900">
                  Highlight videos coming soon
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Athlete highlights and game footage will appear here.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-red-600">
              Athlete feed
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Posts and updates
            </h2>

            <div className="mt-6 rounded-2xl bg-slate-50 p-6">
              <p className="font-bold">{fullName}</p>

              <p className="mt-3 text-slate-600">
                Welcome to my official My High School Sports Family athlete
                profile.
              </p>

              <div className="mt-5 flex gap-6 border-t border-slate-200 pt-4 text-sm font-bold text-slate-500">
                <button type="button">♡ Like</button>
                <button type="button">💬 Comment</button>
                <button type="button">↗ Share</button>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Profile details</h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  School
                </p>
                <p className="mt-1 font-bold">{athlete.school}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Location
                </p>
                <p className="mt-1 font-bold capitalize">
                  {athlete.city}, {athlete.stateId}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Sport
                </p>
                <p className="mt-1 font-bold">{athlete.sport}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Position
                </p>
                <p className="mt-1 font-bold">{athlete.position}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Graduation
                </p>
                <p className="mt-1 font-bold">
                  Class of {athlete.graduationYear}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-red-300">
              Recruiting
            </p>

            <h2 className="mt-2 text-xl font-black">
              Interested in this athlete?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Coaches can review athlete information, statistics and future
              highlight videos from this profile.
            </p>

            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700"
            >
              Contact Athlete
            </button>
          </section>
        </aside>
      </div>
      {messageOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
    <div className="w-full max-w-lg rounded-3xl bg-white p-6 text-slate-900 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-red-600">
            Direct message
          </p>

          <h2 className="mt-1 text-2xl font-black">
            Message {athlete.firstName}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            setMessageOpen(false)
            setMessageSent(false)
          }}
          className="rounded-full px-3 py-1 text-2xl font-bold text-slate-500 hover:bg-slate-100"
          aria-label="Close message box"
        >
          ×
        </button>
      </div>

      {messageSent ? (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
          <p className="text-lg font-bold text-green-700">
            Message sent!
          </p>

          <p className="mt-2 text-sm text-green-700">
            Your message to {athlete.firstName} was submitted.
          </p>

          <button
            type="button"
            onClick={() => {
              setMessageOpen(false)
              setMessageSent(false)
              setMessageText('')
            }}
            className="mt-5 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <textarea
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            placeholder={`Write a message to ${athlete.firstName}...`}
            rows={6}
            maxLength={500}
            className="mt-6 w-full resize-none rounded-2xl border border-slate-300 p-4 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
          />

          <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
            <span>Be respectful and sports-focused.</span>
            <span>{messageText.length}/500</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setMessageOpen(false)
                setMessageText('')
              }}
              className="rounded-xl border border-slate-300 px-4 py-3 font-bold hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!messageText.trim()}
              onClick={() => {
                if (!messageText.trim()) return
                setMessageSent(true)
              }}
              className="rounded-xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Send Message
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}
    </main>
  )
}