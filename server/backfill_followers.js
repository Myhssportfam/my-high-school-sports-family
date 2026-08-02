const admin = require('firebase-admin')

// Initialize Firebase Admin from env var FIREBASE_SERVICE_ACCOUNT (JSON) or Application Default Credentials
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) : null
if (!serviceAccount) console.warn('FIREBASE_SERVICE_ACCOUNT not set; will attempt Application Default Credentials')
if (serviceAccount) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
} else {
  admin.initializeApp()
}
const db = admin.firestore()

async function backfillUserFollowers(pageSize = 200) {
  console.log('Backfilling user followers...')
  let usersQuery = db.collection('users').orderBy('__name__').limit(pageSize)
  let last = null
  while (true) {
    if (last) usersQuery = db.collection('users').orderBy('__name__').startAfter(last).limit(pageSize)
    const snap = await usersQuery.get()
    if (snap.empty) break
    for (const doc of snap.docs) {
      const userId = doc.id
      const followersSnap = await db.collection('users').doc(userId).collection('followers').get()
      const batches = []
      let batch = db.batch()
      let opCount = 0
      for (const f of followersSnap.docs) {
        const data = f.data() || {}
        if (data.displayName && data.avatarUrl) continue
        const followerId = f.id
        const followerDoc = await db.collection('users').doc(followerId).get()
        const followerData = followerDoc.exists ? (followerDoc.data() || {}) : {}
        const ref = db.collection('users').doc(userId).collection('followers').doc(followerId)
        batch.update(ref, {
          displayName: followerData.displayName || null,
          avatarUrl: followerData.avatarUrl || null
        })
        opCount++
        if (opCount >= 450) { batches.push(batch); batch = db.batch(); opCount = 0 }
      }
      if (opCount > 0) batches.push(batch)
      for (const b of batches) await b.commit()
    }
    last = snap.docs[snap.docs.length - 1]
    if (snap.size < pageSize) break
  }
}

async function backfillUserFollowing(pageSize = 200) {
  console.log('Backfilling user following snapshots...')
  let usersQuery = db.collection('users').orderBy('__name__').limit(pageSize)
  let last = null
  while (true) {
    if (last) usersQuery = db.collection('users').orderBy('__name__').startAfter(last).limit(pageSize)
    const snap = await usersQuery.get()
    if (snap.empty) break
    for (const doc of snap.docs) {
      const userId = doc.id
      const followingSnap = await db.collection('users').doc(userId).collection('following').get()
      const batches = []
      let batch = db.batch()
      let opCount = 0
      for (const f of followingSnap.docs) {
        const data = f.data() || {}
        if (data.displayName && data.avatarUrl) continue
        const targetId = f.id
        const targetDoc = await db.collection('users').doc(targetId).get()
        const targetData = targetDoc.exists ? (targetDoc.data() || {}) : {}
        const ref = db.collection('users').doc(userId).collection('following').doc(targetId)
        batch.update(ref, {
          displayName: targetData.displayName || null,
          avatarUrl: targetData.avatarUrl || null
        })
        opCount++
        if (opCount >= 450) { batches.push(batch); batch = db.batch(); opCount = 0 }
      }
      if (opCount > 0) batches.push(batch)
      for (const b of batches) await b.commit()
    }
    last = snap.docs[snap.docs.length - 1]
    if (snap.size < pageSize) break
  }
}

async function backfillSchoolAndTeamFollowers() {
  console.log('Backfilling school and team followers...')
  // schools
  const schools = await db.collection('schools').get()
  for (const s of schools.docs) {
    const schoolId = s.id
    const followersSnap = await db.collection('schools').doc(schoolId).collection('followers').get()
    const batches = []
    let batch = db.batch()
    let opCount = 0
    for (const f of followersSnap.docs) {
      const data = f.data() || {}
      if (data.displayName && data.avatarUrl) continue
      const followerId = f.id
      const followerDoc = await db.collection('users').doc(followerId).get()
      const followerData = followerDoc.exists ? (followerDoc.data() || {}) : {}
      const ref = db.collection('schools').doc(schoolId).collection('followers').doc(followerId)
      batch.update(ref, {
        displayName: followerData.displayName || null,
        avatarUrl: followerData.avatarUrl || null
      })
      opCount++
      if (opCount >= 450) { batches.push(batch); batch = db.batch(); opCount = 0 }
    }
    if (opCount > 0) batches.push(batch)
    for (const b of batches) await b.commit()
  }

  // teams
  const teams = await db.collection('teams').get()
  for (const t of teams.docs) {
    const teamId = t.id
    const followersSnap = await db.collection('teams').doc(teamId).collection('followers').get()
    const batches = []
    let batch = db.batch()
    let opCount = 0
    for (const f of followersSnap.docs) {
      const data = f.data() || {}
      if (data.displayName && data.avatarUrl) continue
      const followerId = f.id
      const followerDoc = await db.collection('users').doc(followerId).get()
      const followerData = followerDoc.exists ? (followerDoc.data() || {}) : {}
      const ref = db.collection('teams').doc(teamId).collection('followers').doc(followerId)
      batch.update(ref, {
        displayName: followerData.displayName || null,
        avatarUrl: followerData.avatarUrl || null
      })
      opCount++
      if (opCount >= 450) { batches.push(batch); batch = db.batch(); opCount = 0 }
    }
    if (opCount > 0) batches.push(batch)
    for (const b of batches) await b.commit()
  }
}

async function main() {
  try {
    await backfillUserFollowers()
    await backfillUserFollowing()
    await backfillSchoolAndTeamFollowers()
    console.log('Backfill complete')
    process.exit(0)
  } catch (e) {
    console.error('Backfill failed', e)
    process.exit(1)
  }
}

main()
