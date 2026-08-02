import { useRouter } from 'next/router'
import { getAthletesByState } from '../../../lib/athletes'
type StatCardProps = { label: string; value: string }
type FeatureCardProps = { title: string; subtitle: string; badge: string }

function formatStateName(value: string) {
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-3xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  )
}

function FeatureCard({ title, subtitle, badge }: FeatureCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700">
        {badge}
      </span>
      <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
    </article>
  )
}

export default function StatePage() {
  const router = useRouter()
  const stateId = typeof router.query.stateId === 'string' ? router.query.stateId : ''
  const stateName = stateId ? formatStateName(stateId) : 'State'
const stateAthletes = stateId ? getAthletesByState(stateId) : []
  const featuredSchools = [
    { name: `${stateName} Central High School`, city: 'Featured program', sport: 'Football', record: '8-1' },
    { name: `${stateName} North Academy`, city: 'Rising program', sport: 'Basketball', record: '12-3' },
    { name: `${stateName} West High School`, city: 'Top contender', sport: 'Baseball', record: '15-4' },
  ]

  const trendingAthletes = [
    { name: 'Jordan Williams', details: 'Class of 2027 • Wide Receiver', stat: '1,124 YDS' },
    { name: 'Avery Johnson', details: 'Class of 2026 • Point Guard', stat: '21.4 PPG' },
    { name: 'Micah Thompson', details: 'Class of 2027 • Center Field', stat: '.421 AVG' },
  ]

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/90">
                My High School Sports Family
              </span>
              <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                {stateName} Sports Family
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                Discover schools, athletes, highlights, rankings, recruiting, live games, and community activity across {stateName}.
              </p>
           <button
  type="button"
  className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
  onClick={() =>
    alert("You joined the " + stateName + " Sports Family!")
  }
>
  Join {stateName} Sports Family
</button>
                <button type="button" className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/30 transition hover:bg-red-500">
                  Find Athletes
                </button>
                <button type="button" className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20">
                  Browse Schools
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-wider text-red-200">State Spotlight</p>
              <h2 className="mt-3 text-2xl font-black">Your home for {stateName} high school sports</h2>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                Follow local athletes, schools, games, highlights, recruiting updates, and community conversations in one place.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-black/20 p-4"><p className="text-2xl font-black">50+</p><p className="mt-1 text-xs text-slate-300">Sports covered</p></div>
                <div className="rounded-2xl bg-black/20 p-4"><p className="text-2xl font-black">24/7</p><p className="mt-1 text-xs text-slate-300">Community access</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          
          <StatCard label="Schools" value="0" />
<StatCard label="Athletes" value={String(stateAthletes.length)} />
<StatCard label="Highlights" value="0" />
<StatCard label="Live Games" value="0" />
  </section>      
          
          
      

        <section className="mt-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <label htmlFor="state-search" className="text-sm font-bold text-slate-700">Search {stateName}</label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input id="state-search" type="search" placeholder="Search schools, athletes, cities, sports..." className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100" />
              <button type="button" className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800">Search</button>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
  Featured Athletes
</h2>

<div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
  {stateAthletes.map((athlete) => (
    <article
      key={athlete.id}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            {athlete.firstName} {athlete.lastName}
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            {athlete.school}
          </p>
        </div>

        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
          Class of {athlete.graduationYear}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-500">Sport</p>
          <p className="font-semibold text-slate-900">{athlete.sport}</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-500">Position</p>
          <p className="font-semibold text-slate-900">{athlete.position}</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-500">City</p>
          <p className="font-semibold text-slate-900">{athlete.city}</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-500">Stats</p>
          <p className="font-semibold text-slate-900">{athlete.statValue}</p>
        </div>
      </div>
    
    <div className="mt-5 flex gap-3">
  <button
    type="button"
    onClick={() => router.push(`/athlete/${athlete.id}`)}
    className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700"
  >
    View Profile
  </button>

  <button
    type="button"
    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100"
  >
    Follow
  </button>
</div>
    </article>
  ))}
</div>
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-sm font-bold uppercase tracking-wider text-red-600">Happening now</p><h2 className="mt-1 text-2xl font-black text-slate-900">Live & Upcoming</h2></div>
            <button type="button" className="text-sm font-bold text-red-600 hover:text-red-700">View all</button>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <FeatureCard badge="Live" title={`${stateName} Game Night`} subtitle="Live game streams and score updates will appear here." />
            <FeatureCard badge="Tonight" title="Featured Matchup" subtitle="Upcoming school matchups, kickoff times, and venues." />
            <FeatureCard badge="This Week" title="Statewide Schedule" subtitle="Browse games by sport, city, school, and classification." />
          </div>
        </section>

        <section className="mt-12">
          <div><p className="text-sm font-bold uppercase tracking-wider text-red-600">Programs to watch</p><h2 className="mt-1 text-2xl font-black text-slate-900">Featured Schools</h2></div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {featuredSchools.map((school) => (
              <article key={school.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-24 bg-gradient-to-r from-slate-900 to-red-800" />
                <div className="p-5">
                  <div className="-mt-10 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white bg-slate-100 text-lg font-black text-slate-800 shadow">{school.name.charAt(0)}</div>
                  <h3 className="mt-4 text-lg font-black text-slate-900">{school.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{school.city}</p>
                  <div className="mt-4 flex items-center justify-between text-sm"><span className="font-bold text-slate-700">{school.sport}</span><span className="rounded-full bg-slate-100 px-3 py-1 font-bold text-slate-700">{school.record}</span></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-red-600">Rising talent</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">Trending Athletes</h2>
            <div className="mt-5 space-y-4">
              {trendingAthletes.map((athlete, index) => (
                <article key={athlete.name} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-950 font-black text-white">{index + 1}</div>
                  <div className="min-w-0 flex-1"><h3 className="truncate font-black text-slate-900">{athlete.name}</h3><p className="truncate text-sm text-slate-500">{athlete.details}</p></div>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">{athlete.stat}</span>
                </article>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-red-600">Recruiting</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">Recruiting Spotlight</h2>
            <div className="mt-5 rounded-3xl bg-slate-950 p-6 text-white shadow-xl">
              <p className="text-sm font-bold uppercase tracking-widest text-red-300">Build your profile</p>
              <h3 className="mt-3 text-2xl font-black">Get discovered by coaches</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">Add your stats, academics, videos, measurements, awards, and contact information to your athlete profile.</p>
              <button type="button" className="mt-6 w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500">Create Recruiting Profile</button>
            </div>
          </div>
        </section>

        <section className="mt-12 pb-10">
          <div><p className="text-sm font-bold uppercase tracking-wider text-red-600">Community</p><h2 className="mt-1 text-2xl font-black text-slate-900">Latest State Activity</h2></div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <FeatureCard badge="Highlights" title="Top Plays" subtitle="Athlete highlights, game clips, and viral sports moments." />
            <FeatureCard badge="Rankings" title="State Rankings" subtitle="Team and athlete rankings will be displayed here." />
            <FeatureCard badge="Community" title={`${stateName} Sports Feed`} subtitle="Posts, photos, videos, comments, and fan conversations." />
          </div>
        </section>
      </div>
    </main>
  )
}
