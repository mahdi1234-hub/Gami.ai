import type { GameType, CampaignStatus, RewardType, WinConditionType } from './constants'

export interface User {
  id: string
  email: string
  name: string
  role: 'owner' | 'admin' | 'member'
  avatar?: string
  createdAt: string
}

export interface Tenant {
  id: string
  name: string
  slug: string
  plan: 'free' | 'starter' | 'pro'
  branding: BrandingConfig
  settings: TenantSettings
  createdAt: string
}

export interface BrandingConfig {
  logoUrl: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  backgroundUrl: string
}

export interface TenantSettings {
  defaultLanguage: string
  timezone: string
  emailFromName: string
  emailFromAddress: string
  googleAnalyticsId: string
  webhookUrl: string
  webhookSecret: string
}

export interface Campaign {
  id: string
  tenantId: string
  name: string
  description: string
  gameType: GameType
  status: CampaignStatus
  config: CampaignConfig
  startAt: string
  endAt: string
  createdAt: string
  updatedAt: string
  stats?: CampaignStats
}

export interface CampaignConfig {
  gameType: GameType
  tenant: {
    brandName: string
    logoUrl: string
    primaryColor: string
    secondaryColor: string
  }
  campaign: {
    id: string
    title: string
    duration: number
    winCondition: {
      type: WinConditionType
      threshold: number
    }
  }
  reward: {
    type: RewardType
    code: string
    displayText: string
  }
  collectEmail: boolean
  leaderboardEnabled: boolean
  maxPlaysPerUser: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface CampaignStats {
  totalSessions: number
  uniquePlayers: number
  avgScore: number
  conversionRate: number
  totalRewardsIssued: number
  avgDuration: number
}

export interface Player {
  id: string
  email: string
  name: string
  campaignId: string
  sessionsPlayed: number
  bestScore: number
  rewardIssued: boolean
  createdAt: string
}

export interface GameSession {
  id: string
  campaignId: string
  playerId: string
  score: number
  won: boolean
  duration: number
  completedAt: string
  deviceType: 'mobile' | 'desktop' | 'tablet'
}

export interface Reward {
  id: string
  campaignId: string
  type: RewardType
  code: string
  issuedToPlayerId: string | null
  issuedAt: string | null
  redeemedAt: string | null
  status: 'available' | 'issued' | 'redeemed' | 'expired'
}

export interface LeaderboardEntry {
  rank: number
  playerId: string
  playerName: string
  playerEmail: string
  score: number
  updatedAt: string
}

export interface AnalyticsEvent {
  id: string
  campaignId: string
  eventType: string
  payload: Record<string, unknown>
  createdAt: string
}

export interface TeamMember {
  id: string
  userId: string
  tenantId: string
  role: 'owner' | 'admin' | 'member'
  user: User
  invitedAt: string
  joinedAt: string
}

export interface WebhookDelivery {
  id: string
  event: string
  url: string
  status: 'success' | 'failed' | 'pending'
  responseCode: number | null
  attempts: number
  createdAt: string
}

export interface FunnelStep {
  name: string
  count: number
  percentage: number
}

export interface DateRange {
  from: Date
  to: Date
}

// postMessage event types
export interface GameEvent {
  type: 'GAME_READY' | 'GAME_STARTED' | 'SCORE_UPDATE' | 'GAME_COMPLETED' | 'REWARD_CLAIMED' | 'EMAIL_SUBMITTED' | 'GAME_ABANDONED' | 'LEADERBOARD_REQUEST' | 'ERROR'
  payload: Record<string, unknown>
}

export interface ShellCommand {
  type: 'LOAD_CONFIG' | 'PAUSE' | 'RESUME' | 'LEADERBOARD_DATA' | 'FORCE_END'
  payload: Record<string, unknown>
}
