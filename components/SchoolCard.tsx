import React from 'react'
import Link from 'next/link'

export default function SchoolCard({ school }: { school: any }) {
  return (
    <Link href={`/states/${school.stateId}/${school.cityId}/${school.id}`}>
      <a className="block p-3 border rounded bg-white dark:bg-gray-800 hover:shadow">
        <div className="flex items-center gap-3">
          <img src={school.logoUrl || '/default-school.png'} className="w-12 h-12 object-cover rounded" />
          <div>
            <div className="font-semibold">{school.name}</div>
            <div className="text-sm text-gray-500">{school.city}, {school.state}</div>
          </div>
        </div>
      </a>
    </Link>
  )
}
