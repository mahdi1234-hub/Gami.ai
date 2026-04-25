import { mockRewards } from '../../lib/mock-data'
import { formatDate, cn } from '../../lib/utils'
import { Gift, Tag, CheckCircle, Clock, XCircle } from 'lucide-react'

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
  available: { color: 'bg-blue-100 text-blue-700', icon: Tag },
  issued: { color: 'bg-amber-100 text-amber-700', icon: Clock },
  redeemed: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  expired: { color: 'bg-red-100 text-red-700', icon: XCircle },
}

export function RewardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Rewards</h1>
          <p className="text-surface-500 mt-1">Manage coupon codes and prizes</p>
        </div>
        <button className="btn-brand"><Gift className="w-4 h-4" /> Issue Reward</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {Object.entries({ available: 1, issued: 2, redeemed: 2, expired: 0 }).map(([status, count]) => {
          const cfg = statusConfig[status]
          return (
            <div key={status} className="glass-card p-4">
              <div className="relative z-10 flex items-center gap-3">
                <div className={cn('p-2 rounded-xl', cfg.color)}><cfg.icon className="w-4 h-4" /></div>
                <div>
                  <p className="text-2xl font-semibold">{count}</p>
                  <p className="text-xs text-surface-500 capitalize">{status}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="relative z-10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200">
                <th className="text-left p-4 text-xs font-medium text-surface-500 uppercase">Code</th>
                <th className="text-left p-4 text-xs font-medium text-surface-500 uppercase hidden sm:table-cell">Type</th>
                <th className="text-left p-4 text-xs font-medium text-surface-500 uppercase">Status</th>
                <th className="text-left p-4 text-xs font-medium text-surface-500 uppercase hidden md:table-cell">Issued</th>
                <th className="text-left p-4 text-xs font-medium text-surface-500 uppercase hidden lg:table-cell">Redeemed</th>
              </tr>
            </thead>
            <tbody>
              {mockRewards.map((reward) => {
                const cfg = statusConfig[reward.status]
                return (
                  <tr key={reward.id} className="border-b border-surface-100 hover:bg-white/40">
                    <td className="p-4"><code className="text-sm font-mono bg-surface-100 px-2 py-1 rounded">{reward.code}</code></td>
                    <td className="p-4 hidden sm:table-cell text-sm capitalize">{reward.type}</td>
                    <td className="p-4">
                      <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium capitalize', cfg.color)}>{reward.status}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-surface-500">{reward.issuedAt ? formatDate(reward.issuedAt) : '-'}</td>
                    <td className="p-4 hidden lg:table-cell text-sm text-surface-500">{reward.redeemedAt ? formatDate(reward.redeemedAt) : '-'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
