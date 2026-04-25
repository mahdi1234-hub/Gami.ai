import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCampaignBuilderStore } from '../../lib/store'
import { GAME_TYPES } from '../../lib/constants'
import { cn } from '../../lib/utils'
import { toast } from 'sonner'
import { HexColorPicker } from 'react-colorful'
import {
  ArrowLeft, ArrowRight, Check, Gamepad2, Palette, Gift, Share2,
  Rocket, Clock, Target, Mail, Trophy, Sliders, Eye
} from 'lucide-react'

const steps = [
  { label: 'Game Type', icon: Gamepad2 },
  { label: 'Branding', icon: Palette },
  { label: 'Rewards', icon: Gift },
  { label: 'Distribution', icon: Share2 },
  { label: 'Review', icon: Rocket },
]

export function CampaignBuilderPage() {
  const navigate = useNavigate()
  const { step, campaign, setStep, nextStep, prevStep, updateCampaign, updateConfig, reset } = useCampaignBuilderStore()
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handlePublish = () => {
    toast.success('Campaign created successfully!')
    reset()
    navigate('/dashboard')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Campaign Builder</h1>
          <p className="text-surface-500 mt-1">Create a new gamified campaign</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center flex-1">
            <button
              onClick={() => setStep(i)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full',
                i === step ? 'bg-surface-900 text-white' :
                i < step ? 'bg-brand-100 text-brand-700' :
                'bg-white/60 text-surface-400'
              )}
            >
              {i < step ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && <div className="w-4 h-px bg-surface-300 mx-1 hidden sm:block" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Choose a game type</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {GAME_TYPES.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => {
                      updateCampaign({ gameType: game.id })
                      updateConfig({ gameType: game.id })
                    }}
                    className={cn(
                      'glass-card p-5 text-left transition-all hover:scale-[1.02]',
                      campaign.gameType === game.id && 'ring-2 ring-brand-500'
                    )}
                  >
                    <div className="relative z-10">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                        style={{ backgroundColor: `${game.color}15` }}
                      >
                        {game.icon}
                      </div>
                      <h3 className="font-medium">{game.name}</h3>
                      <p className="text-sm text-surface-500 mt-1">{game.description}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-surface-400">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{game.avgDuration}</span>
                        <span className="flex items-center gap-1"><Target className="w-3 h-3" />{game.difficulty}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Brand your campaign</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-surface-600 block mb-2">Campaign Name</label>
                    <input
                      type="text"
                      value={campaign.name || ''}
                      onChange={(e) => updateCampaign({ name: e.target.value })}
                      placeholder="e.g., Summer Spin & Win"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600 block mb-2">Description</label>
                    <textarea
                      value={campaign.description || ''}
                      onChange={(e) => updateCampaign({ description: e.target.value })}
                      placeholder="Short description for your campaign..."
                      rows={3}
                      className="input-field resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600 block mb-2">Brand Name</label>
                    <input
                      type="text"
                      value={campaign.config?.tenant?.brandName || ''}
                      onChange={(e) => updateConfig({ tenant: { ...campaign.config.tenant!, brandName: e.target.value } })}
                      placeholder="Your brand name"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600 block mb-2">Primary Color</label>
                    <div className="relative">
                      <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="flex items-center gap-3 input-field cursor-pointer"
                      >
                        <div
                          className="w-6 h-6 rounded-lg border border-surface-200"
                          style={{ backgroundColor: campaign.config?.tenant?.primaryColor || '#F47B20' }}
                        />
                        <span>{campaign.config?.tenant?.primaryColor || '#F47B20'}</span>
                      </button>
                      {showColorPicker && (
                        <div className="absolute z-50 mt-2">
                          <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
                          <div className="relative">
                            <HexColorPicker
                              color={campaign.config?.tenant?.primaryColor || '#F47B20'}
                              onChange={(color) => updateConfig({ tenant: { ...campaign.config.tenant!, primaryColor: color } })}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="relative z-10">
                    <h3 className="text-sm font-medium text-surface-500 mb-4">Preview</h3>
                    <div
                      className="rounded-2xl p-8 text-center text-white"
                      style={{ backgroundColor: campaign.config?.tenant?.primaryColor || '#F47B20' }}
                    >
                      <div className="text-4xl mb-3">{GAME_TYPES.find(g => g.id === campaign.gameType)?.icon}</div>
                      <h3 className="text-xl font-semibold">{campaign.name || 'Your Campaign'}</h3>
                      <p className="text-sm opacity-80 mt-1">{campaign.config?.tenant?.brandName || 'Brand Name'}</p>
                      <button className="mt-4 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-medium">
                        Play Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Configure rewards</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-surface-600 block mb-2">Win Condition</label>
                    <select
                      value={campaign.config?.campaign?.winCondition?.type || 'score'}
                      onChange={(e) => updateConfig({
                        campaign: {
                          ...campaign.config.campaign!,
                          winCondition: { ...campaign.config.campaign!.winCondition, type: e.target.value as 'score' | 'completion' | 'time' | 'always' }
                        }
                      })}
                      className="input-field"
                    >
                      <option value="score">Score threshold</option>
                      <option value="completion">Game completion</option>
                      <option value="always">Always win</option>
                      <option value="time">Time-based</option>
                    </select>
                  </div>
                  {campaign.config?.campaign?.winCondition?.type === 'score' && (
                    <div>
                      <label className="text-sm font-medium text-surface-600 block mb-2">Score Threshold</label>
                      <input
                        type="number"
                        value={campaign.config?.campaign?.winCondition?.threshold || 100}
                        onChange={(e) => updateConfig({
                          campaign: {
                            ...campaign.config.campaign!,
                            winCondition: { ...campaign.config.campaign!.winCondition, threshold: Number(e.target.value) }
                          }
                        })}
                        className="input-field"
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-surface-600 block mb-2">Reward Type</label>
                    <select
                      value={campaign.config?.reward?.type || 'coupon'}
                      onChange={(e) => updateConfig({ reward: { ...campaign.config.reward!, type: e.target.value as 'coupon' | 'freebie' | 'points' | 'custom' } })}
                      className="input-field"
                    >
                      <option value="coupon">Coupon Code</option>
                      <option value="freebie">Free Item</option>
                      <option value="points">Points</option>
                      <option value="custom">Custom Prize</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600 block mb-2">Reward Code</label>
                    <input
                      type="text"
                      value={campaign.config?.reward?.code || ''}
                      onChange={(e) => updateConfig({ reward: { ...campaign.config.reward!, code: e.target.value } })}
                      placeholder="e.g., SAVE20"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600 block mb-2">Reward Display Text</label>
                    <input
                      type="text"
                      value={campaign.config?.reward?.displayText || ''}
                      onChange={(e) => updateConfig({ reward: { ...campaign.config.reward!, displayText: e.target.value } })}
                      placeholder="e.g., 20% off your next order"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600 block mb-2">Game Duration (seconds)</label>
                    <input
                      type="number"
                      value={campaign.config?.campaign?.duration || 60}
                      onChange={(e) => updateConfig({ campaign: { ...campaign.config.campaign!, duration: Number(e.target.value) } })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600 block mb-2">Max Plays Per User</label>
                    <input
                      type="number"
                      value={campaign.config?.maxPlaysPerUser || 3}
                      onChange={(e) => updateConfig({ maxPlaysPerUser: Number(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="glass-card p-5">
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-surface-500" />
                        <div>
                          <p className="text-sm font-medium">Email Gate</p>
                          <p className="text-xs text-surface-500">Require email before playing</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateConfig({ collectEmail: !campaign.config?.collectEmail })}
                        className={cn(
                          'w-11 h-6 rounded-full transition-colors',
                          campaign.config?.collectEmail ? 'bg-brand-500' : 'bg-surface-300'
                        )}
                      >
                        <div className={cn(
                          'w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                          campaign.config?.collectEmail ? 'translate-x-5.5' : 'translate-x-0.5'
                        )} />
                      </button>
                    </div>
                  </div>
                  <div className="glass-card p-5">
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-surface-500" />
                        <div>
                          <p className="text-sm font-medium">Leaderboard</p>
                          <p className="text-xs text-surface-500">Enable competitive rankings</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateConfig({ leaderboardEnabled: !campaign.config?.leaderboardEnabled })}
                        className={cn(
                          'w-11 h-6 rounded-full transition-colors',
                          campaign.config?.leaderboardEnabled ? 'bg-brand-500' : 'bg-surface-300'
                        )}
                      >
                        <div className={cn(
                          'w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                          campaign.config?.leaderboardEnabled ? 'translate-x-5.5' : 'translate-x-0.5'
                        )} />
                      </button>
                    </div>
                  </div>
                  <div className="glass-card p-5">
                    <div className="relative z-10">
                      <label className="text-sm font-medium text-surface-600 block mb-3">Difficulty</label>
                      <div className="flex gap-2">
                        {['easy', 'medium', 'hard'].map((d) => (
                          <button
                            key={d}
                            onClick={() => updateConfig({ difficulty: d as 'easy' | 'medium' | 'hard' })}
                            className={cn(
                              'flex-1 px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all',
                              campaign.config?.difficulty === d ? 'bg-surface-900 text-white' : 'bg-surface-100 text-surface-600'
                            )}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Distribution settings</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-surface-600 block mb-2">Start Date</label>
                    <input
                      type="datetime-local"
                      value={campaign.startAt ? campaign.startAt.slice(0, 16) : ''}
                      onChange={(e) => updateCampaign({ startAt: new Date(e.target.value).toISOString() })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface-600 block mb-2">End Date</label>
                    <input
                      type="datetime-local"
                      value={campaign.endAt ? campaign.endAt.slice(0, 16) : ''}
                      onChange={(e) => updateCampaign({ endAt: new Date(e.target.value).toISOString() })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="relative z-10">
                    <h3 className="text-sm font-medium text-surface-500 mb-4">Distribution Channels</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Website Embed', desc: 'Add to your website via script tag or iframe' },
                        { label: 'QR Code', desc: 'Generate printable QR codes' },
                        { label: 'Direct Link', desc: 'Share a direct game URL' },
                        { label: 'Email Campaign', desc: 'Include in marketing emails' },
                      ].map((channel) => (
                        <div key={channel.label} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50">
                          <Check className="w-4 h-4 text-emerald-500" />
                          <div>
                            <p className="text-sm font-medium">{channel.label}</p>
                            <p className="text-xs text-surface-400">{channel.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Review & Publish</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="glass-card p-5">
                    <div className="relative z-10 space-y-3">
                      <h3 className="font-medium">Campaign Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-surface-500">Name</span><span className="font-medium">{campaign.name || 'Untitled'}</span></div>
                        <div className="flex justify-between"><span className="text-surface-500">Game</span><span className="font-medium">{GAME_TYPES.find(g => g.id === campaign.gameType)?.name}</span></div>
                        <div className="flex justify-between"><span className="text-surface-500">Duration</span><span className="font-medium">{campaign.config?.campaign?.duration}s</span></div>
                        <div className="flex justify-between"><span className="text-surface-500">Win Condition</span><span className="font-medium capitalize">{campaign.config?.campaign?.winCondition?.type}</span></div>
                        <div className="flex justify-between"><span className="text-surface-500">Reward</span><span className="font-medium">{campaign.config?.reward?.code || 'None'}</span></div>
                        <div className="flex justify-between"><span className="text-surface-500">Email Gate</span><span className="font-medium">{campaign.config?.collectEmail ? 'Yes' : 'No'}</span></div>
                        <div className="flex justify-between"><span className="text-surface-500">Leaderboard</span><span className="font-medium">{campaign.config?.leaderboardEnabled ? 'Yes' : 'No'}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="rounded-2xl p-8 text-center text-white"
                  style={{ backgroundColor: campaign.config?.tenant?.primaryColor || '#F47B20' }}
                >
                  <div className="text-5xl mb-4">{GAME_TYPES.find(g => g.id === campaign.gameType)?.icon}</div>
                  <h3 className="text-2xl font-semibold">{campaign.name || 'Your Campaign'}</h3>
                  <p className="text-sm opacity-80 mt-1">{campaign.config?.tenant?.brandName || 'Brand'}</p>
                  <p className="text-sm opacity-60 mt-4">{campaign.config?.reward?.displayText || 'Play to win!'}</p>
                  <button className="mt-6 bg-white/20 backdrop-blur-sm px-8 py-3 rounded-full font-medium hover:bg-white/30 transition-colors">
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-200">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className="btn-secondary disabled:opacity-30"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        {step < 4 ? (
          <button onClick={nextStep} className="btn-brand">
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handlePublish} className="btn-brand">
            <Rocket className="w-4 h-4" /> Publish Campaign
          </button>
        )}
      </div>
    </div>
  )
}
