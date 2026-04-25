import { useState, useEffect } from 'react'

interface MemoryMatchProps {
  primaryColor: string
  onComplete: (score: number, won: boolean) => void
  duration: number
}

const EMOJIS = ['🎁', '🎀', '🎈', '🎉', '⭐', '💎', '🏆', '🎯']

interface Card {
  id: number
  emoji: string
  flipped: boolean
  matched: boolean
}

export function MemoryMatch({ primaryColor, onComplete, duration = 60 }: MemoryMatchProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedIds, setFlippedIds] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [gameOver, setGameOver] = useState(false)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    const pairs = [...EMOJIS, ...EMOJIS]
    const shuffled = pairs.sort(() => Math.random() - 0.5).map((emoji, i) => ({
      id: i,
      emoji,
      flipped: false,
      matched: false,
    }))
    setCards(shuffled)
  }, [])

  useEffect(() => {
    if (gameOver || cards.length === 0) return
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
  }, [gameOver, cards.length])

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) {
      setGameOver(true)
      const bonusScore = score + Math.max(0, timeLeft * 5)
      setScore(bonusScore)
      onComplete(bonusScore, true)
    }
  }, [cards])

  useEffect(() => {
    if (gameOver && !cards.every(c => c.matched)) {
      onComplete(score, false)
    }
  }, [gameOver])

  const handleFlip = (id: number) => {
    if (locked || gameOver) return
    const card = cards.find(c => c.id === id)
    if (!card || card.flipped || card.matched) return

    const newFlipped = [...flippedIds, id]
    setCards(cards.map(c => c.id === id ? { ...c, flipped: true } : c))
    setFlippedIds(newFlipped)

    if (newFlipped.length === 2) {
      setLocked(true)
      setMoves(m => m + 1)
      const [first, second] = newFlipped
      const card1 = cards.find(c => c.id === first)!
      const card2 = cards.find(c => c.id === second)!

      if (card1.emoji === card2.emoji) {
        // Match!
        setScore(s => s + 50)
        setCards(prev => prev.map(c =>
          c.id === first || c.id === second ? { ...c, matched: true, flipped: true } : c
        ))
        setFlippedIds([])
        setLocked(false)
      } else {
        // No match - flip back
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === first || c.id === second ? { ...c, flipped: false } : c
          ))
          setFlippedIds([])
          setLocked(false)
        }, 800)
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 p-2">
      {/* HUD */}
      <div className="flex justify-between w-full max-w-[340px] px-2">
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Score</p>
          <p className="text-lg font-bold" style={{ color: primaryColor }}>{score}</p>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Moves</p>
          <p className="text-lg font-bold">{moves}</p>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Time</p>
          <p className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>{timeLeft}s</p>
        </div>
      </div>

      <p className="text-xs text-surface-500">Find all matching pairs!</p>

      {/* Card Grid */}
      <div className="grid grid-cols-4 gap-2 p-2">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleFlip(card.id)}
            className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 transform ${
              card.flipped || card.matched
                ? 'rotate-y-0 bg-white shadow-md'
                : 'rotate-y-180 hover:scale-105'
            } ${card.matched ? 'opacity-60 scale-90' : ''}`}
            style={{
              backgroundColor: !card.flipped && !card.matched ? primaryColor : undefined,
              perspective: '1000px',
            }}
          >
            {card.flipped || card.matched ? card.emoji : '?'}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="text-center animate-fade-in mt-2">
          <p className="text-xl font-bold">
            {cards.every(c => c.matched) ? '🎉 All Matched!' : '⏰ Time Up!'}
          </p>
          <p className="text-sm text-surface-500">Score: {score} | Moves: {moves}</p>
        </div>
      )}
    </div>
  )
}
