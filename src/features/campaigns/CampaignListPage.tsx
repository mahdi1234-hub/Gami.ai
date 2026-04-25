import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { mockCampaigns, mockOverallStats } from '../../lib/mock-data'
import { GAME_TYPES } from '../../lib/constants'
import { formatNumber, formatDate, cn } from '../../lib/utils'
import {
  Zap, Plus, Search, Filter, MoreHorizontal, Play, Pause,
  Archive, BarChart3, Users, Trophy, Clock, TrendingUp, Eye
} from 'lucide-react'

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-surface-200 text-surface-600',
  paused: 'bg-amber-100 text-amber-700',
  ended: 'bg-red-100 text-red-700',
  archived: 'bg-surface-200 text-surface-500',
}

export function CampaignListPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const campaigns = mockCampaigns.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || c.status === filterStatus
    return matchSearch && matchStatus
  })

  const stats = [
    { label: 'Total Sessions', value: formatNumber(mockOverallStats.totalSessions), icon: Play, color: 'text-brand-500' },
    { label: 'Unique Players', value: formatNumber(mockOverallStats.uniquePlayers), icon: Users, color: 'text-blue-500' },
    { label: 'Conversion Rate', value: `${mockOverallStats.conversionRate}%`, icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Rewards Issued', value: formatNumber(mockOverallStats.totalRewardsIssued), icon: Trophy, color: 'text-amber-500' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Campaigns</h1>
          <p className="text-surface-500 mt-1">Manage your gamified marketing campaigns</p>
        </div>
        <Link to="/campaigns/new" className="btn-brand">
          <Plus className="w-4 h-4" />
          New Campaign
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-sm text-surface-500">{stat.label}</p>
                <p className="text-2xl font-semibold mt-1 tracking-tight">{stat.value}</p>
              </div>
              <div className={cn('p-2 rounded-xl bg-surface-100', stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'draft', 'ended'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                'px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize',
                filterStatus === status
                  ? 'bg-surface-900 text-white'
                  : 'bg-white/60 text-surface-600 hover:bg-white/80'
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {campaigns.map((campaign, i) => {
          const gameType = GAME_TYPES.find((g) => g.id === campaign.gameType)
          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card group cursor-pointer hover:scale-[1.02]"
            >
              <div className="relative z-10">
                {/* Card header */}
                <div className="p-5 pb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${gameType?.color}15`, color: gameType?.color }}
                      >
                        {gameType?.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{campaign.name}</h3>
                        <p className="text-xs text-surface-500">{gameType?.name}</p>
                      </div>
                    </div>
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium capitalize', statusColors[campaign.status])}>
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-sm text-surface-500 line-clamp-2">{campaign.description}</p>
                </div>

                {/* Stats */}
                {campaign.stats && (
                  <div className="grid grid-cols-3 gap-3 p-5">
                    <div>
                      <p className="text-xs text-surface-400">Sessions</p>
                      <p className="text-sm font-semibold">{formatNumber(campaign.stats.totalSessions)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-surface-400">Players</p>
                      <p className="text-sm font-semibold">{formatNumber(campaign.stats.uniquePlayers)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-surface-400">Conv.</p>
                      <p className="text-sm font-semibold">{campaign.stats.conversionRate}%</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="border-t border-surface-200 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-surface-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(campaign.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/campaigns/${campaign.id}/analytics`}
                      className="p-2 hover:bg-surface-100 rounded-lg text-surface-400 hover:text-surface-600 transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/campaigns/${campaign.id}`}
                      className="p-2 hover:bg-surface-100 rounded-lg text-surface-400 hover:text-surface-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* New campaign card */}
        <Link
          to="/campaigns/new"
          className="glass-card flex items-center justify-center min-h-[200px] hover:scale-[1.02] transition-transform group"
        >
          <div className="relative z-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-100 transition-colors">
              <Plus className="w-6 h-6 text-surface-400 group-hover:text-brand-500 transition-colors" />
            </div>
            <p className="text-sm font-medium text-surface-500 group-hover:text-surface-700">Create new campaign</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
