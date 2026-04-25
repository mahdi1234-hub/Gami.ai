import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, ArrowRight, Gamepad2, BarChart3, Share2 } from 'lucide-react'

const steps = [
  { icon: Gamepad2, title: 'Create games in minutes', description: 'Choose from 6 game mechanics and customize them with your brand colors, logo, and prizes.' },
  { icon: BarChart3, title: 'Track performance', description: 'Real-time analytics, conversion funnels, and player insights to optimize your campaigns.' },
  { icon: Share2, title: 'Distribute everywhere', description: 'Embed on your website, share via QR codes, email campaigns, or direct links.' },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  return (
    <div className="min-h-screen bg-surface-100 flex items-center justify-center p-8">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mx-auto mb-8">
          {step < 3 ? (
            (() => { const Icon = steps[step].icon; return <Icon className="w-8 h-8 text-white" /> })()
          ) : (
            <Zap className="w-8 h-8 text-white" />
          )}
        </div>

        {step < 3 ? (
          <>
            <h2 className="text-3xl font-light tracking-tight mb-4">{steps[step].title}</h2>
            <p className="text-surface-500 text-lg mb-8">{steps[step].description}</p>
            <div className="flex items-center justify-center gap-2 mb-8">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-brand-500' : 'bg-surface-300'}`} />
              ))}
            </div>
            <button onClick={() => setStep(step + 1)} className="btn-brand text-lg px-8 py-3">
              Next <ArrowRight className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-light tracking-tight mb-4">You're all set!</h2>
            <p className="text-surface-500 text-lg mb-8">Create your first gamified campaign and start converting visitors into customers.</p>
            <button onClick={() => navigate('/dashboard')} className="btn-brand text-lg px-8 py-3">
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}
