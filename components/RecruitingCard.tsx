import React from 'react'

export default function RecruitingCard({ recruiting }: { recruiting: any }) {
  return (
    <div className="p-4 border rounded bg-white dark:bg-gray-800">
      <h3 className="font-semibold mb-2">Recruiting</h3>
      {recruiting ? (
        <div className="text-sm">
          <div><strong>Class:</strong> {recruiting.classYear}</div>
          <div><strong>Position:</strong> {recruiting.position}</div>
          <div><strong>Ratings:</strong> {recruiting.rating || 'N/A'}</div>
          <div className="mt-2">{recruiting.summary}</div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">No recruiting info provided.</div>
      )}
    </div>
  )
}
