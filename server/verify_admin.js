const admin = require('firebase-admin')

function initAdmin() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS

  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson)
      return admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
    } catch (error) {
      console.error('Invalid FIREBASE_SERVICE_ACCOUNT JSON:', error)
      process.exit(1)
    }
  }

  if (credentialsPath) {
    console.log('Using GOOGLE_APPLICATION_CREDENTIALS:', credentialsPath)
    return admin.initializeApp()
  }

  console.error('No Firebase Admin credentials found. Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS.')
  process.exit(1)
}

const app = initAdmin()
const db = admin.firestore(app)

async function main() {
  try {
    const cols = await db.listCollections()
    console.log('Connected to Firestore. Sample collections:', cols.slice(0, 10).map(c => c.id))
    process.exit(0)
  } catch (e) {
    console.error('Failed to connect to Firestore:', e)
    process.exit(1)
  }
}

main()
