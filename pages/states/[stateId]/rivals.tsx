import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

type RivalProfile = {
  id: number
  name: string
  school: string
  team: string
  state: string
  year: string
  jerseyNumber: string
  sport: string
  position: string
  coach: string
  tournament: string
  opponent: string
  meetings: number
}

type FeedPost = {
  id: number
  author: string
  school: string
  message: string
  time: string
  likes: number
  replies: number
}

const startingRivals: RivalProfile[] = [
  {
    id: 1,
    name: 'Marcus Johnson',
    school: 'Northfield High School',
    team: 'Nighthawks',
    state: 'Colorado',
    year: '2027',
    jerseyNumber: '7',
    sport: 'Football',
    position: 'Quarterback',
    coach: 'Coach Daniels',
    tournament: 'Colorado State Playoffs',
    opponent: 'Central High School',
    meetings: 14,
  },
  {
    id: 2,
    name: 'Devin Carter',
    school: 'East High School',
    team: 'Angels',
    state: 'Colorado',
    year: '2026',
    jerseyNumber: '23',
    sport: 'Basketball',
    position: 'Point Guard',
    coach: 'Coach Williams',
    tournament: 'Mile High Classic',
    opponent: 'George Washington High School',
    meetings: 21,
  },
  {
    id: 3,
    name: 'Jaylen Brooks',
    school: 'Cherry Creek High School',
    team: 'Bruins',
    state: 'Colorado',
    year: '2028',
    jerseyNumber: '2',
    sport: 'Baseball',
    position: 'Center Field',
    coach: 'Coach Martinez',
    tournament: 'Rocky Mountain Invitational',
    opponent: 'Regis Jesuit',
    meetings: 9,
  },
]

const startingFeed: FeedPost[] = [
  {
    id: 1,
    author: 'Marcus Johnson',
    school: 'Northfield High School',
    message:
      'That playoff game against Central was one of the most competitive games I have played. Respect to everybody who competed.',
    time: '2 minutes ago',
    likes: 18,
    replies: 4,
  },
  {
    id: 2,
    author: 'Devin Carter',
    school: 'East High School',
    message:
      'Who played in the Mile High Classic last season? Add me to your Rival Wall.',
    time: '18 minutes ago',
    likes: 11,
    replies: 7,
  },
]

function formatStateName(value: string) {
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function RivalWallPage() {
  const router = useRouter()

  const stateId =
    typeof router.query.stateId === 'string'
      ? router.query.stateId
      : 'colorado'

  const stateName = formatStateName(stateId)

  const [search, setSearch] = useState('')
  const [schoolFilter, setSchoolFilter] = useState('')
  const [teamFilter, setTeamFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [jerseyFilter, setJerseyFilter] = useState('')
  const [coachFilter, setCoachFilter] = useState('')
  const [tournamentFilter, setTournamentFilter] = useState('')
  const [opponentFilter, setOpponentFilter] = useState('')

  const [rivals, setRivals] =
    useState<RivalProfile[]>(startingRivals)

  const [feedPosts, setFeedPosts] =
    useState<FeedPost[]>(startingFeed)

  const [newPost, setNewPost] = useState('')
  const [connectedRivals, setConnectedRivals] = useState<number[]>(
    []
  )

  const filteredRivals = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return rivals.filter((rival) => {
      const matchesSearch =
        !searchValue ||
        rival.name.toLowerCase().includes(searchValue) ||
        rival.school.toLowerCase().includes(searchValue) ||
        rival.team.toLowerCase().includes(searchValue) ||
        rival.state.toLowerCase().includes(searchValue) ||
        rival.year.toLowerCase().includes(searchValue) ||
        rival.jerseyNumber.toLowerCase().includes(searchValue) ||
        rival.coach.toLowerCase().includes(searchValue) ||
        rival.tournament.toLowerCase().includes(searchValue) ||
        rival.opponent.toLowerCase().includes(searchValue)

      const matchesSchool =
        !schoolFilter ||
        rival.school
          .toLowerCase()
          .includes(schoolFilter.toLowerCase())

      const matchesTeam =
        !teamFilter ||
        rival.team.toLowerCase().includes(teamFilter.toLowerCase())

      const matchesYear =
        !yearFilter || rival.year === yearFilter

      const matchesJersey =
        !jerseyFilter ||
        rival.jerseyNumber.includes(jerseyFilter)

      const matchesCoach =
        !coachFilter ||
        rival.coach
          .toLowerCase()
          .includes(coachFilter.toLowerCase())

      const matchesTournament =
        !tournamentFilter ||
        rival.tournament
          .toLowerCase()
          .includes(tournamentFilter.toLowerCase())

      const matchesOpponent =
        !opponentFilter ||
        rival.opponent
          .toLowerCase()
          .includes(opponentFilter.toLowerCase())

      return (
        matchesSearch &&
        matchesSchool &&
        matchesTeam &&
        matchesYear &&
        matchesJersey &&
        matchesCoach &&
        matchesTournament &&
        matchesOpponent
      )
    })
  }, [
    rivals,
    search,
    schoolFilter,
    teamFilter,
    yearFilter,
    jerseyFilter,
    coachFilter,
    tournamentFilter,
    opponentFilter,
  ])

  function togglePlayedAgainst(rivalId: number) {
    setConnectedRivals((current) =>
      current.includes(rivalId)
        ? current.filter((id) => id !== rivalId)
        : [...current, rivalId]
    )
  }

  function submitFeedPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const message = newPost.trim()

    if (!message) {
      return
    }

    const post: FeedPost = {
      id: Date.now(),
      author: 'You',
      school: `${stateName} Sports Family`,
      message,
      time: 'Just now',
      likes: 0,
      replies: 0,
    }

    setFeedPosts((current) => [post, ...current])
    setNewPost('')
  }

  function likePost(postId: number) {
    setFeedPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    )
  }

  function clearFilters() {
    setSearch('')
    setSchoolFilter('')
    setTeamFilter('')
    setYearFilter('')
    setJerseyFilter('')
    setCoachFilter('')
    setTournamentFilter('')
    setOpponentFilter('')
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-400">
              My High School Sports Family
            </p>

            <h1 className="mt-1 text-3xl font-black sm:text-4xl">
              {stateName} Rival Wall
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Find athletes and teams you have competed against.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/states/${stateId}`}
              className="rounded-xl border border-white/15 px-4 py-2 font-bold text-white transition hover:bg-white/10"
            >
              State Community
            </Link>

            <Link
              href="/athletes"
              className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-500"
            >
              Athlete Directory
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-white/10 bg-gradient-to-br from-red-700 via-slate-950 to-blue-900">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wider">
            Rivalry creates community
          </span>

          <h2 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            “I played against this person.”
          </h2>

          <p className="mt-4 max-w-3xl text-lg text-slate-200">
            Reconnect with former opponents, remember major games,
            build sports history, and give respect to the athletes
            who pushed you to improve.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl">
            <div className="mb-5">
              <h2 className="text-2xl font-black">
                Find Your Rivals
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Search by athlete, school, team, coach, event, or
                competition history.
              </p>
            </div>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search all rival information..."
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-white outline-none placeholder:text-slate-500 focus:border-red-500"
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <input
                value={schoolFilter}
                onChange={(event) =>
                  setSchoolFilter(event.target.value)
                }
                placeholder="School"
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none focus:border-red-500"
              />

              <input
                value={teamFilter}
                onChange={(event) =>
                  setTeamFilter(event.target.value)
                }
                placeholder="Team"
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none focus:border-red-500"
              />

              <input
                value={yearFilter}
                onChange={(event) =>
                  setYearFilter(event.target.value)
                }
                placeholder="Graduation year"
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none focus:border-red-500"
              />

              <input
                value={jerseyFilter}
                onChange={(event) =>
                  setJerseyFilter(event.target.value)
                }
                placeholder="Jersey number"
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none focus:border-red-500"
              />

              <input
                value={coachFilter}
                onChange={(event) =>
                  setCoachFilter(event.target.value)
                }
                placeholder="Coach"
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none focus:border-red-500"
              />

              <input
                value={tournamentFilter}
                onChange={(event) =>
                  setTournamentFilter(event.target.value)
                }
                placeholder="Tournament"
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none focus:border-red-500"
              />

              <input
                value={opponentFilter}
                onChange={(event) =>
                  setOpponentFilter(event.target.value)
                }
                placeholder="Opponent"
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 outline-none focus:border-red-500"
              />

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-white/15 px-3 py-3 font-bold transition hover:bg-white/10"
              >
                Clear Filters
              </button>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Rival Results
                </h2>

                <p className="text-sm text-slate-400">
                  {filteredRivals.length} athletes found
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredRivals.map((rival) => {
                const playedAgainst = connectedRivals.includes(
                  rival.id
                )

                return (
                  <article
                    key={rival.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-xl"
                  >
                    <div className="border-b border-white/10 bg-gradient-to-r from-red-700/40 to-blue-700/40 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-black text-slate-950">
                            {rival.jerseyNumber}
                          </div>

                          <div>
                            <h3 className="text-xl font-black">
                              {rival.name}
                            </h3>

                            <p className="text-sm text-slate-300">
                              {rival.sport} · {rival.position}
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-slate-950/60 px-3 py-1 text-xs font-bold">
                          Class of {rival.year}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 p-5 text-sm">
                      <p>
                        <span className="font-bold text-slate-400">
                          School:
                        </span>{' '}
                        {rival.school}
                      </p>

                      <p>
                        <span className="font-bold text-slate-400">
                          Team:
                        </span>{' '}
                        {rival.team}
                      </p>

                      <p>
                        <span className="font-bold text-slate-400">
                          Coach:
                        </span>{' '}
                        {rival.coach}
                      </p>

                      <p>
                        <span className="font-bold text-slate-400">
                          Tournament:
                        </span>{' '}
                        {rival.tournament}
                      </p>

                      <p>
                        <span className="font-bold text-slate-400">
                          Opponent:
                        </span>{' '}
                        {rival.opponent}
                      </p>

                      <p className="text-xs text-slate-500">
                        {rival.meetings} community members remember
                        competing against this athlete.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          togglePlayedAgainst(rival.id)
                        }
                        className={`mt-2 w-full rounded-xl px-4 py-3 font-black transition ${
                          playedAgainst
                            ? 'bg-green-500 text-slate-950'
                            : 'bg-red-600 text-white hover:bg-red-500'
                        }`}
                      >
                        {playedAgainst
                          ? '✓ Added to My Rival History'
                          : 'I Played Against This Person'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>

            {filteredRivals.length === 0 && (
              <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900 p-10 text-center">
                <h3 className="text-xl font-black">
                  No rival matches found
                </h3>

                <p className="mt-2 text-slate-400">
                  Try changing or clearing your filters.
                </p>
              </div>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl xl:sticky xl:top-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">
                Live Rival Feed
              </h2>

              <p className="text-sm text-slate-400">
                {stateName} sports conversations
              </p>
            </div>

            <span className="flex items-center gap-2 text-xs font-bold text-green-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              LIVE
            </span>
          </div>

          <form
            onSubmit={submitFeedPost}
            className="mt-5 rounded-2xl border border-white/10 bg-slate-950 p-4"
          >
            <textarea
              value={newPost}
              onChange={(event) => setNewPost(event.target.value)}
              placeholder="Talk about a game, rivalry, tournament, or opponent..."
              rows={4}
              className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />

            <button
              type="submit"
              className="mt-3 w-full rounded-xl bg-blue-600 px-4 py-3 font-black transition hover:bg-blue-500"
            >
              Post to Rival Feed
            </button>
          </form>

          <div className="mt-5 max-h-[720px] space-y-4 overflow-y-auto pr-1">
            {feedPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-white/10 bg-slate-950 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-blue-500 font-black">
                    {post.author.charAt(0)}
                  </div>

                  <div>
                    <h3 className="font-black">{post.author}</h3>

                    <p className="text-xs text-slate-500">
                      {post.school} · {post.time}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-200">
                  {post.message}
                </p>

                <div className="mt-4 flex gap-4 border-t border-white/10 pt-3 text-xs font-bold text-slate-400">
                  <button
                    type="button"
                    onClick={() => likePost(post.id)}
                    className="transition hover:text-red-400"
                  >
                    ♥ {post.likes}
                  </button>

                  <button
                    type="button"
                    className="transition hover:text-blue-400"
                  >
                    Reply · {post.replies}
                  </button>

                  <button
                    type="button"
                    className="transition hover:text-white"
                  >
                    Share
                  </button>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </main>
  )
}