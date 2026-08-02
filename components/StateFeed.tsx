import { useEffect, useMemo, useRef, useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../lib/firebase'
import MediaEditor from './MediaEditor'
type StateFeedProps = {
  stateName: string
}

type PostType = 'Update' | 'Photo' | 'Video' | 'Check In'

type Comment = {
  id: string
  author: string
  message: string
}

type FeedPost = {
  id: string
  author: string
  initials: string
  role: string
  message: string
  type: PostType
  createdAt: string
  likes: number
  liked: boolean
  comments: Comment[]
  mediaUrl?: string
}

function createStarterPosts(stateName: string): FeedPost[] {
  return [
    {
      id: 'starter-1',
      author: 'MileHighQB',
      initials: 'MQ',
      role: `${stateName} Football`,
      message:
        'Great team workout today. We are getting ready for another big season.',
      type: 'Update',
      createdAt: '12 minutes ago',
      likes: 84,
      liked: false,
      comments: [
        {
          id: 'starter-comment-1',
          author: 'SportsFamilyFan',
          message: 'Keep working! The state family is behind you.',
        },
      ],
    },
    {
      id: 'starter-2',
      author: 'DiamondLife27',
      initials: 'DL',
      role: `${stateName} Baseball`,
      message:
        'New batting practice highlights are up. Finished today with three home runs.',
      type: 'Video',
      createdAt: '38 minutes ago',
      likes: 126,
      liked: false,
      comments: [],
    },
    {
      id: 'starter-3',
      author: 'HoopStars',
      initials: 'HS',
      role: `${stateName} Basketball`,
      message:
        'Final score: 78–71. Proud of the way the team finished the fourth quarter.',
      type: 'Photo',
      createdAt: '1 hour ago',
      likes: 203,
      liked: false,
      comments: [],
    },
  ]
}

export default function StateFeed({ stateName }: StateFeedProps) {
  const [message, setMessage] = useState('')
  const [postType, setPostType] = useState<PostType>('Update')
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [commentText, setCommentText] = useState<Record<string, string>>({})
  const photoInputRef = useRef<HTMLInputElement>(null)
const videoInputRef = useRef<HTMLInputElement>(null)

const [selectedFileName, setSelectedFileName] = useState('')
const [selectedMediaUrl, setSelectedMediaUrl] = useState('')
const [checkInLocation, setCheckInLocation] = useState('')
  const [showComments, setShowComments] = useState<Record<string, boolean>>({})
const [showMediaEditor, setShowMediaEditor] = useState(false)
  const storageKey = useMemo(
    () => `mhssf-state-feed-${stateName.toLowerCase().replace(/\s+/g, '-')}`,
    [stateName]
  )

  useEffect(() => {
    const savedPosts = window.localStorage.getItem(storageKey)

    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts) as FeedPost[])
        return
      } catch {
        window.localStorage.removeItem(storageKey)
      }
    }

    setPosts(createStarterPosts(stateName))
  }, [stateName, storageKey])

 useEffect(() => {
  if (posts.length === 0) return

  try {
    const safePosts = posts.map((post) => ({
      ...post,
      mediaUrl:
        post.mediaUrl?.startsWith('data:video/')
          ? undefined
          : post.mediaUrl,
    }))

    window.localStorage.setItem(
      storageKey,
      JSON.stringify(safePosts)
    )
  } catch (error) {
    console.warn('Feed could not be saved:', error)
  }
}, [posts, storageKey])

  function createPost() {
    const trimmedMessage = message.trim()

  if (!trimmedMessage && !selectedMediaUrl) {
  return
}
const newPost: FeedPost = {
      id: `${Date.now()}`,
      author: 'You',
      initials: 'YOU',
      role: `${stateName} Sports Family`,
      message: trimmedMessage,
      type: postType,
      createdAt: 'Just now',
      likes: 0,
      liked: false,
      comments: [],
      mediaUrl: selectedMediaUrl || undefined,
    }

    setPosts((currentPosts) => [newPost, ...currentPosts])
    setMessage('')
    setPostType('Update')
    setSelectedMediaUrl('')
setSelectedFileName('')
  }

  function toggleLike(postId: string) {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) {
          return post
        }

        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? Math.max(0, post.likes - 1) : post.likes + 1,
        }
      })
    )
  }

  function addComment(postId: string) {
    const newComment = commentText[postId]?.trim()

    if (!newComment) {
      return
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: `${Date.now()}`,
                  author: 'You',
                  message: newComment,
                },
              ],
            }
          : post
      )
    )

    setCommentText((current) => ({
      ...current,
      [postId]: '',
    }))

    setShowComments((current) => ({
      ...current,
      [postId]: true,
    }))
  }

  function deletePost(postId: string) {
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== postId)
    )
  }

  return (
    <>
   {showMediaEditor && selectedMediaUrl && (
  <MediaEditor
    mediaUrl={selectedMediaUrl}
    mediaType={postType === 'Video' ? 'Video' : 'Photo'}
    onCancel={() => {
      setShowMediaEditor(false)
      setSelectedMediaUrl('')
      setSelectedFileName('')
      setPostType('Update')
    }}
    onNext={() => {
      setShowMediaEditor(false)
    }}
  />
)} 
   <input
  ref={photoInputRef}
  type="file"
  accept="image/*"
  hidden
  onChange={async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `state-feeds/${stateName}/photos/${Date.now()}-${safeFileName}`
    const photoRef = ref(storage, storagePath)

    await uploadBytes(photoRef, file)

    const downloadUrl = await getDownloadURL(photoRef)

    setSelectedMediaUrl(downloadUrl)
    setSelectedFileName(file.name)
    setPostType('Photo')
    setShowMediaEditor(true)
  } catch (error) {
    console.error('Photo upload failed:', error)
    alert('The photo could not be uploaded. Please try again.')
  } finally {
    event.target.value = ''
  }
}}
/>
<input  
  ref={videoInputRef}
  type="file"
  accept="video/*"
  onChange={async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `state-feeds/${stateName}/videos/${Date.now()}-${safeFileName}`
    const videoRef = ref(storage, storagePath)

    await uploadBytes(videoRef, file)

    const downloadUrl = await getDownloadURL(videoRef)

    setSelectedMediaUrl(downloadUrl)
    setSelectedFileName(file.name)
    setPostType('Video')
  } catch (error) {
    console.error('Video upload failed:', error)
    alert('The video could not be uploaded. Please try again.')
  } finally {
    event.target.value = ''
  }
}}
/>


<section className="stateFeed">
      <div className="feedHeader"> 
        <div>
          <p className="feedEyebrow">Live Community Feed</p>
          <h2>{stateName} Sports Conversation</h2>
          <p className="feedDescription">
            Share scores, highlights, recruiting news and community updates.
          </p>
        </div>

        <span className="liveBadge">
          <i />
          Live
        </span>
      </div>

      <div className="composer">
        <div className="composerTop">
          <div className="composerAvatar">YOU</div>

          <textarea
            value={message}
            placeholder={`Share something with the ${stateName} sports family...`}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={500}
          />
        </div>

        <div className="composerBottom">
          <div className="postTypes">
            
          <button
  type="button"
  className={postType === 'Update' ? 'selectedType' : ''}
  onClick={() => {
    setPostType('Update')
    setSelectedFileName('')
    setCheckInLocation('')
  }}
>
  ✏️ Update
</button>

<button
  type="button"
  className={postType === 'Photo' ? 'selectedType' : ''}
  onClick={() => photoInputRef.current?.click()}
>
  📷 Photo
</button>

<button
  type="button"
  className={postType === 'Video' ? 'selectedType' : ''}
  onClick={() => videoInputRef.current?.click()}
>
  🎥 Video
</button>

<button
  type="button"
  className={postType === 'Check In' ? 'selectedType' : ''}
  onClick={() => {
    setPostType('Check In')
    setSelectedFileName('')
  }}
>
  📍 Check In
</button>  
          </div>

          <div className="composerActions">
            <span>{message.length}/500</span>

            <button
              type="button"
              className="postButton"
              disabled={!message.trim() && !selectedMediaUrl}
              onClick={createPost}
            >
              Post Update
            </button>
          </div>
        </div>
      </div>

      <div className="feedList">
        {posts.map((post) => (
          <article key={post.id} className="feedPost">
            <div className="postHeader">
  <div className="postIdentity">
    <div className="postAvatar">
      {post.author
        .split(' ')
        .map((name) => name.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()}
    </div>

    <div className="postAuthorInfo">
      <div className="postAuthorRow">
        <strong>{post.author}</strong>
        <span className="verifiedBadge">✓</span>
      </div>

      <span className="postRole">{post.role}</span>
    </div>
  </div>

  <div className="postHeaderRight">
  <span className="postTime">{post.createdAt}</span>

  <button
    type="button"
    className="postMenuButton"
    aria-label="Post options"
  >
    •••
  </button>
</div>
              <div className="postMeta">
                <span>{post.createdAt}</span>

                {post.author === 'You' && (
                  <button
                    type="button"
                    onClick={() => deletePost(post.id)}
                    aria-label="Delete post"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <p className="postMessage">{post.message}</p>
{post.type === 'Photo' && post.mediaUrl && (
  <img
    src={post.mediaUrl}
    alt={post.message || 'Uploaded sports photo'}
    className="uploadedPostImage"
  />
)}
      {post.type === 'Video' && post.mediaUrl && (
  <video
    src={post.mediaUrl}
    className="uploadedPostImage"
    controls
    playsInline
    preload="metadata"
  >
    Your browser does not support the video player.
  </video>
)} 
            <div className="postStats">
              <span>❤️ {post.likes}</span>
              <span>
                {post.comments.length}{' '}
                {post.comments.length === 1 ? 'comment' : 'comments'}
              </span>
            </div>

            <div className="postActions">
              <button
                type="button"
                className={post.liked ? 'likedButton' : ''}
                onClick={() => toggleLike(post.id)}
              >
                {post.liked ? '❤️ Liked' : '♡ Like'}
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowComments((current) => ({
                    ...current,
                    [post.id]: !current[post.id],
                  }))
                }
              >
                💬 Comment
              </button>

              <button
                type="button"
                onClick={() =>
                  navigator.clipboard
                    ?.writeText(
                      `${post.author}: ${post.message} — My High School Sports Family`
                    )
                    .catch(() => undefined)
                }
              >
                ↗ Share
              </button>
            </div>

            {showComments[post.id] && (
              <div className="commentsSection">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div>{comment.author.charAt(0).toUpperCase()}</div>

                    <p>
                      <strong>{comment.author}</strong>
                      <span>{comment.message}</span>
                    </p>
                  </div>
                ))}

                <div className="commentComposer">
                  <input
                    value={commentText[post.id] ?? ''}
                    placeholder="Write a comment..."
                    onChange={(event) =>
                      setCommentText((current) => ({
                        ...current,
                        [post.id]: event.target.value,
                      }))
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        addComment(post.id)
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => addComment(post.id)}
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      <style jsx>{`
        .stateFeed {
          margin-top: 24px;
          padding: 28px;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          background: #f8fafc;
        }

        .feedHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .feedEyebrow {
          margin: 0 0 8px;
          color: #b91c1c;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        h2 {
          margin: 0;
          color: #111827;
          font-size: clamp(25px, 4vw, 34px);
        }

        .feedDescription {
          margin: 8px 0 0;
          color: #64748b;
        }

        .liveBadge {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #b91c1c;
          font-size: 13px;
          font-weight: 800;
        }

        .liveBadge i {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #dc2626;
          box-shadow: 0 0 0 5px rgba(220, 38, 38, 0.12);
        }

        .composer {
          margin-top: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          background: white;
          overflow: hidden;
        }

        .composerTop {
          display: flex;
          gap: 14px;
          padding: 20px;
        }

        .composerAvatar,
        .postAvatar {
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 999px;
          background: linear-gradient(135deg, #172554, #dc2626);
          color: white;
          font-weight: 900;
        }

        .composerAvatar {
          width: 46px;
          height: 46px;
          font-size: 11px;
        }

        textarea {
          width: 100%;
          min-height: 95px;
          border: none;
          outline: none;
          resize: vertical;
          color: #111827;
          font: inherit;
        }

        textarea::placeholder {
          color: #94a3b8;
        }

        .composerBottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 20px;
          border-top: 1px solid #e2e8f0;
        }

        .postTypes {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .postTypes button {
          padding: 8px 10px;
          border: none;
          border-radius: 10px;
          background: transparent;
          color: #475569;
          font-weight: 700;
          cursor: pointer;
        }

        .postTypes button:hover,
        .postTypes .selectedType {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .composerActions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .composerActions span {
          color: #94a3b8;
          font-size: 11px;
        }

        .postButton {
          padding: 11px 18px;
          border: none;
          border-radius: 999px;
          background: #111827;
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        .postButton:disabled {
          cursor: not-allowed;
          opacity: 0.35;
        }

        .feedList {
          display: grid;
          gap: 18px;
          margin-top: 20px;
        }

        .feedPost {
          padding: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          background: white;
        }

        .postHeader,
        .postIdentity,
        .postMeta {
          display: flex;
          align-items: center;
        }

        .postHeader {
          justify-content: space-between;
          gap: 14px;
        }

        .postIdentity {
          gap: 12px;
        }

        .postAvatar {
          width: 44px;
          height: 44px;
          font-size: 12px;
        }

        .postIdentity strong,
        .postIdentity span {
          display: block;
        }

        .postIdentity strong {
          color: #111827;
        }

        .postIdentity span {
          margin-top: 3px;
          color: #64748b;
          font-size: 12px;
        }

        .postMeta {
          gap: 10px;
          color: #94a3b8;
          font-size: 12px;
        }

        .postMeta button {
          width: 28px;
          height: 28px;
          border: none;
          border-radius: 999px;
          background: #f1f5f9;
          color: #64748b;
          cursor: pointer;
        }

        .postMessage {
          margin: 17px 0;
          color: #334155;
          font-size: 15px;
          line-height: 1.7;
          white-space: pre-wrap;
        }
{post.type === 'Photo' && post.mediaUrl && (
  <img
    src={post.mediaUrl}
    alt={post.message || 'Uploaded sports photo'}
    className="uploadedPostImage"
  />
)}
        .mediaPreview {
          display: flex;
          align-items: center;
          gap: 14px;
          min-height: 130px;
          padding: 20px;
          border-radius: 17px;
          background: linear-gradient(135deg, #0f172a, #1e3a8a);
          color: white;
        }

        .mediaPreview > span {
          display: grid;
          width: 60px;
          height: 60px;
          place-items: center;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.13);
          font-size: 25px;
        }

        .mediaPreview strong,
        .mediaPreview small {
          display: block;
        }

        .mediaPreview small {
          margin-top: 5px;
          color: #bfdbfe;
        }
        .uploadedPostImage {
  display: block;
  width: 100%;
  height: auto;
  max-height: 700px;
  object-fit: contain;
  margin-top: 14px;
  background: #f5f5f5;
  border-radius: 17px;
}
.uploadedPostImage {
  display: block;
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  margin-top: 14px;
  background: #f5f5f5;
  border-radius: 17px;
}
        .postStats {
          display: flex;
          justify-content: space-between;
          margin-top: 16px;
          color: #64748b;
          font-size: 12px;
        }

        .postActions {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 12px;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }

        .postActions button {
          padding: 12px 6px;
          border: none;
          background: transparent;
          color: #475569;
          font-weight: 700;
          cursor: pointer;
        }

        .postActions button:hover {
          background: #f8fafc;
        }

        .postActions .likedButton {
          color: #dc2626;
        }

        .commentsSection {
          margin-top: 15px;
        }

        .comment {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 10px;
        }

        .comment > div {
          display: grid;
          width: 32px;
          height: 32px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 999px;
          background: #e2e8f0;
          color: #334155;
          font-size: 12px;
          font-weight: 800;
        }

        .comment p {
          margin: 0;
          padding: 9px 12px;
          border-radius: 14px;
          background: #f1f5f9;
        }

        .comment strong,
        .comment span {
          display: block;
        }

        .comment strong {
          color: #111827;
          font-size: 12px;
        }

        .comment span {
          margin-top: 3px;
          color: #475569;
          font-size: 13px;
        }

        .commentComposer {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }

        .commentComposer input {
          width: 100%;
          padding: 10px 13px;
          border: 1px solid #cbd5e1;
          border-radius: 999px;
          outline: none;
        }

        .commentComposer input:focus {
          border-color: #2563eb;
        }

        .commentComposer button {
          padding: 9px 15px;
          border: none;
          border-radius: 999px;
          background: #111827;
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        @media (max-width: 720px) {
          .stateFeed {
            padding: 18px;
          }

          .feedHeader,
          .composerBottom {
            align-items: flex-start;
            flex-direction: column;
          }

          .composerActions {
            width: 100%;
            justify-content: space-between;
          }

          .postActions {
            font-size: 12px;
          }
        }
      `}</style>
    </section>
  </>
  )
}