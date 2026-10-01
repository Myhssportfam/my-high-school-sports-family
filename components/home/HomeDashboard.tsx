import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import StoriesBar from "../StoriesBar";
import HomeHeroMap from "../HomeHeroMap"
import InteractiveUSMap from "../InteractiveUSMap";
import { db, auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { schools } from "../../lib/schoolData";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  onSnapshot,
orderBy,
limit,
} from "firebase/firestore";
const liveGames = [
  {
    home: "Duncanville",
    away: "North Shore",
    homeScore: 21,
    awayScore: 14,
    status: "3rd Quarter",
    sport: "Football",
  },
  {
    home: "Allen",
    away: "Plano West",
    homeScore: 58,
    awayScore: 52,
    status: "4th Quarter",
    sport: "Basketball",
  },
  {
    home: "Katy",
    away: "Pearland",
    homeScore: 3,
    awayScore: 1,
    status: "5th Inning",
    sport: "Baseball",
  },
];

const arenaGames = [
  {
    title: "Texas vs Florida",
    game: "College Football 27",
    viewers: "1.8K",
  },
  {
    title: "California vs Ohio",
    game: "NBA 2K",
    viewers: "1.2K",
  },
  {
    title: "Georgia vs Alabama",
    game: "MLB The Show",
    viewers: "982",
  },
];

type TrendingAthlete = {
  id?: string;
  name: string;
  position: string;
  classYear: string;
  state: string;
  image: string;
  trendScore?: number;
};

const DEFAULT_TRENDING_ATHLETES: TrendingAthlete[] = [
  {
    name: "Jaden Williams",
    position: "QB",
    classYear: "2025",
    state: "Texas",
    image: "/athletes/jaden-williams.jpg",
    trendScore: 100,
  },
  {
    name: "Michael Brown",
    position: "WR",
    classYear: "2025",
    state: "Ohio",
    image: "/athletes/michael-brown.jpg",
    trendScore: 90,
  },
  {
    name: "Chris Davis",
    position: "ATH",
    classYear: "2026",
    state: "Georgia",
    image: "/athletes/chris-davis.jpg",
    trendScore: 80,
  },
];
type FeedPost = {
  id: string;
  userId: string;
  name: string;
  school: string;
  sport: string;
  classYear: string;
  state: string;
  image: string;
  profileImage: string;
  text: string;
  hashtags?: string;
  createdAt?: any;
};
const WEEKLY_STATES = [
  ["al", "Alabama"],
  ["ak", "Alaska"],
  ["az", "Arizona"],
  ["ar", "Arkansas"],
  ["ca", "California"],
  ["co", "Colorado"],
  ["ct", "Connecticut"],
  ["de", "Delaware"],
  ["fl", "Florida"],
  ["ga", "Georgia"],
  ["hi", "Hawaii"],
  ["id", "Idaho"],
  ["il", "Illinois"],
  ["in", "Indiana"],
  ["ia", "Iowa"],
  ["ks", "Kansas"],
  ["ky", "Kentucky"],
  ["la", "Louisiana"],
  ["me", "Maine"],
  ["md", "Maryland"],
  ["ma", "Massachusetts"],
  ["mi", "Michigan"],
  ["mn", "Minnesota"],
  ["ms", "Mississippi"],
  ["mo", "Missouri"],
  ["mt", "Montana"],
  ["ne", "Nebraska"],
  ["nv", "Nevada"],
  ["nh", "New Hampshire"],
  ["nj", "New Jersey"],
  ["nm", "New Mexico"],
  ["ny", "New York"],
  ["nc", "North Carolina"],
  ["nd", "North Dakota"],
  ["oh", "Ohio"],
  ["ok", "Oklahoma"],
  ["or", "Oregon"],
  ["pa", "Pennsylvania"],
  ["ri", "Rhode Island"],
  ["sc", "South Carolina"],
  ["sd", "South Dakota"],
  ["tn", "Tennessee"],
  ["tx", "Texas"],
  ["ut", "Utah"],
  ["vt", "Vermont"],
  ["va", "Virginia"],
  ["wa", "Washington"],
  ["wv", "West Virginia"],
  ["wi", "Wisconsin"],
  ["wy", "Wyoming"],
] as const;

function getFeaturedState() {
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const firstMonday = Date.UTC(2026, 0, 5);
  const weekNumber = Math.floor((Date.now() - firstMonday) / oneWeek);
  const index =
    ((weekNumber % WEEKLY_STATES.length) + WEEKLY_STATES.length) %
    WEEKLY_STATES.length;

  const [id, name] = WEEKLY_STATES[index];

  return { id, name };
}
function normalizeStateId(value?: string) {
  const normalizedValue = value?.trim().toLowerCase();

  if (!normalizedValue) {
    return "";
  }

  const matchingState = WEEKLY_STATES.find(
    ([id, name]) =>
      id === normalizedValue || name.toLowerCase() === normalizedValue
  );

  return matchingState?.[0] ?? "";
}
export default function HomeDashboard() {
  const featuredState = getFeaturedState();
  type TopSchoolSport =
  | "football"
  | "basketball"
  | "baseball"
  | "soccer"
  | "volleyball";

const topSchoolSports: Array<{
  id: TopSchoolSport;
  label: string;
}> = [
  { id: "football", label: "Football" },
  { id: "basketball", label: "Basketball" },
  { id: "baseball", label: "Baseball" },
  { id: "soccer", label: "Soccer" },
  { id: "volleyball", label: "Volleyball" },
];

const [topSchoolSport, setTopSchoolSport] =
  useState<TopSchoolSport>("football");

const featuredStateCode = featuredState.id.toUpperCase();

const featuredStateSchools = useMemo(
  () =>
    Object.values(schools).filter(
      (school) =>
        school.state === featuredStateCode &&
        school.sports?.[topSchoolSport]
    ),
  [featuredStateCode, topSchoolSport]
);



const topSchools = useMemo(() => {
 const schoolPool = featuredStateSchools;

  return schoolPool
   .sort((firstSchool, secondSchool) => {
  const firstRank =
    firstSchool.sports?.[topSchoolSport]?.rank ?? firstSchool.rank ?? 9999;

  const secondRank =
    secondSchool.sports?.[topSchoolSport]?.rank ?? secondSchool.rank ?? 9999;

  return firstRank - secondRank;
})
    .slice(0, 6);
}, [featuredStateSchools, topSchoolSport]);

const topSchoolsTitle = `Top Schools in ${featuredState.name}`;
    const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [feedTab, setFeedTab] = useState<
  "all" | "following" | "state" | "sports"
>("all");
  const [comment, setComment] = useState("");
  const [trendingAthletes, setTrendingAthletes] =
  useState<TrendingAthlete[]>(DEFAULT_TRENDING_ATHLETES);
  const [comments, setComments] = useState<string[]>([]);
const [saved, setSaved] = useState(false);
const [shareMessage, setShareMessage] = useState("");
const [currentUserId, setCurrentUserId] = useState<string | null>(null);
const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
const [userState, setUserState] = useState("");
const [userSports, setUserSports] = useState<string[]>([]);
const [followingIds, setFollowingIds] = useState<string[]>([]);

useEffect(() => {
  const loadPostData = async () => {
    try {
      const postRef = doc(db, "homePosts", "main-feed-post");
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const data = postSnap.data();

        setLikeCount(data.likeCount || 0);
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Error loading post data:", error);
    }
  };

  loadPostData();
}, []);
useEffect(() => {
  const postsQuery = query(
    collection(db, "homePosts"),
    orderBy("createdAt", "desc"),
    limit(25)
  );

  const unsubscribe = onSnapshot(
    postsQuery,
    (snapshot) => {
      const posts = snapshot.docs.map((postDoc) => ({
        id: postDoc.id,
        ...(postDoc.data() as Omit<FeedPost, "id">),
      }));

      setFeedPosts(posts);
    },
    (error) => {
      console.error("Error loading feed posts:", error);
    }
  );

  return () => unsubscribe();
}, []);
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setCurrentUserId(null);
      setUserState("");
setUserSports([]);
      setLiked(false);
      return;
    }

    setCurrentUserId(user.uid);
try {
  const profileSnapshot = await getDoc(doc(db, "users", user.uid));

  if (profileSnapshot.exists()) {
    const profileData = profileSnapshot.data();

    setUserState(
      normalizeStateId(
        profileData.stateId ||
          profileData.state ||
          profileData.stateCommunity
      )
    );

    setUserSports(
      Array.isArray(profileData.sports) ? profileData.sports : []
    );
  }
} catch (error) {
  console.error("Unable to load the user profile:", error);
  setUserState("");
  setUserSports([]);
}
    try {
      const likeRef = doc(
        db,
        "homePosts",
        "main-feed-post",
        "likes",
        user.uid
      );

      const likeSnap = await getDoc(likeRef);
      setLiked(likeSnap.exists());
    } catch (error) {
      console.error("Error checking user like:", error);
    }
  });

  return () => unsubscribe();
}, []);
useEffect(() => {
  const trendingQuery = query(
    collection(db, "athletes"),
    orderBy("trendScore", "desc"),
    limit(3)
  );

  const unsubscribe = onSnapshot(
    trendingQuery,
    (snapshot) => {
      if (snapshot.empty) {
        return;
      }

      const athletes = snapshot.docs.map((athleteDoc) => ({
        id: athleteDoc.id,
        ...(athleteDoc.data() as Omit<TrendingAthlete, "id">),
      }));

      setTrendingAthletes(athletes);
    },
    (error) => {
      console.error("Error loading trending athletes:", error);
    }
  );

  return () => unsubscribe();
}, []);
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setSaved(false);
      return;
    }

    try {
      const savedRef = doc(
        db,
        "homePosts",
        "main-feed-post",
        "savedBy",
        user.uid
      );

      const savedSnap = await getDoc(savedRef);
      setSaved(savedSnap.exists());
    } catch (error) {
      console.error("Error checking saved post:", error);
    }
  });

  return () => unsubscribe();
}, []);
const filteredFeedPosts = feedPosts.filter((post) => {
  if (feedTab === "all") {
    return true;
  }

  if (feedTab === "following") {
    return followingIds.includes(post.userId);
  }

  if (feedTab === "state") {
    return post.state === userState;
  }

  if (feedTab === "sports") {
    return userSports.includes(post.sport);
  }

  return true;
});
const handleLike = async () => {
  const user = auth.currentUser;

  if (!user) {
    alert("Please log in to like posts.");
    return;
  }

  try {
    const likeRef = doc(
      db,
      "homePosts",
      "main-feed-post",
      "likes",
      user.uid
    );

    const likesRef = collection(
      db,
      "homePosts",
      "main-feed-post",
      "likes"
    );

    const likeSnap = await getDoc(likeRef);

    if (likeSnap.exists()) {
      await deleteDoc(likeRef);
      setLiked(false);
    } else {
      await setDoc(likeRef, {
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      setLiked(true);
    }

    const likesSnapshot = await getDocs(likesRef);
    const newLikeCount = likesSnapshot.size;

    setLikeCount(newLikeCount);

    await setDoc(
      doc(db, "homePosts", "main-feed-post"),
      {
        likeCount: newLikeCount,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving like:", error);
  }
};
 

  const handleAddComment = async () => {
  const trimmedComment = comment.trim();

  if (!trimmedComment) return;

  try {
    const updatedComments = [...comments, trimmedComment];

    setComments(updatedComments);
    setComment("");

    const postRef = doc(db, "homePosts", "main-feed-post");

    await setDoc(
      postRef,
      {
        comments: updatedComments,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving comment:", error);
  }
};
  const handleShare = async () => {
  try {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: "My High School Sports Family",
        text: "Check out this post on My High School Sports Family",
        url,
      });

      setShareMessage("Shared!");
    } else {
      await navigator.clipboard.writeText(url);
      setShareMessage("Link copied!");
    }

    setTimeout(() => setShareMessage(""), 2000);
  } catch (error) {
    console.error("Share failed:", error);
  }
};
const handleSave = async () => {
  const user = auth.currentUser;

  if (!user) {
    alert("Please log in to save posts.");
    return;
  }

  try {
    const savedRef = doc(
      db,
      "homePosts",
      "main-feed-post",
      "savedBy",
      user.uid
    );

    const savedSnap = await getDoc(savedRef);

    if (savedSnap.exists()) {
      await deleteDoc(savedRef);
      setSaved(false);
    } else {
      await setDoc(savedRef, {
        userId: user.uid,
        savedAt: serverTimestamp(),
      });

      setSaved(true);
    }
  } catch (error) {
    console.error("Error saving post:", error);
  }
};
const handleAddTestPost = async () => {
  try {
    await addDoc(collection(db, "homePosts"), {
      userId: "jalen-thompson",
      name: "Jalen Thompson",
      school: "Central High School",
      sport: "Football",
      classYear: "2026",
      state: "Texas",
      profileImage: "/athletes/jalen-thompson.jpg",
      image: "/posts/jalen-thompson-highlight.jpg",
      text: "Great team win tonight! All glory to God. 🙏",
      hashtags: "#TeamFirst #BuiltDifferent",
      createdAt: serverTimestamp(),
    });

    alert("Test post added!");
  } catch (error) {
    console.error("Error adding test post:", error);
    alert("Could not add test post.");
  }
};
return (
  <div className="min-h-screen bg-[#020b14] text-white">
    <main className="mx-auto max-w-[1600px] px-4 py-4">
      
      {/* TOP ROW */}
      <section className="grid gap-0 xl:grid-cols-[0.78fr_1.55fr_0.82fr]">

        {/* LEFT HERO */}
        <article className="min-w-0 bg-[#03101b] px-6 py-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-300">
            My High School Sports Family
          </p>

          <h1 className="mt-5 text-[3.15rem] font-black leading-[1.03] tracking-tight">
            Every athlete
            <br />
            has a story.
            <br />
            <span className="text-blue-400">This is where</span>
            <br />
            all athletes
            <br />
            <span className="text-red-500">belong.</span>
          </h1>

          <p className="mt-6 max-w-sm text-base leading-7 text-gray-300">
            Connect with athletes, families, coaches, schools, and fans in every
            state. Share highlights, follow the journey, get discovered, and
            celebrate sports together.
          </p>

          <div className="mt-6 flex gap-3">
            <Link
  href="/signup"
  className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
>
  Join Your Sports Family
</Link>

            <Link
  href="/live"
  className="rounded-lg border border-white/20 px-5 py-3 font-bold text-white hover:bg-white/10"
>
  ▶ Watch Live
</Link>
          </div>
        </article>

        {/* CLICKABLE USA MAP */}
        <article className="min-w-0 overflow-hidden bg-[#07111d]">
  <HomeHeroMap />
</article>

        {/* LIVE NOW */}
        <aside className="min-w-0 border-l border-white/10 bg-[#04101b] p-4">
          

          <Link
  href="/live"
  className="mt-4 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center font-semibold text-white transition hover:bg-white/10"
>
  Open Live Center
</Link>
        </aside>
      </section>

      {/* LOWER ROW */}
      <section className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.15fr]">

        {/* STORIES + SCHOOLS */}
        <div className="min-w-0">
         <div className="mb-3 flex items-center justify-between">
  <div>
    <p className="text-xs font-bold uppercase tracking-widest text-red-500">
      State Spotlight of the Week
    </p>

    <h2 className="text-lg font-black text-white">
      {featuredState.name} Stories
    </h2>
  </div>

  <Link
    href={`/states/${featuredState.id}`}
    className="text-xs font-bold text-blue-400 hover:text-blue-300"
  >
    Visit community
  </Link>
</div>

<StoriesBar
  stateId={featuredState.id}
  stateName={featuredState.name}
  uploadStateId={userState}
/>

          <div className="mt-4 rounded-2xl border border-white/10 bg-[#07111d] p-4">
  <div className="flex items-start justify-between gap-3">
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-red-400">
        State rankings
      </p>

      <h2 className="font-black text-white">{topSchoolsTitle}</h2>
    </div>

    <Link
      href={`/states/${featuredState.id}/rankings`}
      className="shrink-0 text-xs font-bold text-blue-400 hover:text-blue-300"
    >
      View all
    </Link>
  </div>

  <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
    {topSchoolSports.map((sport) => (
      <button
        key={sport.id}
        type="button"
        onClick={() => setTopSchoolSport(sport.id)}
        className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
          topSchoolSport === sport.id
            ? "bg-red-600 text-white"
            : "bg-white/10 text-gray-300 hover:bg-white/20"
        }`}
      >
        {sport.label}
      </button>
    ))}
  </div>

  {topSchools.length === 0 ? (
    <p className="mt-4 text-sm text-gray-400">
      Rankings are coming soon for this sport.
    </p>
  ) : (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {topSchools.map((school) => {
        const sportRanking = school.sports?.[topSchoolSport];
        const rank = sportRanking?.rank ?? school.rank ?? "—";
        const record = sportRanking?.record ?? school.record;
        const initials = school.name
          .split(" ")
          .slice(0, 2)
          .map((word) => word[0])
          .join("");

        return (
          <Link
            key={school.id}
            href={`/schools/${school.id}`}
            className="group rounded-xl border border-white/10 bg-white/5 p-3 transition hover:-translate-y-0.5 hover:border-red-500/60 hover:bg-white/10"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-blue-700 text-sm font-black text-white">
                {initials}
              </div>

              <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-black text-white">
                #{rank}
              </span>
            </div>

            <p className="mt-3 min-h-[2.5rem] font-bold text-white">
              {school.name}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {school.city}, {school.state}
            </p>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-300">{record}</span>

              <span
                className={
                  school.movement && school.movement > 0
                    ? "font-bold text-emerald-400"
                    : school.movement && school.movement < 0
                    ? "font-bold text-red-400"
                    : "font-bold text-gray-400"
                }
              >
                {school.movement && school.movement > 0
                  ? `▲ ${school.movement}`
                  : school.movement && school.movement < 0
                  ? `▼ ${Math.abs(school.movement)}`
                  : "—"}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  )}
</div>
        </div>

        {/* MAIN FEED */}
        <div className="min-w-0 rounded-2xl border border-white/10 bg-[#07111d]">
  <div className="flex gap-8 border-b border-white/10 px-5 py-4 text-sm">
       <button
  onClick={() => setFeedTab("all")}
  className={`pb-2 ${
    feedTab === "all"
      ? "border-b-2 border-red-500 text-red-500"
      : "text-white"
  }`}
>
  All Feed
</button>

<button
  onClick={() => setFeedTab("following")}
  className={`pb-2 ${
    feedTab === "following"
      ? "border-b-2 border-red-500 text-red-500"
      : "text-white"
  }`}
>
  Following
</button>

<button
  onClick={() => setFeedTab("state")}
  className={`pb-2 ${
    feedTab === "state"
      ? "border-b-2 border-red-500 text-red-500"
      : "text-white"
  }`}
>
  Your State
</button>

<button
  onClick={() => setFeedTab("sports")}
  className={`pb-2 ${
    feedTab === "sports"
      ? "border-b-2 border-red-500 text-red-500"
      : "text-white"
  }`}
>
  Your Sports
</button>
</div>
         <div className="p-5 space-y-6">
  {filteredFeedPosts.length === 0 ? (
    <div className="py-12 text-center text-sm text-gray-400">
      {feedTab === "following" && "No posts from athletes you follow yet."}
      {feedTab === "state" && "No posts from your state yet."}
      {feedTab === "sports" && "No posts from your sports yet."}
      {feedTab === "all" && "No posts yet."}
    </div>
  ) : (
    filteredFeedPosts.map((post) => (
      <article
        key={post.id}
        className="border-b border-white/10 pb-6 last:border-b-0"
      >
        <div className="flex items-center gap-3">
          <img
            src={post.profileImage || "/profile-placeholder.png"}
            alt={post.name}
            className="h-11 w-11 rounded-full object-cover"
          />

          <div>
            <p className="font-bold">{post.name}</p>
            <p className="text-xs text-gray-400">
              {post.school} · {post.sport} · {post.classYear}
            </p>
          </div>
        </div>

        <p className="mt-4">{post.text}</p>

        {post.hashtags && (
          <p className="mt-1 text-sm text-blue-400">
            {post.hashtags}
          </p>
        )}

        {post.image && (
          <img
            src={post.image}
            alt={`${post.name} post`}
            className="mt-4 aspect-video w-full rounded-xl object-cover"
          />
        )}

        <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-sm text-gray-400">
          <button className="hover:text-white">♡ Like</button>
          <button className="hover:text-white">💬 Comment</button>
          <button className="hover:text-white">↗ Share</button>
          <button className="hover:text-white">▱ Save</button>
        </div>
      </article>
    ))
  )}
</div>
</div>
       
      </section>
    </main>
  </div>
)
}