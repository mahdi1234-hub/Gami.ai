import { useState, useRef } from 'react'

interface SlotMachineProps {
  primaryColor: string
  onComplete: (score: number, won: boolean) => void
}

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '🔔', '🍀']
const REEL_SIZE = 20

function generateReel(): string[] {
  return Array.from({ length: REEL_SIZE }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
}

export function SlotMachine({ primaryColor, onComplete }: SlotMachineProps) {
  const [reels] = useState(() => [generateReel(), generateReel(), generateReel()])
  const [positions, setPositions] = useState([0, 0, 0])
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [spinsLeft, setSpinsLeft] = useState(3)
  const [totalScore, setTotalScore] = useState(0)

  const spin = () => {
    if (spinning || spinsLeft <= 0) return
    setSpinning(true)
    setResult(null)
    setSpinsLeft(s => s - 1)

    const newPositions = [
      Math.floor(Math.random() * REEL_SIZE),
      Math.floor(Math.random() * REEL_SIZE),
      Math.floor(Math.random() * REEL_SIZE),
    ]

    // Animate reels stopping one by one
    setTimeout(() => setPositions(p => [newPositions[0], p[1], p[2]]), 800)
    setTimeout(() => setPositions(p => [p[0], newPositions[1], p[2]]), 1400)
    setTimeout(() => {
      setPositions(newPositions)

      // Check win
      const symbols = newPositions.map((pos, i) => reels[i][pos])
      let points = 0
      let msg = ''

      if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        if (symbols[0] === '7️⃣') { points = 500; msg = 'JACKPOT! 777!' }
        else if (symbols[0] === '💎') { points = 200; msg = 'Triple Diamonds!' }
        else { points = 100; msg = `Triple ${symbols[0]}!` }
      } else if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
        points = 25
        msg = 'Pair! Nice!'
      } else {
        msg = 'No match'
      }

      setTotalScore(s => s + points)
      setResult(`${msg}${points > 0 ? ` +${points}` : ''}`)
      setSpinning(false)

      if (spinsLeft <= 1) {
        setTimeout(() => {
          onComplete(totalScore + points, (totalScore + points) >= 50)
        }, 1500)
      }
    }, 2000)
  }

  const getVisibleSymbols = (reelIndex: number) => {
    const pos = positions[reelIndex]
    const reel = reels[reelIndex]
    return [
      reel[(pos - 1 + REEL_SIZE) % REEL_SIZE],
      reel[pos],
      reel[(pos + 1) % REEL_SIZE],
    ]
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex justify-between w-full max-w-[300px]">
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Score</p>
          <p className="text-lg font-bold" style={{ color: primaryColor }}>{totalScore}</p>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Spins</p>
          <p className="text-lg font-bold">{spinsLeft}</p>
        </div>
      </div>

      {/* Machine body */}
      <div className="bg-gradient-to-b from-yellow-400 to-yellow-500 p-4 rounded-3xl shadow-xl">
        <div className="bg-surface-900 p-3 rounded-2xl">
          {/* Reels */}
          <div className="flex gap-2">
            {[0, 1, 2].map(reelIdx => (
              <div key={reelIdx} className="bg-white rounded-xl overflow-hidden w-20">
                {getVisibleSymbols(reelIdx).map((symbol, row) => (
                  <div
                    key={row}
                    className={`h-16 flex items-center justify-center text-3xl transition-all duration-300 ${
                      row === 1 ? 'bg-white' : 'bg-surface-100 opacity-50'
                    } ${spinning ? 'animate-pulse' : ''}`}
                  >
                    {symbol}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Win line indicator */}
          <div className="flex items-center gap-1 mt-1">
            <div className="h-px flex-1 bg-red-500" />
            <span className="text-[10px] text-red-400 font-bold">WIN LINE</span>
            <div className="h-px flex-1 bg-red-500" />
          </div>
        </div>

        {/* Lever / Spin button */}
        <button
          onClick={spin}
          disabled={spinning || spinsLeft <= 0}
          className="w-full mt-3 py-3 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg"
          style={{ backgroundColor: spinning ? '#666' : primaryColor }}
        >
          {spinning ? '🎰 Spinning...' : spinsLeft > 0 ? `🎰 SPIN (${spinsLeft} left)` : 'No spins left'}
        </button>
      </div>

      {result && (
        <div className={`text-center animate-scale-in ${result.includes('+') ? 'text-emerald-600' : 'text-surface-500'}`}>
          <p className="text-lg font-bold">{result}</p>
        </div>
      )}

      {/* Paytable */}
      <div className="text-xs text-surface-400 text-center space-y-0.5">
        <p>7️⃣7️⃣7️⃣ = 500 | 💎💎💎 = 200</p>
        <p>Triple = 100 | Pair = 25</p>
      </div>
    </div>
  )
}
