import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { GAME_TYPES } from '../../lib/constants'
import { mockCampaigns } from '../../lib/mock-data'
import { Maximize2, Volume2, VolumeX, RotateCcw } from 'lucide-react'

export function GamePreviewPage() {
  const { campaignId } = useParams()
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameOver, setGameOver] = useState(false)
  const [muted, setMuted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const campaign = mockCampaigns.find((c) => c.id === campaignId) || mockCampaigns[0]
  const gameType = GAME_TYPES.find((g) => g.id === campaign.gameType)

  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setGameOver(true)
            clearInterval(intervalRef.current)
            return 0
          }
          return t - 1
        })
        setScore((s) => s + Math.floor(Math.random() * 15) + 5)
      }, 1000)
      return () => clearInterval(intervalRef.current)
    }
  }, [gameStarted, gameOver, timeLeft])

  const handleStart = () => {
    if (campaign.config.collectEmail && !emailSubmitted) return
    setGameStarted(true)
    setTimeLeft(campaign.config.campaign.duration)
  }

  const handleRestart = () => {
    setScore(0)
    setTimeLeft(campaign.config.campaign.duration)
    setGameOver(false)
    setGameStarted(true)
  }

  const primaryColor = campaign.config.tenant.primaryColor

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: `${primaryColor}15` }}>
      <div className="w-full max-w-md">
        {/* Game Container */}
        <div className="rounded-3xl overflow-hidden shadow-2xl bg-white">
          {/* Header */}
          <div className="p-4 text-white text-center" style={{ backgroundColor: primaryColor }}>
            <p className="text-xs opacity-70">{campaign.config.tenant.brandName}</p>
            <h1 className="text-lg font-semibold">{campaign.name}</h1>
          </div>

          {/* Game Area */}
          <div className="aspect-square relative bg-surface-50 flex items-center justify-center">
            {!gameStarted && !gameOver && (
              <div className="text-center p-8">
                <div className="text-6xl mb-4">{gameType?.icon}</div>
                <h2 className="text-xl font-semibold mb-2">{campaign.name}</h2>
                <p className="text-sm text-surface-500 mb-6">{campaign.description}</p>

                {campaign.config.collectEmail && !emailSubmitted ? (
                  <div className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email to play"
                      className="input-field text-center"
                    />
                    <button
                      onClick={() => { if (email) setEmailSubmitted(true) }}
                      className="w-full py-3 rounded-xl text-white font-medium"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleStart}
                    className="px-8 py-3 rounded-xl text-white font-medium text-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Play Now
                  </button>
                )}
              </div>
            )}

            {gameStarted && !gameOver && (
              <div className="w-full h-full p-4">
                {/* HUD */}
                <div className="flex justify-between items-center mb-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl px-3 py-1.5 text-sm font-semibold">
                    Score: {score}
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl px-3 py-1.5 text-sm font-semibold">
                    {timeLeft}s
                  </div>
                </div>

                {/* Simulated game area */}
                <div className="w-full h-[calc(100%-3rem)] rounded-2xl bg-gradient-to-br from-surface-100 to-surface-200 flex items-center justify-center">
                  <div className="text-center animate-pulse">
                    <div className="text-8xl mb-4">{gameType?.icon}</div>
                    <p className="text-surface-500 text-sm">Game simulation running...</p>
                    <p className="text-xs text-surface-400 mt-1">Phaser.js game would render here via iframe</p>
                  </div>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="text-center p-8">
                <div className="text-5xl mb-4">
                  {score >= (campaign.config.campaign.winCondition.threshold || 0) ? '🎉' : '😔'}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {score >= (campaign.config.campaign.winCondition.threshold || 0) ? 'You Won!' : 'Game Over'}
                </h2>
                <p className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>{score} pts</p>

                {score >= (campaign.config.campaign.winCondition.threshold || 0) && campaign.config.reward.code && (
                  <div className="bg-surface-50 rounded-2xl p-4 mb-4">
                    <p className="text-sm text-surface-500 mb-2">{campaign.config.reward.displayText}</p>
                    <div className="bg-white rounded-xl p-3 border-2 border-dashed" style={{ borderColor: primaryColor }}>
                      <code className="text-lg font-bold" style={{ color: primaryColor }}>{campaign.config.reward.code}</code>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl text-white font-medium"
                  style={{ backgroundColor: primaryColor }}
                >
                  <RotateCcw className="w-4 h-4" /> Play Again
                </button>
              </div>
            )}
          </div>

          {/* Footer controls */}
          {gameStarted && (
            <div className="p-3 border-t border-surface-200 flex justify-between">
              <button onClick={() => setMuted(!muted)} className="p-2 hover:bg-surface-100 rounded-lg text-surface-400">
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button className="p-2 hover:bg-surface-100 rounded-lg text-surface-400">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-surface-400 mt-4">Powered by Gami.ai</p>
      </div>
    </div>
  )
}
