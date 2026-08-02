import React from 'react'
import Link from 'next/link'

export default function TrendingHighlights({ items = [] }: { items: any[] }) {
  if (!items || items.length === 0) return null
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((h) => (
        <Link key={h.id} href={`/highlights/${h.id}`}>
          <a className="block border rounded overflow-hidden bg-white dark:bg-gray-800 hover:shadow">
            <img src={h.thumbnailUrl || h.mediaUrl} className="w-full h-40 object-cover" />
            <div className="p-3">
              <div className="font-semibold">{h.title || 'Highlight'}</div>
              <div className="text-sm text-gray-500">{h.athleteName || h.teamName}</div>
            </div>
          </a>
        </Link>
      ))}
    </div>
  )
}
