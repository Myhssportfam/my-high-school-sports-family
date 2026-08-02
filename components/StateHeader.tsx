import React from 'react'

export default function StateHeader({ name, coverUrl, description }: { name: string; coverUrl?: string; description?: string }) {
  return (
    <div className="relative rounded overflow-hidden mb-6">
      <div className="h-44 bg-gray-200 dark:bg-gray-800 w-full flex items-center justify-center">
        {coverUrl ? <img src={coverUrl} className="w-full h-full object-cover" /> : <div className="text-2xl text-gray-600">{name} Sports Family</div>}
      </div>
      <div className="p-4 bg-white dark:bg-gray-900 border-t">
        <h2 className="text-2xl font-bold">{name} Sports Family</h2>
        {description && <div className="text-sm text-gray-600 mt-1">{description}</div>}
      </div>
    </div>
  )
}
