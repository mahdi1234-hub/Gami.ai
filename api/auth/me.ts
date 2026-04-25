import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const token = auth.slice(7)
    const payload = JSON.parse(Buffer.from(token, 'base64url').toString())
    if (payload.exp < Date.now()) {
      return res.status(401).json({ message: 'Token expired' })
    }
    return res.status(200).json({
      user: { id: payload.userId, email: 'user@gami.ai', name: 'Gami User', role: 'owner' },
    })
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
