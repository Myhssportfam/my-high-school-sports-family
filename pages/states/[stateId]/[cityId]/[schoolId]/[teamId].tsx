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
          setPosts(p)
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

  if (loading) return <div className="container py-8">Loading team...</div>
  if (!team) return <div className="container py-8">Team not found</div>

  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/states', label: 'States' }, { href: `/states/${stateId}`, label: stateId?.toUpperCase() || '' }, { href: `/states/${stateId}/${cityId}`, label: cityId || '' }, { href: `/states/${stateId}/${cityId}/${schoolId}`, label: school?.name || '' }, { label: team.name }]} />
      <TeamHeader team={team} school={school} />

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
            <h3 className="text-lg font-semibold mb-2">Schedule</h3>
            <ScheduleList schedule={schedule} />
          </section>
        </div>

        <aside>
          <section className="mb-4">
            <h4 className="font-semibold mb-2">Roster</h4>
            <RosterList roster={roster} />
          </section>

          <section className="mb-4">
            <h4 className="font-semibold mb-2">Coaches</h4>
            <div className="space-y-2">
              {coaches.length === 0 ? <div className="p-2">No coaches listed</div> : coaches.map((c) => <CoachCard key={c.id} coach={c} />)}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
