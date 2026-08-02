import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const secret = process.env.REVALIDATE_SECRET
  const token = req.headers['x-revalidate-secret'] || req.headers.authorization

  if (!secret) {
    return res.status(500).json({ message: 'REVALIDATE_SECRET not configured' })
  }

  if (!token || (typeof token === 'string' && token.replace(/^Bearer\s+/i, '') !== secret)) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const { athleteId, path } = req.body || {}
  if (!athleteId && !path) {
    return res.status(400).json({ message: 'Provide `athleteId` or `path` in body' })
  }

  try {
    const target = path || `/athlete/${athleteId}`
    // Note: Next.js res.revalidate is available in API routes
    await res.revalidate(target)
    return res.json({ revalidated: true, path: target })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || 'Error revalidating' })
  }
}
