import React, { useEffect, useState } from 'react'
import LocationCard from '../../components/LocationCard'
import Breadcrumbs from '../../components/Breadcrumbs'
import { fetchStates } from '../../lib/data'

export default function StatesPage() {
  const [states, setStates] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetchStates()
      .then((s) => mounted && setStates(s))
      .catch(() => {})
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const fallback = [
  { id: 'alabama', name: 'Alabama' },
  { id: 'alaska', name: 'Alaska' },
  { id: 'arizona', name: 'Arizona' },
  { id: 'arkansas', name: 'Arkansas' },
  { id: 'california', name: 'California' },
  { id: 'colorado', name: 'Colorado' },
  { id: 'connecticut', name: 'Connecticut' },
  { id: 'delaware', name: 'Delaware' },
  { id: 'florida', name: 'Florida' },
  { id: 'georgia', name: 'Georgia' },
  { id: 'hawaii', name: 'Hawaii' },
  { id: 'idaho', name: 'Idaho' },
  { id: 'illinois', name: 'Illinois' },
  { id: 'indiana', name: 'Indiana' },
  { id: 'iowa', name: 'Iowa' },
  { id: 'kansas', name: 'Kansas' },
  { id: 'kentucky', name: 'Kentucky' },
  { id: 'louisiana', name: 'Louisiana' },
  { id: 'maine', name: 'Maine' },
  { id: 'maryland', name: 'Maryland' },
  { id: 'massachusetts', name: 'Massachusetts' },
  { id: 'michigan', name: 'Michigan' },
  { id: 'minnesota', name: 'Minnesota' },
  { id: 'mississippi', name: 'Mississippi' },
  { id: 'missouri', name: 'Missouri' },
  { id: 'montana', name: 'Montana' },
  { id: 'nebraska', name: 'Nebraska' },
  { id: 'nevada', name: 'Nevada' },
  { id: 'new-hampshire', name: 'New Hampshire' },
  { id: 'new-jersey', name: 'New Jersey' },
  { id: 'new-mexico', name: 'New Mexico' },
  { id: 'new-york', name: 'New York' },
  { id: 'north-carolina', name: 'North Carolina' },
  { id: 'north-dakota', name: 'North Dakota' },
  { id: 'ohio', name: 'Ohio' },
  { id: 'oklahoma', name: 'Oklahoma' },
  { id: 'oregon', name: 'Oregon' },
  { id: 'pennsylvania', name: 'Pennsylvania' },
  { id: 'rhode-island', name: 'Rhode Island' },
  { id: 'south-carolina', name: 'South Carolina' },
  { id: 'south-dakota', name: 'South Dakota' },
  { id: 'tennessee', name: 'Tennessee' },
  { id: 'texas', name: 'Texas' },
  { id: 'utah', name: 'Utah' },
  { id: 'vermont', name: 'Vermont' },
  { id: 'virginia', name: 'Virginia' },
  { id: 'washington', name: 'Washington' },
  { id: 'west-virginia', name: 'West Virginia' },
  { id: 'wisconsin', name: 'Wisconsin' },
  { id: 'wyoming', name: 'Wyoming' },
 ]

  return (
    <div className="container py-8">
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { label: 'States' }]} />
      <h1 className="text-2xl font-bold mb-4">States</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(loading ||states.length === 0 ? fallback : states).map((s) => (
          <LocationCard key={s.id} href={`/states/${s.id}`} title={s.name} />
        ))}
      </div>
    </div>
  )
}
