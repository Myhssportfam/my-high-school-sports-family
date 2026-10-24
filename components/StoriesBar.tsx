import { ChangeEvent, useEffect, useRef, useState } from "react"
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth"
import { uploadMedia } from "../lib/uploadMedia";
import {deleteContent} from '../lib/deleteContent'
import {
  createStory,
  recordStoryView,
  subscribeToActiveStories,
  toggleStoryLike,
} from "../lib/stories";

type MediaType = "Photo" | "Video"

type Story = {
  id: string
  userId?: string
  isUserStory?: boolean
  firestoreId?: string
  views?: {
    userId: string
    userName: string
    avatarUrl: string
    viewedAt: number
  }[]
  name: string
  sport: string
  emoji: string
  avatarUrl?: string
  mediaUrl?: string
  mediaType?: MediaType
  isLive?: boolean
  linkUrl?: string
}

type StoriesBarProps = {
  stateId: string
  stateName: string
  uploadStateId?: string
}

const defaultStories: Story[] = [
  {
    id: "your-story",
    name: "Your Story",
    sport: "Add Story",
    emoji: "YOU",
    isUserStory: true,
  },
  {
    id: "football",
    name: "Friday Night",
    sport: "Football",
    emoji: "🏈",
    isLive: true,
  },
  {
    id: "basketball",
    name: "Hoop Stars",
    sport: "Basketball",
    emoji: "🏀",
  },
  {
    id: "baseball",
    name: "Diamond Life",
    sport: "Baseball",
    emoji: "⚾",
  },
  {
    id: "track",
    name: "Track Speed",
    sport: "Track",
    emoji: "🏃",
  },
  {
    id: "soccer",
    name: "Soccer Club",
    sport: "Soccer",
    emoji: "⚽",
  },
  {
    id: "volleyball",
    name: "Volleyball",
    sport: "Volleyball",
    emoji: "🏐",
  },
  {
    id: "wrestling",
    name: "Wrestling",
    sport: "Wrestling",
    emoji: "🤼",
  },
]

export default function StoriesBar({
  stateId,
  stateName,
  uploadStateId,
}: StoriesBarProps) {
  const [stories, setStories] = useState<Story[]>(defaultStories)
  const [signedInUser, setSignedInUser] = useState(auth.currentUser)
  useEffect(() => onAuthStateChanged(auth, setSignedInUser), [])
 const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null)
const [showViewers, setShowViewers] = useState(false)
const [deletingStory, setDeletingStory] = useState(false)
  const [storyProgress, setStoryProgress] = useState(0)
  const [isStoryMuted, setIsStoryMuted] = useState(false)
  const [storyLiked, setStoryLiked] = useState(false)
const [storyLikeCount, setStoryLikeCount] = useState(0)
const [storyReply, setStoryReply] = useState("")
const storyVideoRef = useRef<HTMLVideoElement | null>(null)
  const storyFileInputRef = useRef<HTMLInputElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const createdObjectUrlsRef = useRef<string[]>([])
const [storyLinkUrl, setStoryLinkUrl] = useState("")
  const activeStory =
    activeStoryIndex !== null ? stories[activeStoryIndex] : null

  const ownsStory = (story: Story) => Boolean(
    signedInUser && story.firestoreId && story.userId === signedInUser.uid
  )

  async function removeStory(story: Story) {
    if (!ownsStory(story) || deletingStory || !story.firestoreId) return
    if (!window.confirm('Delete this story?')) return
    setDeletingStory(true)
    videoRef.current?.pause()
    try {
      await deleteContent({kind: 'story', id: story.firestoreId, stateId})
      closeStory()
      setStories((items) => items.flatMap((item) =>
        item.firestoreId !== story.firestoreId ? [item] :
        item.id === 'your-story' ? [defaultStories[0]] : []
      ))
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Could not delete story.')
      videoRef.current?.play().catch(() => {})
    } finally {
      setDeletingStory(false)
    }
  }

  const openStoryPicker = () => {
    storyFileInputRef.current?.click()
  }

  const handleStoryFile = async (
  event: ChangeEvent<HTMLInputElement>
) => {
  const selectedFiles = Array.from(event.target.files ?? []);

  if (selectedFiles.length === 0) {
    return;
  }

  const user = auth.currentUser;

  if (!user) {
    window.alert("You must be signed in to add a story.");
    event.target.value = "";
    return;
  }
const storyStateId =
  uploadStateId === undefined ? stateId : uploadStateId;

if (!storyStateId) {
  window.alert(
    "Choose your state community in your profile before adding a story."
  );
  event.target.value = "";
  return;
}
  const validFiles = selectedFiles.filter((file) => {
    return (
      file.type.startsWith("image/") ||
      file.type.startsWith("video/")
    );
  });

  if (validFiles.length === 0) {
    window.alert("Please choose image or video files.");
    event.target.value = "";
    return;
  }

  try {
    const uploadedStories: Story[] = [];

    for (let index = 0; index < validFiles.length; index += 1) {
      const file = validFiles[index];
      const isVideo = file.type.startsWith("video/");
console.log("Current User:", auth.currentUser);
console.log("UID:", auth.currentUser?.uid);
      const uploadedMedia = await uploadMedia(file, user.uid);

      const savedStory = await createStory({
        stateId: storyStateId,
        userId: user.uid,
        userName:
          user.displayName ||
          user.email?.split("@")[0] ||
          "MyHSSportsFamily User",
          avatarUrl: user.photoURL || "",
        mediaUrl: uploadedMedia.downloadURL,
        mediaType: uploadedMedia.fileType,
      });

      uploadedStories.push({
        id: `firebase-story-${savedStory.id}`,
        firestoreId: savedStory.id,
        userId: user.uid,
        name: "Your Story",
        sport: isVideo ? "Video" : "Photo",
        emoji: "YOU",
        mediaType: isVideo ? "Video" : "Photo",
        mediaUrl: uploadedMedia.downloadURL,
        isUserStory: true,
        linkUrl: storyLinkUrl.trim(),
      });
    }

    setStories((currentStories) => {
      const yourStoryButton = currentStories.find(
        (story) => story.id === "your-story"
      );

      const existingUserStories = currentStories.filter(
        (story) =>
          story.id !== "your-story" &&
          story.id.startsWith("user-story-")
      );

      const communityStories = currentStories.filter(
        (story) =>
          story.id !== "your-story" &&
          !story.id.startsWith("user-story-")
      );

      return [
        ...(yourStoryButton ? [yourStoryButton] : []),
        ...uploadedStories,
        ...existingUserStories,
        ...communityStories,
      ];
    });

    setStoryLinkUrl("");
    setActiveStoryIndex(1);
    setStoryProgress(0);

    window.alert(
      `${uploadedStories.length} story item${
        uploadedStories.length === 1 ? "" : "s"
      } uploaded successfully.`
    );
  } catch (error) {
    console.error("Story upload failed:", error);

    window.alert(
      error instanceof Error
        ? error.message
        : "The story upload failed."
    );
  } finally {
    event.target.value = "";
  }
};

    
  

  const closeStory = () => {
    setActiveStoryIndex(null)
    setStoryProgress(0)

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const showNextStory = () => {
    if (deletingStory) return
    if (activeStoryIndex === null) {
      return
    }

    const nextIndex = activeStoryIndex + 1

    if (nextIndex >= stories.length) {
      closeStory()
      return
    }
setIsStoryMuted(false)
    setActiveStoryIndex(nextIndex)
    setStoryProgress(0)
  }

  const showPreviousStory = () => {
    if (deletingStory) return
    if (activeStoryIndex === null) {
      return
    }

    const previousIndex = activeStoryIndex - 1

    if (previousIndex < 0) {
      setStoryProgress(0)
      return
    }

    setActiveStoryIndex(previousIndex)
    setStoryProgress(0)
  }

  useEffect(() => {
    if (!activeStory || deletingStory) {
      return
    }

    setStoryProgress(0)

    

    const duration = 25000
    const intervalSpeed = 50
    const progressIncrease = (intervalSpeed / duration) * 100

    const interval = window.setInterval(() => {
      setStoryProgress((currentProgress) => {
        const nextProgress = currentProgress + progressIncrease

        if (nextProgress >= 100) {
          window.clearInterval(interval)
          window.setTimeout(showNextStory, 0)
          return 100
        }

        return nextProgress
      })
    }, intervalSpeed)

    return () => {
      window.clearInterval(interval)
    }
  }, [activeStoryIndex, deletingStory])

  useEffect(() => {
    return () => {
      createdObjectUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [])
useEffect(() => {
  const unsubscribe = subscribeToActiveStories(
  stateId,
  (firebaseStories) => {
    const loadedStories: Story[] = firebaseStories.map((story) => ({
      id: `firebase-story-${story.id}`,
      firestoreId: story.id,
      userId: story.userId,
      views: story.views || [],
      name: story.userName,
      avatarUrl: story.avatarUrl,
      sport: story.mediaType === "video" ? "Video" : "Photo",
      emoji:
        story.userId === auth.currentUser?.uid
          ? "YOU"
          : story.userName.slice(0, 2).toUpperCase(),
      mediaType:
        story.mediaType === "video"
          ? "Video"
          : "Photo",
      mediaUrl: story.mediaUrl,
      isUserStory: story.userId === auth.currentUser?.uid,
    }));

    setStories((currentStories) => {
      const yourStoryButton = currentStories.find(
        (story) => story.id === "your-story"
      );

      const communityStories = currentStories.filter(
        (story) =>
          story.id !== "your-story" &&
          !story.id.startsWith("user-story-") &&
          !story.id.startsWith("firebase-story-")
      );

     const otherUsersStories = loadedStories.filter(
  (story) => story.userId !== auth.currentUser?.uid
);

const myStories = loadedStories.filter(
  (story) => story.userId === auth.currentUser?.uid
);

const updatedYourStoryButton =
  myStories.length > 0
    ? {
        ...myStories[0],
        id: "your-story",
        firestoreId: myStories[0].firestoreId,
        userId: myStories[0].userId,
        mediaUrl: myStories[0].mediaUrl,
        mediaType: myStories[0].mediaType,
        isUserStory: true,
        name: "Your Story",
        emoji: "YOU",
      }
    : defaultStories[0];

return [
  ...(updatedYourStoryButton ? [updatedYourStoryButton] : []),
  ...myStories.slice(1),
  ...otherUsersStories,
  ...communityStories,
];
    });
  });

  return unsubscribe;
}, [stateId]);
  return (
    <>
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-700">
              State Stories
            </p>

            <h2 className="text-2xl font-black text-gray-900">
              What&apos;s happening in {stateName}
            </h2>
          </div>
        </div>

        <input
  ref={storyFileInputRef}
  id="story-file-upload"
  type="file"
  accept="image/*,video/*"
  multiple
  onChange={handleStoryFile}
  className="hidden"
/>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {stories
  .filter((story, index, allStories) => {
  // Always keep the "Your Story" upload button
  if (story.id === "your-story") {
    return true
  }

  // If this story belongs to an athlete/user,
  // only show the first story from that person.
  // Their remaining stories will play after opening the circle.
  if (story.userId) {
    return (
      index ===
      allStories.findIndex(
        (item) =>
          item.userId === story.userId &&
          item.id !== "your-story"
      )
    )
  }

  // Keep other built-in/demo story circles
  return true
})
  .map((story) => {
  const hasMedia = Boolean(story.mediaUrl)

  console.log("STORY DEBUG:", {
    id: story.id,
    firestoreId: story.firestoreId,
    userId: story.userId,
    name: story.name,
    isUserStory: story.isUserStory,
    mediaUrl: story.mediaUrl,
  })

  return (
      <div key={story.id} className="relative min-w-[86px] text-center">
        <button
          type="button"
          onClick={async () => {
  const originalIndex =
  story.firestoreId && story.userId
    ? stories.findIndex(
        (item) =>
          item.firestoreId &&
          item.userId === story.userId
      )
    : stories.findIndex(
        (item) => item.id === story.id
      )

  setActiveStoryIndex(originalIndex)

  const currentUser = auth.currentUser

  if (
    currentUser &&
    story.firestoreId &&
    !story.isUserStory
  ) {
    try {
     await recordStoryView(
  stateId,
  story.firestoreId,
  currentUser.uid,
  currentUser.displayName ||
    currentUser.email?.split("@")[0] ||
    "MyHSSportsFamily User"
)
    } catch (error) {
      console.error("Could not record story view:", error)
    }
  }
}}
          className="block w-full"
        >
          <div className="relative mx-auto h-[78px] w-[78px] rounded-full">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-red-500 bg-white">
              {hasMedia && story.mediaType === "Video" ? (
                <video
                  src={story.mediaUrl}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
              ) : hasMedia && story.mediaType === "Photo" ? (
                <img
                  src={story.mediaUrl}
                  alt={story.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  className={
                    story.id === "your-story"
                      ? "text-xs font-black text-red-800"
                      : "text-3xl"
                  }
                >
                  {story.emoji}
                </span>
              )}
            </div>

            {story.isLive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                LIVE
              </span>
            )}
          </div>

          <p className="mt-2 truncate text-sm font-bold text-gray-900">
            {story.name}
          </p>

          <p className="truncate text-xs text-gray-500">
            {story.id === "your-story" ? "Add Story" : story.sport}
          </p>
        </button>

        {ownsStory(story) && (
          <button type="button" disabled={deletingStory} onClick={() => removeStory(story)}
            className="mt-2 min-h-11 rounded-lg border border-red-600 px-2 py-2 text-xs font-bold text-red-700 disabled:opacity-50">
            {deletingStory ? 'Deleting…' : 'Delete story'}
          </button>
        )}

        {story.id === "your-story" && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              openStoryPicker()
            }}
            className="absolute right-0 top-[52px] z-20 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white"
            aria-label="Add another story"
          >
            +
          </button>
        )}
      </div>
    )
  })}
        </div>
      </section>


      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          <div className="absolute left-4 right-4 top-4 z-30 h-1 overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full bg-white transition-all duration-75"
              style={{ width: `${storyProgress}%` }}
            />
          </div>

          <button
            type="button"
            onClick={showPreviousStory}
            className="absolute bottom-0 left-0 top-0 z-10 w-1/2 cursor-pointer"
            aria-label="Previous story"
          />

          <button
            type="button"
            onClick={showNextStory}
            className="absolute bottom-0 right-0 top-0 z-10 w-1/2 cursor-pointer"
            aria-label="Next story"
          />

          <div className="absolute left-6 top-8 z-30 flex items-center gap-3 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-700 text-xs font-black">
              {activeStory.avatarUrl ? (
  <img
    src={activeStory.avatarUrl}
    alt={activeStory.name}
    className="h-full w-full rounded-full object-cover"
  />
) : (
  activeStory.emoji
)}
            </div>

            <div>
              <p className="font-bold">{activeStory.name}</p>
              <p className="text-xs text-white/70">{activeStory.sport}</p>
            </div>
          </div>

          {activeStory.mediaType === "Video" && (
            <button
              type="button"
              onClick={() => {
                setIsStoryMuted((currentValue) => !currentValue)
              }}
              className="absolute right-20 top-7 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-xl text-white"
              aria-label={isStoryMuted ? "Unmute story" : "Mute story"}
            >
              {isStoryMuted ? "🔇" : "🔊"}
            </button>
          )}

          <button
            type="button"
            onClick={closeStory}
            className="absolute right-6 top-7 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-3xl font-light text-white"
            aria-label="Close story"
          >
            ×
          </button>
          {ownsStory(activeStory) && <button type="button" disabled={deletingStory} className="absolute right-6 top-20 z-40 min-h-11 rounded-lg bg-red-700 px-4 py-2 font-bold text-white disabled:opacity-50" onClick={() => removeStory(activeStory)}>{deletingStory ? 'Deleting…' : 'Delete story'}</button>}

        <div className="relative z-20 aspect-[9/16] h-[85vh] max-h-[85vh] w-auto max-w-[95vw] overflow-hidden rounded-2xl bg-black">
            {activeStory.mediaUrl &&
            activeStory.mediaType === "Video" ? (
              <video
                key={activeStory.id}
                ref={videoRef}
                src={activeStory.mediaUrl}
                autoPlay
                muted={isStoryMuted}
                playsInline
              
                onTimeUpdate={(event) => {
                  const video = event.currentTarget

                  if (video.duration > 0) {
                    setStoryProgress(
                      (video.currentTime / video.duration) * 100
                    )
                  }
                }}
                onEnded={showNextStory}
                className="h-full w-full object-cover"
              />
            ) : activeStory.mediaUrl &&
              activeStory.mediaType === "Photo" ? (
              <img
                src={activeStory.mediaUrl}
                alt={activeStory.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[500px] w-full flex-col items-center justify-center bg-gradient-to-br from-red-900 via-gray-950 to-blue-950 px-8 text-center text-white">
                <span className="text-7xl">{activeStory.emoji}</span>

                <h3 className="mt-6 text-3xl font-black">
                  {activeStory.name}
                </h3>

                <p className="mt-2 text-lg text-white/70">
                  {activeStory.sport}
                </p>

                {activeStory.isLive && (
                  <span className="mt-6 rounded-full bg-red-600 px-5 py-2 text-sm font-black">
                    LIVE NOW
                  </span>
                )}
                {activeStory.userId === auth.currentUser?.uid && (
  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation()
      setShowViewers(true)
    }}
    className="absolute bottom-6 left-6 z-50 rounded-full bg-black/70 px-4 py-2 text-sm font-bold text-white backdrop-blur"
  >
    👥 {activeStory.views?.length || 0} Views
  </button>
)}
                {activeStory.linkUrl && (
  <a
    href={activeStory.linkUrl}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(event) => {
      event.stopPropagation()
    }}
    className="absolute bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full bg-white px-5 py-3 font-bold text-black shadow-xl"
  >
    Visit Link ↗
  </a>
)}
{/* Story reply + like controls */}
<div
  className="fixed bottom-8 left-1/2 z-[100] flex w-[90%] max-w-md -translate-x-1/2 items-center gap-3"
  onClick={(event) => event.stopPropagation()}
>
  <input
    type="text"
    value={storyReply}
    onChange={(event) => setStoryReply(event.target.value)}
    placeholder="Send a reply..."
    className="flex-1 rounded-full border border-white/70 bg-black/30 px-5 py-3 text-sm text-white placeholder:text-white/70 outline-none backdrop-blur"
  />

  <button
    type="button"
   onClick={async () => {
  const user = auth.currentUser

  if (!user) {
    alert("ERROR: No logged-in user")
    return
  }

  if (!activeStory) {
    alert("ERROR: No active story")
    return
  }

  const storyStateId = uploadStateId || stateId

  
  try {
    alert(
  "ACTIVE STORY\n" +
  "id: " + activeStory.id + "\n" +
  "firestoreId: " + activeStory.firestoreId + "\n" +
  "userId: " + activeStory.userId
)
    const liked = await toggleStoryLike(
      storyStateId,
      activeStory.firestoreId || activeStory.id,
      user.uid
    )

    alert(`FIRESTORE FINISHED: liked = ${liked}`)

    setStoryLiked(liked)

    setStoryLikeCount((count) =>
      liked ? count + 1 : Math.max(0, count - 1)
    )
  } catch (error) {
    alert(
      `FIRESTORE ERROR: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}}
    className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-3xl text-white"
    aria-label={storyLiked ? "Unlike story" : "Like story"}
  >
    {storyLiked ? "❤️" : "♡"}
  </button>
</div>
              </div>
            )}
          </div>
        </div>
      )}
      {showViewers && activeStory && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
    onClick={() => setShowViewers(false)}
  >
    <div
      className="w-full max-w-md rounded-2xl bg-white p-6 text-black shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Story Viewers
        </h2>

        <button
          type="button"
          onClick={() => setShowViewers(false)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {activeStory.views && activeStory.views.length > 0 ? (
        <div className="max-h-80 space-y-4 overflow-y-auto">
          {activeStory.views.map((viewer) => (
            <div
              key={viewer.userId}
              className="flex items-center gap-3 border-b border-gray-100 pb-3"
            >
              {viewer.avatarUrl ? (
                <img
                  src={viewer.avatarUrl}
                  alt={viewer.userName}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 font-bold">
                  {viewer.userName?.charAt(0).toUpperCase() || "?"}
                </div>
              )}

              <div>
                <p className="font-semibold">
                  {viewer.userName}
                </p>
                <p className="text-sm text-gray-500">
                  Viewed your story
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          No views yet.
        </div>
      )}
    </div>
  </div>
)}
    </>
  )
}
