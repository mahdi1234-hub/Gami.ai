import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { mockSessionsOverTime, mockScoreDistribution, mockFunnel, mockOverallStats } from '../../lib/mock-data'
import { formatNumber } from '../../lib/utils'
import { TrendingUp, Users, Clock, Trophy, Target, Activity, Download } from 'lucide-react'

export function AnalyticsDashboardPage() {
  const stats = [
    { label: 'Total Sessions', value: formatNumber(mockOverallStats.totalSessions), change: '+12.3%', icon: Activity, color: 'text-brand-500' },
    { label: 'Unique Players', value: formatNumber(mockOverallStats.uniquePlayers), change: '+8.7%', icon: Users, color: 'text-blue-500' },
    { label: 'Conversion Rate', value: `${mockOverallStats.conversionRate}%`, change: '+2.1%', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Avg Duration', value: `${mockOverallStats.avgDuration}s`, change: '-3.2s', icon: Clock, color: 'text-purple-500' },
    { label: 'Avg Score', value: mockOverallStats.avgScore.toString(), change: '+45', icon: Target, color: 'text-amber-500' },
    { label: 'Rewards Issued', value: formatNumber(mockOverallStats.totalRewardsIssued), change: '+890', icon: Trophy, color: 'text-pink-500' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Analytics</h1>
          <p className="text-surface-500 mt-1">Campaign performance overview</p>
        </div>
        <div className="flex gap-3">
          <select className="input-field py-2 px-3 text-sm w-auto">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>All time</option>
          </select>
          <button className="btn-secondary py-2 text-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-5"
          >
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-sm text-surface-500">{stat.label}</p>
                <p className="text-2xl font-semibold mt-1 tracking-tight">{stat.value}</p>
                <p className="text-xs text-emerald-600 mt-1 font-medium">{stat.change}</p>
              </div>
              <div className={`p-2 rounded-xl bg-surface-100 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions Over Time */}
        <div className="glass-card p-6">
          <div className="relative z-10">
            <h3 className="font-medium mb-4">Sessions Over Time</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={mockSessionsOverTime}>
                <defs>
                  <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F47B20" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#F47B20" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DD" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9A9385" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9A9385" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '0.75rem' }}
                />
                <Area type="monotone" dataKey="sessions" stroke="#F47B20" fill="url(#sessionGradient)" strokeWidth={2} />
                <Line type="monotone" dataKey="players" stroke="#2563EB" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Distribution */}
        <div className="glass-card p-6">
          <div className="relative z-10">
            <h3 className="font-medium mb-4">Score Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockScoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DD" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="#9A9385" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9A9385" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '0.75rem' }}
                />
                <Bar dataKey="count" fill="#F47B20" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="glass-card p-6">
        <div className="relative z-10">
          <h3 className="font-medium mb-6">Conversion Funnel</h3>
          <div className="space-y-3">
            {mockFunnel.map((step, i) => (
              <div key={step.name} className="flex items-center gap-4">
                <div className="w-32 text-sm text-surface-600 font-medium">{step.name}</div>
                <div className="flex-1 h-10 bg-surface-100 rounded-xl overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${step.percentage}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="h-full rounded-xl"
                    style={{ backgroundColor: `hsl(${25 + i * 15}, 90%, ${55 + i * 5}%)` }}
                  />
                  <div className="absolute inset-0 flex items-center px-4 text-sm font-medium">
                    {formatNumber(step.count)} ({step.percentage}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
