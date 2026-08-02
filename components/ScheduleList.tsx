import React from 'react'

export default function ScheduleList({ schedule = [] }: { schedule: any[] }) {
  if (!schedule || schedule.length === 0) return <div className="p-4">No scheduled events</div>
  return (
    <ul className="space-y-2">
      {schedule.map((s) => (
        <li key={s.id} className="p-2 border rounded flex items-center justify-between">
          <div>
            <div className="font-semibold">{s.opponent || s.title}</div>
            <div className="text-sm text-gray-500">{new Date(s.date).toLocaleString()}</div>
          </div>
          <div className="text-sm">{s.location || ''}</div>
        </li>
      ))}
    </ul>
  )
}
