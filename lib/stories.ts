import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";


import { db } from "./firebase";

export type FirestoreStory = {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt?: unknown;
  expiresAt: number;
  views: string[];
  likes: string[];
};

export async function createStory({
  stateId,
  userId,
  userName,
  avatarUrl,
  mediaUrl,
  mediaType,
}: {
  stateId: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
}) {
  return addDoc(
    collection(db, "stateStories", stateId, "stories"),
    {
    userId,
    userName,
    avatarUrl: avatarUrl || "",
    mediaUrl,
    mediaType,
    createdAt: serverTimestamp(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    views: [],
    likes: [],
  });
}

export function subscribeToActiveStories(
  stateId: string,
  onStoriesChange: (stories: FirestoreStory[]) => void
) {
  if (!stateId) {
  return () => {};
}
  const storiesQuery = query(
    collection(db, "stateStories", stateId, "stories"),
    where("expiresAt", ">", Date.now()),
    orderBy("expiresAt", "asc")
  )

  return onSnapshot(
    storiesQuery,
    (snapshot) => {
      const stories = snapshot.docs.map((document) => ({
        id: document.id,
        ...(document.data() as Omit<FirestoreStory, "id">),
      }));

      onStoriesChange(stories);
    },
    (error) => {
      console.error("Failed to load stories:", error);
    }
  );
}
export async function recordStoryView(
  stateId: string,
  storyId: string,
  viewerId: string,
  viewerName: string
) {
  if (!storyId || !viewerId) {
    return;
  }

  const storyReference = doc(db, "stateStories", stateId, "stories", storyId);

  await updateDoc(storyReference, {
    views: arrayUnion({
      userId: viewerId,
      userName: viewerName,
      viewedAt: Date.now(),
    }),
  });
}