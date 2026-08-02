import Link from 'next/link'
import React from 'react'

const LocationCard: React.FC<{ href: string; title: string; subtitle?: string }> = ({ href, title, subtitle }) => {
  return (
    <Link href={href} className="block p-4 border rounded hover:shadow">
      <div className="font-semibold">{title}</div>
      {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
    </Link>
  )
}

export default LocationCard
