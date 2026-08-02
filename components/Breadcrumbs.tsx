import Link from 'next/link'
import React from 'react'

const Breadcrumbs: React.FC<{ items: Array<{ href?: string; label: string }> }> = ({ items }) => {
  return (
    <nav className="text-sm text-gray-600 dark:text-gray-300 mb-4">
      {items.map((it, idx) => (
        <span key={idx}>
          {it.href ? <Link href={it.href} className="underline">{it.label}</Link> : <span>{it.label}</span>}
          {idx < items.length - 1 && <span className="px-2">/</span>}
        </span>
      ))}
    </nav>
  )
}

export default Breadcrumbs
