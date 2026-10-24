import type {NextApiRequest, NextApiResponse} from 'next'
import admin, {adminDb} from '../../../lib/firebaseAdmin'
import {ContentDeletionError, removeOwnedContent} from '../../../lib/contentDeletion'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control','no-store')
  if (req.method !== 'POST') {res.setHeader('Allow','POST');return res.status(405).json({error:'Use POST.'})}
  if (!adminDb) return res.status(503).json({error:'Deletion is not configured. Please contact the site owner.'})
  let uid: string
  try {
    const bearer = req.headers.authorization
    if (!bearer?.startsWith('Bearer ')) throw new Error('Sign in')
    uid = (await admin.auth().verifyIdToken(bearer.slice(7),true)).uid
  } catch {return res.status(401).json({error:'Please sign in again.'})}
  try {return res.status(200).json(await removeOwnedContent(adminDb,uid,req.body || {}))}
  catch (error) {return res.status(error instanceof ContentDeletionError ? error.status : 500).json({
    error:error instanceof ContentDeletionError ? error.message : 'Could not delete. Please try again.',
  })}
}
