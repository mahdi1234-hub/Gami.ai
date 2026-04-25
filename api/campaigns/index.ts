import type { VercelRequest, VercelResponse } from '@vercel/node'

const mockCampaigns = [
  { id: 'camp_001', name: 'Summer Spin & Win', gameType: 'spin-wheel', status: 'active', description: 'Spin the wheel for amazing summer discounts!', createdAt: '2026-03-25T10:00:00Z', stats: { totalSessions: 12450, uniquePlayers: 8320, conversionRate: 34.5 } },
  { id: 'camp_002', name: 'Match & Save Challenge', gameType: 'match-3', status: 'active', description: 'Match tiles to unlock exclusive deals', createdAt: '2026-04-05T10:00:00Z', stats: { totalSessions: 5680, uniquePlayers: 3240, conversionRate: 22.8 } },
  { id: 'camp_003', name: 'Bubble Pop Bonanza', gameType: 'bubble-shooter', status: 'draft', description: 'Pop bubbles and win prizes!', createdAt: '2026-04-20T10:00:00Z' },
  { id: 'camp_004', name: 'Scratch & Discover', gameType: 'scratch-card', status: 'ended', description: 'Scratch to reveal your prize', createdAt: '2026-02-25T10:00:00Z', stats: { totalSessions: 28900, uniquePlayers: 22100, conversionRate: 45.2 } },
  { id: 'camp_005', name: 'Target Practice Tournament', gameType: 'shooting-range', status: 'active', description: 'Compete for the top spot!', createdAt: '2026-04-10T10:00:00Z', stats: { totalSessions: 3420, uniquePlayers: 1580, conversionRate: 12.5 } },
]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ campaigns: mockCampaigns })
  }
  if (req.method === 'POST') {
    const campaign = { id: `camp_${Date.now()}`, ...req.body, status: 'draft', createdAt: new Date().toISOString() }
    return res.status(201).json({ campaign })
  }
  return res.status(405).json({ message: 'Method not allowed' })
}
