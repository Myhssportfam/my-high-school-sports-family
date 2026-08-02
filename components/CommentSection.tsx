import React, { useEffect, useState } from 'react'
import { addComment, subscribeToComments } from '../lib/posts'
import { useAuth } from '../hooks/useAuth'

export default function CommentSection({ postId, initiallyOpen = false }: { postId: string; initiallyOpen?: boolean }) {
  const { user } = useAuth()
  const [comments, setComments] = useState<any[]>([])
  const [open, setOpen] = useState(initiallyOpen)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initiallyOpen) setOpen(true)
  }, [initiallyOpen])

  useEffect(() => {
    if (!open) return
    try { return subscribeToComments(postId, setComments) } catch (err: any) { setError(err.message) }
  }, [open, postId])

  async function submitComment(event: React.FormEvent) {
    event.preventDefault()
    if (!user) return setError('Sign in to comment.')
    if (!text.trim()) return
    setSending(true)
    setError(null)
    try { await addComment(postId, user, text.trim()); setText('') }
    catch (err: any) { setError(err.message || 'Comment could not be added.') }
    finally { setSending(false) }
  }

  return (
    <div className="comment-section">
      <button type="button" className="comment-toggle" onClick={() => setOpen((value) => !value)}>{open ? 'Hide comments' : 'View comments'}</button>
      {open && <>
        <div className="comment-list">
          {comments.length === 0 && <p className="comment-empty">No comments yet. Start the conversation.</p>}
          {comments.map((comment) => <div key={comment.id} className="comment-row">
            <div className="comment-avatar">{(comment.author?.displayName || 'M')[0].toUpperCase()}</div>
            <div><strong>{comment.author?.displayName || 'MHSF Member'}</strong><p>{comment.text}</p></div>
          </div>)}
        </div>
        <form onSubmit={submitComment} className="comment-form">
          <input value={text} onChange={(event) => setText(event.target.value)} maxLength={500} placeholder={user ? 'Write a comment…' : 'Sign in to comment'} />
          <button disabled={sending || !text.trim()}>{sending ? '…' : 'Post'}</button>
        </form>
        {error && <div className="composer-error">{error}</div>}
      </>}
    </div>
  )
}
