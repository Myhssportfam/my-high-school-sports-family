import type {Firestore, DocumentReference} from 'firebase-admin/firestore'

export class ContentDeletionError extends Error {
  constructor(public status: number, message: string) {super(message)}
}
function id(value: unknown) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{1,160}$/.test(value))
    throw new ContentDeletionError(400, 'Invalid content ID.')
  return value
}
export async function removeOwnedContent(db: Firestore, uid: string, input: {kind?: unknown; id?: unknown; stateId?: unknown}) {
  const contentId = id(input.id)
  let path: string
  switch (input.kind) {
    case 'profile': path = `users/${uid}/posts/${contentId}`; break
    case 'post': path = `posts/${contentId}`; break
    case 'coach': path = `coachPosts/${contentId}`; break
    case 'state': path = `stateFeeds/${id(input.stateId)}/posts/${contentId}`; break
    case 'story': path = `stateStories/${id(input.stateId)}/stories/${contentId}`; break
    case 'legacyStory': path = `stories/${contentId}`; break
    default: throw new ContentDeletionError(400, 'Choose a post or story.')
  }
  const source = db.doc(path)
  const snapshot = await source.get()
  if (!snapshot.exists) return {deleted: true}
  const data = snapshot.data()!
  const owner = input.kind === 'profile' ? uid : (data.authorId || data.userId)
  if (owner !== uid) throw new ContentDeletionError(403, 'You can only delete your own posts and stories.')
  const roots: DocumentReference[] = [source]
  if (input.kind === 'profile' && data.stateId && data.communityPostId) {
    const mirror = db.doc(`stateFeeds/${id(data.stateId)}/posts/${id(data.communityPostId)}`)
    const linked = (await mirror.get()).data()
    if (linked && (linked.authorId || linked.userId) === uid && linked.profilePostId === contentId && linked.profileUserId === uid)
      roots.push(mirror)
  }
  if (input.kind === 'state' && data.activityType === 'profilePost' && data.profileUserId === uid && data.profilePostId) {
    const mirror = db.doc(`users/${uid}/posts/${id(data.profilePostId)}`)
    const linked = (await mirror.get()).data()
    if (linked && linked.communityPostId === contentId && linked.stateId === input.stateId)
      roots.push(mirror)
  }
  const batch = db.batch()
  for (const root of roots) batch.delete(root)
  await batch.commit() // Profile and its state community copy disappear together.
  let cleanupPending = false
  for (const root of roots) {
    try {await db.recursiveDelete(root)}
    catch {cleanupPending = true}
  }
  return {deleted: true, cleanupPending}
}
