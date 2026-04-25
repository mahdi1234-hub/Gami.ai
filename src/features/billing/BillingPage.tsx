import { PLANS } from '../../lib/constants'
import { cn } from '../../lib/utils'
import { Check, Zap, Star, Crown } from 'lucide-react'

const planIcons = [Zap, Star, Crown]

export function BillingPage() {
  const currentPlan = 'free'

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-light tracking-tight">Billing & Plans</h1>
        <p className="text-surface-500 mt-1">Manage your subscription</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan, i) => {
          const Icon = planIcons[i]
          const isCurrent = plan.id === currentPlan
          return (
            <div
              key={plan.id}
              className={cn(
                'glass-card p-6 transition-all hover:scale-[1.02]',
                isCurrent && 'ring-2 ring-brand-500',
                plan.id === 'pro' && 'bg-surface-900 text-white'
              )}
            >
              <div className="relative z-10">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4', plan.id === 'pro' ? 'bg-brand-500' : 'bg-brand-100')}>
                  <Icon className={cn('w-5 h-5', plan.id === 'pro' ? 'text-white' : 'text-brand-600')} />
                </div>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className={cn('text-sm', plan.id === 'pro' ? 'text-surface-300' : 'text-surface-500')}>/month</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className={cn('w-4 h-4 flex-shrink-0', plan.id === 'pro' ? 'text-brand-400' : 'text-emerald-500')} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={cn(
                  'w-full py-2.5 rounded-xl text-sm font-medium transition-all',
                  isCurrent ? 'bg-surface-200 text-surface-500 cursor-default' :
                  plan.id === 'pro' ? 'bg-brand-500 text-white hover:bg-brand-600' :
                  'bg-surface-900 text-white hover:bg-surface-800'
                )}>
                  {isCurrent ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="glass-card p-6">
        <div className="relative z-10">
          <h3 className="font-medium mb-4">Billing History</h3>
          <div className="text-center py-8 text-surface-400">
            <p className="text-sm">No billing history yet</p>
            <p className="text-xs mt-1">Upgrade to a paid plan to see invoices here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
