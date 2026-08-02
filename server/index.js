const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const admin = require('firebase-admin')
const fetch = require('node-fetch')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Initialize Firebase Admin from env var FIREBASE_SERVICE_ACCOUNT (JSON)
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) : null
if (!serviceAccount) console.warn('FIREBASE_SERVICE_ACCOUNT not set; server may have limited functionality')
try {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
} catch (e) {
  if (!admin.apps.length) throw e
}
const db = admin.firestore()

const SERVER_SECRET = process.env.SERVER_SECRET || process.env.REVALIDATE_SECRET || null

app.get('/', (req, res) => res.json({ ok: true, serverTime: new Date().toISOString() }))

// Fan-out endpoint: POST { postId, authorId }
app.post('/fanout', async (req, res) => {
  try {
    const auth = req.headers['x-server-secret'] || req.body.secret
    if (SERVER_SECRET && auth !== SERVER_SECRET) return res.status(401).json({ error: 'unauthorized' })

    const { postId, authorId } = req.body
    if (!postId || !authorId) return res.status(400).json({ error: 'postId and authorId required' })

    // Get followers of author
    const followersSnap = await db.collection('users').doc(authorId).collection('followers').get()
    const batch = db.batch()
    const createdAt = admin.firestore.FieldValue.serverTimestamp()

    // write into each follower's homeFeeds collection
    followersSnap.forEach((f) => {
      const followerId = f.id
      const ref = db.collection('homeFeeds').doc(followerId).collection('posts').doc(postId)
      batch.set(ref, { postId, authorId, addedAt: createdAt })
    })

    // ensure author has it in their own feed
    const authorRef = db.collection('homeFeeds').doc(authorId).collection('posts').doc(postId)
    batch.set(authorRef, { postId, authorId, addedAt: createdAt })

    await batch.commit()

    // Optionally trigger ISR revalidation by calling Next revalidate endpoint if available
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    try {
      await fetch(`${base}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: process.env.REVALIDATE_SECRET || process.env.SERVER_SECRET })
      })
    } catch (e) {
      // ignore revalidation errors
      console.warn('revalidate proxy failed', e.message)
    }

    res.json({ ok: true, fans: followersSnap.size })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

// Revalidate proxy endpoint (POST { secret })
app.post('/revalidate', async (req, res) => {
  try {
    const secret = req.body.secret || req.headers['x-revalidate-secret']
    if (!secret || secret !== process.env.REVALIDATE_SECRET) return res.status(401).json({ error: 'unauthorized' })
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const resp = await fetch(`${base}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret })
    })
    const j = await resp.json().catch(() => null)
    res.json({ ok: true, proxied: j })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

// Server-side followers search: POST { targetUserId, q, limit=50, startAfterId }
app.post('/followers/search', async (req, res) => {
  try {
    const auth = req.headers['x-server-secret'] || req.body.secret
    if (SERVER_SECRET && auth !== SERVER_SECRET) return res.status(401).json({ error: 'unauthorized' })

    const { targetUserId, q, limit = 50, startAfterId } = req.body
    if (!targetUserId) return res.status(400).json({ error: 'targetUserId required' })

    // fetch follower docs for the target user, paginated by createdAt
    let followersQuery = db.collection('users').doc(targetUserId).collection('followers').orderBy('createdAt', 'desc')
    if (startAfterId) {
      const startRef = db.collection('users').doc(targetUserId).collection('followers').doc(startAfterId)
      const startSnap = await startRef.get()
      if (startSnap.exists) followersQuery = followersQuery.startAfter(startSnap)
    }
    const followerDocs = await followersQuery.limit(500).get() // cap read to 500
    // prefer denormalized follower subdoc data when available to avoid fetching user docs
    const followerEntries = followerDocs.docs.map((d) => ({ id: d.id, data: d.data() || {} }))

    if (!q) {
      const take = followerEntries.slice(0, limit)
      const profiles = []
      const missing = []
      for (const f of take) {
        if (f.data && (f.data.displayName || f.data.avatarUrl)) {
          profiles.push({ id: f.id, ...f.data })
        } else {
          missing.push(f.id)
        }
      }
      if (missing.length > 0) {
        const refs = missing.map((id) => db.collection('users').doc(id))
        const chunkSize = 100
        for (let i = 0; i < refs.length; i += chunkSize) {
          const snaps = await db.getAll(...refs.slice(i, i + chunkSize))
          snaps.forEach((s) => profiles.push({ id: s.id, ...(s.exists ? s.data() : {}) }))
        }
      }
      return res.json({ ok: true, results: profiles, nextStartAfterId: followerEntries[limit] ? followerEntries[limit].id : null })
    }

    const lowerQ = String(q || '').toLowerCase()
    const results = []
    const missingToCheck = []
    // first pass: check denormalized follower subdocs
    for (const f of followerEntries) {
      const name = String((f.data && f.data.displayName) || '').toLowerCase()
      if (name && name.includes(lowerQ)) {
        results.push({ id: f.id, ...(f.data || {}) })
        if (results.length >= limit) break
      } else {
        missingToCheck.push(f.id)
      }
    }

    // if not enough results, fetch missing user docs in chunks and filter
    if (results.length < limit && missingToCheck.length > 0) {
      const chunkSize = 200
      for (let i = 0; i < missingToCheck.length && results.length < limit; i += chunkSize) {
        const chunk = missingToCheck.slice(i, i + chunkSize)
        const refs = chunk.map((id) => db.collection('users').doc(id))
        const snaps = await db.getAll(...refs)
        for (const s of snaps) {
          if (!s.exists) continue
          const data = s.data() || {}
          const name = String(data.displayName || '').toLowerCase()
          if (name.includes(lowerQ)) {
            results.push({ id: s.id, ...data })
            if (results.length >= limit) break
          }
        }
      }
    }

    // compute nextStartAfterId relative to the followerEntries window we scanned
    const nextStartAfterId = followerEntries.length > 0 && followerEntries.length > limit ? followerEntries[limit].id : null
    return res.json({ ok: true, results, nextStartAfterId })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
