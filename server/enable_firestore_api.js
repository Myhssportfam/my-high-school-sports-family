const fs = require('fs')
const path = require('path')
const { GoogleAuth } = require('google-auth-library')

async function main() {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  if (!credentialsPath) {
    console.error('Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_PATH to the service account JSON file path.')
    process.exit(1)
  }

  const fullPath = path.resolve(credentialsPath)
  if (!fs.existsSync(fullPath)) {
    console.error('Service account file not found at:', fullPath)
    process.exit(1)
  }

  const serviceAccount = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
  const projectId = serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID
  if (!projectId) {
    console.error('Unable to determine project ID from service account JSON or environment.')
    process.exit(1)
  }

  const auth = new GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  })

  const client = await auth.getClient()
  const tokenResponse = await client.getAccessToken()
  const token = tokenResponse.token || tokenResponse

  if (!token) {
    console.error('Failed to obtain access token.')
    process.exit(1)
  }

  const apiUrl = `https://serviceusage.googleapis.com/v1/projects/${projectId}/services/firestore.googleapis.com:enable`
  console.log('Enabling Cloud Firestore API for project:', projectId)

  const resp = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!resp.ok) {
    const text = await resp.text()
    console.error('Failed to enable Firestore API:', resp.status, resp.statusText)
    console.error(text)
    process.exit(1)
  }

  const body = await resp.json()
  console.log('Firestore API enable request response:', JSON.stringify(body, null, 2))
  console.log('If the operation is pending, wait a few minutes and rerun verification.')
}

main().catch((err) => {
  console.error('Error enabling Firestore API:', err)
  process.exit(1)
})
