import type { NextApiRequest, NextApiResponse } from 'next'
import admin, {adminDb} from '../../../lib/firebaseAdmin'
import {AccountDeletionError, deleteAccountData, requireDeletionConfirmation} from '../../../lib/accountDeletion'
import {streamRequest} from '../../../lib/broadcastServer'

export const config = {maxDuration: 60}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({error: 'Use POST.'})
  }
  if (!adminDb || !process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
    return res.status(503).json({error: 'Account deletion is not configured. Please contact the site owner.'})
  const bearer = req.headers.authorization
  if (!bearer?.startsWith('Bearer ')) return res.status(401).json({error: 'Please sign in first.'})
  let uid: string
  try {
    const token = await admin.auth().verifyIdToken(bearer.slice(7), true)
    requireDeletionConfirmation(req.body, token.auth_time)
    uid = token.uid // Never accept a target UID from the request body.
  } catch (error) {
    return res.status(error instanceof AccountDeletionError ? error.status : 401)
      .json({error: error instanceof AccountDeletionError ? error.message : 'Please sign in and verify your account again.'})
  }
  const lock = adminDb.doc(`accountDeletions/${uid}`)
  let acquired = false
  try {
    await adminDb.runTransaction(async tx => {
      const previous = await tx.get(lock)
      if (Number(previous.get('leaseUntil') || 0) > Date.now())
        throw new AccountDeletionError(409, 'Deletion is already running. Wait a few minutes before retrying.')
      tx.set(lock, {leaseUntil: Date.now() + 120000})
    })
    acquired = true
    const bucket = admin.storage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
    await deleteAccountData(adminDb, uid, {
      deleteMedia: prefix => bucket.deleteFiles({prefix, force: true}),
      retireLiveInput: async streamId => {
        const secret = adminDb!.doc(`broadcastSecrets/${streamId}`)
        const input = (await secret.get()).get('inputUid')
        if (input) await streamRequest(`/${encodeURIComponent(input)}`, {method: 'DELETE'})
        await secret.delete()
      },
      deleteAuthUser: async id => {
        try { await admin.auth().deleteUser(id) }
        catch (error: any) { if (error.code !== 'auth/user-not-found') throw error }
      },
    })
    // Lock cleanup must not turn a completed deletion into a reported failure.
    await lock.delete().catch(() => {})
    return res.status(200).json({deleted: true})
  } catch (error) {
    if (acquired) await lock.delete().catch(() => {})
    console.error('Account deletion failed:', error instanceof Error ? error.message : 'Unknown failure')
    return res.status(error instanceof AccountDeletionError ? error.status : 500).json({
      error: error instanceof AccountDeletionError ? error.message :
        'Deletion could not finish. Some data may already be removed. Verify your account and retry; contact support if it keeps failing.',
    })
  }
}
