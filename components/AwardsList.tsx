import React from 'react'

export default function AwardsList({ awards }: { awards: Array<any> }) {
  return (
    <div className="p-4 border rounded bg-white dark:bg-gray-800">
      <h3 className="font-semibold mb-2">Awards</h3>
      {awards && awards.length ? (
        <ul className="list-disc list-inside text-sm">
          {awards.map((a, i) => <li key={i}>{a.title} ({a.year})</li>)}
        </ul>
      ) : (
        <div className="text-sm text-gray-500">No awards listed.</div>
      )}
    </div>
  )
}
