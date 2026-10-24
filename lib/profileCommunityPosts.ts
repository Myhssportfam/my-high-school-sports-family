import {doc, serverTimestamp, writeBatch} from 'firebase/firestore';
import {db} from './firebase';
import {canonicalState} from './broadcasts';

export function profileCommunityState(profile: {state?: string; stateId?: string} | null | undefined) {
  const state = canonicalState(profile?.state, profile?.stateId);
  if (!state) throw new Error('Choose your state community in Edit Profile before posting.');
  return state;
}

export async function publishProfileCommunityPost({user, profile, id, mediaUrl, type, caption}: {
  user: {uid:string; displayName?:string|null; photoURL?:string|null};
  profile: any; id:string; mediaUrl:string; type:'photo'|'video'; caption:string;
}) {
  const state = profileCommunityState(profile);
  const batch = writeBatch(db);
  const communityId = `profile-${user.uid}-${id}`;
  const author = profile?.displayName || user.displayName || 'Sports Family Member';
  batch.set(doc(db, 'users', user.uid, 'posts', id), {
    userId:user.uid, authorId:user.uid, type, mediaUrl, caption,
    state:state.state, stateId:state.stateId, communityPostId:communityId,
    createdAt:serverTimestamp(),
  });
  batch.set(doc(db, 'stateFeeds', state.stateId, 'posts', communityId), {
    userId:user.uid, authorId:user.uid, author,
    initials:author.split(' ').filter(Boolean).map((word:string) => word[0]).join('').slice(0,2).toUpperCase(),
    photoURL:profile?.avatarUrl || profile?.photoURL || user.photoURL || '',
    role:profile?.role || `${state.state} Sports Family`, message:caption,
    type:type === 'video' ? 'Video' : 'Photo', mediaUrl,
    createdAt:'Just now', createdAtMs:Date.now(), likes:0, likedBy:[], comments:[],
    activityType:'profilePost', profilePostId:id, profileUserId:user.uid,
  });
  await batch.commit();
}
