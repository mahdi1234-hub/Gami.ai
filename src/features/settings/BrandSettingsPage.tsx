import { useState } from 'react'
import { toast } from 'sonner'
import { HexColorPicker } from 'react-colorful'
import { Save, Upload, Palette } from 'lucide-react'

export function BrandSettingsPage() {
  const [branding, setBranding] = useState({
    brandName: 'Gami Demo',
    logoUrl: '',
    primaryColor: '#F47B20',
    secondaryColor: '#FFFFFF',
    fontFamily: 'Plus Jakarta Sans',
    defaultLanguage: 'en',
    timezone: 'UTC',
    emailFromName: 'Gami.ai',
    emailFromAddress: 'noreply@gami.ai',
    googleAnalyticsId: '',
    webhookUrl: '',
  })
  const [showPicker, setShowPicker] = useState(false)

  const handleSave = () => {
    toast.success('Brand settings saved!')
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Brand Settings</h1>
          <p className="text-surface-500 mt-1">Customize your brand appearance</p>
        </div>
        <button onClick={handleSave} className="btn-brand"><Save className="w-4 h-4" /> Save Changes</button>
      </div>

      <div className="glass-card p-6">
        <div className="relative z-10 space-y-6">
          <h3 className="font-medium flex items-center gap-2"><Palette className="w-5 h-5" /> Branding</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-surface-600 block mb-2">Brand Name</label>
              <input type="text" value={branding.brandName} onChange={(e) => setBranding({ ...branding, brandName: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-surface-600 block mb-2">Font Family</label>
              <select value={branding.fontFamily} onChange={(e) => setBranding({ ...branding, fontFamily: e.target.value })} className="input-field">
                <option>Plus Jakarta Sans</option>
                <option>Inter</option>
                <option>Poppins</option>
                <option>Roboto</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-surface-600 block mb-2">Primary Color</label>
              <div className="relative">
                <button onClick={() => setShowPicker(!showPicker)} className="flex items-center gap-3 input-field cursor-pointer">
                  <div className="w-6 h-6 rounded-lg border" style={{ backgroundColor: branding.primaryColor }} />
                  <span>{branding.primaryColor}</span>
                </button>
                {showPicker && (
                  <div className="absolute z-50 mt-2">
                    <div className="fixed inset-0" onClick={() => setShowPicker(false)} />
                    <div className="relative"><HexColorPicker color={branding.primaryColor} onChange={(c) => setBranding({ ...branding, primaryColor: c })} /></div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-surface-600 block mb-2">Logo</label>
              <div className="input-field flex items-center gap-3 cursor-pointer">
                <Upload className="w-5 h-5 text-surface-400" />
                <span className="text-surface-500">Upload logo image</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="relative z-10 space-y-6">
          <h3 className="font-medium">Email Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-surface-600 block mb-2">From Name</label>
              <input type="text" value={branding.emailFromName} onChange={(e) => setBranding({ ...branding, emailFromName: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-surface-600 block mb-2">From Email</label>
              <input type="email" value={branding.emailFromAddress} onChange={(e) => setBranding({ ...branding, emailFromAddress: e.target.value })} className="input-field" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="relative z-10 space-y-6">
          <h3 className="font-medium">Integrations</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-surface-600 block mb-2">Google Analytics ID</label>
              <input type="text" value={branding.googleAnalyticsId} onChange={(e) => setBranding({ ...branding, googleAnalyticsId: e.target.value })} placeholder="G-XXXXXXXXXX" className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-surface-600 block mb-2">Webhook URL</label>
              <input type="url" value={branding.webhookUrl} onChange={(e) => setBranding({ ...branding, webhookUrl: e.target.value })} placeholder="https://your-api.com/webhook" className="input-field" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
