import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useUserProfile } from '../hooks/useUserProfile'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from '../lib/auth'
import { uploadFile } from '../lib/storage'
import SportsIdentity from "../components/SportsIdentity";
import SportsTimeline from "../components/SportsTimeline";
import SportsPassport from "../components/SportsPassport";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"
import {
  doc,
  getDoc,
  collection,
onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, storage } from "../lib/firebase"

// Cover Photo Upload
// ⬇️
// Profile Photo Upload
// ⬇️
// Display Name
// ⬇️
// Account Type
// ⬇️
// Bio
// ⬇️
// Upload Photos
// ⬇️
// Upload Videos
// 

type ProfileForm = {
  displayName?: string
  bio?: string
  city?: string
  state?: string
  stateId?: string 
  isPrivateProfile?: boolean
  sports?: string
  gradYear?: number | ''
  height?: string
  weight?: string
  position?: string
  schoolId?: string
  teamId?: string
  playstationGamertag?: string
xboxGamertag?: string
  recruiting?: string
  recruitingStatus?: string
  profileMusicUrl?: string
profileMusicName?: string
profileMediaUrl?: string
profileMediaType?: "image" | "video"
  role?: 'athlete' | 'coach' | 'cheerleader' | 'band' | 'fan' | 'parent' | 'trainer' | 'media'
  

}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const profileUserId = router.query.uid as string || user?.uid
  const { profile, loading: profileLoading } = useUserProfile(profileUserId)
  useEffect(() => {
    if (authLoading || profileLoading || !user || profileUserId !== user.uid) return
    if (profile && (!profile.state || !profile.stateId)) router.replace('/choose-state')
  }, [authLoading, profileLoading, user, profileUserId, profile, router])
  
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<ProfileForm>({})
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [profileMediaType, setProfileMediaType] =
  useState<"image" | "video">("image")

const [profileMediaUrl, setProfileMediaUrl] = useState("")

const [uploadingProfileMedia, setUploadingProfileMedia] =
  useState(false)
const [uploadingProfileMusic, setUploadingProfileMusic] =
  useState(false)
const [profileMusicUrl, setProfileMusicUrl] = useState("")
const [profileMusicName, setProfileMusicName] = useState("")

  useEffect(() => {
  if (!profile) return

  if (profile.profileMediaUrl) {
    setProfileMediaUrl(profile.profileMediaUrl)
  }

  if (profile.profileMediaType) {
    setProfileMediaType(profile.profileMediaType)
  }

  if (profile.profileMusicUrl) {
    setProfileMusicUrl(profile.profileMusicUrl)
  }

  if (profile.profileMusicName) {
    setProfileMusicName(profile.profileMusicName)
  }
}, [profile])
const [isPrivateProfile, setIsPrivateProfile] = useState(false)
const [isFollowing, setIsFollowing] = useState(false);
const [isFollowRequested, setIsFollowRequested] = useState(false)
const [goals, setGoals] = useState<
  { id: string; text: string; completed: boolean }[]
>([])

const [newGoal, setNewGoal] = useState('')
const [socialLoading, setSocialLoading] = useState(false);
const [followLoading, setFollowLoading] = useState(false);
const [followersCount, setFollowersCount] = useState(0)
const [followingCount, setFollowingCount] = useState(0)
const [activeProfileTab, setActiveProfileTab] = useState("Home")
const [postsCount, setPostsCount] = useState(0)
const [socialListOpen, setSocialListOpen] = useState<
  'followers' | 'following' | null
>(null)
const [savedPosts, setSavedPosts] = useState<any[]>([])
const [profileTab, setProfileTab] = useState<"posts" | "saved">("posts")
const [socialUsers, setSocialUsers] = useState<any[]>([])
const [editingOfferId, setEditingOfferId] = useState<string | null>(null)
// Main profile photo/video posts
const [profilePostFiles, setProfilePostFiles] = useState<File[]>([])
const [profilePostCaption, setProfilePostCaption] = useState('')
const [profilePostType, setProfilePostType] = useState<'photo' | 'video'>('photo')
const [postingProfileMedia, setPostingProfileMedia] = useState(false)
const [showProfileComposer, setShowProfileComposer] = useState(false)
const [profilePostsError, setProfilePostsError] = useState('')
const [profilePosts, setProfilePosts] = useState<any[]>([])
const [selectedPost, setSelectedPost] = useState<any | null>(null)
const [selectedPostLiked, setSelectedPostLiked] = useState(false)
const [selectedPostLikeCount, setSelectedPostLikeCount] = useState(0)
const [selectedPostSaved, setSelectedPostSaved] = useState(false)
const [sportsTimeline, setSportsTimeline] = useState<any[]>([])
const [showAddSeason, setShowAddSeason] = useState(false)
const [editingSeasonId, setEditingSeasonId] = useState<string | null>(null)
const [seasonYear, setSeasonYear] = useState("")
const [seasonSport, setSeasonSport] = useState("")
const [seasonSchool, setSeasonSchool] = useState("")
const [seasonTeam, setSeasonTeam] = useState("")
const [seasonPosition, setSeasonPosition] = useState("")
const [seasonStats, setSeasonStats] = useState("")
const [seasonAwards, setSeasonAwards] = useState("")
const [seasonNotes, setSeasonNotes] = useState("")
const [seasonMediaFile, setSeasonMediaFile] = useState<File | null>(null)
const [seasonMediaUrl, setSeasonMediaUrl] = useState("")
const [seasonMediaType, setSeasonMediaType] = useState<"image" | "video" | "">("")
const [originalSeasonMediaUrl, setOriginalSeasonMediaUrl] = useState("")
const [uploadingSeasonMedia, setUploadingSeasonMedia] = useState(false)
const [removeSeasonMedia, setRemoveSeasonMedia] = useState(false)
const [recruitingStatus, setRecruitingStatus] = useState("Open to Offers")
const [offerInput, setOfferInput] = useState("")
const [offerType, setOfferType] = useState("Scholarship Offer")
const [offerInterestLevel, setOfferInterestLevel] = useState("High")
const [offerOfficialVisit, setOfferOfficialVisit] = useState("")
const [offerNotes, setOfferNotes] = useState("")
const [recruitingEmail, setRecruitingEmail] = useState("")
const [recruitingPhone, setRecruitingPhone] = useState("")
const [recruitingContactName, setRecruitingContactName] = useState("")
const [recruitingContactRole, setRecruitingContactRole] = useState("")
const [offers, setOffers] = useState<any[]>([])
const [committedSchool, setCommittedSchool] = useState("")

// Main profile music
const [profileSongFile, setProfileSongFile] = useState<File | null>(null)
const [profileSongUrl, setProfileSongUrl] = useState('')
const [profileSongTitle, setProfileSongTitle] = useState('')
const [profileSongArtist, setProfileSongArtist] = useState('')
const [liveHistory, setLiveHistory] = useState<any[]>([])
const [arenaAccomplishments, setArenaAccomplishments] = useState<any[]>([])
const [alumniHistory, setAlumniHistory] = useState<any[]>([])
const [rivalHistory, setRivalHistory] = useState<any[]>([])
const [coachHistory, setCoachHistory] = useState<any[]>([])
const [uploadingSong, setUploadingSong] = useState(false)
const [showMusicComposer, setShowMusicComposer] = useState(false)
const [selectedPostComments, setSelectedPostComments] = useState<any[]>([])
const [newComment, setNewComment] = useState("")
const careerSeasonsCount = sportsTimeline.length
const [recruitingPrivateNotes, setRecruitingPrivateNotes] = useState("")
const hasBio = Boolean(profile?.bio?.trim())
const hasRecruitingContact = Boolean(
  recruitingEmail || recruitingPhone || recruitingContactName
)
const hasFeaturedHighlight = sportsTimeline.some(
  (season: any) => season.featured && season.mediaUrl
)
const careerStatsEntries = sportsTimeline.filter(
  (season: any) => season.stats?.trim()
)

const hasProfilePhoto = Boolean(profile?.avatarUrl)

const hasStats = careerStatsEntries.length > 0

const recruitingProfileCompletion = [
  hasProfilePhoto,
  hasBio,
  hasRecruitingContact,
  hasFeaturedHighlight,
  hasStats,
].filter(Boolean).length

const careerAwardsCount = sportsTimeline.filter(
  (season: any) => season.awards?.trim()
).length

const careerHighlightsCount = sportsTimeline.filter(
  (season: any) => season.mediaUrl
).length
useEffect(() => {
  if (!profile) return
setProfileSongUrl(profile.profileSongUrl || '')
setProfileSongTitle(profile.profileSongTitle || '')
setProfileSongArtist(profile.profileSongArtist || '')
setIsPrivateProfile((profile as any).isPrivateProfile || false)
setForm({
    displayName: profile.displayName || '',
    bio: profile.bio || '',
    city: profile.city || '',
    playstationGamertag:
  (profile as any).playstationGamertag ||
  (profile as any).playstationId ||
  '',
xboxGamertag:
  (profile as any).xboxGamertag || '',
    state:
      typeof router.query.state === 'string'
        ? router.query.state
        : profile.state || '',
    sports: (profile.sports || []).join(', '),
    gradYear: profile.gradYear || '',
    height: profile.height || '',
    weight: profile.weight || '',
    position: profile.position || '',
    schoolId: profile.schoolId || '',
    teamId: profile.teamId || '',
    recruiting: profile.recruiting?.profileUrl || '',
    stateId: profile.stateId || '',
  })
}, [profile, router.query.state])
useEffect(() => {
  setOffers(profile?.offers || [])
  setCommittedSchool(profile?.committedSchool || "")
}, [profile?.offers, profile?.committedSchool])
useEffect(() => {
  if (!router.isReady) return

  const selectedState =
    typeof router.query.state === 'string'
      ? router.query.state
      : ''

  const selectedStateId =
    typeof router.query.stateId === 'string'
      ? router.query.stateId
      : ''

  if (!selectedState && !selectedStateId) return

  setForm((current) => ({
    ...current,
    state: selectedState || current.state,
    stateId: selectedStateId || current.stateId,
  }))

  setEditing(true)
}, [router.isReady, router.query.state, router.query.stateId])
useEffect(() => {
  if (!profileUserId) return

  const userRef = doc(db, "users", profileUserId)

  const unsubscribe = onSnapshot(userRef, (snapshot) => {
    if (!snapshot.exists()) return

    const data = snapshot.data()

    setLiveHistory(
      Array.isArray(data.liveHistory) ? data.liveHistory : []
    )

    setArenaAccomplishments(
      Array.isArray(data.arenaAccomplishments)
        ? data.arenaAccomplishments
        : []
    )

    setAlumniHistory(
      Array.isArray(data.alumniHistory)
        ? data.alumniHistory
        : []
    )

    setRivalHistory(
      Array.isArray(data.rivalHistory)
        ? data.rivalHistory
        : []
    )

    setCoachHistory(
      Array.isArray(data.coachHistory)
        ? data.coachHistory
        : []
    )
  })

  return () => unsubscribe()
}, [profileUserId])
useEffect(() => {
  if (!profileUserId) return

  const followersRef = collection(
    db,
    "users",
    profileUserId,
    "followers"
  )

  const followingRef = collection(
    db,
    "users",
    profileUserId,
    "following"
  )

  const postsRef = collection(
    db,
    "users",
    profileUserId,
    "posts"
  )

  const unsubscribeFollowers = onSnapshot(
    followersRef,
    (snapshot) => {
      setFollowersCount(snapshot.size)
    }
  )

  const unsubscribeFollowing = onSnapshot(
    followingRef,
    (snapshot) => {
      setFollowingCount(snapshot.size)
    }
  )

  const unsubscribePosts = onSnapshot(
    postsRef,
   (snapshot) => {
  const posts = snapshot.docs.map((postDoc) => ({
    id: postDoc.id,
    ...postDoc.data(),
  }))

  setProfilePostsError('')
  setProfilePosts(posts)
  setPostsCount(posts.length)
},
(error) => {
  console.error("Could not load profile posts:", error)
  setProfilePosts([])
  setPostsCount(0)
  setProfilePostsError("Could not load highlights and posts. " + error.message)
}
  )

  return () => {
    unsubscribeFollowers()
    unsubscribeFollowing()
    unsubscribePosts()
  }
  }, [profileUserId])
  
  useEffect(() => {
  if (profile?.recruitingStatus) {
    setRecruitingStatus(profile.recruitingStatus)
  }
}, [profile?.recruitingStatus])
useEffect(() => {
  setRecruitingPrivateNotes(profile?.recruitingPrivateNotes || "")
}, [profile?.recruitingPrivateNotes])
useEffect(() => {
  setRecruitingEmail(profile?.recruitingEmail || "")
  setRecruitingPhone(profile?.recruitingPhone || "")
  setRecruitingContactName(profile?.recruitingContactName || "")
  setRecruitingContactRole(profile?.recruitingContactRole || "")
}, [
  profile?.recruitingEmail,
  profile?.recruitingPhone,
  profile?.recruitingContactName,
  profile?.recruitingContactRole,
])
  useEffect(() => {
  if (!selectedPost || !profileUserId) {
    setSelectedPostLiked(false)
    setSelectedPostLikeCount(0)
    return
  }

  const currentUser = auth.currentUser

  const likesRef = collection(
    db,
    "users",
    profileUserId,
    "posts",
    selectedPost.id,
    "likes"
  )

  const unsubscribeLikes = onSnapshot(likesRef, (snapshot) => {
    setSelectedPostLikeCount(snapshot.size)

    if (currentUser) {
      setSelectedPostLiked(
        snapshot.docs.some((likeDoc) => likeDoc.id === currentUser.uid)
      )
    } else {
      setSelectedPostLiked(false)
    }
  })

  return () => unsubscribeLikes()
}, [selectedPost, profileUserId])
useEffect(() => {
  if (!selectedPost || !profileUserId) {
    setSelectedPostComments([])
    return
  }

  const commentsRef = collection(
    db,
    "users",
    profileUserId,
    "posts",
    selectedPost.id,
    "comments"
  )

  const unsubscribeComments = onSnapshot(commentsRef, (snapshot) => {
    const comments = snapshot.docs.map((commentDoc) => ({
      id: commentDoc.id,
      ...commentDoc.data(),
    }))

    setSelectedPostComments(comments)
  })

  return () => unsubscribeComments()
}, [selectedPost, profileUserId])
useEffect(() => {
  const currentUser = auth.currentUser

  if (!currentUser || !selectedPost || !profileUserId) {
    setSelectedPostSaved(false)
    return
  }

  const savedPostRef = doc(
    db,
    "users",
    currentUser.uid,
    "savedPosts",
    `${profileUserId}_${selectedPost.id}`
  )

  const unsubscribeSaved = onSnapshot(savedPostRef, (snapshot) => {
    setSelectedPostSaved(snapshot.exists())
  })

  return () => unsubscribeSaved()
}, [selectedPost, profileUserId])
useEffect(() => {
  const currentUser = auth.currentUser

  if (!currentUser) {
    setSavedPosts([])
    return
  }

  const savedPostsRef = collection(
    db,
    "users",
    currentUser.uid,
    "savedPosts"
  )

  const unsubscribeSavedPosts = onSnapshot(savedPostsRef, (snapshot) => {
    const items = snapshot.docs.map((savedDoc) => ({
      id: savedDoc.id,
      ...savedDoc.data(),
    }))

    setSavedPosts(items)
  })

  return () => unsubscribeSavedPosts()
}, [user?.uid])
useEffect(() => {
  if (!profileUserId) {
    setSportsTimeline([])
    return
  }

  const profileRef = doc(db, "users", profileUserId)

  const unsubscribe = onSnapshot(profileRef, (snapshot) => {
    if (!snapshot.exists()) {
      setSportsTimeline([])
      return
    }

    const data = snapshot.data()

    setSportsTimeline(
      Array.isArray(data.sportsTimeline) ? data.sportsTimeline : []
    )
  })

  return () => unsubscribe()
}, [profileUserId])


  if (authLoading || profileLoading) return <div className="container py-8">Loading...</div>

async function handleSaveCommitment() {
  const currentUser = auth.currentUser
  if (!currentUser) return

  try {
    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        committedSchool: committedSchool.trim(),
        recruitingStatus: committedSchool.trim()
          ? "Committed"
          : recruitingStatus,
      },
      { merge: true }
    )

    if (committedSchool.trim()) {
      setRecruitingStatus("Committed")
    }
  } catch (error) {
    console.error("Failed to save commitment:", error)
    alert("Commitment could not be saved.")
  }
}
async function handleAddOffer() {
  const currentUser = auth.currentUser
  const school = offerInput.trim()
function handleEditOffer(offer: any) {
  setEditingOfferId(offer.id)
  setOfferInput(offer.school || "")
  setOfferType(offer.offerType || "Scholarship Offer")
  setOfferInterestLevel(offer.interestLevel || "High")
  setOfferOfficialVisit(offer.officialVisit || "")
  setOfferNotes(offer.notes || "")
}
  if (!currentUser || !school) return

  const newOffer = {
    id: Date.now().toString(),
    school,
    offerType,
    interestLevel: offerInterestLevel,
    officialVisit: offerOfficialVisit.trim(),
    notes: offerNotes.trim(),
  }
  const updatedOffers = editingOfferId
  ? offers.map((offer: any) =>
      offer.id === editingOfferId
        ? {
            ...newOffer,
            id: editingOfferId,
          }
        : offer
    )
  : [...offers, newOffer]

  try {
    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        offers: updatedOffers,
      },
      { merge: true }
    )

    setOffers(updatedOffers)
    setOfferInput("")
    setOfferType("Scholarship Offer")
    setOfferInterestLevel("High")
    setOfferOfficialVisit("")
    setOfferNotes("")
    setEditingOfferId(null)
  } catch (error) {
    console.error("Failed to add offer:", error)
    alert("Offer could not be added.")
  }
}

async function handleUncommit() {
  const currentUser = auth.currentUser
  if (!currentUser) return

  const confirmed = window.confirm(
    "Are you sure you want to remove your commitment?"
  )

  if (!confirmed) return

  try {
    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        committedSchool: "",
        recruitingStatus: "Open",
      },
      { merge: true }
    )

    setCommittedSchool("")
    setRecruitingStatus("Open")
  } catch (error) {
    console.error("Failed to remove commitment:", error)
    alert("Commitment could not be removed.")
  }
}


  async function handleSaveRecruitingContact() {
  const currentUser = auth.currentUser

  if (!currentUser) {
    alert("You must be signed in.")
    return
  }
  }
  async function saveProfile() {
    if (!user) return
    setSaving(true)
    setError(null)
    try {
      const updates: any = {}

updates.isPrivateProfile = isPrivateProfile

if (form.displayName) updates.displayName = form.displayName
      if (form.bio) updates.bio = form.bio
      if (form.city) updates.city = form.city
    updates.playstationGamertag = (
  form.playstationGamertag || ""
).trim();

updates.playstationId = (
  form.playstationGamertag || ""
).trim();

updates.xboxGamertag = (
  form.xboxGamertag || ""
).trim();

if (!form.state) {
  setError("You must choose a State Community before saving your profile.");
  setSaving(false);
  return;
}

const stateSlugMap: Record<string, string> = {
  Alabama: 'al',
  Alaska: 'ak',
  Arizona: 'az',
  Arkansas: 'ar',
  California: 'ca',
  Colorado: 'co',
  Connecticut: 'ct',
  Delaware: 'de',
  Florida: 'fl',
  Georgia: 'ga',
  Hawaii: 'hi',
  Idaho: 'id',
  Illinois: 'il',
  Indiana: 'in',
  Iowa: 'ia',
  Kansas: 'ks',
  Kentucky: 'ky',
  Louisiana: 'la',
  Maine: 'me',
  Maryland: 'md',
  Massachusetts: 'ma',
  Michigan: 'mi',
  Minnesota: 'mn',
  Mississippi: 'ms',
  Missouri: 'mo',
  Montana: 'mt',
  Nebraska: 'ne',
  Nevada: 'nv',
  'New Hampshire': 'nh',
  'New Jersey': 'nj',
  'New Mexico': 'nm',
  'New York': 'ny',
  'North Carolina': 'nc',
  'North Dakota': 'nd',
  Ohio: 'oh',
  Oklahoma: 'ok',
  Oregon: 'or',
  Pennsylvania: 'pa',
  'Rhode Island': 'ri',
  'South Carolina': 'sc',
  'South Dakota': 'sd',
  Tennessee: 'tn',
  Texas: 'tx',
  Utah: 'ut',
  Vermont: 'vt',
  Virginia: 'va',
  Washington: 'wa',
  'West Virginia': 'wv',
  Wisconsin: 'wi',
  Wyoming: 'wy',
}

updates.state = form.state
updates.stateId =
  form.stateId ||
  stateSlugMap[form.state] ||
  form.state.toLowerCase().trim().replace(/\s+/g, "-")
updates.stateCommunity = form.state
      if (form.sports) updates.sports = form.sports.split(',').map((s) => s.trim())
      if (form.gradYear) updates.gradYear = Number(form.gradYear)
      if (form.height) updates.height = form.height
      if (form.weight) updates.weight = form.weight
      if (form.position) updates.position = form.position
      if (form.schoolId) updates.schoolId = form.schoolId
      if (form.teamId) updates.teamId = form.teamId
      if (form.recruiting) updates.recruiting = { profileUrl: form.recruiting, status: profile?.recruiting?.status || 'open' }

      if (avatarFile) {
        const path = `avatars/${user.uid}/${Date.now()}-${avatarFile.name}`
        const url = await uploadFile(avatarFile, path)
        updates.avatarUrl = url
      }
      if (coverFile) {
        const path = `covers/${user.uid}/${Date.now()}-${coverFile.name}`
        const url = await uploadFile(coverFile, path)
        updates.coverUrl = url
      }
if (form.role) updates.role = form.role
      updates.updatedAt = serverTimestamp()
      await setDoc(doc(db, 'users', user.uid), updates, { merge: true })
      setEditing(false)
    } catch (e: any) {
      setError(e.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }
const handleFollow = async () => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    alert("Please sign in first.");
    return;
  }

  if (!profileUserId) {
    alert("This profile could not be found.");
    return;
  }

  if (currentUser.uid === profileUserId) {
    alert("You cannot follow your own profile.");
    return;
  }

  try {
    setSocialLoading(true);
if (isPrivateProfile && !isFollowing) {
  const requestRef = doc(
    db,
    "users",
    profileUserId,
    "followRequests",
    currentUser.uid
  )

  await setDoc(requestRef, {
    requesterId: currentUser.uid,
    profileUserId,
    status: "pending",
    createdAt: serverTimestamp(),
  })

  setIsFollowRequested(true)
  return
}
    const followRef = doc(
      db,
      "users",
      currentUser.uid,
      "following",
      profileUserId
    );

    const followerRef = doc(
      db,
      "users",
      profileUserId,
      "followers",
      currentUser.uid
    );

    const followSnapshot = await getDoc(followRef);

    if (followSnapshot.exists()) {
      await deleteDoc(followRef);
      await deleteDoc(followerRef);
      setIsFollowing(false);
    } else {
      const followData = {
        createdAt: serverTimestamp(),
      };

      await setDoc(followRef, {
        ...followData,
        userId: profileUserId,
      });

      await setDoc(followerRef, {
        ...followData,
        userId: currentUser.uid,
      });

      setIsFollowing(true);
    }
  } catch (error) {
    console.error("Follow error:", error);
    alert("Follow could not be completed.");
  } finally {
    setSocialLoading(false);
  }
};

const handleMessage = () => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    alert("Please sign in first.");
    return;
  }

  if (!profileUserId) {
    alert("This profile could not be found.");
    return;
  }

  if (currentUser.uid === profileUserId) {
    alert("You cannot message yourself.");
    return;
  }

  router.push(`/messages?userId=${profileUserId}`);
};

const handleShareProfile = async () => {
  const profileUrl = window.location.href;

  try {
    if (navigator.share) {
      await navigator.share({
        title: "My High School Sports Family Profile",
        text: "View this profile on My High School Sports Family.",
        url: profileUrl,
      });
    } else {
      await navigator.clipboard.writeText(profileUrl);
      alert("Profile link copied.");
    }
  } catch (error) {
    console.error("Share error:", error);
  }
};
async function handleAddPostComment() {
  const currentUser = auth.currentUser

  if (!currentUser || !selectedPost || !profileUserId) {
    alert("You must be signed in to comment.")
    return
  }

  const comment = newComment.trim()

  if (!comment) return

  try {
    await setDoc(
      doc(
        db,
        "users",
        profileUserId,
        "posts",
        selectedPost.id,
        "comments",
        `${Date.now()}`
      ),
      {
        userId: currentUser.uid,
        text: comment,
        createdAt: serverTimestamp(),
      }
    )

    setNewComment("")
  } catch (error) {
    console.error("Failed to add comment:", error)
    alert("Could not add comment.")
  }
}
async function handleTogglePostLike() {
  const currentUser = auth.currentUser

  if (!currentUser || !selectedPost || !profileUserId) {
    alert("You must be signed in to like a post.")
    return
  }

  try {
    const likeRef = doc(
      db,
      "users",
      profileUserId,
      "posts",
      selectedPost.id,
      "likes",
      currentUser.uid
    )

    if (selectedPostLiked) {
      await deleteDoc(likeRef)
    } else {
      await setDoc(likeRef, {
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      })
    }
  } catch (error) {
    console.error("Failed to update like:", error)
    alert("Could not update like.")
  }
}
const handleToggleSavePost = async () => {
  const currentUser = auth.currentUser

  if (!currentUser || !selectedPost) {
    alert("You must be signed in to save posts.")
    return
  }

  try {
    const saveRef = doc(
      db,
      "users",
      currentUser.uid,
      "savedPosts",
      selectedPost.id
    )

    const saveSnapshot = await getDoc(saveRef)

    if (saveSnapshot.exists()) {
      await deleteDoc(saveRef)
      setSelectedPostSaved(false)
    } else {
      await setDoc(saveRef, {
        userId: profileUserId,
        postId: selectedPost.id,
        savedAt: serverTimestamp(),
      })
      setSelectedPostSaved(true)
    }
  } catch (error) {
    console.error("Failed to toggle save post:", error)
    alert("Could not save post.")
  }
}
   async function handleProfileMediaPost() {
  const currentUser = auth.currentUser

  if (!currentUser || currentUser.uid !== profileUserId) {
    alert("You must be signed in to post.")
    return
  }

  if (profilePostFiles.length === 0) {
    alert(`Choose one or more ${profilePostType}s first.`)
    return
  }

  if (postingProfileMedia) return
  const expectedType = profilePostType === 'photo' ? 'image/' : 'video/'
  if (profilePostFiles.some((file) => !file.type.startsWith(expectedType))) {
    alert(`Please select only ${profilePostType} files.`)
    return
  }

  try {
    setPostingProfileMedia(true)

    const uploadTime = Date.now()

    await Promise.all(
      profilePostFiles.map(async (file, index) => {
        const mediaType: "photo" | "video" =
          file.type.startsWith("video/") ? "video" : "photo"

        const path = `profile-posts/${currentUser.uid}/${uploadTime}-${index}-${file.name}`
        const mediaUrl = await uploadFile(file, path)

        await setDoc(
          doc(
            db,
            "users",
            currentUser.uid,
            "posts",
            `${uploadTime}-${index}`
          ),
          {
            userId: currentUser.uid,
            type: mediaType,
            mediaUrl,
            caption: profilePostCaption.trim(),
            state: profile?.state || "",
            createdAt: serverTimestamp(),
          }
        )
      })
    )

    const uploadedCount = profilePostFiles.length

    setProfilePostFiles([])
    setProfilePostCaption("")
    setShowProfileComposer(false)

    alert(`${uploadedCount} files posted!`)
  } catch (error) {
    console.error("Failed to post profile media:", error)
    alert(error instanceof Error ? `Upload failed: ${error.message}` : "Your files could not be uploaded.")
  } finally {
    setPostingProfileMedia(false)
  }
}

async function handleUploadProfileSong() {
  const currentUser = auth.currentUser

  if (!currentUser) {
    alert('You must be signed in to add profile music.')
    return
  }

  if (!profileSongFile) {
    alert('Choose an audio file first.')
    return
  }

  try {
    setUploadingSong(true)

    const path = `profile-music/${currentUser.uid}/${Date.now()}-${profileSongFile.name}`

    const songUrl = await uploadFile(profileSongFile, path)

    await setDoc(
      doc(db, 'users', currentUser.uid),
      {
        profileSongUrl: songUrl,
        profileSongTitle: profileSongTitle.trim(),
        profileSongArtist: profileSongArtist.trim(),
        profileSongUpdatedAt: serverTimestamp(),
      },
      { merge: true }
    )

    setProfileSongUrl(songUrl)
    setProfileSongFile(null)
    setShowMusicComposer(false)

    alert('Profile music added!')
  } catch (error) {
    console.error('Failed to upload profile music:', error)
    alert('Profile music could not be uploaded.')
  } finally {
    setUploadingSong(false)
  }
}
async function handleAddSeason() {
  const currentUser = auth.currentUser

  if (!currentUser) {
    alert("You must be signed in to save a season.")
    return
  }

  if (!seasonYear.trim() || !seasonSport.trim()) {
    alert("Please add at least a season year and sport.")
    return
  }

  try {
    setUploadingSeasonMedia(true)

    let finalMediaUrl = seasonMediaUrl
    let finalMediaType = seasonMediaType
if (removeSeasonMedia) {
  finalMediaUrl = ""
  finalMediaType = ""
}
    if (seasonMediaFile) {
      const safeFileName = seasonMediaFile.name.replace(/\s+/g, "-")

      const mediaRef = ref(
        storage,
        `season-highlights/${currentUser.uid}/${Date.now()}-${safeFileName}`
        
      )

      await uploadBytes(mediaRef, seasonMediaFile)

      finalMediaUrl = await getDownloadURL(mediaRef)

      if (seasonMediaFile.type.startsWith("image/")) {
        finalMediaType = "image"
      } else if (seasonMediaFile.type.startsWith("video/")) {
        finalMediaType = "video"
      }
    }

    const seasonData = {
      id: editingSeasonId || Date.now().toString(),
      year: seasonYear.trim(),
      sport: seasonSport.trim(),
      school: seasonSchool.trim(),
      team: seasonTeam.trim(),
      position: seasonPosition.trim(),
      stats: seasonStats.trim(),
      awards: seasonAwards.trim(),
      notes: seasonNotes.trim(),

      mediaUrl: finalMediaUrl,
      mediaType: finalMediaType,
featured: editingSeasonId
  ? sportsTimeline.find((season: any) => season.id === editingSeasonId)?.featured || false
  : false,
      updatedAt: new Date().toISOString(),
    }

    const updatedTimeline = editingSeasonId
      ? sportsTimeline.map((season: any) =>
          season.id === editingSeasonId ? seasonData : season
        )
      : [seasonData, ...sportsTimeline]

    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        sportsTimeline: updatedTimeline,
      },
      { merge: true }
    )
if (
  editingSeasonId &&
  originalSeasonMediaUrl &&
  (
    removeSeasonMedia ||
    (seasonMediaFile && finalMediaUrl !== originalSeasonMediaUrl)
  )
) {
  try {
    const oldMediaRef = ref(storage, originalSeasonMediaUrl)
    await deleteObject(oldMediaRef)
  } catch (deleteError) {
    console.warn(
      "Old season highlight could not be deleted from Storage:",
      deleteError
    )
  }
}
    setSportsTimeline(updatedTimeline)

    setSeasonYear("")
    setSeasonSport("")
    setSeasonSchool("")
    setSeasonTeam("")
    setSeasonPosition("")
    setSeasonStats("")
    setSeasonAwards("")
    setSeasonNotes("")

    setSeasonMediaFile(null)
    setSeasonMediaUrl("")
    setSeasonMediaType("")
    setRemoveSeasonMedia(false)
    setOriginalSeasonMediaUrl("")
    setEditingSeasonId(null)
    setShowAddSeason(false)
  } catch (error) {
    console.error("Failed to save sports season:", error)
    alert("Season could not be saved.")
  } finally {
    setUploadingSeasonMedia(false)
  }
}
{/* CAREER SNAPSHOT */}
<div className="mt-5">
  <div className="mb-3">
    <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
      Career Snapshot
    </p>

    <h3 className="text-lg font-black mt-1">
      Athlete Career
    </h3>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div className="border rounded-xl p-3 text-center">
      <p className="text-2xl font-black">
        {careerSeasonsCount}
      </p>
      <p className="text-xs text-gray-500 font-semibold mt-1">
        Seasons
      </p>
    </div>

    <div className="border rounded-xl p-3 text-center">
      <p className="text-2xl font-black">
        {careerStatsEntries.length}
      </p>
      <p className="text-xs text-gray-500 font-semibold mt-1">
        Stat Records
      </p>
    </div>

    <div className="border rounded-xl p-3 text-center">
      <p className="text-2xl font-black">
        {careerAwardsCount}
      </p>
      <p className="text-xs text-gray-500 font-semibold mt-1">
        Awards
      </p>
    </div>
{/* RECRUITING PROFILE READINESS */}
<div className="mt-5 border rounded-2xl p-4">
  <div className="flex items-center justify-between gap-3 mb-4">
    <div>
      <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
        Recruiting Readiness
      </p>

      <h3 className="font-black text-lg mt-1">
        {recruitingProfileCompletion}/5 Complete
      </h3>
    </div>

    <span className="text-sm font-bold">
      {Math.round((recruitingProfileCompletion / 5) * 100)}%
    </span>
  </div>

  <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
    <div
      className="h-full bg-green-500"
      style={{
        width: `${(recruitingProfileCompletion / 5) * 100}%`,
      }}
    />
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-sm">
  <button
    type="button"
    onClick={() => scrollToProfileSection("profile-details")}
    className="text-left border rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
  >
    {hasProfilePhoto ? "✅" : "⬜"} Profile Photo
  </button>

  <button
    type="button"
    onClick={() => scrollToProfileSection("profile-details")}
    className="text-left border rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
  >
    {hasBio ? "✅" : "⬜"} Athlete Bio
  </button>

  <button
    type="button"
    onClick={() => scrollToProfileSection("sports-timeline")}
    className="text-left border rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
  >
    {hasStats ? "✅" : "⬜"} Career Stats
  </button>

  <button
    type="button"
    onClick={() => scrollToProfileSection("sports-timeline")}
    className="text-left border rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
  >
    {hasFeaturedHighlight ? "✅" : "⬜"} Featured Highlight
  </button>

  <button
    type="button"
    onClick={() => scrollToProfileSection("recruiting-contact")}
    className="text-left border rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
  >
    {hasRecruitingContact ? "✅" : "⬜"} Recruiting Contact
  </button>
</div>
</div>
    <div className="border rounded-xl p-3 text-center">
      <p className="text-2xl font-black">
        {careerHighlightsCount}
      </p>
      <p className="text-xs text-gray-500 font-semibold mt-1">
        Highlights
      </p>
    </div>
  </div>

  {careerStatsEntries.length > 0 && (
    <div className="mt-4 space-y-2">
      {careerStatsEntries
        .slice()
        .sort(
          (a: any, b: any) =>
            Number(b.year || 0) - Number(a.year || 0)
        )
        .slice(0, 3)
        .map((season: any, index: number) => (
          <div
            key={season.id || index}
            className="border rounded-xl p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-bold">
                {season.sport || "Sport"}
              </p>

              <span className="text-xs font-semibold text-gray-500">
                {season.year || ""}
              </span>
            </div>

            <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
              {season.stats}
            </p>
          </div>
        ))}
    </div>
  )}
</div>
    
async function handleDeleteSeason(seasonId: string) {
  const currentUser = auth.currentUser

  if (!currentUser) {
    alert("You must be signed in.")
    return
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete this season?"
  )

  if (!confirmed) return

  try {
    const seasonToDelete = sportsTimeline.find(
  (season: any) => season.id === seasonId
)
const hasProfilePhoto = Boolean(profile?.avatarUrl)

const updatedTimeline = sportsTimeline.filter(
  (season: any) => season.id !== seasonId
)

    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        sportsTimeline: updatedTimeline,
      },
      { merge: true }
    )
if (seasonToDelete?.mediaUrl) {
  try {
    const mediaRef = ref(storage, seasonToDelete.mediaUrl)
    await deleteObject(mediaRef)
  } catch (deleteMediaError) {
    console.warn(
      "Season highlight could not be deleted from Storage:",
      deleteMediaError
    )
  }
}
    setSportsTimeline(updatedTimeline)
  } catch (error) {
    console.error("Failed to delete season:", error)
    alert("Season could not be deleted.")
  }
}
function handleEditSeason(season: any) {
  setEditingSeasonId(season.id)

  setSeasonYear(season.year || "")
  setSeasonSport(season.sport || "")
  setSeasonSchool(season.school || "")
  setSeasonTeam(season.team || "")
  setSeasonPosition(season.position || "")
  setSeasonStats(season.stats || "")
  setSeasonAwards(season.awards || "")
  setSeasonNotes(season.notes || "")
setSeasonMediaUrl(season.mediaUrl || "")
setSeasonMediaType(season.mediaType || "")
setOriginalSeasonMediaUrl(season.mediaUrl || "")
setRemoveSeasonMedia(false)
  setShowAddSeason(true)
}

async function handleFeatureSeason(seasonId: string) {
  const currentUser = auth.currentUser

  if (!currentUser) {
    alert("You must be signed in.")
    return
  }

  try {
    const selectedSeason = sportsTimeline.find(
      (season: any) => season.id === seasonId
    )
function scrollToProfileSection(sectionId: string) {
  if (typeof document === "undefined") return

  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}
    const willFeature = !selectedSeason?.featured

    const updatedTimeline = sportsTimeline.map((season: any) => ({
      ...season,
      featured: willFeature ? season.id === seasonId : false,
    }))

    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        sportsTimeline: updatedTimeline,
      },
      { merge: true }
    )

    setSportsTimeline(updatedTimeline)
  } catch (error) {
    console.error("Failed to feature season:", error)
    alert("Featured season could not be updated.")
  }
}
const spotlightVideo = [...profilePosts]
  .filter((post) => post.type === 'video' && post.mediaUrl)
  .sort((a, b) => (b.createdAt?.toMillis?.() || Number(b.id?.split('-')[0]) || 0) - (a.createdAt?.toMillis?.() || Number(a.id?.split('-')[0]) || 0))[0]
const isOwnProfile = Boolean(user && user.uid === profileUserId)
const canViewPrivateProfile =
  !isPrivateProfile || isOwnProfile || isFollowing
const careerSports = Array.from(
  
  new Set(
    sportsTimeline
      .map((season: any) => season.sport?.trim())
      .filter(Boolean)
  )
)

const careerSchools = Array.from(
  new Set(
    sportsTimeline
      .map((season: any) => season.school?.trim())
      .filter(Boolean)
  )
)
function handleEditOffer(offer: any) {
  setEditingOfferId(offer.id)
  setOfferInput(offer.school || "")
  setOfferType(offer.offerType || "Scholarship Offer")
  setOfferInterestLevel(offer.interestLevel || "High")
  setOfferOfficialVisit(offer.officialVisit || "")
  setOfferNotes(offer.notes || "")
}
async function handleRemoveOffer(offerId: string) {
  const currentUser = auth.currentUser

  if (!currentUser) {
    alert("You must be signed in.")
    return
  }

  const updatedOffers = offers.filter(
    (offer: any) => offer.id !== offerId
  )

  try {
    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        offers: updatedOffers,
      },
      { merge: true }
    )

    setOffers(updatedOffers)

    if (editingOfferId === offerId) {
      setEditingOfferId(null)
      setOfferInput("")
      setOfferType("Scholarship Offer")
      setOfferInterestLevel("High")
      setOfferOfficialVisit("")
      setOfferNotes("")
    }
  } catch (error) {
    console.error("Failed to remove offer:", error)
    alert("Offer could not be removed.")
  }
}

async function handleCommitToOffer(offer: any) {
  const currentUser = auth.currentUser
  if (!currentUser) return

  const school = offer.school?.trim()
  if (!school) return

  try {
    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        committedSchool: school,
        recruitingStatus: "Committed",
      },
      { merge: true }
    )

    setCommittedSchool(school)
    setRecruitingStatus("Committed")
  } catch (error) {
    console.error("Failed to commit to school:", error)
    alert("Commitment could not be saved.")
  }
}
async function handleShareRecruitingProfile() {
  const profileUrl =
    typeof window !== "undefined" ? window.location.href : ""

  const athleteName = profile?.displayName || "Athlete"
const hasProfilePhoto = Boolean(profile?.avatarUrl)
const hasBio = Boolean(profile?.bio?.trim())
const hasRecruitingContact = Boolean(
  recruitingEmail || recruitingPhone || recruitingContactName
)
const hasFeaturedHighlight = sportsTimeline.some(
  (season: any) => season.featured && season.mediaUrl
)
const hasStats = careerStatsEntries.length > 0

const recruitingProfileCompletion = [
  hasProfilePhoto,
  hasBio,
  hasRecruitingContact,
  hasFeaturedHighlight,
  hasStats,
].filter(Boolean).length
  const shareData = {
    title: `${athleteName} Recruiting Profile`,
    text: `Check out ${athleteName}'s recruiting profile on My High School Sports Family.`,
    url: profileUrl,
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(profileUrl)
      alert("Recruiting profile link copied!")
    }
  } catch (error) {
    console.error("Could not share recruiting profile:", error)
  }
}
function scrollToProfileSection(sectionId: string) {
  if (typeof document === "undefined") return

  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}
async function saveSportsTimeline(
  timeline: {
    id: string;
    title: string;
    subtitle?: string;
    icon?: string;
    years?: string;
    organization?: string;
    description?: string;
    photos?: string[];
videos?: string[];
music?: string[];
    completed?: boolean;
  }[]
) {
  if (!user?.uid) return;

  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        sportsTimeline: timeline,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Failed to save sports timeline:", error);
  }
}
async function saveSportsIdentity(data: {
  activity: string;
  role: string;
}) {
  if (!user?.uid) return;

  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        sports: data.activity ? [data.activity] : [],
        activityRole: data.role,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Failed to save sports identity:", error);
  }
}
async function handleProfileMediaUpload(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0]

  if (!file) return

  try {
    setUploadingProfileMedia(true)

    const isVideo = file.type.startsWith("video/")
    const mediaType: "image" | "video" = isVideo ? "video" : "image"

    const url = await uploadFile(
  file,
  `profiles/${profileUserId}/${Date.now()}-${file.name}`
)

    setProfileMediaType(mediaType)
setProfileMediaUrl(url)

if (!profileUserId) {
  throw new Error("No profile user ID found")
}

await setDoc(
  doc(db, "users", profileUserId),
  {
    profileMediaUrl: url,
    profileMediaType: mediaType,

    // Keep image uploads compatible with your current avatar system
    ...(mediaType === "image" ? { avatarUrl: url } : {}),
  },
  { merge: true }
)

console.log("Profile media saved:", url)
  } catch (error) {
    console.error("Profile media upload failed:", error)
  } finally {
    setUploadingProfileMedia(false)
  }
}
async function handleProfileMusicUpload(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0]

  if (!file || !profileUserId) return
  if (auth.currentUser?.uid !== profileUserId) {
    alert("Sign in to your own profile to add music.")
    return
  }

  try {
    setUploadingProfileMusic(true)

    if (!file.type.startsWith("audio/")) {
      alert("Please choose an audio file.")
      return
    }

    const url = await uploadFile(
      file,
      `profiles/${profileUserId}/music/${Date.now()}-${file.name}`
    )

    await setDoc(
      doc(db, "users", profileUserId),
      {
        profileMusicUrl: url,
        profileMusicName: file.name,
      },
      { merge: true }
    )

    setProfileMusicUrl(url)
    setProfileMusicName(file.name)
  } catch (error) {
    console.error("Profile music upload failed:", error)
    alert(error instanceof Error ? `Music upload failed: ${error.message}` : "Music could not be uploaded.")
  } finally {
    setUploadingProfileMusic(false)
  }
}
  return ( 

    <div className="min-h-screen bg-black text-white">
    {showProfileComposer && isOwnProfile && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label="Create media post">
      <div id="profile-post-composer" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-white/20 bg-zinc-950 p-6 text-white">
        <h3 className="font-bold">
          {profilePostType === 'photo' ? 'Create Photo Post' : 'Create Video Post'}
        </h3>

       <input
  type="file"
  multiple
  disabled={postingProfileMedia}
  aria-label="Choose photos or videos"
  accept={profilePostType === 'photo' ? 'image/*' : 'video/*'}
  onChange={(e) =>
    setProfilePostFiles(Array.from(e.target.files ?? []))
  }
  className="mt-4 block w-full"
/>

        <textarea
          value={profilePostCaption}
          onChange={(e) => setProfilePostCaption(e.target.value)}
          placeholder="Write a caption..."
          disabled={postingProfileMedia}
          className="mt-4 min-h-[100px] w-full rounded-xl border bg-zinc-900 text-white p-3"
        />

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={handleProfileMediaPost}
            disabled={ profilePostFiles.length === 0|| postingProfileMedia}
            className="rounded-xl bg-red-600 px-5 py-2 font-bold text-white disabled:opacity-50"
          >
            {postingProfileMedia
              ? 'Posting...'
              : profilePostType === 'photo'
              ? 'Post Photo'
              : 'Post Video'}
          </button>

          <button
            type="button"
            disabled={postingProfileMedia}
            onClick={() => {
              setShowProfileComposer(false)
              setProfilePostFiles([])
              setProfilePostCaption('')
            }}
            className="rounded-xl border px-5 py-2 font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
      </div>
    )}

      {/* NEW ATHLETE HERO */}
<section className="w-full border-b border-white/10 bg-black">
  <div className="mx-auto max-w-7xl px-6 py-10">

    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

      {/* PROFILE INFO */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

       <div className="flex flex-col items-center gap-3">

  <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-red-600 bg-zinc-900">

    {profileMediaType === "video" && profileMediaUrl ? (
      <video
        src={profileMediaUrl}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      />
    ) : (
      <img
        src={
          profileMediaUrl ||
          profile?.avatarUrl ||
          "/default-avatar.png"
        }
        alt="Athlete profile"
        className="h-full w-full object-cover"
      />
    )}

  </div>

  <label className="cursor-pointer rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10">

    {uploadingProfileMedia
      ? "Uploading..."
      : "Add Photo or Video"}

    <input
      type="file"
      accept="image/*,video/*"
      onChange={handleProfileMediaUpload}
      disabled={uploadingProfileMedia}
      className="hidden"
    />

  </label>

</div>

        <div>
          <h1 className="text-3xl font-black text-white">
            {profile?.displayName || "Sports Family Member"}
          </h1>

          <p className="mt-2 text-lg font-semibold text-zinc-300">
            {(profile?.sports || []).join(", ") || "Sport"}
            {profile?.position ? ` • ${profile.position}` : ""}
          </p>

          <button
  type="button"
  onClick={() => {
    if (profile?.stateId) {
      router.push(`/states/${profile.stateId}`)
    }
  }}
  className="mt-1 text-left text-sm font-bold text-blue-400 hover:text-blue-300 hover:underline"
>
  {profile?.state || "State"} Sports Family
</button>

          <div className="mt-5 flex flex-wrap gap-3">
            <button className="rounded-xl bg-red-600 px-5 py-2 font-bold text-white hover:bg-red-500">
              Follow
            </button>

            <button className="rounded-xl border border-white/20 bg-white/5 px-5 py-2 font-bold text-white hover:bg-white/10">
              Message
            </button>

            <button className="rounded-xl border border-white/20 bg-white/5 px-5 py-2 font-bold text-white hover:bg-white/10">
              Share Profile
            </button>
          </div>
        </div>
      </div>

      {/* COUNTS */}
      <div className="grid grid-cols-3 gap-8 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-5">

        <div className="text-center">
          <div className="text-2xl font-black">0</div>
          <div className="text-xs font-bold uppercase text-zinc-500">
            Posts
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-black">
            {followersCount}
          </div>
          <div className="text-xs font-bold uppercase text-zinc-500">
            Followers
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-black">
            {followingCount}
          </div>
          <div className="text-xs font-bold uppercase text-zinc-500">
            Following
          </div>
        </div>

      </div>
    </div>

    {/* ATHLETE DETAILS */}
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs font-bold uppercase text-zinc-500">School</p>
        <p className="mt-1 font-bold">
        {profile?.schoolId || "Not Added"}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs font-bold uppercase text-zinc-500">Class</p>
        <p className="mt-1 font-bold">
          {profile?.gradYear || "—"}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs font-bold uppercase text-zinc-500">Height</p>
        <p className="mt-1 font-bold">
          {profile?.height || "—"}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs font-bold uppercase text-zinc-500">Weight</p>
        <p className="mt-1 font-bold">
          {profile?.weight || "—"}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs font-bold uppercase text-zinc-500">Position</p>
        <p className="mt-1 font-bold">
          {profile?.position || "—"}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs font-bold uppercase text-zinc-500">State</p>
        <p className="mt-1 font-bold">
          {profile?.state || "—"}
        </p>
      </div>

    </div>
  </div>
</section>

{/* PROFILE TABS */}
<div className="w-full border-b border-white/10 bg-black/95">
  <div className="mx-auto flex max-w-7xl gap-8 overflow-x-auto px-6">

    {[
      "Home",
      "Highlights",
      "Timeline",
      "Stats",
      "Recruiting",
      "Arena",
      "About",
    ].map((tab) => (
      <button
  key={tab}
  onClick={() => setActiveProfileTab(tab)}
  className={`whitespace-nowrap border-b-2 py-4 text-sm font-bold transition ${
    activeProfileTab === tab
      ? "border-red-500 text-white"
      : "border-transparent text-zinc-400 hover:text-white"
  }`}
>
  {tab}
</button>
    ))}

  </div>
</div>
{/* =========================
    NEW PROFILE HOME
========================= */}

{activeProfileTab === "Home" && (
  <main className="mx-auto w-full max-w-7xl px-5 py-8">

    {/* WELCOME / ATHLETE OVERVIEW */}
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
      <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-white to-red-600" />

      <div className="p-6 md:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">
              My Sports Family
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              {profile?.displayName || "Sports Family Member"}
            </h2>

            <p className="mt-2 text-zinc-400">
              Build your sports story. Represent your state. Leave your legacy.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-xl bg-red-600 px-5 py-3 font-bold hover:bg-red-500">
              + Add Post
            </button>

            <button
              onClick={() => setEditing(true)}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold hover:bg-white/10"
            >
              Edit Profile
            </button>
            {editing && (
  <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:items-center">
    <form
      onSubmit={saveProfile}
      className="my-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-zinc-900 p-6 text-white"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit Profile</h2>

        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-2xl text-zinc-400 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block font-semibold">
            PlayStation Gamertag
          </label>

          <input
            type="text"
            value={form.playstationGamertag || ""}
            onChange={(e) =>
              setForm({
                ...form,
                playstationGamertag: e.target.value,
              })
            }
            placeholder="Enter PlayStation Gamertag"
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            Xbox Gamertag
          </label>

          <input
            type="text"
            value={form.xboxGamertag || ""}
            onChange={(e) =>
              setForm({
                ...form,
                xboxGamertag: e.target.value,
              })
            }
            placeholder="Enter Xbox Gamertag"
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-green-500"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="flex-1 rounded-xl border border-white/20 px-5 py-3 font-bold"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-xl bg-red-600 px-5 py-3 font-bold hover:bg-red-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  </div>
)}
          </div>

        </div>
      </div>
    </section>
{/* PROFILE SOUNDTRACK */}
<section className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-5">
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-400">
        Profile Soundtrack
      </p>

      <h3 className="mt-1 text-xl font-black text-white">
        🎵 My Music
      </h3>

      <p className="mt-1 text-sm text-zinc-500">
        {profileMusicName || "Add music to your sports profile"}
      </p>
    </div>

    <label className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10">
      {uploadingProfileMusic ? "Uploading..." : "+ Add Music"}

      <input
        type="file"
        accept="audio/*"
        onChange={handleProfileMusicUpload}
        disabled={uploadingProfileMusic}
        className="hidden"
      />
    </label>
  </div>

  {profileMusicUrl && (
    <div className="mt-5">
      <audio
        controls
        preload="metadata"
        src={profileMusicUrl}
        className="w-full"
      />
    </div>
  )}
</section>

    {/* MAIN DASHBOARD */}
    <div className="mt-6 grid gap-6 lg:grid-cols-3">

      {/* FEATURED MEDIA */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 lg:col-span-2">

        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
              Featured
            </p>

            <h3 className="mt-1 text-xl font-black">
              Athlete Spotlight
            </h3>
          </div>

         {isOwnProfile && (<button
  type="button"
  onClick={() => {
    setProfilePostType('video')
    setProfilePostFiles([])
    setShowProfileComposer(true)


  }}
  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-bold text-white"
>
  + Add Highlight
</button>)}
        </div>

        {isOwnProfile && profilePostsError && <p role="alert" className="px-5 pt-4 text-sm text-red-400">{profilePostsError}</p>}
        {!canViewPrivateProfile ? (
          <p className="p-6 text-zinc-400">This profile is private.</p>
        ) : spotlightVideo ? (
          <div className="p-5">
            <video key={spotlightVideo.mediaUrl} src={spotlightVideo.mediaUrl} controls playsInline preload="metadata" className="max-h-[520px] w-full rounded-xl bg-black" />
            {spotlightVideo.caption && <p className="mt-3 text-sm text-zinc-300">{spotlightVideo.caption}</p>}
          </div>
        ) : (
        <div className="flex min-h-[380px] items-center justify-center bg-black">
          <div className="px-6 text-center">
            <div className="text-5xl">▶</div>

            <h3 className="mt-5 text-xl font-black">
              Show Your Biggest Moment
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Highlights, game footage, live replays and sports memories.
            </p>
          </div>
        </div>
        )}

      </section>


      {/* SPORTS IDENTITY */}
      <section className="rounded-3xl border border-white/10 bg-zinc-950 p-6">

        <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-400">
          Sports Identity
        </p>

        <h3 className="mt-2 text-2xl font-black">
          Who I Represent
        </h3>

        <div className="mt-6 space-y-3">

          <div className="rounded-2xl border border-white/5 bg-white/[0.04] p-4">
            <p className="text-xs font-bold uppercase text-zinc-500">
              Role
            </p>

            <p className="mt-1 text-lg font-black capitalize">
              {profile?.role || "Member"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.04] p-4">
            <p className="text-xs font-bold uppercase text-zinc-500">
              Position
            </p>

            <p className="mt-1 text-lg font-black">
              {profile?.position || "Not Added"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.04] p-4">
            <p className="text-xs font-bold uppercase text-zinc-500">
              State Family
            </p>

            <p className="mt-1 text-lg font-black">
              {profile?.state ? (
                <Link href={`/states/${profile.stateId || profile.state.toLowerCase()}`} className="text-blue-300 hover:underline">
                  {profile.state} Sports Family
                </Link>
              ) : "Choose a State Community"}
            </p>
          </div>

        </div>

      </section>

    </div>


    {/* FEATURE CARDS */}
    <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      <button
        onClick={() => setActiveProfileTab("Timeline")}
        className="rounded-3xl border border-white/10 bg-zinc-950 p-6 text-left transition hover:-translate-y-1 hover:border-blue-500/50"
      >
        <div className="text-3xl">🏆</div>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.25em] text-blue-400">
          Sports Journey
        </p>

        <h3 className="mt-2 text-2xl font-black">
          My Sports Timeline
        </h3>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Youth leagues, middle school, high school, college and alumni.
        </p>

        <p className="mt-6 font-black text-white">
          View Timeline →
        </p>
      </button>


      <button
        onClick={() => setActiveProfileTab("Recruiting")}
        className="rounded-3xl border border-white/10 bg-zinc-950 p-6 text-left transition hover:-translate-y-1 hover:border-red-500/50"
      >
        <div className="text-3xl">🎯</div>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.25em] text-red-500">
          Recruiting
        </p>

        <h3 className="mt-2 text-2xl font-black">
          Recruiting Center
        </h3>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Recruiting status, coach contact information, offers and highlights.
        </p>

        <p className="mt-6 font-black text-white">
          Open Recruiting →
        </p>
      </button>


      <button
        onClick={() => setActiveProfileTab("Arena")}
        className="rounded-3xl border border-white/10 bg-zinc-950 p-6 text-left transition hover:-translate-y-1 hover:border-purple-500/50"
      >
        <div className="text-3xl">🎮</div>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.25em] text-purple-400">
          Gaming
        </p>

        <h3 className="mt-2 text-2xl font-black">
          Arena Career
        </h3>

        <p className="mt-3 text-sm leading-6 text-zinc-400">
          State battles, tournaments, wins and gaming accomplishments.
        </p>

        <p className="mt-6 font-black text-white">
          View Arena →
        </p>
      </button>

    </div>


    {/* ATHLETE LEGACY */}
    <section className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-8">

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">
            Connected Sports History
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Athlete Legacy
          </h2>

          <p className="mt-2 max-w-2xl text-zinc-400">
            Your accomplishments across sports, live events, recruiting,
            Arena and your career become one permanent sports history.
          </p>
        </div>

        <button
          onClick={() => setActiveProfileTab("Timeline")}
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold hover:bg-white/10"
        >
          View Legacy
        </button>

      </div>


      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

        {[
          ["0", "Live Events"],
          ["0", "Replays"],
          ["0", "Arena Wins"],
          ["0", "Awards"],
          ["0", "Rivals"],
          ["0", "Coaches"],
        ].map(([number, label]) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-black p-5 text-center"
          >
            <div className="text-3xl font-black">
              {number}
            </div>

            <div className="mt-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
              {label}
            </div>
          </div>
        ))}

      </div>

    </section>

  </main>
)}
<div className={activeProfileTab === "Home" ? "hidden" : "block"}>

      <div className="relative h-56 md:h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
        {profile?.coverUrl ? <img src={profile.coverUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">Cover photo</div>}
        <div className="absolute -bottom-16 left-6 z-10">
    <img
  src={profile?.avatarUrl || '/default-avatar.png'}
  alt="avatar"
  className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-xl"
/>
        </div>
       <div className="absolute top-4 right-4">
  <button
    type="button"
    className="px-3 py-1 border rounded"
    onClick={() => {
      const openingEditor = !editing
      setEditing(openingEditor)

      if (openingEditor) {
        setTimeout(() => {
          document
            .getElementById('gaming-ids-editor')
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
        }, 100)
      }
    }}
  >
    {editing ? 'Cancel' : 'Edit profile'}
  </button>
</div>
</div>
      <div className="mt-20 max-w-3xl mx-auto px-4">
        {!editing ? (
          <>
            <h1 className="text-2xl font-bold">{profile?.displayName}</h1>
            <p className="mt-1 inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-bold capitalize text-red-700">
  {profile?.role || 'Sports Family Member'}
</p>
<div className="mt-5 grid grid-cols-3 max-w-md border-y border-gray-200 dark:border-gray-700 py-4 text-center">
  <button
  type="button"
  onClick={() => {
    document
      .getElementById("profile-posts")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
  className="text-center"
>
  <div className="text-xl font-bold">{postsCount}</div>
  <div className="text-xs uppercase tracking-wide text-gray-500">
    Posts
  </div>
</button>

  <button
  type="button"
  onClick={() => setSocialListOpen('followers')}
  className="text-center"
>
  <div className="text-xl font-bold">{followersCount}</div>
  <div className="text-xs uppercase tracking-wide text-gray-500">
    Followers
  </div>
</button>

  <button
  type="button"
  onClick={() => setSocialListOpen('following')}
  className="text-center"
>
  <div className="text-xl font-bold">{followingCount}</div>
  <div className="text-xs uppercase tracking-wide text-gray-500">
    Following
  </div>
</button>
</div>
<div className="mt-8 space-y-6">
  <SportsPassport
  name={profile?.displayName || "Sports Family Member"}
  avatarUrl={profile?.avatarUrl}
  sport={(profile?.sports || []).join(", ")}
  role={profile?.role || "Sports Family Member"}
  position={profile?.position}
  state={profile?.state || ""}
  classYear={
    profile?.gradYear !== undefined
      ? String(profile.gradYear)
      : undefined
  }
  followers={followersCount}
  achievements={[]}
  verified={false}
/>
  <SportsIdentity
  initialActivity={(profile?.sports || [])[0] || ""}
  initialRole={profile?.activityRole || profile?.role || ""}
  onChange={saveSportsIdentity}
/>
<section className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
  <div className="mb-4">
    <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">
      Arena Identity
    </p>
    <h2 className="mt-1 text-2xl font-black text-gray-950">
      Gaming IDs
    </h2>
  </div>

  <div className="grid gap-4 sm:grid-cols-2">
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
        PlayStation
      </p>
      <p className="mt-2 text-lg font-black text-gray-950">
        {(profile as any)?.playstationGamertag ||
          (profile as any)?.playstationId ||
          'Not added'}
      </p>
    </div>

    <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-green-700">
        Xbox
      </p>
      <p className="mt-2 text-lg font-black text-gray-950">
        {(profile as any)?.xboxGamertag || 'Not added'}
      </p>
    </div>
  </div>
</section>
  <SportsTimeline
  initialTimeline={
    profile?.sportsTimeline?.length
      ? profile.sportsTimeline.map((stage) => ({
          ...stage,
          subtitle: stage.subtitle || "",
          icon: stage.icon || "🏆",
        }))
      : undefined
  }
  onChange={saveSportsTimeline}
/>
            <div className="text-sm text-gray-600">{[profile?.city, profile?.state].filter(Boolean).join(', ')}</div>
            <div className="mt-4">{profile?.bio}</div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div><strong>Role:</strong> {profile?.role}</div>
              <div><strong>Sports:</strong> {(profile?.sports || []).join(', ')}</div>
              <div><strong>Grad Year:</strong> {profile?.gradYear || 'N/A'}</div>
              <div><strong>Height / Weight:</strong> {profile?.height || '-'} / {profile?.weight || '-'}</div>
              <div><strong>Position:</strong> {profile?.position || '-'}</div>
              <div><strong>School:</strong> {profile?.schoolId || 'Unassigned'}</div>
              <div><strong>Team:</strong> {profile?.teamId || 'Unassigned'}</div>
            </div>
            {/* RECRUITING SNAPSHOT */}
<div className="mt-6 border rounded-2xl p-5">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h2 className="text-xl font-bold">Recruiting Snapshot</h2>
      <p className="text-sm text-gray-500">
        Quick athlete information for coaches and recruiters.
      </p>
    </div>

    <span className="text-xs font-bold border rounded-full px-3 py-1">
      Recruiting Profile
    </span>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div className="border rounded-xl p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        Graduation
      </div>
      <div className="font-bold">
        {profile?.gradYear || "N/A"}
      </div>
    </div>

    <div className="border rounded-xl p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        Position
      </div>
      <div className="font-bold">
        {profile?.position || "N/A"}
      </div>
    </div>

    <div className="border rounded-xl p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        Height
      </div>
      <div className="font-bold">
        {profile?.height || "N/A"}
      </div>
    </div>

    <div className="border rounded-xl p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        Weight
      </div>
      <div className="font-bold">
        {profile?.weight || "N/A"}
      </div>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
    <div className="border rounded-xl p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        School
      </div>
      <div className="font-bold">
        {profile?.schoolId || "Unassigned"}
      </div>
    </div>

    <div className="border rounded-xl p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        Team
      </div>
      <div className="font-bold">
        {profile?.teamId || "Unassigned"}
      </div>
    </div>
  </div>

  {sportsTimeline.find((season: any) => season.featured) && (
    <div className="mt-4 border border-yellow-400 rounded-xl p-4">
      <div className="text-xs uppercase tracking-wide text-yellow-500 font-bold mb-2">
        ★ Featured Season
      </div>

      <div className="font-bold text-lg">
        {
          sportsTimeline.find((season: any) => season.featured)?.sport
        }{" "}
        {
          sportsTimeline.find((season: any) => season.featured)?.year
        }
      </div>

      {sportsTimeline.find((season: any) => season.featured)?.stats && (
        <p className="text-sm text-gray-500 mt-1">
          {
            sportsTimeline.find((season: any) => season.featured)?.stats
          }
        </p>
      )}
    </div>
  )}
</div>
{/* COLLEGE OFFERS LIST */}
<div className="mt-5">
  <h3 className="font-bold mb-3">College Offers</h3>

  {offers.length === 0 ? (
    <p className="text-sm text-gray-500">
      No offers added yet.
    </p>
  ) : (

    <div className="space-y-3">
      {offers.map((offer: any) => (
        <div
          key={offer.id}
          className="border rounded-xl p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-lg font-bold">
                🎓 {offer.school}
              </h4>

              <div className="flex flex-wrap gap-2 mt-2">
                {offer.offerType && (
                  <span className="text-xs font-semibold border rounded-full px-2 py-1">
                    {offer.offerType}
                  </span>
                )}

                {offer.interestLevel && (
                  <span className="text-xs font-semibold border rounded-full px-2 py-1">
                    🔥 {offer.interestLevel} Interest
                  </span>
                )}
              </div>
            </div>

            {isOwnProfile && (
              <div className="flex gap-3">
                {committedSchool === offer.school ? (
                  <span className="text-sm font-bold text-green-600">
                    ✅ Committed
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCommitToOffer(offer)}
                    className="text-sm font-semibold text-green-600 hover:text-green-700"
                  >
                    Commit
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleEditOffer(offer)}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleRemoveOffer(offer.id)}
                  className="text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {offer.officialVisit && (
            <div className="mt-3 text-sm">
              <strong>📅 Official Visit:</strong>{" "}
              {offer.officialVisit}
            </div>
          )}

          {offer.notes && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              {offer.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  )}
</div>
{/* RECRUITING BADGES */}
<div className="mt-4 flex flex-wrap gap-2">
  <span
    className={`px-3 py-1 rounded-full text-xs font-bold border ${
      recruitingStatus === "Committed"
        ? "border-green-500 text-green-600"
        : recruitingStatus === "Open"
        ? "border-blue-500 text-blue-600"
        : "border-gray-400 text-gray-500"
    }`}
  >
    {recruitingStatus === "Committed"
      ? "✅ Committed"
      : recruitingStatus === "Open"
      ? "🟢 Open to Recruiting"
      : `Recruiting: ${recruitingStatus || "Not Set"}`}
  </span>

  <span className="px-3 py-1 rounded-full text-xs font-bold border">
    🎓 Offers: {offers.length}
  </span>

  {committedSchool && (
    <span className="px-3 py-1 rounded-full text-xs font-bold border border-green-500 text-green-600">
      🏫 {committedSchool}
    </span>
  )}

  {sportsTimeline.some((season: any) => season.featured) && (
    <span className="px-3 py-1 rounded-full text-xs font-bold border border-yellow-500 text-yellow-600">
      ⭐ Featured Athlete
    </span>
  )}
</div>
{/* RECRUITING PROFILE SUMMARY */}
<div className="mt-6 border rounded-2xl p-5">
  <div className="flex items-center justify-between gap-4 flex-wrap">
    <div>
      <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
        Recruiting Profile
      </p>

      <h2 className="text-xl font-black mt-1">
        {recruitingStatus === "Committed"
          ? "✅ Committed Athlete"
          : "🟢 Open to Recruiting"}
      </h2>
    </div>

    <div className="flex flex-wrap gap-2">
      <span className="px-3 py-1 rounded-full border text-xs font-bold">
        🎓 {offers.length} Offer{offers.length === 1 ? "" : "s"}
      </span>

      {sportsTimeline.some((season: any) => season.featured) && (
        <span className="px-3 py-1 rounded-full border border-yellow-500 text-yellow-600 text-xs font-bold">
          ⭐ Featured
        </span>
      )}
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
    <div className="border rounded-xl p-3">
      <p className="text-xs text-gray-500 font-semibold">
        Recruiting Status
      </p>

      <p className="font-bold mt-1">
        {recruitingStatus || "Not Set"}
      </p>
    </div>

    <div className="border rounded-xl p-3">
      <p className="text-xs text-gray-500 font-semibold">
        College Offers
      </p>

      <p className="font-bold mt-1">
        {offers.length}
      </p>
    </div>
{/* FEATURED RECRUITING HIGHLIGHT */}
{sportsTimeline.find(
  (season: any) => season.featured && season.mediaUrl
) && (
  <div className="mt-5 border rounded-2xl overflow-hidden">
    <div className="px-4 py-3 border-b">
      <p className="text-xs uppercase tracking-widest text-yellow-500 font-bold">
        ⭐ Featured Recruiting Highlight
      </p>

      <h3 className="font-bold mt-1">
        {
          sportsTimeline.find(
            (season: any) => season.featured && season.mediaUrl
          )?.sport
        }
        {" "}
        {
          sportsTimeline.find(
            (season: any) => season.featured && season.mediaUrl
          )?.year
        }
      </h3>
    </div>

    {sportsTimeline.find(
      (season: any) => season.featured && season.mediaUrl
    )?.mediaType === "video" ? (
      <video
        src={
          sportsTimeline.find(
            (season: any) => season.featured && season.mediaUrl
          )?.mediaUrl
        }
        controls
        playsInline
        className="w-full max-h-[500px] bg-black"
      />
    ) : (
      <img
        src={
          sportsTimeline.find(
            (season: any) => season.featured && season.mediaUrl
          )?.mediaUrl
        }
        alt="Featured recruiting highlight"
        className="w-full max-h-[500px] object-cover"
      />
    )}
  </div>
)}
    <div className="border rounded-xl p-3">
      <p className="text-xs text-gray-500 font-semibold">
        Commitment
      </p>

      <p className="font-bold mt-1">
        {committedSchool || "Not Committed"}
      </p>
    </div>
  </div>
</div>

  {(recruitingEmail || recruitingPhone) && (
    <div className="flex flex-wrap gap-3 mt-5">
      {recruitingEmail && (
        <a
          href={`mailto:${recruitingEmail}`}
          className="px-4 py-2 rounded-lg border font-semibold"
        >
          ✉️ Contact Recruiting
        </a>
      )}

      {recruitingPhone && (
        <a
          href={`tel:${recruitingPhone}`}
          className="px-4 py-2 rounded-lg border font-semibold"
        >
          📞 Call Contact
        </a>
      )}
    </div>
  )}
  <div className="mt-5">
  <button
    type="button"
    onClick={handleShareRecruitingProfile}
    className="w-full md:w-auto px-5 py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700"
  >
    🔗 Share Recruiting Profile
  </button>
</div>
</div>
{/* COMMITMENT BANNER */}
{committedSchool && (
  <div className="mt-6 rounded-2xl border-2 border-green-500 p-5 bg-green-50 dark:bg-green-950/20">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-widest font-bold text-green-600">
          🎓 College Commitment
        </p>

        <h2 className="text-2xl font-black mt-1">
          COMMITTED
        </h2>

        <p className="text-lg font-bold mt-1">
          {committedSchool}
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Recruiting Status: {recruitingStatus}
        </p>
      </div>

      <div className="text-4xl">
        ✅
      </div>
    </div>

    {isOwnProfile && (
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleUncommit}
          className="px-4 py-2 rounded-lg border border-red-500 text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          Remove Commitment
        </button>
      </div>
    )}
  </div>
)}
{/* RECRUITING CONTACT */}
<div className="mt-6 border rounded-2xl p-5">
  <div className="flex items-center justify-between gap-3 mb-4">
    <div>
      <h2 className="text-xl font-bold">Recruiting Contact</h2>
      <p className="text-sm text-gray-500">
        Contact information for college coaches and recruiting staff.
      </p>
    </div>
  </div>

  {isOwnProfile ? (
    <div className="space-y-3">
      <input
        type="text"
        value={recruitingContactName}
        onChange={(e) => setRecruitingContactName(e.target.value)}
        placeholder="Contact name"
        className="w-full border rounded-lg px-3 py-2 bg-transparent"
      />

      <input
        type="text"
        value={recruitingContactRole}
        onChange={(e) => setRecruitingContactRole(e.target.value)}
        placeholder="Role — Example: Parent, Coach, Athlete"
        className="w-full border rounded-lg px-3 py-2 bg-transparent"
      />

      <input
        type="email"
        value={recruitingEmail}
        onChange={(e) => setRecruitingEmail(e.target.value)}
        placeholder="Recruiting email"
        className="w-full border rounded-lg px-3 py-2 bg-transparent"
      />

      <input
        type="tel"
        value={recruitingPhone}
        onChange={(e) => setRecruitingPhone(e.target.value)}
        placeholder="Recruiting phone"
        className="w-full border rounded-lg px-3 py-2 bg-transparent"
      />

      <button
        type="button"
        onClick={handleSaveRecruitingContact}
        className="w-full px-4 py-3 rounded-lg bg-red-600 text-white font-bold"
      >
        Save Recruiting Contact
      </button>
    </div>
  ) : (
    <div className="space-y-2 text-sm">
      {recruitingContactName && (
        <p>
          <strong>Contact:</strong> {recruitingContactName}
        </p>
      )}

      {recruitingContactRole && (
        <p>
          <strong>Role:</strong> {recruitingContactRole}
        </p>
      )}

      
        <div className="space-y-3">
  {recruitingContactName && (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
        Recruiting Contact
      </p>

      <p className="font-bold text-lg">
        {recruitingContactName}
      </p>

      {recruitingContactRole && (
        <p className="text-sm text-gray-500">
          {recruitingContactRole}
        </p>
      )}
    </div>
  )}

  <div className="flex flex-wrap gap-3">
    {recruitingEmail && (
      <a
        href={`mailto:${recruitingEmail}`}
        className="px-4 py-2 rounded-lg border font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        ✉️ Email
      </a>
    )}

    {recruitingPhone && (
      <a
        href={`tel:${recruitingPhone}`}
        className="px-4 py-2 rounded-lg border font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        📞 Call
      </a>
    )}
  </div>

  
  
</div>
    </div>
  )}
</div>
            {/* SPORTS TIMELINE */}
            {!canViewPrivateProfile && (
  <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
    <div className="mb-3 text-4xl">🔒</div>

    <h2 className="text-xl font-bold">This account is private</h2>

    <p className="mt-2 text-sm text-gray-500">
      Follow this profile to view their sports timeline and history.
    </p>
  </div>
)}
  
<div
  id="sports-timeline"
  className={`mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 ${
    canViewPrivateProfile ? '' : 'hidden'
  }`}
>
  <div className="flex items-center justify-between mb-4">
    <div>
      <h2 className="text-xl font-bold">Sports Timeline</h2>
      <p className="text-sm text-gray-500">
        Your sports journey, season by season.
      </p>
    </div>
{/* CONNECTED SPORTS HISTORY */}
<div
  className={`mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 ${
    canViewPrivateProfile ? '' : 'hidden'
  }`}
>
  <div className="mb-5">
    <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
      Connected Sports History
    </p>

    <h2 className="text-2xl font-black mt-1">
      Athlete Legacy
    </h2>

    <p className="text-sm text-gray-500 mt-1">
      Streams, arena accomplishments, rivals, coaches and career history.
    </p>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
    <div className="border rounded-xl p-4">
      <p className="text-2xl font-black">
        {liveHistory.length}
      </p>
      <p className="text-xs text-gray-500 font-semibold">
        Live Events
      </p>
    </div>

    <div className="border rounded-xl p-4">
      <p className="text-2xl font-black">
        {liveHistory.filter((event: any) => event.replayUrl).length}
      </p>
      <p className="text-xs text-gray-500 font-semibold">
        Replays
      </p>
    </div>

    <div className="border rounded-xl p-4">
      <p className="text-2xl font-black">
        {arenaAccomplishments.length}
      </p>
      <p className="text-xs text-gray-500 font-semibold">
        Arena Accomplishments
      </p>
    </div>

    <div className="border rounded-xl p-4">
      <p className="text-2xl font-black">
        {alumniHistory.length}
      </p>
      <p className="text-xs text-gray-500 font-semibold">
        Alumni Entries
      </p>
    </div>

    <div className="border rounded-xl p-4">
      <p className="text-2xl font-black">
        {rivalHistory.length}
      </p>
      <p className="text-xs text-gray-500 font-semibold">
        Rivals
      </p>
    </div>

    <div className="border rounded-xl p-4">
      <p className="text-2xl font-black">
        {coachHistory.length}
      </p>
      <p className="text-xs text-gray-500 font-semibold">
        Coaches
      </p>
    </div>
  </div>
</div>
    {isOwnProfile && (
  <button
    type="button"
    onClick={() => {
      setEditingSeasonId(null)
      setShowAddSeason((v) => !v)
    }}
    className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
  >
    {showAddSeason ? "Cancel" : "+ Add Season"}
  </button>
)}
  </div>

  {isOwnProfile && showAddSeason && (
    
  <div className="border rounded-xl p-5 mb-6 space-y-5">
  <div>
    <h3 className="font-bold text-xl">
      {editingSeasonId ? "Edit Sports Season" : "Add Sports Season"}
    </h3>

    <p className="text-sm text-gray-500 mt-1">
      Build your sports history season by season.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-semibold mb-2">
        Season Year
      </label>

      <input
        type="text"
        placeholder="Example: 2026"
        value={seasonYear}
        onChange={(e) => setSeasonYear(e.target.value)}
        className="w-full border rounded-lg px-3 py-3 bg-transparent"
      />
    </div>

    <div>
      <label className="block text-sm font-semibold mb-2">
        Sport
      </label>

      <input
        type="text"
        placeholder="Football, Baseball, Basketball..."
        value={seasonSport}
        onChange={(e) => setSeasonSport(e.target.value)}
        className="w-full border rounded-lg px-3 py-3 bg-transparent"
      />
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-semibold mb-2">
        School
      </label>
{/* LIVE STREAM HISTORY */}
<div className="mt-8">
  <div className="flex items-center justify-between gap-4 mb-4">
    <div>
      <p className="text-xs uppercase tracking-widest text-red-600 font-bold">
        MHSF Live
      </p>

      <h2 className="text-xl font-black">
        Live Games & Replays
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Games connected to this athlete&apos;s sports history.
      </p>
    </div>

    <Link
      href="/live"
      className="px-4 py-2 rounded-lg border font-semibold hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      🔴 MHSF Live
    </Link>
  </div>

  {liveHistory.length === 0 ? (
    <div className="border rounded-xl p-6 text-center text-gray-500">
      No live games or replays connected yet.
    </div>
  ) : (
    <div className="space-y-4">
      {[...liveHistory]
        .sort(
          (a: any, b: any) =>
            new Date(b.date || 0).getTime() -
            new Date(a.date || 0).getTime()
        )
        .map((event: any, index: number) => (
          <div
            key={event.id || index}
            className="border rounded-2xl p-4"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-full border font-bold">
                    {event.sport || "Sport"}
                  </span>

                  {event.streamUrl && !event.replayUrl && (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-600 text-white font-bold">
                      🔴 LIVE
                    </span>
                  )}

                  {event.replayUrl && (
                    <span className="text-xs px-2 py-1 rounded-full border font-bold">
                      ▶ Replay
                    </span>
                  )}
                </div>

                <h3 className="font-black text-lg mt-2">
                  {event.title || "Game"}
                </h3>

                {event.opponent && (
                  <p className="text-sm text-gray-500 mt-1">
                    vs {event.opponent}
                  </p>
                )}

                {event.result && (
                  <p className="text-sm font-bold mt-1">
                    {event.result}
                  </p>
                )}

                {event.date && (
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {event.streamUrl && !event.replayUrl && (
                  <a
                    href={event.streamUrl}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold"
                  >
                    Watch Live
                  </a>
                )}

                {event.replayUrl && (
                  <a
                    href={event.replayUrl}
                    className="px-4 py-2 rounded-lg border font-bold"
                  >
                    ▶ Watch Replay
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  )}
</div>
      <input
        type="text"
        placeholder="School name"
        value={seasonSchool}
        onChange={(e) => setSeasonSchool(e.target.value)}
        className="w-full border rounded-lg px-3 py-3 bg-transparent"
      />
    </div>

    <div>
      <label className="block text-sm font-semibold mb-2">
        Team
      </label>

      <input
        type="text"
        placeholder="Varsity, JV, Club..."
        value={seasonTeam}
        onChange={(e) => setSeasonTeam(e.target.value)}
        className="w-full border rounded-lg px-3 py-3 bg-transparent"
      />
    </div>
  </div>

  <div>
    <label className="block text-sm font-semibold mb-2">
      Position
    </label>

    <input
      type="text"
      placeholder="QB, WR, CF, PG..."
      value={seasonPosition}
      onChange={(e) => setSeasonPosition(e.target.value)}
      className="w-full border rounded-lg px-3 py-3 bg-transparent"
    />
  </div>

  <div>
    <label className="block text-sm font-semibold mb-2">
      Season Stats
    </label>

    <textarea
      placeholder="Games, points, yards, batting average, goals, assists..."
      value={seasonStats}
      onChange={(e) => setSeasonStats(e.target.value)}
      className="w-full border rounded-lg px-3 py-3 bg-transparent"
      rows={4}
    />
  </div>

  <div>
    <label className="block text-sm font-semibold mb-2">
      Awards & Honors
    </label>

    <textarea
      placeholder="All-State, All-District, MVP, Captain..."
      value={seasonAwards}
      onChange={(e) => setSeasonAwards(e.target.value)}
      className="w-full border rounded-lg px-3 py-3 bg-transparent"
      rows={3}
    />
  </div>

  <div>
    <label className="block text-sm font-semibold mb-2">
      Season Story
    </label>

    <textarea
      placeholder="Tell the story of this season..."
      value={seasonNotes}
      onChange={(e) => setSeasonNotes(e.target.value)}
      className="w-full border rounded-lg px-3 py-3 bg-transparent"
      rows={4}
    />
  </div>
<div>
  <label className="block text-sm font-semibold mb-2">
    Season Highlight
  </label>
{seasonMediaUrl && seasonMediaType === "image" && (
  <div className="mb-3">
    <p className="text-sm font-semibold mb-2">
      Current Highlight
    </p>

    <img
      src={seasonMediaUrl}
      alt="Current season highlight"
      className="w-full max-h-72 object-cover rounded-xl"
    />
  </div>
)}

{seasonMediaUrl && seasonMediaType === "video" && (
  <div className="mb-3">
    <p className="text-sm font-semibold mb-2">
      Current Highlight
    </p>

    <video
      src={seasonMediaUrl}
      controls
      playsInline
      className="w-full max-h-80 rounded-xl bg-black"
    />
  </div>
)}
{seasonMediaUrl && (
  <button
    type="button"
    onClick={() => {
      setSeasonMediaUrl("")
      setSeasonMediaType("")
      setSeasonMediaFile(null)
      setRemoveSeasonMedia(true)
    }}
    className="mb-3 text-sm font-semibold text-red-600 hover:text-red-700"
  >
    Remove Highlight
  </button>
)}
  <input
    type="file"
    accept="image/*,video/*"
    onChange={(e) => {
      const file = e.target.files?.[0] || null
      setSeasonMediaFile(file)

      if (file?.type.startsWith("image/")) {
        setSeasonMediaType("image")
      } else if (file?.type.startsWith("video/")) {
        setSeasonMediaType("video")
      } else {
        setSeasonMediaType("")
      }
    }}
    className="w-full border rounded-lg px-3 py-3 bg-transparent"
  />

  <p className="text-xs text-gray-500 mt-2">
    Add a photo or video highlight from this season.
  </p>
</div>
  <button
    type="button"
    onClick={handleAddSeason}
    className="w-full px-4 py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700"
  >
    {editingSeasonId ? "Update Season" : "Save Season"}
  </button>
</div>
  )}
  {sportsTimeline.length === 0 ? (
    <div className="border rounded-xl p-6 text-center text-gray-500">
      No sports seasons added yet.
    </div>
  ) : (
    <div className="space-y-4">
      {[...sportsTimeline]
  .sort((a: any, b: any) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1

    return Number(b.year || 0) - Number(a.year || 0)
  })
  .map((season: any, index: number) => (
        <div
          key={season.id || index}
          className={`border rounded-xl p-4 ${
  season.featured
    ? "border-yellow-400 ring-2 ring-yellow-300/40"
    : ""
}`}
        >
          <div className="flex items-start justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
  <div className="flex items-start gap-3">
    <div className="w-11 h-11 rounded-full border flex items-center justify-center text-xl">
      {season.sport?.toLowerCase().includes("football")
        ? "🏈"
        : season.sport?.toLowerCase().includes("baseball")
        ? "⚾"
        : season.sport?.toLowerCase().includes("basketball")
        ? "🏀"
        : season.sport?.toLowerCase().includes("soccer")
        ? "⚽"
        : season.sport?.toLowerCase().includes("volleyball")
        ? "🏐"
        : season.sport?.toLowerCase().includes("track")
        ? "🏃"
        : "🏆"}
    </div>

    <div>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-bold text-xl">
          {season.sport || "Sport"}
        </h3>

        {season.year && (
          <span className="px-2 py-1 rounded-full text-xs font-bold border">
            {season.year}
          </span>
        )}
      </div>

      {(season.school || season.team) && (
        <p className="text-sm text-gray-500 mt-1">
          {[season.school, season.team].filter(Boolean).join(" • ")}
        </p>
      )}

      {season.position && (
        <p className="text-sm font-semibold mt-1">
          Position: {season.position}
        </p>
      )}
    </div>
  </div>

  {isOwnProfile && (
  <div className="border rounded-xl p-4 mb-4 space-y-3">
    <input
      type="text"
      value={offerInput}
      onChange={(e) => setOfferInput(e.target.value)}
      placeholder="College or university"
      className="w-full border rounded-lg px-3 py-2 bg-transparent"
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <select
        value={offerType}
        onChange={(e) => setOfferType(e.target.value)}
        className="border rounded-lg px-3 py-2 bg-transparent"
      >
        <option value="Scholarship Offer">Scholarship Offer</option>
        <option value="Preferred Walk-On">Preferred Walk-On</option>
        <option value="Walk-On">Walk-On</option>
        <option value="Roster Spot">Roster Spot</option>
        <option value="Interest">Interest</option>
      </select>

      <select
        value={offerInterestLevel}
        onChange={(e) => setOfferInterestLevel(e.target.value)}
        className="border rounded-lg px-3 py-2 bg-transparent"
      >
        <option value="High">High Interest</option>
        <option value="Medium">Medium Interest</option>
        <option value="Low">Low Interest</option>
      </select>
    </div>

    <input
      type="text"
      value={offerOfficialVisit}
      onChange={(e) => setOfferOfficialVisit(e.target.value)}
      placeholder="Official visit — Example: Sept. 12, 2026"
      className="w-full border rounded-lg px-3 py-2 bg-transparent"
    />

    <textarea
      value={offerNotes}
      onChange={(e) => setOfferNotes(e.target.value)}
      placeholder="Recruiting notes..."
      rows={3}
      className="w-full border rounded-lg px-3 py-2 bg-transparent"
    />

    <button
      type="button"
      onClick={handleAddOffer}
      className="w-full px-4 py-3 rounded-lg bg-red-600 text-white font-bold"
    >
      + Add Recruiting Offer
    </button>
  </div>
)}
</div>
   

          {season.school && (
            <p className="mt-2">
              <strong>School:</strong> {season.school}
            </p>
          )}

          {season.team && (
            <p>
              <strong>Team:</strong> {season.team}
            </p>
          )}

          {season.position && (
            <p>
              <strong>Position:</strong> {season.position}
            </p>
          )}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
  {season.stats && (
    <div className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-900">
      <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
        📊 Season Stats
      </div>

      <p className="text-sm font-medium">
        {season.stats}
      </p>
    </div>
  )}

  {season.awards && (
    <div className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-900">
      <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
        🏆 Awards & Honors
      </div>

      <p className="text-sm font-medium">
        {season.awards}
      </p>
    </div>
  )}
</div>

          {season.notes && (
  <div className="mt-4 border rounded-xl p-4 bg-gray-50 dark:bg-gray-900">
    <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
      📖 Season Story
    </div>

    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
      {season.notes}
    </p>
  </div>
)}
        {season.mediaUrl && (
  <div className="mt-4 border rounded-xl p-4 bg-gray-50 dark:bg-gray-900">
    <div className="flex items-center justify-between mb-3">
      <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
        🎬 Season Highlight Reel
      </div>

      <span className="text-xs text-gray-500">
        {season.mediaType === "video" ? "Video" : "Photo"}
      </span>
    </div>

    {season.mediaType === "image" && (
      <img
        src={season.mediaUrl}
        alt={`${season.sport || "Season"} highlight`}
        className="w-full max-h-[500px] object-cover rounded-xl"
      />
    )}

    {season.mediaType === "video" && (
      <video
        src={season.mediaUrl}
        controls
        playsInline
        preload="metadata"
        className="w-full max-h-[550px] rounded-xl bg-black"
      />
    )}
  </div>
)}  
        </div>
      ))}
    </div>
  )}
</div>
<div className="mb-6 grid gap-3 sm:grid-cols-3">
  {profile?.state && (
    <button
      type="button"
      onClick={() => {
        const stateId =
          profile.stateId ||
          profile.state?.toLowerCase().replace(/\s+/g, '-')

        router.push(`/states/${stateId}`)
      }}
      className="rounded-xl border px-4 py-3 font-bold"
    >
      🏠 My State Community
    </button>
  )}

  <button
    type="button"
    onClick={() => router.push('/arena')}
    className="rounded-xl border px-4 py-3 font-bold"
  >
    🎮 Arena
  </button>

  <button
    type="button"
    onClick={() => router.push('/live')}
    className="rounded-xl border px-4 py-3 font-bold"
  >
    🔴 Live
  </button>
</div>
     {user?.uid === profileUserId && (
  <section className="mb-6 rounded-2xl border p-4">
    <h2 className="text-xl font-bold">Create Post</h2>
    <p className="mt-1 text-sm text-gray-500">
      Share photos, videos, and profile updates.
    </p>

    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <button
        type="button"
        onClick={() => {
          setProfilePostType('photo')
          setShowProfileComposer(true)
          setProfilePostFiles([])
        }}
        className="rounded-xl border px-4 py-3 font-bold"
      >
        📷 Add Photo
      </button>

      <button
        type="button"
        onClick={() => {
          setProfilePostType('video')
          setShowProfileComposer(true)
          setProfilePostFiles([])
        }}
        className="rounded-xl border px-4 py-3 font-bold"
      >
        🎥 Add Video
      </button>

      <button
  type="button"
  onClick={() => setShowMusicComposer(true)}
  className="rounded-xl border px-4 py-3 font-bold"
>
  🎵 Add Music
</button>
    </div>
{showMusicComposer && (
  <div className="mt-4 rounded-xl border p-4">
    <h3 className="font-bold">Add Profile Music</h3>

    <input
      type="text"
      value={profileSongTitle}
      onChange={(e) => setProfileSongTitle(e.target.value)}
      placeholder="Song title"
      className="mt-4 w-full rounded-xl border p-3"
    />

    <input
      type="text"
      value={profileSongArtist}
      onChange={(e) => setProfileSongArtist(e.target.value)}
      placeholder="Artist"
      className="mt-3 w-full rounded-xl border p-3"
    />

    <input
      type="file"
      accept="audio/*"
      onChange={(e) => setProfileSongFile(e.target.files?.[0] || null)}
      className="mt-3 block w-full"
    />

    <div className="mt-4 flex gap-3">
      <button
  type="button"
  onClick={handleUploadProfileSong}
  disabled={!profileSongFile || uploadingSong}
  className="rounded-xl bg-red-600 px-5 py-2 font-bold text-white disabled:opacity-50"
>
        {uploadingSong ? 'Uploading...' : 'Add Music'}
      </button>

      <button
        type="button"
        onClick={() => {
          setShowMusicComposer(false)
          setProfileSongFile(null)
        }}
        className="rounded-xl border px-5 py-2 font-bold"
      >
        Cancel
      </button>
    </div>
  </div>
)}

  </section>
)} 
    <section
  id="profile-posts"
  className={`mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 ${
    canViewPrivateProfile ? '' : 'hidden'
  }`}
>
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold">Posts</h2>
    <span className="text-sm text-gray-500">
      {profilePosts.length} {profilePosts.length === 1 ? "post" : "posts"}
    </span>
  </div>

  {profilePosts.length === 0 ? (
    <div className="py-12 text-center border rounded-2xl">
      <div className="text-4xl mb-3">📸</div>
      <h3 className="font-bold">No posts yet</h3>
      <p className="mt-1 text-sm text-gray-500">
        Photos and videos you post will appear here.
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-3 gap-1 md:gap-2">
      {profilePosts.map((post) => (
        <button
  key={post.id}
  type="button"
  onClick={() => setSelectedPost(post)}
  className="relative aspect-square overflow-hidden bg-black rounded-md"
>
          {post.type === "video" ? (
            <video
              src={post.mediaUrl}
              controls
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={post.mediaUrl}
              alt={post.caption || "Profile post"}
              className="h-full w-full object-cover"
            />
          )}
        </button>
      ))}
    </div>
  )}
</section> 
{selectedPost && (
  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-2xl bg-white dark:bg-gray-900">

      <button
        type="button"
        onClick={() => setSelectedPost(null)}
        className="absolute top-3 right-3 z-10 rounded-full bg-black/70 text-white w-10 h-10 text-xl"
      >
        ✕
      </button>

      <div className="grid md:grid-cols-2">
        <div className="bg-black flex items-center justify-center min-h-[400px]">
          {selectedPost.type === "video" ? (
            <video
              src={selectedPost.mediaUrl}
              controls
              autoPlay
              playsInline
              className="max-h-[80vh] w-full object-contain"
            />
          ) : (
            <img
              src={selectedPost.mediaUrl}
              alt={selectedPost.caption || "Profile post"}
              className="max-h-[80vh] w-full object-contain"
            />
          )}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold mb-3">Post</h3>

          {selectedPost.caption ? (
            <p className="text-sm">{selectedPost.caption}</p>
          ) : (
            <p className="text-sm text-gray-500">No caption.</p>
          )}
          <div className="mt-6 border-t pt-4">
  <div className="flex items-center gap-4 text-xl">
    <button
      type="button"
      onClick={handleTogglePostLike}
      className="hover:scale-110 transition"
      title="Like"
    >
      {selectedPostLiked ? "❤️" : "🤍"}
    </button>

    <button
      type="button"
      onClick={() => alert("Comments feature next")}
      className="hover:scale-110 transition"
      title="Comment"
    >
      💬
    </button>

    <button
      type="button"
      onClick={() => {
        if (navigator.share) {
          navigator.share({
            title: "My High School Sports Family",
            text: selectedPost.caption || "Check out this post",
            url: window.location.href,
          })
        } else {
          navigator.clipboard.writeText(window.location.href)
          alert("Profile link copied!")
        }
      }}
      className="hover:scale-110 transition"
      title="Share"
    >
      📤
    </button>

    <button
      type="button"
      onClick={handleToggleSavePost}
      className="ml-auto hover:scale-110 transition"
      title="Save"
    >
    {selectedPostSaved ? "🔖" : "🏷️"}
    </button>
  </div>
  <div className="mt-5">
  <h4 className="font-bold mb-3">
    Comments ({selectedPostComments.length})
  </h4>

  <div className="space-y-3 max-h-48 overflow-y-auto">
    {selectedPostComments.length === 0 ? (
      <p className="text-sm text-gray-500">
        No comments yet.
      </p>
    ) : (
      selectedPostComments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-xl bg-gray-100 dark:bg-gray-800 p-3"
        >
          <p className="text-sm">{comment.text}</p>
        </div>
      ))
    )}
  </div>

  <div className="mt-4 flex gap-2">
    <input
      type="text"
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleAddPostComment()
        }
      }}
      placeholder="Add a comment..."
      className="flex-1 rounded-xl border px-3 py-2 bg-transparent"
    />

    <button
      type="button"
      onClick={handleAddPostComment}
      className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white"
    >
      Post
    </button>
  </div>
</div>
</div>
        </div>
      </div>
    </div>
  </div>
)}
 {profileSongUrl && (
  <section className="mb-6 rounded-2xl border p-4">
    <div className="flex items-center gap-3">
      <div className="text-2xl">🎵</div>

      <div>
        <h3 className="font-bold">
          {profileSongTitle || 'Profile Song'}
        </h3>

        <p className="text-sm text-gray-500">
          {profileSongArtist || 'Artist'}
        </p>
      </div>
    </div>

    <audio
      controls
      preload="metadata"
      src={profileSongUrl}
      className="mt-4 w-full"
    />
  </section>
)}
  <h2 className="mb-4 text-xl font-bold">My Sports Connections</h2>

  <div className="grid gap-4 md:grid-cols-3">

    <div className="rounded-xl border p-4">
  <h3 className="font-bold">State Community</h3>

  {profile?.state && profile?.stateId ? (
    <>
      <p className="mt-2 text-sm text-gray-600">
        {profile.state} Sports Family
      </p>

      <p className="mt-1 text-xs font-bold text-green-600">
        Member
      </p>

      <button
        onClick={() => router.push(`/states/${profile.stateId}`)}
        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        Enter {profile.state} Community
      </button>
    </>
  ) : (
    <>
      <p className="mt-2 text-sm text-gray-600">
        Choose a State Community to complete your sports profile.
      </p>

      <button
        onClick={() => router.push("/states")}
        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        Choose State Community
      </button>
    </>
  )}
</div>
    </div>

    <div className="rounded-xl border p-4">
      <h3 className="font-bold">Arena</h3>
      <p className="text-sm text-gray-600">
        Join tournaments, gaming rooms, and State vs State battles.
      </p>

      <button
  onClick={() => {
    if (!profile?.stateId || !profile?.state) {
      router.push("/states")
      return
    }

    router.push({
      pathname: "/arena",
      query: {
        state: profile.state,
        stateId: profile.stateId,
      },
    })
  }}
  className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 text-white"
>
  Enter Arena
</button>
    </div>

    <div className="rounded-xl border p-4">
      <h3 className="font-bold">Go Live</h3>
      <p className="text-sm text-gray-600">
        Stream games, practices, and highlights.
      </p>

      <button
        onClick={() => {
  if (!profile?.stateId || !profile?.state) {
    router.push("/states")
    return
  }

  router.push({
    pathname: "/live",
    query: {
      state: profile.state,
      stateId: profile.stateId,
    },
  })
}}
        className="mt-4 w-full rounded-lg bg-black px-4 py-2 text-white"
      >
        Go Live
      </button>
    </div>

  
  {profile?.role === "athlete" && (
              <div className="mt-4 rounded-lg border p-4 bg-white dark:bg-gray-900">
                <h2 className="text-lg font-semibold mb-2">Athlete recruiting</h2>
                <p>Status: {profile?.recruiting?.status || 'Open'}</p>
               {profile?.recruiting?.profileUrl && (
  <a
    href={profile.recruiting.profileUrl}
    className="text-blue-600 underline"
    target="_blank"
    rel="noreferrer"
  >
    View Recruiting Profile
  </a>
)}
              </div>
            )}
            {profile?.role === 'coach' && (
              <div className="mt-4 rounded-lg border p-4 bg-white dark:bg-gray-900">
                <h2 className="text-lg font-semibold mb-2">Coach details</h2>
                <p>Managed team: {profile?.teamId || 'TBD'}</p>
                <p>School: {profile?.schoolId || 'TBD'}</p>
              </div>
            )}
            {profile?.role === 'parent' && (
              <div className="mt-4 rounded-lg border p-4 bg-white dark:bg-gray-900">
                <h2 className="text-lg font-semibold mb-2">Parent profile</h2>
                <p>Connected athlete: {profile?.teamId || 'None specified'}</p>
                <p>Preferred sport: {(profile?.sports || []).join(', ') || 'N/A'}</p>
              </div>
            )}
            <div className="mt-4">
              <button
                onClick={() => signOut()}
                className="px-3 py-1 border rounded"
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <input value={form.displayName || ''} onChange={(e) => setForm((s) => ({ ...s, displayName: e.target.value }))} placeholder="Full name" className="w-full p-2 border rounded" />
            <textarea value={form.bio || ''} onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))} placeholder="Bio" className="w-full p-2 border rounded" />
            <div className="grid grid-cols-2 gap-2">
              <input value={form.city || ''} onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))} placeholder="City" className="p-2 border rounded" />
              <select
                value={form.state || ''}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    state: e.target.value,
                    stateId: '',
                  }))
                }
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-black"
              >
  <option value="">Choose State Community</option>
  <option value="Alabama">Alabama</option>
  <option value="Alaska">Alaska</option>
  <option value="Arizona">Arizona</option>
  <option value="Arkansas">Arkansas</option>
  <option value="California">California</option>
  <option value="Colorado">Colorado</option>
  <option value="Connecticut">Connecticut</option>
  <option value="Delaware">Delaware</option>
  <option value="Florida">Florida</option>
  <option value="Georgia">Georgia</option>
  <option value="Hawaii">Hawaii</option>
  <option value="Idaho">Idaho</option>
  <option value="Illinois">Illinois</option>
  <option value="Indiana">Indiana</option>
  <option value="Iowa">Iowa</option>
  <option value="Kansas">Kansas</option>
  <option value="Kentucky">Kentucky</option>
  <option value="Louisiana">Louisiana</option>
  <option value="Maine">Maine</option>
  <option value="Maryland">Maryland</option>
  <option value="Massachusetts">Massachusetts</option>
  <option value="Michigan">Michigan</option>
  <option value="Minnesota">Minnesota</option>
  <option value="Mississippi">Mississippi</option>
  <option value="Missouri">Missouri</option>
  <option value="Montana">Montana</option>
  <option value="Nebraska">Nebraska</option>
  <option value="Nevada">Nevada</option>
  <option value="New Hampshire">New Hampshire</option>
  <option value="New Jersey">New Jersey</option>
  <option value="New Mexico">New Mexico</option>
  <option value="New York">New York</option>
  <option value="North Carolina">North Carolina</option>
  <option value="North Dakota">North Dakota</option>
  <option value="Ohio">Ohio</option>
  <option value="Oklahoma">Oklahoma</option>
  <option value="Oregon">Oregon</option>
  <option value="Pennsylvania">Pennsylvania</option>
  <option value="Rhode Island">Rhode Island</option>
  <option value="South Carolina">South Carolina</option>
  <option value="South Dakota">South Dakota</option>
  <option value="Tennessee">Tennessee</option>
  <option value="Texas">Texas</option>
  <option value="Utah">Utah</option>
  <option value="Vermont">Vermont</option>
  <option value="Virginia">Virginia</option>
  <option value="Washington">Washington</option>
  <option value="West Virginia">West Virginia</option>
  <option value="Wisconsin">Wisconsin</option>
  <option value="Wyoming">Wyoming</option>
</select>
            </div>
            <input value={form.sports || ''} onChange={(e) => setForm((s) => ({ ...s, sports: e.target.value }))} placeholder="Sports (comma separated)" className="w-full p-2 border rounded" />
            <div className="grid grid-cols-3 gap-2">
              <input value={form.gradYear || ''} onChange={(e) => setForm((s) => ({ ...s, gradYear: e.target.value ? Number(e.target.value) : '' }))} placeholder="Grad Year" className="p-2 border rounded" />
              <input value={form.height || ''} onChange={(e) => setForm((s) => ({ ...s, height: e.target.value }))} placeholder="Height" className="p-2 border rounded" />
              <input value={form.weight || ''} onChange={(e) => setForm((s) => ({ ...s, weight: e.target.value }))} placeholder="Weight" className="p-2 border rounded" />
            </div>
            <input value={form.position || ''} onChange={(e) => setForm((s) => ({ ...s, position: e.target.value }))} placeholder="Position" className="w-full p-2 border rounded" />
            <div className="grid grid-cols-2 gap-2">
              <input value={form.schoolId || ''} onChange={(e) => setForm((s) => ({ ...s, schoolId: e.target.value }))} placeholder="School ID" className="p-2 border rounded" />
              <input value={form.teamId || ''} onChange={(e) => setForm((s) => ({ ...s, teamId: e.target.value }))} placeholder="Team ID" className="p-2 border rounded" />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
  <h3 className="mb-3 text-lg font-bold text-gray-900">
    Gaming IDs
  </h3>

  <div className="grid gap-3 sm:grid-cols-2">
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-gray-700">
        PlayStation Gamertag
      </span>
      <input
        type="text"
        value={form.playstationGamertag || ''}
        onChange={(e) =>
          setForm((current) => ({
            ...current,
            playstationGamertag: e.target.value,
          }))
        }
        placeholder="Enter your PlayStation Gamertag"
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-600"
      />
    </label>

    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-gray-700">
        Xbox Gamertag
      </span>
      <input
        type="text"
        value={form.xboxGamertag || ''}
        onChange={(e) =>
          setForm((current) => ({
            ...current,
            xboxGamertag: e.target.value,
          }))
        }
        placeholder="Enter your Xbox Gamertag"
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-600"
      />
    </label>
  </div>
</div>
            {profile?.role === 'athlete' && (
              <input value={form.recruiting || ''} onChange={(e) => setForm((s) => ({ ...s, recruiting: e.target.value }))} placeholder="Recruiting profile URL" className="w-full p-2 border rounded" />
            )}
            <div className="flex items-center gap-2">
              <label className="flex-1">
                <div className="text-sm text-gray-600">Avatar</div>
                <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)} />
              </label>
              <label className="flex-1">
                <div className="text-sm text-gray-600">Cover photo</div>
                <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files ? e.target.files[0] : null)} />
              </label>
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4 mb-4">
              <div>
                <p className="font-semibold">Private Profile</p>
                <p className="text-sm text-gray-500">
                  Only approved followers can view your full profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPrivateProfile((current) => !current)}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  isPrivateProfile ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                    isPrivateProfile ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={saveProfile} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? 'Saving...' : 'Save profile'}</button>
              <button onClick={() => setEditing(false)} className="px-4 py-2 border rounded">Cancel</button>
            </div>
          </div>
        )}

      </div>
    </div>
    </div>
  )
}
