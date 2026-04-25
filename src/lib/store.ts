import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { User, Tenant, Campaign } from './types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        localStorage.setItem('auth_token', token)
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem('auth_token')
        set({ user: null, token: null, isAuthenticated: false })
      },
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    { name: 'gami-auth' }
  )
)

interface TenantState {
  tenant: Tenant | null
  setTenant: (tenant: Tenant) => void
  updateBranding: (branding: Partial<Tenant['branding']>) => void
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      tenant: null,
      setTenant: (tenant) => set({ tenant }),
      updateBranding: (branding) =>
        set((state) => ({
          tenant: state.tenant
            ? { ...state.tenant, branding: { ...state.tenant.branding, ...branding } }
            : null,
        })),
    }),
    { name: 'gami-tenant' }
  )
)

interface CampaignBuilderState {
  step: number
  campaign: Partial<Campaign> & { config: Partial<Campaign['config']> }
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateCampaign: (data: Partial<Campaign>) => void
  updateConfig: (data: Partial<Campaign['config']>) => void
  reset: () => void
}

const initialCampaign = {
  name: '',
  description: '',
  gameType: 'spin-wheel' as const,
  status: 'draft' as const,
  config: {
    gameType: 'spin-wheel' as const,
    tenant: { brandName: '', logoUrl: '', primaryColor: '#F47B20', secondaryColor: '#FFFFFF' },
    campaign: { id: '', title: '', duration: 60, winCondition: { type: 'score' as const, threshold: 100 } },
    reward: { type: 'coupon' as const, code: '', displayText: '' },
    collectEmail: true,
    leaderboardEnabled: false,
    maxPlaysPerUser: 3,
    difficulty: 'easy' as const,
  },
  startAt: '',
  endAt: '',
}

export const useCampaignBuilderStore = create<CampaignBuilderState>()(
  immer((set) => ({
    step: 0,
    campaign: initialCampaign,
    setStep: (step) => set((state) => { state.step = step }),
    nextStep: () => set((state) => { state.step = Math.min(state.step + 1, 4) }),
    prevStep: () => set((state) => { state.step = Math.max(state.step - 1, 0) }),
    updateCampaign: (data) =>
      set((state) => {
        Object.assign(state.campaign, data)
      }),
    updateConfig: (data) =>
      set((state) => {
        Object.assign(state.campaign.config, data)
      }),
    reset: () =>
      set((state) => {
        state.step = 0
        state.campaign = initialCampaign as typeof state.campaign
      }),
  }))
)

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'light',
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'gami-ui' }
  )
)
