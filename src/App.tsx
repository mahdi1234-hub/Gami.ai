import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './lib/store'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { AuthPage } from './features/auth/AuthPage'
import { CampaignListPage } from './features/campaigns/CampaignListPage'
import { CampaignBuilderPage } from './features/campaigns/CampaignBuilderPage'
import { AnalyticsDashboardPage } from './features/analytics/AnalyticsDashboardPage'
import { PlayersPage } from './features/players/PlayersPage'
import { RewardsPage } from './features/rewards/RewardsPage'
import { LeaderboardPage } from './features/leaderboard/LeaderboardPage'
import { EmbedGeneratorPage } from './features/embed/EmbedGeneratorPage'
import { BrandSettingsPage } from './features/settings/BrandSettingsPage'
import { TeamMembersPage } from './features/settings/TeamMembersPage'
import { BillingPage } from './features/billing/BillingPage'
import { GamePreviewPage } from './features/games/GamePreviewPage'
import { OnboardingPage } from './features/onboarding/OnboardingPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route path="/play/:campaignId" element={<GamePreviewPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<CampaignListPage />} />
        <Route path="campaigns/new" element={<CampaignBuilderPage />} />
        <Route path="campaigns/:id" element={<CampaignBuilderPage />} />
        <Route path="campaigns/:id/analytics" element={<AnalyticsDashboardPage />} />
        <Route path="campaigns/:id/players" element={<PlayersPage />} />
        <Route path="campaigns/:id/rewards" element={<RewardsPage />} />
        <Route path="campaigns/:id/leaderboard" element={<LeaderboardPage />} />
        <Route path="campaigns/:id/embed" element={<EmbedGeneratorPage />} />
        <Route path="settings/brand" element={<BrandSettingsPage />} />
        <Route path="settings/team" element={<TeamMembersPage />} />
        <Route path="settings/billing" element={<BillingPage />} />
      </Route>
    </Routes>
  )
}
