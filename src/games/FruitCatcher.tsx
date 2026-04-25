import { useRef, useEffect, useState, useCallback } from 'react'

interface FruitCatcherProps {
  primaryColor: string
  onComplete: (score: number, won: boolean) => void
  duration: number
  winThreshold: number
}

const W = 340
const H = 420
const BASKET_W = 60
const BASKET_H = 40

interface Fruit {
  x: number
  y: number
  speed: number
  emoji: string
  points: number
  alive: boolean
}

const FRUIT_TYPES = [
  { emoji: '🍎', points: 10 },
  { emoji: '🍊', points: 10 },
  { emoji: '🍋', points: 15 },
  { emoji: '🍇', points: 15 },
  { emoji: '🍓', points: 20 },
  { emoji: '🌟', points: 50 },
  { emoji: '💣', points: -30 },
]

export function FruitCatcher({ primaryColor, onComplete, duration = 45, winThreshold = 200 }: FruitCatcherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [gameOver, setGameOver] = useState(false)
  const [caught, setCaught] = useState(0)

  const basketRef = useRef(W / 2 - BASKET_W / 2)
  const fruitsRef = useRef<Fruit[]>([])
  const scoreRef = useRef(0)
  const caughtRef = useRef(0)
  const gameOverRef = useRef(false)
  const animRef = useRef(0)
  const spawnTimerRef = useRef(0)

  useEffect(() => {
    if (gameOver) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          gameOverRef.current = true
          setGameOver(true)
          onComplete(scoreRef.current, scoreRef.current >= winThreshold)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameOver])

  const spawnFruit = useCallback(() => {
    const type = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)]
    fruitsRef.current.push({
      x: 20 + Math.random() * (W - 40),
      y: -20,
      speed: 2 + Math.random() * 3,
      emoji: type.emoji,
      points: type.points,
      alive: true,
    })
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const basket = basketRef.current

    // Sky
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, '#87CEEB')
    grad.addColorStop(1, '#E8F5E9')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Ground
    ctx.fillStyle = '#8BC34A'
    ctx.fillRect(0, H - 30, W, 30)

    // Fruits
    fruitsRef.current.forEach(f => {
      if (!f.alive) return
      ctx.font = '28px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(f.emoji, f.x, f.y)
    })

    // Basket
    ctx.fillStyle = primaryColor
    ctx.beginPath()
    ctx.moveTo(basket, H - 35)
    ctx.lineTo(basket + BASKET_W, H - 35)
    ctx.lineTo(basket + BASKET_W - 8, H - 35 + BASKET_H)
    ctx.lineTo(basket + 8, H - 35 + BASKET_H)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Basket rim
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.fillRect(basket + 2, H - 35, BASKET_W - 4, 5)
  }, [primaryColor])

  const gameLoop = useCallback(() => {
    if (gameOverRef.current) return

    // Spawn
    spawnTimerRef.current++
    if (spawnTimerRef.current % 25 === 0) spawnFruit()

    const basket = basketRef.current

    // Move fruits
    fruitsRef.current.forEach(f => {
      if (!f.alive) return
      f.y += f.speed

      // Catch check
      if (
        f.y >= H - 45 &&
        f.y <= H - 25 &&
        f.x >= basket &&
        f.x <= basket + BASKET_W
      ) {
        f.alive = false
        scoreRef.current += f.points
        if (f.points > 0) caughtRef.current++
        setScore(Math.max(0, scoreRef.current))
        setCaught(caughtRef.current)
      }

      // Miss
      if (f.y > H + 20) f.alive = false
    })

    // Cleanup
    fruitsRef.current = fruitsRef.current.filter(f => f.alive || f.y < H + 50)

    draw()
    animRef.current = requestAnimationFrame(gameLoop)
  }, [draw, spawnFruit])

  useEffect(() => {
    animRef.current = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animRef.current)
  }, [gameLoop])

  const handleMove = (clientX: number) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const x = (clientX - rect.left) * (W / rect.width)
    basketRef.current = Math.max(0, Math.min(W - BASKET_W, x - BASKET_W / 2))
  }

  return (
    <div className="flex flex-col items-center gap-3 p-2">
      <div className="flex justify-between w-full max-w-[340px]">
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Score</p>
          <p className="text-lg font-bold" style={{ color: primaryColor }}>{score}</p>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Caught</p>
          <p className="text-lg font-bold text-emerald-600">{caught}</p>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Time</p>
          <p className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>{timeLeft}s</p>
        </div>
      </div>
      <p className="text-xs text-surface-500">Catch fruits, avoid bombs! Goal: {winThreshold} pts</p>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-2xl shadow-lg touch-none cursor-pointer"
        onMouseMove={e => handleMove(e.clientX)}
        onTouchMove={e => handleMove(e.touches[0].clientX)}
      />
      {gameOver && (
        <div className="text-center animate-fade-in">
          <p className="text-xl font-bold">{score >= winThreshold ? '🍎 Great Catch!' : '⏰ Time Up!'}</p>
          <p className="text-sm text-surface-500">Score: {score} | Caught: {caught}</p>
        </div>
      )}
    </div>
  )
}
