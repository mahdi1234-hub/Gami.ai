import { useState } from 'react'
import { mockPlayers } from '../../lib/mock-data'
import { formatDate, cn } from '../../lib/utils'
import { Search, Download, Filter, Mail, Trophy, GamepadIcon, ChevronRight } from 'lucide-react'

export function PlayersPage() {
  const [search, setSearch] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)

  const players = mockPlayers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Players</h1>
          <p className="text-surface-500 mt-1">{mockPlayers.length} total players</p>
        </div>
        <button className="btn-secondary">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="relative z-10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200">
                <th className="text-left p-4 text-xs font-medium text-surface-500 uppercase tracking-wider">Player</th>
                <th className="text-left p-4 text-xs font-medium text-surface-500 uppercase tracking-wider hidden md:table-cell">Sessions</th>
                <th className="text-left p-4 text-xs font-medium text-surface-500 uppercase tracking-wider hidden md:table-cell">Best Score</th>
                <th className="text-left p-4 text-xs font-medium text-surface-500 uppercase tracking-wider hidden sm:table-cell">Reward</th>
                <th className="text-left p-4 text-xs font-medium text-surface-500 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr
                  key={player.id}
                  className="border-b border-surface-100 hover:bg-white/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedPlayer(selectedPlayer === player.id ? null : player.id)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold text-sm">
                        {player.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{player.name}</p>
                        <p className="text-xs text-surface-500">{player.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-sm">
                      <GamepadIcon className="w-4 h-4 text-surface-400" />
                      {player.sessionsPlayed}
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      {player.bestScore}
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium',
                      player.rewardIssued ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-200 text-surface-500'
                    )}>
                      {player.rewardIssued ? 'Issued' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-sm text-surface-500">
                    {formatDate(player.createdAt)}
                  </td>
                  <td className="p-4">
                    <ChevronRight className={cn('w-4 h-4 text-surface-400 transition-transform', selectedPlayer === player.id && 'rotate-90')} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
