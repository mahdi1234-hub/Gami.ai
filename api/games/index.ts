import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    games: [
      { id: 'bubble-shooter', name: 'Bubble Shooter', icon: '🫧', difficulty: 'Easy', avgDuration: '60s' },
      { id: 'match-3', name: 'Match 3', icon: '💎', difficulty: 'Medium', avgDuration: '90s' },
      { id: 'draw-line', name: 'Draw a Line', icon: '✏️', difficulty: 'Easy', avgDuration: '45s' },
      { id: 'shooting-range', name: 'Shooting Range', icon: '🎯', difficulty: 'Hard', avgDuration: '60s' },
      { id: 'scratch-card', name: 'Scratch Card', icon: '🎟️', difficulty: 'Easy', avgDuration: '15s' },
      { id: 'spin-wheel', name: 'Spin the Wheel', icon: '🎡', difficulty: 'Easy', avgDuration: '10s' },
    ],
  })
}
