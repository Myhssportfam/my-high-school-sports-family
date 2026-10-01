import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import LocationCard from '../../../../components/LocationCard'
import Breadcrumbs from '../../../../components/Breadcrumbs'
import { fetchSchools } from '../../../../lib/data'
export default function CityPage() {
  const { query } = useRouter()
  const { stateId, cityId } = query as { stateId?: string; cityId?: string }
  const [schools, setSchools] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    if (!stateId || !cityId) return
    fetchSchools(stateId, cityId)
      .then((s) => mounted && setSchools(s))
      .catch(() => {})
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [stateId, cityId])

  const fallback = cityId === 'la' ? [{ id: 'lafhs', name: 'LA High School' }, { id: 'ch', name: 'Central High' }] : []
const cityName = cityId
  ? cityId
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  : 'City'

const sampleSchools = [
  {
    id: 'sample-school-1',
    name: `${cityName} Central High School`,
    mascot: 'Tigers',
    athletes: 842,
    liveGames: 4,
  },
  {
    id: 'sample-school-2',
    name: `${cityName} Sports Academy`,
    mascot: 'Eagles',
    athletes: 615,
    liveGames: 2,
  },
  {
    id: 'sample-school-3',
    name: `${cityName} West High School`,
    mascot: 'Panthers',
    athletes: 489,
    liveGames: 1,
  },
]
  return (
  <div className="container py-8">
    <Breadcrumbs
      items={[
        { href: '/', label: 'Home' },
        { href: '/states', label: 'States' },
        { href: `/states/${stateId}`, label: stateId?.toUpperCase() || 'State' },
        { href: `/states/${stateId}/${cityId}`, label: cityName },
      ]}
    />

    <h1 className="mb-6 text-2xl font-bold">
  Schools in {cityName} — {sampleSchools.length} schools
</h1>

  
<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {sampleSchools.map((school) => (
        <Link
          key={school.id}
          href={`/states/${stateId}/${cityId}/${school.id}`}
          className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <p className="text-xs font-bold uppercase text-red-600">
            High School
          </p>

          <h2 className="mt-2 text-xl font-black">
            {school.name}
          </h2>

          <p className="mt-2 text-gray-600">
            Mascot: {school.mascot}
          </p>

          <div className="mt-4 flex gap-3">
            <div className="rounded-xl bg-gray-50 px-4 py-3">
              <p className="font-black">{school.athletes}</p>
              <p className="text-xs text-gray-500">Athletes</p>
            </div>

            <div className="rounded-xl bg-red-50 px-4 py-3">
              <p className="font-black text-red-600">
                {school.liveGames}
              </p>
              <p className="text-xs text-red-600">Live games</p>
            </div>
          </div>

          <p className="mt-5 font-bold text-red-600">
            View school →
          </p>
        </Link>
      ))}
    </div>
  </div>
)
}