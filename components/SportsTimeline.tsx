import { useEffect, useState } from "react";
import { auth, storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
export type TimelineStage = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  years?: string;
  organization?: string;
  sport?: string;
  achievements?: string;
stats?: string;
memories?: string;
  description?: string;
  photos?: string[];
videos?: string[];
music?: string[];
completed?: boolean;
};

const DEFAULT_TIMELINE: TimelineStage[] = [
  {
    id: "youth",
    title: "Youth Leagues",
    subtitle: "Where the journey started",
    icon: "🧒",
  },
  {
    id: "middle-school",
    title: "Middle School",
    subtitle: "Building the foundation",
    icon: "🏫",
  },
  {
    id: "high-school",
    title: "High School",
    subtitle: "Represent your school",
    icon: "🎓",
  },
  {
    id: "college",
    title: "College",
    subtitle: "The next level",
    icon: "🏛️",
  },
  {
    id: "professional",
    title: "Professional",
    subtitle: "Compete at the highest level",
    icon: "⭐",
  },
  {
    id: "alumni",
    title: "Alumni",
    subtitle: "Your legacy lives forever",
    icon: "🏆",
  },
];

type SportsTimelineProps = {
  initialTimeline?: TimelineStage[];
  onChange?: (timeline: TimelineStage[]) => void;
};
export default function SportsTimeline({
  initialTimeline = DEFAULT_TIMELINE,
  onChange,
}: SportsTimelineProps) {
  const [timeline, setTimeline] = useState<TimelineStage[]>(initialTimeline);
useEffect(() => {
  if (initialTimeline && initialTimeline.length > 0) {
    setTimeline(initialTimeline);
  }
}, [initialTimeline]);
  // Call onChange whenever the timeline is updated
  const updateTimeline = (newTimeline: TimelineStage[]) => {
    setTimeline(newTimeline);
    if (onChange) {
      onChange(newTimeline);
    }
  };
const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
async function uploadTimelineFiles(
  files: File[],
  stageId: string,
  mediaType: "photos" | "videos" | "music"
) {
  const urls: string[] = [];

  for (const file of files) {
    const safeName = file.name.replace(/\s+/g, "-");
    const userId = auth.currentUser?.uid;

if (!userId) {
  throw new Error("You must be signed in to upload timeline media.");
}

const fileRef = ref(
  storage,
  `sports-timeline/${userId}/${stageId}/${mediaType}/${Date.now()}-${safeName}`
);

    await uploadBytes(fileRef, file);

    const downloadURL = await getDownloadURL(fileRef);
    urls.push(downloadURL);
  }

  return urls;
}
  function updateStage(
  id: string,
  field: keyof TimelineStage,
  value: string | boolean | string[]
) {
  setTimeline((current) => {
    const updated = current.map((stage) =>
      stage.id === id
        ? {
            ...stage,
            [field]: value,
          }
        : stage
    );

    onChange?.(updated);

    return updated;
  });
}
  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-950 p-5 shadow-xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
            Sports Journey
          </p>

          <h2 className="mt-1 text-2xl font-black text-white">
            My Sports Timeline
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Your story from youth sports to alumni.
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 px-4 py-2 text-center">
          <div className="text-lg font-black text-white">
            {timeline.filter((item) => item.completed).length}
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Chapters
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute bottom-5 left-[22px] top-5 w-[2px] bg-white/10" />

        <div className="space-y-4">
          {timeline.map((stage) => {
            const editing = editingId === stage.id;

            return (
              <div
                key={stage.id}
                className="relative flex gap-4"
              >
                <div
                  className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-xl ${
                    stage.completed
                      ? "border-red-500 bg-red-600"
                      : "border-white/10 bg-zinc-900"
                  }`}
                >
                  {stage.icon}
                </div>

                <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-white">
                        {stage.title}
                    
                      </h3>

                    <p className="text-sm text-zinc-500">
  {stage.subtitle}
</p>

{stage.completed && (
  <span className="mt-3 inline-flex rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-300">
    ✓ Chapter Added
  </span>
)}
{!editing && (stage.organization || stage.years || stage.sport) && (
  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
    {stage.organization && (
      <span className="rounded-full bg-white/5 px-3 py-1">
        🏫 {stage.organization}
      </span>
    )}

    {stage.years && (
      <span className="rounded-full bg-white/5 px-3 py-1">
        📅 {stage.years}
      </span>
    )}

    {stage.sport && (
      <span className="rounded-full bg-white/5 px-3 py-1">
        🏅 {stage.sport}
      </span>
    )}

  </div>
)}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setEditingId(editing ? null : stage.id)
                      }
                      className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20"
                    >
                      {editing ? "Done" : "Edit"}
                    </button>
                  </div>

                  {stage.organization && !editing && (
                    <div className="mt-4">
                      <p className="font-bold text-white">
                        {stage.organization}
                      </p>

                      {stage.years && (
                        <p className="text-xs text-zinc-500">
                          {stage.years}
                        </p>
                      )}
</div>
)}
                     {!editing && (stage.achievements || stage.stats || stage.memories) && (
  <div className="mt-4 grid gap-3 md:grid-cols-3">
    {stage.achievements && (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
          🏆 Achievements
        </p>

        <p className="mt-2 text-sm leading-6 text-zinc-300">
          {stage.achievements}
        </p>
      </div>
    )}

    {stage.stats && (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
          📊 Stats
        </p>

        <p className="mt-2 text-sm leading-6 text-zinc-300">
          {stage.stats}
        </p>
      </div>
    )}

    {stage.memories && (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-red-400">
          ⭐ Memorable Moments
        </p>

        <p className="mt-2 text-sm leading-6 text-zinc-300">
          {stage.memories}
        </p>
      </div>
    )}
  </div>
)}

{/* PHOTOS */}
{stage.photos && stage.photos.length > 0 && (
  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
    {stage.photos.map((photo, index) => (
      <div
        key={`${photo}-${index}`}
        className="relative"
      >
        <button
  type="button"
  onClick={() => setSelectedPhoto(photo)}
  className="block w-full"
>
  <img
    src={photo}
    alt={`${stage.title} photo ${index + 1}`}
    className="h-36 w-full rounded-xl object-cover transition hover:opacity-90"
  />
</button>

        {editing && (
          <button
            type="button"
            onClick={() => {
              updateStage(
                stage.id,
                "photos",
                stage.photos?.filter((_, i) => i !== index) || []
              );
            }}
            className="absolute right-2 top-2 rounded-full bg-black/80 px-3 py-2 text-sm font-bold text-white"
          >
            ✕
          </button>
        )}
      </div>
    ))}
  </div>
)}
 

{/* VIDEOS */}
{stage.videos && stage.videos.length > 0 && (
  <div className="mt-4 space-y-4">
    {stage.videos.map((video, index) => (
      <div
        key={`${video}-${index}`}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-400">
              Highlight Video
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {stage.title} Highlight {index + 1}
            </p>
          </div>

          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-zinc-300">
            ▶ Video
          </span>
        </div>

        <video
          src={video}
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full bg-black object-cover"
        />

        {editing && (
          <button
            type="button"
            onClick={() => {
              updateStage(
                stage.id,
                "videos",
                stage.videos?.filter((_, i) => i !== index) || []
              );
            }}
            className="absolute right-3 top-3 rounded-full bg-black/80 px-3 py-2 text-sm font-bold text-white"
          >
            ✕
          </button>
        )}
      </div>
    ))}
  </div>
)}

{/* MUSIC */}
{stage.music && stage.music.length > 0 && (
  <div className="mt-4 space-y-3">
    {stage.music.map((song, index) => (
      <div
        key={`${song}-${index}`}
        className="relative rounded-2xl border border-white/10 bg-white/5 p-4"
      >
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-lg">
            🎵
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
              Chapter Soundtrack
            </p>

            <p className="text-sm font-semibold text-white">
              {stage.title} Track {index + 1}
            </p>
          </div>
        </div>

        <audio
          src={song}
          controls
          preload="metadata"
          className="w-full"
        />

        {editing && (
          <button
            type="button"
            onClick={() => {
              updateStage(
                stage.id,
                "music",
                stage.music?.filter((_, i) => i !== index) || []
              );
            }}
            className="absolute right-3 top-3 rounded-full bg-black/80 px-3 py-2 text-sm font-bold text-white"
          >
            ✕
          </button>
        )}
      </div>
    ))}
  </div>
)}
{((stage.photos?.length || 0) > 0 ||
  (stage.videos?.length || 0) > 0 ||
  (stage.music?.length || 0) > 0) && (
  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-zinc-400">
    {(stage.photos?.length || 0) > 0 && (
      <span className="rounded-full bg-white/5 px-3 py-1">
        📸 {stage.photos?.length} {stage.photos?.length === 1 ? "Photo" : "Photos"}
      </span>
    )}

    {(stage.videos?.length || 0) > 0 && (
      <span className="rounded-full bg-white/5 px-3 py-1">
        🎥 {stage.videos?.length} {stage.videos?.length === 1 ? "Video" : "Videos"}
      </span>
    )}

    {(stage.music?.length || 0) > 0 && (
      <span className="rounded-full bg-white/5 px-3 py-1">
        🎵 {stage.music?.length} {stage.music?.length === 1 ? "Song" : "Songs"}
      </span>
    )}
  </div>
)}
{!stage.organization && !editing && (
                    <p className="mt-4 text-sm text-zinc-500">
                      Add this chapter to your sports story.
                    </p>
                  )}

                  {editing && (
                    <div className="mt-4 space-y-3">
                      <input
                        type="text"
                        placeholder="Team, school, league or organization"
                        value={stage.organization || ""}
                        onChange={(e) =>
                          updateStage(
                            stage.id,
                            "organization",
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none"
                      />

                      <input
                        type="text"
                        placeholder="Years — example: 2018–2022"
                        value={stage.years || ""}
                        onChange={(e) =>
                          updateStage(
                            stage.id,
                            "years",
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none"
                      />
<input
  type="text"
  placeholder="Sport / activity — example: Football"
  value={stage.sport || ""}
  onChange={(e) =>
    updateStage(stage.id, "sport", e.target.value)
  }
  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
/>

<textarea
  placeholder="Achievements — championships, awards, honors..."
  value={stage.achievements || ""}
  onChange={(e) =>
    updateStage(stage.id, "achievements", e.target.value)
  }
  rows={3}
  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
/>

<textarea
  placeholder="Stats — touchdowns, points, batting average, records..."
  value={stage.stats || ""}
  onChange={(e) =>
    updateStage(stage.id, "stats", e.target.value)
  }
  rows={3}
  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
/>

<textarea
  placeholder="Memorable moments — big games, rivals, teammates, memories..."
  value={stage.memories || ""}
  onChange={(e) =>
    updateStage(stage.id, "memories", e.target.value)
  }
  rows={3}
  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
/>
                      <textarea
                        placeholder="Stats, memories, accomplishments, championships..."
                        value={stage.description || ""}
                        onChange={(e) =>
                          updateStage(
                            stage.id,
                            "description",
                            e.target.value
                          )
                        }
                        rows={3}
                        className="w-full resize-none rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none"
                      />

                      <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white/5 p-3">
                        <input
                          type="checkbox"
                          checked={stage.completed || false}
                          onChange={(e) =>
                            updateStage(
                              stage.id,
                              "completed",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4"
                        />

                        <span className="text-sm font-bold text-white">
                          Add this chapter to my timeline
                        </span>
                      </label>
                      {/* MEDIA UPLOADS */}
<div className="mt-5 border-t border-white/10 pt-5">
  <p className="mb-3 text-sm font-bold text-white">
    Add Media to This Chapter
  </p>

  <div className="flex flex-wrap gap-3">

    {/* PHOTOS */}
    <label className="cursor-pointer rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20">
      📷 Add Photos

      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={async (e) => {
  const files = Array.from(e.target.files || []);

  if (files.length === 0) return;

  const uploadedPhotos = await uploadTimelineFiles(
    files,
    stage.id,
    "photos"
  );

  updateStage(
    stage.id,
    "photos",
    [...(stage.photos || []), ...uploadedPhotos]
  );

  e.target.value = "";
}}
      />
    </label>

    {/* VIDEOS */}
    <label className="cursor-pointer rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20">
      🎥 Add Videos

      <input
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={async (e) => {
          const files = Array.from(e.target.files || []);
          if (files.length === 0) return;

          const uploadedVideos = await uploadTimelineFiles(
            files,
            stage.id,
            "videos"
          );

          updateStage(
            stage.id,
            "videos",
            [...(stage.videos || []), ...uploadedVideos]
          );

          e.target.value = "";
        }}
      />
    </label>

    {/* MUSIC */}
    <label className="cursor-pointer rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20">
      🎵 Add Music

      <input
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={async (e) => {
          const files = Array.from(e.target.files || []);

          if (files.length === 0) return;

          const uploadedMusic = await uploadTimelineFiles(
            files,
            stage.id,
            "music"
          );

          updateStage(
            stage.id,
            "music",
            [...(stage.music || []), ...uploadedMusic]
          );

          e.target.value = "";
        }}
      />
    </label>
         </div>
      </div>
    </div>
  )}

  </div>
</div>

);
})}

</div>
</div>
      {selectedPhoto && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
    onClick={() => setSelectedPhoto(null)}
  >
    <button
      type="button"
      onClick={() => setSelectedPhoto(null)}
      className="absolute right-6 top-6 rounded-full bg-white/10 px-4 py-2 text-xl font-bold text-white"
    >
      ✕
    </button>

    <img
      src={selectedPhoto}
      alt="Sports timeline"
      className="max-h-[90vh] max-w-[95vw] rounded-2xl object-contain"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
      )}
    </section>
  );
}