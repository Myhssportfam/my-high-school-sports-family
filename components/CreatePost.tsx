import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'
import { useUserProfile } from '../hooks/useUserProfile'
import { uploadFile } from '../lib/storage'
import { createPost } from '../lib/posts'

const SPORTS = ['Football', 'Basketball', 'Baseball', 'Softball', 'Soccer', 'Volleyball', 'Track & Field', 'Cheer', 'Wrestling', 'Other']
const MAX_FILES = 4
const MAX_FILE_BYTES = 50 * 1024 * 1024

export default function CreatePost({ onPosted }: { onPosted?: () => void }) {
  const { user } = useAuth()
  const { profile } = useUserProfile(user?.uid)
  const [content, setContent] = useState('')
  const [sport, setSport] = useState('')
  const [state, setState] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!state && profile?.state) setState(profile.state)
  }, [profile?.state, state])

  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews])

  const canSubmit = useMemo(() => Boolean(content.trim() || files.length), [content, files.length])

  function chooseFiles(fileList: FileList | null) {
    setError(null)
    const next = fileList ? Array.from(fileList).slice(0, MAX_FILES) : []
    const invalid = next.find((file) => file.size > MAX_FILE_BYTES)
    if (invalid) {
      setError(`${invalid.name} is larger than 50 MB.`)
      return
    }
    previews.forEach((url) => URL.revokeObjectURL(url))
    setFiles(next)
    setPreviews(next.map((file) => URL.createObjectURL(file)))
  }

  function removeFile(index: number) {
    URL.revokeObjectURL(previews[index])
    setFiles((current) => current.filter((_, i) => i !== index))
    setPreviews((current) => current.filter((_, i) => i !== index))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!user) return setError('Sign in or create an account to share a post.')
    if (!canSubmit) return setError('Write something or add a photo or video.')

    setLoading(true)
    setError(null)
    try {
      const media: Array<{ url: string; type: 'image' | 'video'; name: string }> = []
      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
        const path = `posts/${user.uid}/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`
        const url = await uploadFile(file, path, (value) => setProgress((current) => ({ ...current, [file.name]: value })))
        media.push({ url, type: file.type.startsWith('video/') ? 'video' : 'image', name: file.name })
      }

      await createPost({
        author: user,
        profile,
        content: content.trim(),
        media,
        sport: sport || null,
        state: state.trim() || null,
      })
      previews.forEach((url) => URL.revokeObjectURL(url))
      setContent('')
      setSport('')
      setFiles([])
      setPreviews([])
      setProgress({})
      onPosted?.()
    } catch (err: any) {
      setError(err?.message || 'The post could not be shared. Check Firebase Storage and Firestore rules.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="social-composer signed-out-composer">
        <div className="composer-avatar">M</div>
        <div>
          <strong>Join the sports conversation</strong>
          <p>Sign in to share highlights, scores, photos, videos, and recruiting updates.</p>
          <div className="mt-3 flex gap-2">
            <Link href="/signin" className="primary-button">Sign In</Link>
            <Link href="/signup" className="secondary-button dark">Create Account</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="social-composer">
      <div className="composer-top">
        {user.photoURL ? <img src={user.photoURL} alt="Your profile" className="composer-avatar" /> : <div className="composer-avatar">{(user.displayName || user.email || 'M')[0].toUpperCase()}</div>}
        <textarea
          rows={3}
          maxLength={2000}
          placeholder="Share a highlight, score, announcement, or recruiting update..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </div>

      {previews.length > 0 && (
        <div className={`composer-preview-grid preview-count-${previews.length}`}>
          {previews.map((url, index) => (
            <div key={url} className="composer-preview">
              {files[index]?.type.startsWith('video/') ? <video src={url} controls /> : <img src={url} alt={`Post preview ${index + 1}`} />}
              <button type="button" onClick={() => removeFile(index)} aria-label="Remove media">×</button>
              {progress[files[index]?.name] !== undefined && <div className="upload-progress"><span style={{ width: `${progress[files[index].name]}%` }} /></div>}
            </div>
          ))}
        </div>
      )}

      <div className="composer-tags">
        <select value={sport} onChange={(event) => setSport(event.target.value)} aria-label="Sport tag">
          <option value="">Choose sport</option>
          {SPORTS.map((item) => <option key={item}>{item}</option>)}
        </select>
        <input value={state} onChange={(event) => setState(event.target.value)} maxLength={30} placeholder="State (example: Texas)" aria-label="State tag" />
      </div>

      <div className="composer-footer">
        <div className="composer-tools">
          <label className="media-picker">📷 Photo / Video<input type="file" multiple accept="image/*,video/*" onChange={(event) => chooseFiles(event.target.files)} /></label>
          <span>{content.length}/2000</span>
        </div>
        <button disabled={loading || !canSubmit} className="primary-button">{loading ? 'Sharing…' : 'Share Post'}</button>
      </div>
      {error && <div className="composer-error" role="alert">{error}</div>}
    </form>
  )
}
