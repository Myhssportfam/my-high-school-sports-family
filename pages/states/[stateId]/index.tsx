import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import StoriesBar from '../../../components/StoriesBar'
import StateFeed from '../../../components/StateFeed'
import TrendingAthletes from '../../../components/TrendingAthletes'
import {  
fetchAthletesByState,
  fetchCities,
  fetchSchoolsByState,
} from '../../../lib/data'

type School = {
  id: string
  name?: string
  city?: string
  mascot?: string
}

type City = {
  id: string
  name?: string
}

type Athlete = {
  id: string
  displayName?: string
  name?: string
  firstName?: string
  lastName?: string
  sport?: string
  schoolName?: string
}

function formatStateName(value: string) {
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getAthleteName(athlete: Athlete) {
  if (athlete.displayName) return athlete.displayName
  if (athlete.name) return athlete.name

  const fullName = `${athlete.firstName ?? ''} ${athlete.lastName ?? ''}`.trim()

  return fullName || 'Athlete'
}
const stateNames: Record<string, string> = {
  al: 'Alabama',
  ak: 'Alaska',
  az: 'Arizona',
  ar: 'Arkansas',
  ca: 'California',
  co: 'Colorado',
  ct: 'Connecticut',
  de: 'Delaware',
  fl: 'Florida',
  ga: 'Georgia',
  hi: 'Hawaii',
  id: 'Idaho',
  il: 'Illinois',
  in: 'Indiana',
  ia: 'Iowa',
  ks: 'Kansas',
  ky: 'Kentucky',
  la: 'Louisiana',
  me: 'Maine',
  md: 'Maryland',
  ma: 'Massachusetts',
  mi: 'Michigan',
  mn: 'Minnesota',
  ms: 'Mississippi',
  mo: 'Missouri',
  mt: 'Montana',
  ne: 'Nebraska',
  nv: 'Nevada',
  nh: 'New Hampshire',
  nj: 'New Jersey',
  nm: 'New Mexico',
  ny: 'New York',
  nc: 'North Carolina',
  nd: 'North Dakota',
  oh: 'Ohio',
  ok: 'Oklahoma',
  or: 'Oregon',
  pa: 'Pennsylvania',
  ri: 'Rhode Island',
  sc: 'South Carolina',
  sd: 'South Dakota',
  tn: 'Tennessee',
  tx: 'Texas',
  ut: 'Utah',
  vt: 'Vermont',
  va: 'Virginia',
  wa: 'Washington',
  wv: 'West Virginia',
  wi: 'Wisconsin',
  wy: 'Wyoming',
  dc: 'Washington, D.C.',
}
export default function StatePage() {
  const router = useRouter()

  const stateId =
    typeof router.query.stateId === 'string' ? router.query.stateId : ''

 const stateName = stateNames[stateId.toLowerCase()] ?? formatStateName(stateId)
  const [schools, setSchools] = useState<School[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!router.isReady || !stateId) return

    async function loadStateData() {
      try {
        setLoading(true)
        setError('')

        const [schoolData, cityData, athleteData] = await Promise.all([
          fetchSchoolsByState(stateId),
          fetchCities(stateId),
          fetchAthletesByState(stateId),
        ])

        setSchools(schoolData as School[])
        setCities(cityData as City[])
        setAthletes(athleteData as Athlete[])
      } catch (err) {
        console.error('Unable to load state data:', err)
        setError('We could not load this state’s sports data.')
      } finally {
        setLoading(false)
      }
    }

    loadStateData()
  }, [router.isReady, stateId])

  return (
  
  <main className="container py-8">
    <Link
  href="/arena"
  className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-100"
>
  ← Back to Arena Map
</Link>
<section className="relative mb-6 overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white shadow-xl">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.25),transparent_38%)]" />

  <div className="relative grid gap-6 px-6 py-8 lg:grid-cols-[1.4fr_1fr] lg:px-10 lg:py-10">
    <div>
      <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
        State Sports Community
      </p>

      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
        {stateName} Sports Family
      </h1>

      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
        One state. Thousands of athletes. One family. Follow schools,
        athletes, teams, live games, recruiting news and community updates
        across {stateName}.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500"
        >
          Join {stateName}
        </button>

        <button
          type="button"
          className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
        >
          Watch Live
        </button>

        <button
          type="button"
          className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
        >
          View Rankings
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      {[
        { label: "Members", value: "248K" },
        { label: "Schools", value: "1,485" },
        { label: "Athletes", value: "87K" },
        { label: "Live Games", value: "62" },
      ].map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
        >
          <p className="text-2xl font-black">{stat.value}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-300">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
    <StoriesBar stateName={stateName} />
<StateFeed stateName={stateName} />
<TrendingAthletes stateName={stateName} />
    <section className="rounded-2xl border"></section>
    <section className="rounded-2xl border"></section><section className="rounded-2xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          My High School Sports Family
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          {stateName} Sports Family
        </h1>

        <p className="mt-3 text-gray-600">
          Explore schools, athletes, highlights, cities, and recruiting activity
          across {stateName}.
        </p>
      </section>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
          <div className="text-3xl font-bold">
            {loading ? '...' : schools.length}
          </div>
          <div className="mt-1 text-gray-600">Schools</div>
        </div>

        <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
          <div className="text-3xl font-bold">
            {loading ? '...' : athletes.length}
          </div>
          <div className="mt-1 text-gray-600">Athletes</div>
        </div>

        <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
          <div className="text-3xl font-bold">0</div>
          <div className="mt-1 text-gray-600">Highlights</div>
        </div>
      </section>      <section className="mt-8 space-y-10">
        <div>
          <h2 className="text-xl font-bold">Featured Schools</h2>

          {loading ? (
            <p className="mt-2 text-gray-500">Loading schools...</p>
          ) : schools.length === 0 ? (
            <p className="mt-2 text-gray-500">
              No schools have been added for {stateName} yet.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {schools.slice(0, 6).map((school) => (
                <div
                  key={school.id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >
                  <h3 className="font-bold">
                    {school.name || 'High School'}
                  </h3>

                  {school.city && (
                    <p className="mt-1 text-sm text-gray-500">
                      {school.city}
                    </p>
                  )}

                  {school.mascot && (
                    <p className="mt-2 text-sm text-gray-600">
                      Mascot: {school.mascot}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold">Cities</h2>

          {loading ? (
            <p className="mt-2 text-gray-500">Loading cities...</p>
          ) : cities.length === 0 ? (
            <p className="mt-2 text-gray-500">
              No cities have been added for {stateName} yet.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-3">
              {cities.slice(0, 12).map((city) => (
                <div
                  key={city.id}
                  className="rounded-full border bg-white px-4 py-2 text-sm font-semibold shadow-sm"
                >
                  {city.name || formatStateName(city.id)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold">Trending Athletes</h2>

          {loading ? (
            <p className="mt-2 text-gray-500">Loading athletes...</p>
          ) : athletes.length === 0 ? (
            <p className="mt-2 text-gray-500">
              No athletes have joined the {stateName} Sports Family yet.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {athletes.slice(0, 6).map((athlete) => (
                <div
                  key={athlete.id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >
                  <h3 className="font-bold">
                    {getAthleteName(athlete)}
                  </h3>

                  {athlete.sport && (
                    <p className="mt-1 text-sm font-semibold text-red-600">
                      {athlete.sport}
                    </p>
                  )}

                  {athlete.schoolName && (
                    <p className="mt-2 text-sm text-gray-500">
                      {athlete.schoolName}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
{/* Live State Action */}
<section className="mt-10 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-900 via-blue-700 to-red-700 p-8 text-white shadow-xl">
  <h2 className="text-3xl font-bold">
    🔥 Live in {formatStateName(stateId)}
  </h2>

  <p className="mt-3 text-blue-100">
    Watch games, join tournaments, follow athletes, and compete with players
    from across the state.
  </p>

  <div className="mt-8 grid gap-6 md:grid-cols-4">
    <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
      <div className="text-4xl">🏈</div>
      <h3 className="mt-3 font-bold">Football</h3>
      <p className="text-sm text-blue-100 mt-2">
        Live scores, highlights, rankings, recruiting.
      </p>
    </div>

    <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
      <div className="text-4xl">🏀</div>
      <h3 className="mt-3 font-bold">Basketball</h3>
      <p className="text-sm text-blue-100 mt-2">
        Follow your favorite schools and players.
      </p>
    </div>

    <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
      <div className="text-4xl">🎮</div>
      <h3 className="mt-3 font-bold">Arena</h3>
      <p className="text-sm text-blue-100 mt-2">
        Challenge athletes in College Football 27 Dynasty and other sports games.
      </p>
    </div>

    <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
      <div className="text-4xl">🎥</div>
      <h3 className="mt-3 font-bold">Live Streams</h3>
      <p className="text-sm text-blue-100 mt-2">
        Watch livestreams from athletes and schools across the state.
      </p>
    </div>
  </div>

  <div className="mt-8 flex flex-wrap gap-4">
    <button className="rounded-xl bg-white px-6 py-3 font-bold text-blue-900 transition hover:scale-105">
      Join State Community
    </button>

    <button className="rounded-xl border border-white px-6 py-3 font-bold transition hover:bg-white hover:text-blue-900">
      View Live Feed
    </button>

    <button className="rounded-xl border border-white px-6 py-3 font-bold transition hover:bg-white hover:text-blue-900">
      Recruiting
    </button>
  </div>
</section>

    </main>
  )
}