import React from 'react'
import Link from 'next/link'

export default function RosterList({ roster = [] }: { roster: any[] }) {
  if (!roster || roster.length === 0) return <div className="p-4">No roster available</div>
  return (
    <ul className="space-y-2">
      {roster.map((p) => (
        <li key={p.id} className="p-2 border rounded flex items-center gap-3">
          <img src={p.avatarUrl || '/default-avatar.png'} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <Link href={`/athlete/${p.id}`} className="font-semibold">{p.displayName}</Link>
            <div className="text-sm text-gray-500">{(p.sports || []).join(', ')} • {p.position || ''}</div>
          </div>
        </li>
      ))}
    </ul>
  )
}
