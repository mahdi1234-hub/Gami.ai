import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

// Simple in-memory store (in production, use a real database)
const users: Record<string, { id: string; email: string; name: string; passwordHash: string; verified: boolean }> = {}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'gami_salt_2026').digest('hex')
}

function generateToken(userId: string): string {
  const payload = { userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }
  return Buffer.from(JSON.stringify(payload)).toString('base64url')
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'louatimahdi390@gmail.com',
    pass: 'vtjb rtop rbfd nevr',
  },
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' })
    }

    if (users[email]) {
      return res.status(409).json({ message: 'User already exists' })
    }

    const userId = `usr_${crypto.randomBytes(8).toString('hex')}`
    users[email] = {
      id: userId,
      email,
      name,
      passwordHash: hashPassword(password),
      verified: false,
    }

    const token = generateToken(userId)
    const verificationToken = crypto.randomBytes(32).toString('hex')

    // Send verification email
    try {
      await transporter.sendMail({
        from: '"Gami.ai" <louatimahdi390@gmail.com>',
        to: email,
        subject: 'Welcome to Gami.ai - Verify your email',
        html: `
          <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #F47B20, #E56012); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 24px;">⚡</div>
              <h1 style="font-size: 24px; font-weight: 300; color: #2C2824; margin-top: 16px;">Welcome to Gami.ai</h1>
            </div>
            <p style="color: #7D7668; line-height: 1.6;">Hi ${name},</p>
            <p style="color: #7D7668; line-height: 1.6;">Thanks for signing up! You're one step away from creating amazing gamified marketing campaigns.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${req.headers.origin || 'https://gami-ai.vercel.app'}/verify?token=${verificationToken}" style="background: #F47B20; color: white; padding: 12px 32px; border-radius: 50px; text-decoration: none; font-weight: 500; font-size: 14px;">Verify Email</a>
            </div>
            <p style="color: #9A9385; font-size: 12px; text-align: center;">Powered by Gami.ai - Gamification Marketing Platform</p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Email send error:', emailErr)
      // Continue even if email fails
    }

    return res.status(201).json({
      token,
      user: { id: userId, email, name },
      message: 'Account created. Check your email to verify.',
    })
  } catch (err) {
    console.error('Signup error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
