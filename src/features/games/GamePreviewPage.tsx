import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { GAME_TYPES } from '../../lib/constants'
import { mockCampaigns } from '../../lib/mock-data'
import { SpinWheel, ScratchCard, Match3Game, MemoryMatch, BubbleShooter, ShootingRange } from '../../games'
import { RotateCcw, Volume2, VolumeX, Copy } from 'lucide-react'
import { toast } from 'sonner'

export function GamePreviewPage() {
  const { campaignId } = useParams()
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [won, setWon] = useState(false)
  const [muted, setMuted] = useState(false)

  const campaign = mockCampaigns.find((c) => c.id === campaignId) || mockCampaigns[0]
  const gameType = GAME_TYPES.find((g) => g.id === campaign.gameType)
  const primaryColor = campaign.config.tenant.primaryColor

  const handleGameComplete = (score: number, didWin: boolean) => {
    setFinalScore(score)
    setWon(didWin)
    setGameOver(true)
  }

  const handleRestart = () => {
    setGameOver(false)
    setFinalScore(0)
    setWon(false)
    setGameStarted(false)
    // Force remount by briefly setting gameStarted false then true
    setTimeout(() => setGameStarted(true), 50)
  }

  const handleStart = () => {
    if (campaign.config.collectEmail && !emailSubmitted) return
    setGameStarted(true)
    setGameOver(false)
  }

  const copyRewardCode = () => {
    navigator.clipboard.writeText(campaign.config.reward.code)
    toast.success('Coupon code copied!')
  }

  const renderGame = () => {
    const gameProps = {
      primaryColor,
      onComplete: handleGameComplete,
      duration: campaign.config.campaign.duration,
      winThreshold: campaign.config.campaign.winCondition.threshold,
    }

    switch (campaign.gameType) {
      case 'spin-wheel':
        return <SpinWheel primaryColor={primaryColor} onComplete={handleGameComplete} prizes={['20% OFF', 'Free Ship', 'Try Again', '50% OFF', '10% OFF', 'Try Again', 'Free Item', '5% OFF']} />
      case 'scratch-card':
        return <ScratchCard primaryColor={primaryColor} onComplete={handleGameComplete} prize={campaign.config.reward.displayText || '20% OFF'} />
      case 'match-3':
        return <Match3Game {...gameProps} />
      case 'bubble-shooter':
        return <BubbleShooter {...gameProps} />
      case 'shooting-range':
        return <ShootingRange {...gameProps} />
      case 'draw-line':
        return <MemoryMatch {...gameProps} />
      default:
        return <SpinWheel primaryColor={primaryColor} onComplete={handleGameComplete} prizes={['20% OFF', 'Free Ship', 'Try Again', '50% OFF']} />
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: `${primaryColor}10` }}>
      <div className="w-full max-w-md">
        <div className="rounded-3xl overflow-hidden shadow-2xl bg-white">
          {/* Header */}
          <div className="p-4 text-white text-center relative" style={{ backgroundColor: primaryColor }}>
            <p className="text-xs opacity-70">{campaign.config.tenant.brandName || 'Gami.ai'}</p>
            <h1 className="text-lg font-semibold">{campaign.name}</h1>
            {gameStarted && !gameOver && (
              <button
                onClick={() => setMuted(!muted)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/20 hover:bg-white/30"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Game Area */}
          <div className="min-h-[400px] relative bg-gradient-to-b from-surface-50 to-white flex items-center justify-center overflow-hidden">
            {/* Pre-game: Email gate + Start */}
            {!gameStarted && !gameOver && (
              <div className="text-center p-8 w-full">
                <div className="text-6xl mb-4">{gameType?.icon}</div>
                <h2 className="text-xl font-semibold mb-2">{campaign.name}</h2>
                <p className="text-sm text-surface-500 mb-6">{campaign.description}</p>

                {campaign.config.collectEmail && !emailSubmitted ? (
                  <div className="space-y-3 max-w-xs mx-auto">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email to play"
                      className="input-field text-center"
                    />
                    <button
                      onClick={() => { if (email.includes('@')) setEmailSubmitted(true) }}
                      className="w-full py-3 rounded-xl text-white font-medium transition-all hover:opacity-90"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleStart}
                    className="px-8 py-3.5 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Play Now
                  </button>
                )}

                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-surface-400">
                  <span>🕐 {campaign.config.campaign.duration}s</span>
                  <span>🎯 {gameType?.difficulty}</span>
                  <span>🎁 {campaign.config.reward.type}</span>
                </div>
              </div>
            )}

            {/* Active game */}
            {gameStarted && !gameOver && (
              <div className="w-full">
                {renderGame()}
              </div>
            )}

            {/* Game over screen */}
            {gameOver && (
              <div className="text-center p-8 w-full animate-fade-in">
                <div className="text-5xl mb-4">{won ? '🎉' : '😔'}</div>
                <h2 className="text-2xl font-bold mb-2">{won ? 'You Won!' : 'Game Over'}</h2>
                <p className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
                  {finalScore} pts
                </p>

                {won && campaign.config.reward.code && (
                  <div className="bg-surface-50 rounded-2xl p-5 mb-4 max-w-xs mx-auto">
                    <p className="text-sm text-surface-500 mb-3">{campaign.config.reward.displayText}</p>
                    <div
                      className="bg-white rounded-xl p-4 border-2 border-dashed flex items-center justify-center gap-3 cursor-pointer hover:bg-surface-50 transition-colors"
                      style={{ borderColor: primaryColor }}
                      onClick={copyRewardCode}
                    >
                      <code className="text-xl font-bold tracking-wider" style={{ color: primaryColor }}>
                        {campaign.config.reward.code}
                      </code>
                      <Copy className="w-4 h-4 text-surface-400" />
                    </div>
                    <p className="text-xs text-surface-400 mt-2">Tap to copy</p>
                  </div>
                )}

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-medium transition-all hover:scale-105"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <RotateCcw className="w-4 h-4" /> Play Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-surface-400 mt-4">
          Powered by <span className="font-medium">Gami.ai</span>
        </p>
      </div>
    </div>
  )
}
