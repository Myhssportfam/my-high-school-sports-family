import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Breadcrumbs from '../../../../../components/Breadcrumbs'
import SchoolHeader from '../../../../../components/SchoolHeader'
import { fetchSchool, fetchRoster, fetchCoaches, fetchSchedule, fetchTeams, fetchPostsBySchool } from '../../../../../lib/data'
import RosterList from '../../../../../components/RosterList'
import ScheduleList from '../../../../../components/ScheduleList'
import CoachCard from '../../../../../components/CoachCard'
import Link from 'next/link'

export default function SchoolPage() {
  const { query } = useRouter()
  const { stateId, cityId, schoolId } = query as { stateId?: string; cityId?: string; schoolId?: string }

  const [school, setSchool] = useState<any | null>(null)
  const [roster, setRoster] = useState<any[]>([])
  const [coaches, setCoaches] = useState<any[]>([])
  const [schedule, setSchedule] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    if (!schoolId) return
    ;(async () => {
      try {
        const [s, r, c, sch, t, p] = await Promise.all([
          fetchSchool(schoolId),
          fetchRoster(schoolId, 200),
          fetchCoaches(schoolId, 20),
          fetchSchedule(schoolId, 50),
          fetchTeams(schoolId),
          fetchPostsBySchool(schoolId, 12)
        ])
        if (mounted) {
          setSchool(s)
          setRoster(r)
          setCoaches(c)
          setSchedule(sch)
          setTeams(t)
          setPosts(p)
        }
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [schoolId])

  if (loading) return <div className="container py-8">Loading school...</div>
  const fallbackSchool = {
  id: schoolId || 'sample-school',
  name:
  schoolId === 'sample-school-1'
    ? 'Rankings Central High School'
    : schoolId === 'sample-school-2'
    ? 'Rankings Sports Academy'
    : schoolId === 'sample-school-3'
    ? 'Rankings West High School'
    : 'Community High School',
  city: cityId
    ? cityId
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : stateId === 'co'
? 'Colorado'
: 'Community',
  state: stateId?.toUpperCase() || 'TX',
  mascot:
    schoolId === 'sample-school-1'
      ? 'Tigers'
      : schoolId === 'sample-school-2'
        ? 'Eagles'
        : 'Panthers',
}

const displayedSchool = school || fallbackSchool



  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/states', label: 'States' }, { href: `/states/${stateId}`, label: stateId?.toUpperCase() || '' }, { href: `/states/${stateId}/${cityId}`, label: cityId || '' }, { label: displayedSchool.name }]} />
      <SchoolHeader school={displayedSchool} />
<section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
  <div className="border-b border-gray-200 px-5 py-4">
    <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
      School Sports
    </p>

    <h2 className="mt-1 text-2xl font-black text-slate-950">
      Explore Houston Central Teams
    </h2>
  </div>

  <div className="flex gap-3 overflow-x-auto px-5 py-4">
    {[
      { name: 'Football', icon: '🏈' },
      { name: 'Baseball', icon: '⚾' },
      { name: 'Basketball', icon: '🏀' },
      { name: 'Soccer', icon: '⚽' },
      { name: 'Softball', icon: '🥎' },
      { name: 'Volleyball', icon: '🏐' },
      { name: 'Track', icon: '🏃' },
      { name: 'Wrestling', icon: '🤼' },
      { name: 'Tennis', icon: '🎾' },
      { name: 'Golf', icon: '⛳' },
    ].map((sport, index) => (
      <button
        key={sport.name}
        type="button"
        onClick={() => window.location.href = `/states/${stateId}/${cityId}/${displayedSchool.id}/${sport.name.toLowerCase()}`}
        className={`flex min-w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
          index === 0
            ? 'border-red-600 bg-red-600 text-white'
            : 'border-gray-200 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50'
        }`}
      >
        <span>{sport.icon}</span>
        <span>{sport.name}</span>
      </button>
    ))}
  </div>
</section>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">Team Feed</h3>
            {posts.length === 0 ? <div className="p-4">No posts</div> : posts.map((p) => (
              <div key={p.id} className="p-3 border rounded mb-2">
                <div className="font-semibold">{p.author?.displayName}</div>
                <div className="text-sm text-gray-600">{p.content}</div>
              </div>
            ))}
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Teams</h3>
            <div className="grid grid-cols-2 gap-3">
              {teams.map((t) => (
                <Link key={t.id} href={`/states/${stateId}/${cityId}/${schoolId}/${t.id}`} className="p-3 border rounded bg-white dark:bg-gray-800 hover:shadow">{t.name}</Link>
              ))}
            </div>
          </section>
        </div>

        <aside>
          <section className="mb-4">
            <h4 className="font-semibold mb-2">Roster</h4>
            <RosterList roster={roster} />
          </section>

          <section className="mb-4">
            <h4 className="font-semibold mb-2">Upcoming Schedule</h4>
            <ScheduleList schedule={schedule} />
          </section>

          <section>
            <h4 className="font-semibold mb-2">Coaches</h4>
            <div className="space-y-2">
              {coaches.map((c) => <CoachCard key={c.id} coach={c} />)}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
