export const APP_NAME = 'Gami.ai'
export const APP_DESCRIPTION = 'Gamification Marketing Platform'

export const GAME_TYPES = [
  {
    id: 'bubble-shooter',
    name: 'Bubble Shooter',
    description: 'Pop bubbles to score points! Fast-paced and addictive.',
    icon: '🫧',
    color: '#7C3AED',
    difficulty: 'Easy',
    avgDuration: '60s',
  },
  {
    id: 'match-3',
    name: 'Match 3',
    description: 'Swap tiles to create matches of 3 or more. Classic puzzle fun.',
    icon: '💎',
    color: '#2563EB',
    difficulty: 'Medium',
    avgDuration: '90s',
  },
  {
    id: 'draw-line',
    name: 'Draw a Line',
    description: 'Trace the path to connect the dots. Creative and engaging.',
    icon: '✏️',
    color: '#059669',
    difficulty: 'Easy',
    avgDuration: '45s',
  },
  {
    id: 'shooting-range',
    name: 'Shooting Range',
    description: 'Hit targets and score big! Action-packed gameplay.',
    icon: '🎯',
    color: '#DC2626',
    difficulty: 'Hard',
    avgDuration: '60s',
  },
  {
    id: 'scratch-card',
    name: 'Scratch Card',
    description: 'Scratch to reveal your prize. Instant gratification.',
    icon: '🎟️',
    color: '#D97706',
    difficulty: 'Easy',
    avgDuration: '15s',
  },
  {
    id: 'spin-wheel',
    name: 'Spin the Wheel',
    description: 'Spin and win! The classic prize wheel experience.',
    icon: '🎡',
    color: '#EC4899',
    difficulty: 'Easy',
    avgDuration: '10s',
  },
] as const

export type GameType = typeof GAME_TYPES[number]['id']

export const CAMPAIGN_STATUSES = ['draft', 'active', 'paused', 'ended', 'archived'] as const
export type CampaignStatus = typeof CAMPAIGN_STATUSES[number]

export const REWARD_TYPES = ['coupon', 'freebie', 'points', 'custom'] as const
export type RewardType = typeof REWARD_TYPES[number]

export const WIN_CONDITION_TYPES = ['score', 'completion', 'time', 'always'] as const
export type WinConditionType = typeof WIN_CONDITION_TYPES[number]

export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    maxCampaigns: 1,
    features: ['1 active campaign', 'Basic analytics', 'Winday Club listing', 'Email support'],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    maxCampaigns: 5,
    features: ['5 active campaigns', 'Tournament mode', 'Email gate', 'Google Analytics', 'CSV export', 'Priority support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 199,
    maxCampaigns: -1,
    features: ['Unlimited campaigns', 'Custom domain', 'Webhook integration', 'White label', 'API access', 'Dedicated support'],
  },
] as const

export const FEATURE_FLAGS: Record<string, Record<string, boolean | number>> = {
  free: {
    max_active_campaigns: 1,
    tournament_mode: false,
    custom_domain: false,
    email_gate: false,
    google_analytics: false,
    csv_export: false,
    webhook_integration: false,
    white_label: false,
    api_access: false,
    winday_club_listing: true,
  },
  starter: {
    max_active_campaigns: 5,
    tournament_mode: true,
    custom_domain: false,
    email_gate: true,
    google_analytics: true,
    csv_export: true,
    webhook_integration: false,
    white_label: false,
    api_access: false,
    winday_club_listing: true,
  },
  pro: {
    max_active_campaigns: -1,
    tournament_mode: true,
    custom_domain: true,
    email_gate: true,
    google_analytics: true,
    csv_export: true,
    webhook_integration: true,
    white_label: true,
    api_access: true,
    winday_club_listing: true,
  },
}

export const WEBHOOK_EVENTS = [
  'campaign.published',
  'session.started',
  'session.completed',
  'reward.issued',
  'reward.redeemed',
  'player.created',
  'leaderboard.updated',
  'campaign.ended',
] as const
