import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Breadcrumbs from '../../../../../components/Breadcrumbs'
import TeamHeader from '../../../../../components/TeamHeader'
import { fetchTeam, fetchRosterByTeam, fetchScheduleByTeam, fetchPostsByTeam, fetchSchool, fetchCoaches } from '../../../../../lib/data'
import RosterList from '../../../../../components/RosterList'
import ScheduleList from '../../../../../components/ScheduleList'
import CoachCard from '../../../../../components/CoachCard'

export default function TeamPage() {
  const { query } = useRouter()
  const { stateId, cityId, schoolId, teamId } = query as { stateId?: string; cityId?: string; schoolId?: string; teamId?: string }

  const [team, setTeam] = useState<any | null>(null)
  const [school, setSchool] = useState<any | null>(null)
  const [roster, setRoster] = useState<any[]>([])
  const [schedule, setSchedule] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [coaches, setCoaches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
const sampleRoster = [
  {
    id: 'athlete-1',
    displayName: 'Marcus Johnson',
    jerseyNumber: 7,
    position: 'Quarterback',
    grade: 'Senior',
    height: `6'2"`,
    weight: '205 lbs',
    sports: ['Football'],
  },
  {
    id: 'athlete-2',
    displayName: 'Jaylen Carter',
    jerseyNumber: 3,
    position: 'Running Back',
    grade: 'Junior',
    height: `5'11"`,
    weight: '190 lbs',
    sports: ['Football'],
  },
  {
    id: 'athlete-3',
    displayName: 'Darius Williams',
    jerseyNumber: 11,
    position: 'Wide Receiver',
    grade: 'Senior',
    height: `6'1"`,
    weight: '185 lbs',
    sports: ['Football'],
  },
  {
    id: 'athlete-4',
    displayName: 'Chris Thompson',
    jerseyNumber: 55,
    position: 'Linebacker',
    grade: 'Senior',
    height: `6'0"`,
    weight: '220 lbs',
    sports: ['Football'],
  },
]
const samplePosts = [
  {
    id: 'post-1',
    author: {
      displayName: 'Marcus Johnson',
    },
    role: 'Quarterback',
    content: 'Big district win tonight! Proud of my brothers. One game at a time.',
    time: '2 hours ago',
    likes: 342,
    comments: 51,
  },
  {
    id: 'post-2',
    author: {
      displayName: 'Coach Williams',
    },
    role: 'Head Coach',
    content: 'Film session tomorrow at 6 PM. Bring your notebooks and be ready to work.',
    time: '5 hours ago',
    likes: 118,
    comments: 14,
  },
  {
    id: 'post-3',
    author: {
      displayName: 'Houston Central Football',
    },
    role: 'Official Team',
    content: 'FINAL: Houston Central 35 • Katy High 21 🏈',
    time: 'Yesterday',
    likes: 684,
    comments: 93,
  },
]
const sampleSchedule = [
  {
    id: 'game-1',
    date: '2026-08-29T19:00:00',
    opponent: 'Katy High',
    location: 'Home',
    result: 'W',
    score: '35–21',
  },
  {
    id: 'game-2',
    date: '2026-09-05T19:00:00',
    opponent: 'Cypress Ranch',
    location: 'Away',
    result: 'W',
    score: '28–17',
  },
  {
    id: 'game-3',
    date: '2026-09-12T19:00:00',
    opponent: 'North Shore',
    location: 'Home',
    result: 'L',
    score: '21–24',
  },
  {
    id: 'game-4',
    date: '2026-09-19T19:00:00',
    opponent: 'Westfield High',
    location: 'Away',
    result: 'Upcoming',
    score: '7:00 PM',
  },
]
const sampleCoaches = [
  {
    id: 'coach-1',
    displayName: 'Coach Williams',
    role: 'Head Coach',
    experience: '12 years',
    record: '86–24',
    bio: 'Program leader focused on discipline, development, and championship football.',
  },
  {
    id: 'coach-2',
    displayName: 'Coach Davis',
    role: 'Offensive Coordinator',
    experience: '8 years',
    record: '34.8 PPG',
    bio: 'Leads the offense and quarterback development program.',
  },
  {
    id: 'coach-3',
    displayName: 'Coach Thompson',
    role: 'Defensive Coordinator',
    experience: '10 years',
    record: '17.2 PPG allowed',
    bio: 'Directs the defense, linebackers, and game-planning unit.',
  },
]
  useEffect(() => {
    let mounted = true
    if (!teamId) return
    ;(async () => {
      try {
        const [t, r, sch, p] = await Promise.all([
          fetchTeam(teamId),
          fetchRosterByTeam(teamId, 200),
          fetchScheduleByTeam(teamId, 100),
          fetchPostsByTeam(teamId, 20)
        ])
        let s = null
        if (t?.schoolId) {
          s = await fetchSchool(t.schoolId)
        }
        // fetch coaches for the school and filter by teamId (coaches may reference teamId)
        let allCoaches: any[] = []
        if (s) {
          allCoaches = await fetchCoaches(s.id, 20)
        }
        const teamCoaches = allCoaches.filter((c) => c.teamId === teamId || (c.teams || []).includes(teamId))

        if (mounted) {
          setTeam(t)
          setSchool(s)
          setRoster(r)
          setSchedule(sch)
          setPosts(p.length > 0 ? p : samplePosts)
          setCoaches(teamCoaches)
        }
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [teamId])

 if (loading) {
  return <div className="container py-8">Loading team...</div>
}

const displayedTeam = team || {
  id: typeof teamId === 'string' ? teamId : 'football',
  name:
    typeof teamId === 'string'
      ? teamId.charAt(0).toUpperCase() + teamId.slice(1)
      : 'Football',
  mascot: 'Tigers',
  schoolName: school?.name || 'Houston Central High School',
  record: '8-2',
}

return (
  <div className="container py-8">
    <Breadcrumbs
      items={[
        { href: '/', label: 'Home' },
        { href: '/states', label: 'States' },
        {
          href: `/states/${stateId}`,
          label: stateId?.toUpperCase() || 'State',
        },
        {
          href: `/states/${stateId}/${cityId}`,
          label: cityId || 'City',
        },
        {
          href: `/states/${stateId}/${cityId}/${schoolId}`,
          label: school?.name || 'School',
        },
        {
          href: `/states/${stateId}/${cityId}/${schoolId}/${teamId}`,
          label: displayedTeam.name,
        },
      ]}
    />

    <TeamHeader team={displayedTeam} school={school} />
    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">Team Feed</h3>
            {(posts.length > 0 ? posts : samplePosts).map((p) => (
  <div key={p.id} className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className="font-bold text-slate-950">
      {p.author?.displayName || 'Team Member'}
    </div>

    <div className="mt-1 text-xs font-semibold text-red-600">
      {p.role || 'Team Update'} · {p.time || 'Recently'}
    </div>

    <div className="mt-3 text-sm text-gray-700">
      {p.content}
    </div>

    <div className="mt-4 flex gap-5 text-sm font-semibold text-gray-500">
      <span>♥ {p.likes || 0}</span>
      <span>💬 {p.comments || 0}</span>
      <span>Share</span>
    </div>
  </div>
))}
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Schedule</h3>
            <ScheduleList
  schedule={schedule.length > 0 ? schedule : sampleSchedule}
/>
          </section>
        </div>

        <aside>
          <section className="mb-4">
            <h4 className="font-semibold mb-2">Roster</h4>
            <RosterList roster={roster.length > 0 ? roster : sampleRoster} />
          </section>

          <section className="mb-4">
            <h4 className="font-semibold mb-2">Coaches</h4>
            <div className="space-y-2">
             <div className="space-y-3">
  {(coaches.length > 0 ? coaches : sampleCoaches).map((coach) => (
    <div
      key={coach.id}
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-950 text-lg font-black text-white">
          {coach.displayName?.charAt(0) || 'C'}
        </div>

        <div>
          <h4 className="font-black text-slate-950">
            {coach.displayName}
          </h4>

          <p className="text-sm font-bold text-red-600">
            {coach.role}
          </p>

          <p className="mt-2 text-sm text-gray-600">
            {coach.bio}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-gray-600">
            <span className="rounded-full bg-gray-100 px-3 py-1">
              {coach.experience}
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1">
              {coach.record}
            </span>
          </div>
        </div>
      </div>
    </div>
  ))}
</div> 
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
