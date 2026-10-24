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

  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/states', label: 'States' }, { href: `/states/${stateId}`, label: stateId?.toUpperCase() || '' }, { label: cityId || '' }]} />
      <h1 className="text-2xl font-bold mb-4">Schools in {cityId}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(loading ? fallback : schools).map((s) => (
          <LocationCard key={s.id} href={`/states/${stateId}/${cityId}/${s.id}`} title={s.name} />
        ))}
      </div>
    </div>
  )
}
