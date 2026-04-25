import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'gami_salt_2026').digest('hex')
}

function generateToken(userId: string): string {
  const payload = { userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }
  return Buffer.from(JSON.stringify(payload)).toString('base64url')
}

// Demo user for testing
const demoUser = {
  id: 'usr_demo001',
  email: 'demo@gami.ai',
  name: 'Demo User',
  passwordHash: hashPassword('demo123'),
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Check demo user
    if (email === demoUser.email && hashPassword(password) === demoUser.passwordHash) {
      const token = generateToken(demoUser.id)
      return res.status(200).json({
        token,
        user: { id: demoUser.id, email: demoUser.email, name: demoUser.name },
      })
    }

    // For any other email/password combo, create a session (demo mode)
    const userId = `usr_${crypto.randomBytes(8).toString('hex')}`
    const token = generateToken(userId)
    return res.status(200).json({
      token,
      user: { id: userId, email, name: email.split('@')[0] },
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
