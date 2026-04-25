import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'
import { cn } from '../../lib/utils'
import { Code, QrCode, Link2, Copy, Download, Monitor, Smartphone } from 'lucide-react'

const tabs = [
  { id: 'script', label: 'Script Tag', icon: Code },
  { id: 'iframe', label: 'iFrame', icon: Monitor },
  { id: 'qr', label: 'QR Code', icon: QrCode },
  { id: 'link', label: 'Direct Link', icon: Link2 },
]

export function EmbedGeneratorPage() {
  const [activeTab, setActiveTab] = useState('script')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const gameUrl = `${window.location.origin}/play/camp_001`

  const scriptCode = `<script src="${gameUrl}/embed.js"></script>
<div id="gami-game" data-campaign="camp_001"></div>`

  const iframeCode = `<iframe
  src="${gameUrl}"
  width="100%"
  height="600"
  frameborder="0"
  allow="autoplay; fullscreen"
  style="border-radius: 16px; max-width: 480px;"
></iframe>`

  const handleCopy = (text: string) => {
    copy(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight">Embed & Share</h1>
        <p className="text-surface-500 mt-1">Distribute your game across channels</p>
      </div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
              activeTab === tab.id ? 'bg-surface-900 text-white' : 'bg-white/60 text-surface-600 hover:bg-white/80'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {activeTab === 'script' && (
            <div className="glass-card p-6">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Script Tag Embed</h3>
                  <button onClick={() => handleCopy(scriptCode)} className="btn-secondary py-1.5 px-3 text-xs">
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <pre className="bg-surface-900 text-surface-100 p-4 rounded-xl text-sm overflow-x-auto font-mono">
                  <code>{scriptCode}</code>
                </pre>
                <p className="text-sm text-surface-500 mt-3">
                  Add this script to your website. The game will render inside the container div.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'iframe' && (
            <div className="glass-card p-6">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">iFrame Embed</h3>
                  <button onClick={() => handleCopy(iframeCode)} className="btn-secondary py-1.5 px-3 text-xs">
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <pre className="bg-surface-900 text-surface-100 p-4 rounded-xl text-sm overflow-x-auto font-mono">
                  <code>{iframeCode}</code>
                </pre>
                <p className="text-sm text-surface-500 mt-3">
                  Embed directly as an iframe. No JavaScript required.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="glass-card p-6">
              <div className="relative z-10 flex flex-col items-center">
                <h3 className="font-medium mb-6">QR Code</h3>
                <div className="p-6 bg-white rounded-2xl shadow-sm">
                  <QRCodeSVG value={gameUrl} size={200} level="H" />
                </div>
                <p className="text-sm text-surface-500 mt-4 text-center">
                  Scan to play the game. Perfect for print materials and in-store displays.
                </p>
                <button className="btn-brand mt-4">
                  <Download className="w-4 h-4" /> Download PNG
                </button>
              </div>
            </div>
          )}

          {activeTab === 'link' && (
            <div className="glass-card p-6">
              <div className="relative z-10">
                <h3 className="font-medium mb-4">Direct Link</h3>
                <div className="flex gap-2">
                  <input type="text" value={gameUrl} readOnly className="input-field font-mono text-sm flex-1" />
                  <button onClick={() => handleCopy(gameUrl)} className="btn-brand py-2.5">
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                </div>
                <p className="text-sm text-surface-500 mt-3">
                  Share this link directly via email, social media, or messaging apps.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="glass-card p-6">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Preview</h3>
              <div className="flex gap-1 bg-surface-100 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={cn('p-1.5 rounded', previewMode === 'desktop' ? 'bg-white shadow-sm' : '')}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={cn('p-1.5 rounded', previewMode === 'mobile' ? 'bg-white shadow-sm' : '')}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className={cn(
              'bg-surface-900 rounded-2xl overflow-hidden mx-auto transition-all',
              previewMode === 'desktop' ? 'w-full aspect-video' : 'w-[280px] aspect-[9/16]'
            )}>
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center p-8">
                  <div className="text-5xl mb-4">🎡</div>
                  <h3 className="text-xl font-semibold">Summer Spin & Win</h3>
                  <p className="text-sm opacity-60 mt-1">by Gami Demo</p>
                  <button className="mt-6 bg-brand-500 px-6 py-2.5 rounded-full text-sm font-medium">
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
