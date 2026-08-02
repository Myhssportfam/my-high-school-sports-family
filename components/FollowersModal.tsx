import React, { useEffect } from 'react'
import FollowersList from './FollowersList'

export default function FollowersModal({ userId, open, onClose }: { userId: string; open: boolean; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 rounded shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold">Followers</div>
          <button onClick={onClose} className="text-sm px-2 py-1">Close</button>
        </div>
        <div className="p-4">
          <FollowersList userId={userId} pageSize={30} />
        </div>
      </div>
    </div>
  )
}
