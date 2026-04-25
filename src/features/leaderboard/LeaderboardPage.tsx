import { motion } from 'framer-motion'
import { mockLeaderboard } from '../../lib/mock-data'
import { Trophy, Medal, Crown } from 'lucide-react'

export function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight">Leaderboard</h1>
        <p className="text-surface-500 mt-1">Tournament rankings</p>
      </div>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-4 py-8">
        {[1, 0, 2].map((idx) => {
          const entry = mockLeaderboard[idx]
          if (!entry) return null
          const heights = ['h-32', 'h-24', 'h-20']
          const colors = ['from-amber-400 to-amber-500', 'from-surface-300 to-surface-400', 'from-orange-300 to-orange-400']
          const icons = [Crown, Trophy, Medal]
          const Icon = icons[idx]
          return (
            <motion.div
              key={entry.playerId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg mb-2">
                {entry.playerName.charAt(0)}
              </div>
              <p className="text-sm font-medium mb-1">{entry.playerName}</p>
              <p className="text-xs text-surface-500 mb-2">{entry.score} pts</p>
              <div className={`w-24 ${heights[idx]} rounded-t-xl bg-gradient-to-b ${colors[idx]} flex items-start justify-center pt-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Full leaderboard */}
      <div className="glass-card overflow-hidden">
        <div className="relative z-10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200">
                <th className="text-left p-4 text-xs font-medium text-surface-500 uppercase w-16">Rank</th>
                <th className="text-left p-4 text-xs font-medium text-surface-500 uppercase">Player</th>
                <th className="text-right p-4 text-xs font-medium text-surface-500 uppercase">Score</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaderboard.map((entry, i) => (
                <motion.tr
                  key={entry.playerId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-surface-100 hover:bg-white/40"
                >
                  <td className="p-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? 'bg-amber-100 text-amber-700' :
                      i === 1 ? 'bg-surface-200 text-surface-600' :
                      i === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-surface-100 text-surface-500'
                    }`}>
                      {entry.rank}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold text-sm">
                        {entry.playerName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{entry.playerName}</p>
                        <p className="text-xs text-surface-500">{entry.playerEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-lg font-semibold">{entry.score}</span>
                    <span className="text-xs text-surface-500 ml-1">pts</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
