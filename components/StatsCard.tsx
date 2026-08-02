import React from 'react'

export default function StatsCard({ stats }: { stats: any }) {
  return (
    <div className="p-4 border rounded bg-white dark:bg-gray-800">
      <div className="grid grid-cols-3 text-center">
        <div>
          <div className="font-bold">{stats.gamesPlayed ?? 0}</div>
          <div className="text-sm text-gray-500">Games</div>
        </div>
        <div>
          <div className="font-bold">{stats.points ?? 0}</div>
          <div className="text-sm text-gray-500">Points</div>
        </div>
        <div>
          <div className="font-bold">{stats.rebounds ?? 0}</div>
          <div className="text-sm text-gray-500">Rebounds</div>
        </div>
      </div>
    </div>
  )
}
