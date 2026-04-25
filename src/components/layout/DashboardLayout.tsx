import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore, useUIStore } from '../../lib/store'
import {
  LayoutDashboard, Gamepad2, BarChart3, Settings, CreditCard,
  Users, Menu, X, LogOut, ChevronDown, Zap, Bell
} from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  { label: 'Campaigns', icon: Gamepad2, path: '/dashboard' },
  { label: 'Analytics', icon: BarChart3, path: '/campaigns/camp_001/analytics' },
  { label: 'Players', icon: Users, path: '/campaigns/camp_001/players' },
]

const settingsItems = [
  { label: 'Brand', icon: Settings, path: '/settings/brand' },
  { label: 'Team', icon: Users, path: '/settings/team' },
  { label: 'Billing', icon: CreditCard, path: '/settings/billing' },
]

export function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-100">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed lg:relative z-40 w-[280px] h-full bg-white/60 backdrop-blur-xl border-r border-surface-200 flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold tracking-tight">Gami.ai</h1>
                  <p className="text-xs text-surface-500">Marketing Platform</p>
                </div>
              </Link>
              <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-surface-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
              <p className="px-4 py-2 text-xs font-medium text-surface-400 uppercase tracking-wider">Platform</p>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'sidebar-link',
                    location.pathname === item.path && 'active'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}

              <div className="pt-4">
                <p className="px-4 py-2 text-xs font-medium text-surface-400 uppercase tracking-wider">Settings</p>
                {settingsItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'sidebar-link',
                      location.pathname === item.path && 'active'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* User */}
            <div className="p-4 border-t border-surface-200">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-surface-500 truncate">{user?.email || ''}</p>
                </div>
                <button onClick={handleLogout} className="p-2 hover:bg-surface-100 rounded-lg text-surface-400 hover:text-surface-600">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white/60 backdrop-blur-xl border-b border-surface-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button onClick={toggleSidebar} className="p-2 hover:bg-surface-100 rounded-lg">
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="hidden md:flex items-center gap-2 text-sm text-surface-500">
              <LayoutDashboard className="w-4 h-4" />
              <span>{location.pathname.split('/').filter(Boolean).join(' / ')}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-surface-100 rounded-lg text-surface-400 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
            </button>
            <Link to="/campaigns/new" className="btn-brand text-sm py-2">
              <Zap className="w-4 h-4" />
              New Campaign
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
