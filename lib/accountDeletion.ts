import type { Firestore, CollectionReference } from 'firebase-admin/firestore'

export class AccountDeletionError extends Error {
  constructor(public status: number, message: string) { super(message) }
}

export function requireDeletionConfirmation(body: unknown, authTime: number, now = Date.now()) {
  if (!body || typeof body !== 'object' || (body as {confirmation?: unknown}).confirmation !== 'DELETE')
    throw new AccountDeletionError(400, 'Type DELETE to confirm account deletion.')
  if (!Number.isFinite(authTime) || now / 1000 - authTime > 300 || authTime > now / 1000 + 30)
    throw new AccountDeletionError(401, 'Verify your password or Google account again before deleting.')
}

// Trailing slash is essential: deleting one UID must never match another UID's files.
export function accountMediaPrefixes(uid: string) {
  if (!uid || uid.includes('/')) throw new Error('Invalid user ID')
  return ['avatars', 'covers', 'posts', 'profile-posts', 'profile-music', 'season-highlights',
    'profiles', 'sports-timeline', 'users'].map(folder => `${folder}/${uid}/`)
}

async function deleteOwned(db: Firestore, collection: CollectionReference, uid: string, fields: string[], beforeDelete?: (data: Record<string, any>) => Promise<void>) {
  for (const field of fields) {
    // Small repeatable pages; recursiveDelete also removes nested replies and likes.
    while (true) {
      const page = await collection.where(field, '==', uid).limit(100).get()
      if (page.empty) break
      for (const document of page.docs) {
        if (beforeDelete) await beforeDelete(document.data())
        await db.recursiveDelete(document.ref)
      }
    }
  }
}

async function removeFollow(db: Firestore, mirrorPath: string, parentPath: string, count: string) {
  await db.runTransaction(async tx => {
    const mirror = db.doc(mirrorPath), parent = db.doc(parentPath)
    const [link, profile] = await Promise.all([tx.get(mirror), tx.get(parent)])
    if (!link.exists) return
    tx.delete(mirror)
    if (profile.exists) tx.update(parent, {[count]: Math.max(0, Number(profile.get(count) || 0) - 1)})
  })
}

export async function deleteAccountData(db: Firestore, uid: string, dependencies: {
  deleteMedia: (prefix: string) => Promise<unknown>
  retireLiveInput: (streamId: string) => Promise<void>
  deleteAuthUser: (uid: string) => Promise<void>
}) {
  const user = db.doc(`users/${uid}`)
  // Keep the account usable for retry if any cleanup fails. Authentication is deleted last.
  for (const prefix of accountMediaPrefixes(uid)) await dependencies.deleteMedia(prefix)
  const streams = await db.collection('liveStreams').where('ownerId', '==', uid).get()
  for (const stream of streams.docs) {
    await dependencies.retireLiveInput(stream.id)
    await db.recursiveDelete(stream.ref)
  }
  // Failed provisioning can leave private provider inputs without a liveStreams record.
  for (const secret of (await db.collection('broadcastSecrets').where('ownerId', '==', uid).get()).docs)
    await dependencies.retireLiveInput(secret.id)
  for (const [collection, fields] of [
    ['posts', ['authorId', 'userId']], ['profilePosts', ['authorId', 'userId']],
    ['coachPosts', ['authorId']],
    ['stories', ['authorId', 'userId']],
  ] as [string, string[]][]) await deleteOwned(db, db.collection(collection), uid, fields)
  await deleteOwned(db, db.collection('statePosts'), uid, ['userId', 'authorId'], async data => {
    if (typeof data.stateId === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(data.stateId))
      await dependencies.deleteMedia(`state-posts/${data.stateId}/${uid}/`)
  })
  // listDocuments includes parents which only have subcollections (e.g. stateFeeds/tx).
  for (const collection of ['stateFeeds', 'stateStories']) {
    for (const state of await db.collection(collection).listDocuments())
      await deleteOwned(db, state.collection(collection === 'stateFeeds' ? 'posts' : 'stories'), uid, ['userId', 'authorId'])
  }
  for (const follow of (await user.collection('following').get()).docs)
    await removeFollow(db, `users/${follow.id}/followers/${uid}`, `users/${follow.id}`, 'followersCount')
  for (const follower of (await user.collection('followers').get()).docs)
    await removeFollow(db, `users/${follower.id}/following/${uid}`, `users/${follower.id}`, 'followingCount')
  for (const [own, target] of [['followingSchools', 'schools'], ['followingTeams', 'teams']])
    for (const follow of (await user.collection(own).get()).docs)
      await removeFollow(db, `${target}/${follow.id}/followers/${uid}`, `${target}/${follow.id}`, 'followersCount')
  for (const collection of ['userLikes', 'userSaves', 'notifications', 'broadcastHosts'])
    await db.recursiveDelete(db.doc(`${collection}/${uid}`))
  await db.recursiveDelete(user)
  await dependencies.deleteAuthUser(uid)
}
