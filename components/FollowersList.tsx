import React, { useEffect, useState, useRef } from 'react'
import { fetchFollowersPaginated, fetchUserById, searchFollowersServer } from '../lib/users'
import Link from 'next/link'

export default function FollowersList({ userId, pageSize = 12, maxPrefetchPages = 5 }: { userId: string; pageSize?: number; maxPrefetchPages?: number }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [lastId, setLastId] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [filter, setFilter] = useState('')
  const [debouncedFilter, setDebouncedFilter] = useState('')
  const [serverSearching, setServerSearching] = useState(false)
  const [serverResults, setServerResults] = useState<any[] | null>(null)
  const [serverNextId, setServerNextId] = useState<string | null>(null)
  const debounceRef = useRef<number | null>(null)

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => setDebouncedFilter(filter.trim()), 300)
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [filter])

  useEffect(() => {
    let mounted = true
    if (!userId) return
    setLoading(true)
    setItems([])
    setLastId(null)
    setHasMore(true)

    ;(async () => {
      try {
        // if there's a filter, prefetch up to maxPrefetchPages pages and filter client-side
        if (debouncedFilter) {
          let all: any[] = []
          let cursor: string | undefined = undefined
          for (let i = 0; i < maxPrefetchPages; i++) {
            const res = await fetchFollowersPaginated(userId, pageSize, cursor)
            if (!mounted) return
            const profiles = await Promise.all(res.map(async (r) => {
              const p = await fetchUserById(r.id)
              return { id: r.id, profile: p, createdAt: r.createdAt }
            }))
            all = all.concat(profiles)
            if (res.length < pageSize) break
            cursor = res[res.length - 1].id
          }
          const filtered = all.filter((it) => (it.profile?.displayName || it.id).toLowerCase().includes(debouncedFilter.toLowerCase()))
          setItems(filtered)
          setHasMore(false)
          setLastId(null)
          setServerResults(null)
        } else {
          const res = await fetchFollowersPaginated(userId, pageSize)
          if (!mounted) return
          const profiles = await Promise.all(res.map(async (r) => {
            const p = await fetchUserById(r.id)
            return { id: r.id, profile: p, createdAt: r.createdAt }
          }))
          if (mounted) {
            setItems(profiles)
            setLastId(res.length ? res[res.length - 1].id : null)
            setHasMore(res.length === pageSize)
          }
        }
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [userId, debouncedFilter])

  async function searchAllOnServer() {
    if (!debouncedFilter) return
    setServerSearching(true)
    try {
      const j = await searchFollowersServer(userId, debouncedFilter, 200)
      if (j && j.ok && Array.isArray(j.results)) {
        setServerResults(j.results)
        setItems(j.results.map((r: any) => ({ id: r.id, profile: r })))
        setHasMore(false)
        setServerNextId(j.nextStartAfterId || null)
      }
    } catch (e) {
      // ignore
    } finally {
      setServerSearching(false)
    }
  }

  async function loadMoreServer() {
    if (!debouncedFilter || !serverNextId) return
    setServerSearching(true)
    try {
      const j = await searchFollowersServer(userId, debouncedFilter, 200, serverNextId)
      if (j && j.ok && Array.isArray(j.results)) {
        setServerResults((prev) => prev ? [...prev, ...j.results] : j.results)
        setItems((prev) => [...prev, ...j.results.map((r: any) => ({ id: r.id, profile: r }))])
        setServerNextId(j.nextStartAfterId || null)
        setHasMore(false)
      }
    } catch (e) {
      // ignore
    } finally {
      setServerSearching(false)
    }
  }

  async function loadMore() {
    if (!userId || !lastId || debouncedFilter) return
    setLoadingMore(true)
    try {
      const res = await fetchFollowersPaginated(userId, pageSize, lastId)
      const profiles = await Promise.all(res.map(async (r) => {
        const p = await fetchUserById(r.id)
        return { id: r.id, profile: p, createdAt: r.createdAt }
      }))
      setItems((prev) => [...prev, ...profiles])
      setLastId(res.length ? res[res.length - 1].id : null)
      setHasMore(res.length === pageSize)
    } catch (e) {
      // ignore
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) return <div className="p-4">Loading followers...</div>
  if (!items || items.length === 0) return (
    <div className="p-4">
      <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search followers" className="w-full p-2 border rounded mb-2" />
      <div>No followers found</div>
    </div>
  )

  return (
    <div className="p-2 border rounded bg-white dark:bg-gray-800">
      <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search followers" className="w-full p-2 border rounded mb-2" />
      <div className="mb-2 text-right text-sm">
        {debouncedFilter && (
          serverResults ? (
            <button onClick={() => { setServerResults(null); setFilter(''); }} className="px-2 py-1 text-sm underline">Clear</button>
          ) : (
            <button onClick={searchAllOnServer} disabled={serverSearching} className="px-2 py-1 text-sm underline">{serverSearching ? 'Searching...' : 'Search all'}</button>
          )
        )}
      </div>
      <ul className="space-y-2 max-h-64 overflow-auto">
        {items.map((it) => (
          <li key={it.id} className="flex items-center gap-3 p-2">
            <img src={it.profile?.avatarUrl || '/default-avatar.png'} className="w-8 h-8 rounded-full object-cover" />
            <div className="flex-1">
              <Link href={`/athlete/${it.id}`} className="font-semibold">{it.profile?.displayName || it.id}</Link>
              <div className="text-xs text-gray-500">{it.profile?.city || ''}</div>
            </div>
          </li>
        ))}
      </ul>
      {hasMore && !serverResults && (
        <div className="mt-2 text-center">
          <button onClick={loadMore} disabled={loadingMore} className="px-3 py-1 bg-gray-100 rounded">
            {loadingMore ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
      {serverNextId && (
        <div className="mt-2 text-center">
          <button onClick={loadMoreServer} disabled={serverSearching} className="px-3 py-1 bg-gray-100 rounded">
            {serverSearching ? 'Loading...' : 'Load more (search all)'}
          </button>
        </div>
      )}
    </div>
  )
}
