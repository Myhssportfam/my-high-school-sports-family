import React from 'react'
import Link from 'next/link'

export default function RosterList({ roster = [] }: { roster: any[] }) {
  if (!roster || roster.length === 0) return <div className="p-4">No roster available</div>
  return (
    <ul className="space-y-2">
      {roster.map((player) => (
  <li
    key={player.id}
    className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
  >
    <Link
      href={`/athletes/${player.id}`}
      className="flex items-center gap-3"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-950 font-black text-white">
        #{player.jerseyNumber || '—'}
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-bold text-red-600">
          {player.displayName || 'Athlete'}
        </div>

        <div className="text-sm text-gray-600">
          {player.position || 'Player'} ·{' '}
          {player.grade || 'Grade unavailable'}
        </div>

        <div className="mt-1 text-xs text-gray-500">
          {player.height || 'Height unavailable'} ·{' '}
          {player.weight || 'Weight unavailable'}
        </div>
      </div>

      <span className="font-bold text-gray-400">→</span>
    </Link>
  </li>
))}
    </ul>
  )
}
