import React from 'react'

export default function ScheduleList({
  schedule = [],
}: {
  schedule: any[]
}) {
  if (!schedule || schedule.length === 0) {
    return <div className="p-4">No scheduled events</div>
  }

    return (
    <ul className="space-y-3">
      {schedule.map((game) => {
        const result = game.result || 'Upcoming'
        const isWin = result === 'W'
        const isLoss = result === 'L'

        return (
          <li
            key={game.id}
            className="flex items-center justify-between rounded-xl border bg-white p-4"
          >
            <div>
              <div className="font-bold">
                {game.opponent || game.title}
              </div>

              <div className="text-sm text-gray-500">
                {new Date(game.date).toLocaleString()}
              </div>

              <div className="mt-2 text-sm font-semibold text-gray-600">
                {game.location || ''}
              </div>
            </div>

            <div className="text-right">
              <div
                className={`inline-flex rounded-full px-3 py-1 text-sm font-black ${
                  isWin
                    ? 'bg-green-100 text-green-700'
                    : isLoss
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                {result}
              </div>

              <div className="mt-2 font-black">
                {game.score || 'TBD'}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}