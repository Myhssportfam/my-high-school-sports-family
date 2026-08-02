import React from 'react'
import Link from 'next/link'

export default function AthleteCard({ athlete }: { athlete: any }) {
  return (
    <Link href={`/athlete/${athlete.id}`}>
      <a className="block p-3 border rounded bg-white dark:bg-gray-800 hover:shadow">
        <div className="flex items-center gap-3">
          <img src={athlete.avatarUrl || '/default-avatar.png'} className="w-12 h-12 object-cover rounded-full" />
          <div>
            <div className="font-semibold">{athlete.displayName}</div>
            <div className="text-sm text-gray-500">{(athlete.sports || []).join(', ')} • {athlete.gradYear || ''}</div>
          </div>
        </div>
      </a>
    </Link>
  )
}
