import { ChangeEvent, useEffect, useRef, useState } from "react"

type MediaType = "Photo" | "Video"

type Story = {
  id: string
  name: string
  sport: string
  emoji: string
  mediaType?: MediaType
  mediaUrl?: string
  isLive?: boolean
  isUserStory?: boolean
}

type StoriesBarProps = {
  stateName?: string
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
  stateName = "Colorado",
}: StoriesBarProps) {
  const [stories, setStories] = useState<Story[]>(defaultStories)
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(
    null
  )
  const [storyProgress, setStoryProgress] = useState(0)
  const [isStoryMuted, setIsStoryMuted] = useState(true)

  const storyFileInputRef = useRef<HTMLInputElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const createdObjectUrlsRef = useRef<string[]>([])

  const activeStory =
    activeStoryIndex !== null ? stories[activeStoryIndex] : null

  const openStoryPicker = () => {
    storyFileInputRef.current?.click()
  }

  const handleStoryFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const isVideo = file.type.startsWith("video/")
    const isPhoto = file.type.startsWith("image/")

    if (!isVideo && !isPhoto) {
      window.alert("Please choose an image or video file.")
      event.target.value = ""
      return
    }

    const mediaUrl = URL.createObjectURL(file)
    createdObjectUrlsRef.current.push(mediaUrl)

    const newStory: Story = {
      id: `user-story-${Date.now()}`,
      name: "Your Story",
      sport: isVideo ? "Video" : "Photo",
      emoji: "YOU",
      mediaType: isVideo ? "Video" : "Photo",
      mediaUrl,
      isUserStory: true,
    }

    setStories((currentStories) => {
      const withoutOldUserUploads = currentStories.filter(
        (story) =>
          story.id === "your-story" || !story.id.startsWith("user-story-")
      )

      return [
        withoutOldUserUploads[0],
        newStory,
        ...withoutOldUserUploads.slice(1),
      ]
    })

    setActiveStoryIndex(1)
    setStoryProgress(0)
    event.target.value = ""
  }

  const openStory = (story: Story, index: number) => {
    if (story.id === "your-story" && !story.mediaUrl) {
      openStoryPicker()
      return
    }

    setActiveStoryIndex(index)
    setStoryProgress(0)
  }

  const closeStory = () => {
    setActiveStoryIndex(null)
    setStoryProgress(0)

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const showNextStory = () => {
    if (activeStoryIndex === null) {
      return
    }

    const nextIndex = activeStoryIndex + 1

    if (nextIndex >= stories.length) {
      closeStory()
      return
    }

    setActiveStoryIndex(nextIndex)
    setStoryProgress(0)
  }

  const showPreviousStory = () => {
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
    if (!activeStory) {
      return
    }

    setStoryProgress(0)

    if (activeStory.mediaType === "Video") {
      return
    }

    const duration = 5000
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
  }, [activeStoryIndex])

  useEffect(() => {
    return () => {
      createdObjectUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [])

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
          onChange={handleStoryFile}
          className="hidden"
        />

        <div className="flex gap-4 overflow-x-auto pb-2">
          {stories.map((story, index) => {
            const hasMedia = Boolean(story.mediaUrl)

            return (
              <button
                key={story.id}
                type="button"
                onClick={() => openStory(story, index)}
                className="min-w-[86px] text-center"
              >
                <div className="relative mx-auto h-[78px] w-[78px] rounded-full bg-gradient-to-br from-red-600 via-orange-500 to-blue-600 p-[3px]">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100">
                    {hasMedia && story.mediaType === "Video" ? (
                      <video
                        src={story.mediaUrl}
                        muted
                        playsInline
                        preload="metadata"
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
                          story.isUserStory
                            ? "text-xs font-black text-red-800"
                            : "text-3xl"
                        }
                      >
                        {story.emoji}
                      </span>
                    )}
                  </div>

                  {story.isLive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-md bg-red-600 px-2 py-1 text-[10px] font-black text-white">
                      LIVE
                    </span>
                  )}

                  {story.isUserStory && !hasMedia && (
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-sm font-bold text-white">
                      +
                    </span>
                  )}
                </div>

                <p className="mt-2 truncate text-sm font-bold text-gray-900">
                  {story.name}
                </p>

                <p className="truncate text-xs text-gray-500">
                  {story.sport}
                </p>
              </button>
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
              {activeStory.emoji}
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

          <div className="relative z-20 flex h-full max-h-[85vh] w-full max-w-md items-center justify-center overflow-hidden rounded-2xl bg-black">
            {activeStory.mediaUrl &&
            activeStory.mediaType === "Video" ? (
              <video
                key={activeStory.id}
                ref={videoRef}
                src={activeStory.mediaUrl}
                autoPlay
                muted={isStoryMuted}
                playsInline
                controls
                onTimeUpdate={(event) => {
                  const video = event.currentTarget

                  if (video.duration > 0) {
                    setStoryProgress(
                      (video.currentTime / video.duration) * 100
                    )
                  }
                }}
                onEnded={showNextStory}
                className="h-full w-full object-contain"
              />
            ) : activeStory.mediaUrl &&
              activeStory.mediaType === "Photo" ? (
              <img
                src={activeStory.mediaUrl}
                alt={activeStory.name}
                className="h-full w-full object-contain"
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
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}