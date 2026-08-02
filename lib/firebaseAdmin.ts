import admin from 'firebase-admin'

let app: admin.app.App | null = null

if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) : null
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS

  if (serviceAccount) {
    app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  } else if (credentialsPath) {
    app = admin.initializeApp()
  } else {
    console.warn('Firebase Admin credentials not found. Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS for server-side Firebase operations.')
  }
} else {
  app = admin.apps[0]
}

export const adminDb = app ? admin.firestore(app) : null

export default admin
