import { useState, useEffect, useRef, useCallback } from 'react'

interface WhackAMoleProps {
  primaryColor: string
  onComplete: (score: number, won: boolean) => void
  duration: number
  winThreshold: number
}

interface Mole {
  id: number
  active: boolean
  hit: boolean
  type: 'mole' | 'golden' | 'bomb'
}

export function WhackAMole({ primaryColor, onComplete, duration = 30, winThreshold = 150 }: WhackAMoleProps) {
  const [moles, setMoles] = useState<Mole[]>(
    Array.from({ length: 9 }, (_, i) => ({ id: i, active: false, hit: false, type: 'mole' as const }))
  )
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [gameOver, setGameOver] = useState(false)
  const [combo, setCombo] = useState(0)
  const scoreRef = useRef(0)
  const comboRef = useRef(0)

  // Timer
  useEffect(() => {
    if (gameOver) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameOver(true)
          clearInterval(timer)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameOver])

  useEffect(() => {
    if (gameOver) onComplete(scoreRef.current, scoreRef.current >= winThreshold)
  }, [gameOver])

  // Spawn moles
  useEffect(() => {
    if (gameOver) return
    const spawn = () => {
      const availableSlots = moles.filter(m => !m.active).map(m => m.id)
      if (availableSlots.length === 0) return

      const count = 1 + Math.floor(Math.random() * 2)
      const selected = availableSlots.sort(() => Math.random() - 0.5).slice(0, count)

      setMoles(prev => prev.map(m => {
        if (selected.includes(m.id)) {
          const rand = Math.random()
          const type = rand < 0.1 ? 'bomb' : rand < 0.25 ? 'golden' : 'mole'
          return { ...m, active: true, hit: false, type }
        }
        return m
      }))

      // Hide after random duration
      const hideDelay = 800 + Math.random() * 600
      setTimeout(() => {
        setMoles(prev => prev.map(m => selected.includes(m.id) ? { ...m, active: false, hit: false } : m))
      }, hideDelay)
    }

    const interval = setInterval(spawn, 700 + Math.random() * 400)
    return () => clearInterval(interval)
  }, [gameOver])

  const whack = useCallback((id: number) => {
    if (gameOver) return
    setMoles(prev => prev.map(m => {
      if (m.id === id && m.active && !m.hit) {
        if (m.type === 'bomb') {
          scoreRef.current = Math.max(0, scoreRef.current - 30)
          setScore(scoreRef.current)
          comboRef.current = 0
          setCombo(0)
        } else {
          const pts = m.type === 'golden' ? 30 : 10
          const multiplier = Math.min(comboRef.current + 1, 5)
          scoreRef.current += pts * multiplier
          comboRef.current++
          setScore(scoreRef.current)
          setCombo(comboRef.current)
        }
        return { ...m, hit: true }
      }
      return m
    }))
  }, [gameOver])

  const missWhack = () => {
    comboRef.current = 0
    setCombo(0)
  }

  return (
    <div className="flex flex-col items-center gap-3 p-2">
      <div className="flex justify-between w-full max-w-[320px]">
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Score</p>
          <p className="text-lg font-bold" style={{ color: primaryColor }}>{score}</p>
        </div>
        {combo > 1 && (
          <div className="bg-amber-100 text-amber-700 rounded-xl px-3 py-1.5 animate-scale-in">
            <p className="text-xs">Combo</p>
            <p className="text-lg font-bold">x{Math.min(combo, 5)}</p>
          </div>
        )}
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Time</p>
          <p className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>{timeLeft}s</p>
        </div>
      </div>
      <p className="text-xs text-surface-500">Whack the moles! Avoid bombs! Goal: {winThreshold} pts</p>

      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-gradient-to-b from-green-200 to-green-300" onClick={missWhack}>
        {moles.map(mole => (
          <button
            key={mole.id}
            onClick={(e) => { e.stopPropagation(); whack(mole.id) }}
            className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl transition-all duration-150 relative overflow-hidden ${
              mole.active && !mole.hit
                ? 'scale-100 cursor-pointer'
                : mole.hit
                  ? 'scale-75 opacity-50'
                  : 'cursor-default'
            }`}
            style={{ backgroundColor: mole.active ? '#8B4513' : '#654321' }}
          >
            {/* Hole */}
            <div className="absolute bottom-0 left-1 right-1 h-4 bg-black/30 rounded-full" />

            {/* Mole */}
            <div className={`transition-all duration-150 ${mole.active && !mole.hit ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {mole.type === 'bomb' ? '💣' : mole.type === 'golden' ? '⭐' : '🐹'}
            </div>

            {/* Hit effect */}
            {mole.hit && (
              <div className="absolute inset-0 flex items-center justify-center animate-scale-in">
                {mole.type === 'bomb' ? '💥' : '✨'}
              </div>
            )}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="text-center animate-fade-in">
          <p className="text-xl font-bold">{score >= winThreshold ? '🔨 Great Whacking!' : '⏰ Time Up!'}</p>
          <p className="text-sm text-surface-500">Score: {score}</p>
        </div>
      )}
    </div>
  )
}
