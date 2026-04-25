const API_BASE = '/api'

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }

  return res.json()
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string; name: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (data: { email: string; password: string; name: string }) =>
    request<{ token: string; user: { id: string; email: string; name: string } }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyEmail: (token: string) =>
    request<{ message: string }>(`/auth/verify?token=${token}`),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  getMe: () =>
    request<{ user: { id: string; email: string; name: string; role: string } }>('/auth/me'),

  // Campaigns
  getCampaigns: () =>
    request<{ campaigns: unknown[] }>('/campaigns'),

  getCampaign: (id: string) =>
    request<{ campaign: unknown }>(`/campaigns/${id}`),

  createCampaign: (data: unknown) =>
    request<{ campaign: unknown }>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCampaign: (id: string, data: unknown) =>
    request<{ campaign: unknown }>(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteCampaign: (id: string) =>
    request<{ success: boolean }>(`/campaigns/${id}`, {
      method: 'DELETE',
    }),

  publishCampaign: (id: string) =>
    request<{ campaign: unknown }>(`/campaigns/${id}/publish`, {
      method: 'POST',
    }),

  archiveCampaign: (id: string) =>
    request<{ campaign: unknown }>(`/campaigns/${id}/archive`, {
      method: 'POST',
    }),

  getCampaignConfig: (id: string) =>
    request<unknown>(`/campaigns/${id}/config`),

  getCampaignAnalytics: (id: string) =>
    request<unknown>(`/campaigns/${id}/analytics`),

  // Players
  getPlayers: (campaignId: string) =>
    request<{ players: unknown[] }>(`/campaigns/${campaignId}/players`),

  // Leaderboard
  getLeaderboard: (campaignId: string) =>
    request<{ entries: unknown[] }>(`/campaigns/${campaignId}/leaderboard`),

  // Rewards
  getRewards: (campaignId: string) =>
    request<{ rewards: unknown[] }>(`/campaigns/${campaignId}/rewards`),

  // Sessions
  createSession: (data: unknown) =>
    request<{ session: unknown }>('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Games
  getGameTypes: () =>
    request<{ games: unknown[] }>('/games'),

  // Settings
  updateBranding: (data: unknown) =>
    request<{ tenant: unknown }>('/settings/branding', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getTeamMembers: () =>
    request<{ members: unknown[] }>('/settings/team'),

  inviteTeamMember: (data: { email: string; role: string }) =>
    request<{ member: unknown }>('/settings/team/invite', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Billing
  getPlans: () =>
    request<{ plans: unknown[] }>('/billing/plans'),

  // Assets
  uploadAsset: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return fetch(`${API_BASE}/assets/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: formData,
    }).then(res => res.json())
  },
}
