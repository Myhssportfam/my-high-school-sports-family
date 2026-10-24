1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  runTransaction,
  where,
} from "firebase/firestore";


import { auth, db } from "./firebase";

export type StoryViewer = {
  userId: string;
  userName: string;
  avatarUrl?: string;
  viewedAt?: number;
};

// Older stories may contain only user IDs. Keep them readable.
export function getStoryViewers(views: unknown): StoryViewer[] {
  if (!Array.isArray(views)) return [];
  const viewers = new Map<string, StoryViewer>();
  for (const value of views) {
    const entry: unknown = typeof value === "string"
      ? { userId: value, userName: "Sports Family member" }
      : value;
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    if (typeof record.userId !== "string" || !record.userId) continue;
    const viewer: StoryViewer = {
      userId: record.userId,
      userName: typeof record.userName === "string" && record.userName.trim()
        ? record.userName : "Sports Family member",
      avatarUrl: typeof record.avatarUrl === "string" ? record.avatarUrl : "",
      viewedAt: typeof record.viewedAt === "number" ? record.viewedAt : undefined,
    };
    const existing = viewers.get(viewer.userId);
    if (!existing || (viewer.viewedAt ?? 0) > (existing.viewedAt ?? 0)) {
      viewers.set(viewer.userId, viewer);
    }
  }
  return Array.from(viewers.values()).sort(
    (a, b) => (b.viewedAt ?? 0) - (a.viewedAt ?? 0)
  );
}

export type FirestoreStory = {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt?: unknown;
  expiresAt: number;
  views: Array<string | StoryViewer>;
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
  callback: (stories: any[]) => void
) {
  if (!stateId) {
    callback([]);
    return () => {};
  }

  const storiesRef = collection(
    db,
    "stateStories",
    stateId,
    "stories"
  );

  const q = query(
    storiesRef,
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const stories = snapshot.docs
      .map((storyDoc) => ({
        id: storyDoc.id,
        ...storyDoc.data(),
      })) as any[];

    const activeStories = stories.filter(
      (story) => story.expiresAt > Date.now()
    );
console.log("ALL FIRESTORE STORIES:", stories);
console.log("ACTIVE FIRESTORE STORIES:", activeStories);
    callback(activeStories);
  });
}

export async function recordStoryView(
  stateId: string,
  storyId: string,
  viewerId: string,
  viewerName: string
) {
  const user = auth.currentUser;

  if (!stateId || !storyId || !viewerId || !user) return;
  if (user.uid !== viewerId) return;

  const storyReference = doc(
    db,
    "stateStories",
    stateId,
    "stories",
    storyId
  );

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(storyReference);

    if (!snapshot.exists()) return;

    const story = snapshot.data();

    if (story.userId === viewerId) return;
    if (story.expiresAt <= Date.now()) return;

    const currentViews = getStoryViewers(story.views);

    if (currentViews.some((viewer) => viewer.userId === viewerId)) {
      return;
    }

    transaction.update(storyReference, {
      views: arrayUnion({
        userId: viewerId,
        userName: viewerName.trim() || "Sports Family member",
        avatarUrl: user.photoURL || "",
        viewedAt: Date.now(),
      }),
    });
  });
}
export async function toggleStoryLike(
  stateId: string,
  storyId: string,
  userId: string
) {
  const user = auth.currentUser;

  if (!stateId || !storyId || !userId || !user) return false;
  if (user.uid !== userId) return false;

  const storyReference = doc(
    db,
    "stateStories",
    stateId,
    "stories",
    storyId
  );

  let liked = false;

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(storyReference);

    if (!snapshot.exists()) return;

    const story = snapshot.data();

    const currentLikes: string[] = Array.isArray(story.likes)
      ? story.likes
      : [];

    const alreadyLiked = currentLikes.includes(userId);

    const updatedLikes = alreadyLiked
      ? currentLikes.filter((id) => id !== userId)
      : [...currentLikes, userId];

    liked = !alreadyLiked;

    transaction.update(storyReference, {
      likes: updatedLikes,
      likeCount: updatedLikes.length,
    });
  });

  return liked;
}