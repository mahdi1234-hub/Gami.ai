import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../lib/store'
import { api } from '../../lib/api'
import { toast } from 'sonner'
import { Zap, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react'

interface AuthPageProps {
  mode: 'login' | 'signup'
}

export function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        const res = await api.login(form.email, form.password)
        login(
          { id: res.user.id, email: res.user.email, name: res.user.name, role: 'owner', createdAt: new Date().toISOString() },
          res.token
        )
        toast.success('Welcome back!')
        navigate('/dashboard')
      } else {
        const res = await api.signup({ email: form.email, password: form.password, name: form.name })
        login(
          { id: res.user.id, email: res.user.email, name: res.user.name, role: 'owner', createdAt: new Date().toISOString() },
          res.token
        )
        toast.success('Account created! Check your email to verify.')
        navigate('/onboarding')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-100 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-400 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-md px-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mb-8">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-light text-white tracking-tight mb-4">
            Turn every click into a customer
          </h2>
          <p className="text-surface-400 text-lg leading-relaxed">
            Create branded marketing games in minutes. Boost engagement, capture leads,
            and drive conversions with gamified campaigns.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { label: 'Avg. Engagement', value: '4.2x' },
              { label: 'Conversion Rate', value: '34%' },
              { label: 'Setup Time', value: '<5min' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-semibold text-brand-400">{stat.value}</p>
                <p className="text-xs text-surface-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold">Gami.ai</h1>
          </div>

          <h2 className="text-3xl font-light tracking-tight mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-surface-500 mb-8">
            {mode === 'login'
              ? 'Sign in to manage your gamified campaigns'
              : 'Start creating engaging marketing games today'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  placeholder="Full name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field pl-12"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="email"
                placeholder="Email address"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field pl-12"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-brand w-full justify-center py-3.5 text-base disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <Link to="/signup" className="text-brand-600 font-medium hover:underline">Sign up</Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
              </>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
