import React from 'react'

export default function Skeleton({ className = 'h-4 bg-gray-200 dark:bg-gray-700 rounded', animated = true }: { className?: string; animated?: boolean }) {
  return <div className={`${className} ${animated ? 'animate-pulse' : ''}`} />
}
