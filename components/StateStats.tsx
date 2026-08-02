import React from 'react'

export default function StateStats({ schools, athletes, highlights }: { schools: number; athletes: number; highlights: number }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="p-4 border rounded text-center bg-white dark:bg-gray-800">
        <div className="text-2xl font-bold">{schools}</div>
        <div className="text-sm text-gray-500">Schools</div>
      </div>
      <div className="p-4 border rounded text-center bg-white dark:bg-gray-800">
        <div className="text-2xl font-bold">{athletes}</div>
        <div className="text-sm text-gray-500">Athletes</div>
      </div>
      <div className="p-4 border rounded text-center bg-white dark:bg-gray-800">
        <div className="text-2xl font-bold">{highlights}</div>
        <div className="text-sm text-gray-500">Highlights</div>
      </div>
    </div>
  )
}
