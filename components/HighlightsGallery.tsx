import React from 'react'

export default function HighlightsGallery({ items }: { items: Array<any> }) {
  return (
    <div className="p-4 border rounded bg-white dark:bg-gray-800">
      <h3 className="font-semibold mb-2">Highlights</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {items && items.length ? items.map((it, i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
            {it.type === 'video' ? (
              <video src={it.url} className="w-full h-full object-cover" muted />
            ) : (
              <img src={it.url} className="w-full h-full object-cover" />
            )}
          </div>
        )) : <div className="text-sm text-gray-500">No highlights yet.</div>}
      </div>
    </div>
  )
}
