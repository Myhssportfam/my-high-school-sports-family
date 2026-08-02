import React, { useEffect } from 'react'

export default function Lightbox({ media = [], startIndex = 0, onClose }: { media: any[]; startIndex?: number; onClose: () => void }) {
  const [index, setIndex] = React.useState(startIndex)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(media.length - 1, i + 1))
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [media.length, onClose])

  if (!media || media.length === 0) return null

  const item = media[index]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <button onClick={onClose} className="absolute top-4 right-4 text-white text-xl">✕</button>
      <div className="max-w-4xl max-h-full p-4">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setIndex((i) => Math.max(0, i - 1))} className="text-white text-2xl px-4">◀</button>
          <div className="text-white">{index + 1} / {media.length}</div>
          <button onClick={() => setIndex((i) => Math.min(media.length - 1, i + 1))} className="text-white text-2xl px-4">▶</button>
        </div>

        <div className="bg-black rounded">
          {item.type === 'video' ? (
            <video src={item.url} controls className="max-w-full max-h-[70vh] rounded" />
          ) : (
            <img src={item.url} className="max-w-full max-h-[70vh] object-contain rounded" />
          )}
        </div>
      </div>
    </div>
  )
}
