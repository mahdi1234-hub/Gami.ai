import { useState, useRef, useEffect, useCallback } from 'react'

interface ShootingRangeProps {
  primaryColor: string
  onComplete: (score: number, won: boolean) => void
  duration: number
  winThreshold: number
}

interface Target {
  id: number
  x: number
  y: number
  size: number
  speed: number
  dx: number
  dy: number
  points: number
  emoji: string
  alive: boolean
  spawnTime: number
}

const W = 340
const H = 380
const TARGET_TYPES = [
  { emoji: '🎯', size: 30, points: 10, speed: 1.5 },
  { emoji: '⭐', size: 24, points: 25, speed: 2.5 },
  { emoji: '💎', size: 20, points: 50, speed: 3.5 },
  { emoji: '🎪', size: 36, points: 5, speed: 1 },
]

let targetId = 0

export function ShootingRange({ primaryColor, onComplete, duration = 45, winThreshold = 200 }: ShootingRangeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [gameOver, setGameOver] = useState(false)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [showHit, setShowHit] = useState<{ x: number; y: number; pts: number } | null>(null)
  const targetsRef = useRef<Target[]>([])
  const animRef = useRef<number>(0)
  const scoreRef = useRef(0)

  const spawnTarget = useCallback(() => {
    const type = TARGET_TYPES[Math.floor(Math.random() * TARGET_TYPES.length)]
    const fromLeft = Math.random() > 0.5
    const target: Target = {
      id: targetId++,
      x: fromLeft ? -type.size : W + type.size,
      y: 40 + Math.random() * (H - 120),
      size: type.size,
      speed: type.speed * (0.8 + Math.random() * 0.4),
      dx: fromLeft ? type.speed : -type.speed,
      dy: (Math.random() - 0.5) * 0.8,
      points: type.points,
      emoji: type.emoji,
      alive: true,
      spawnTime: Date.now(),
    }
    targetsRef.current.push(target)
  }, [])

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
    if (gameOver) {
      cancelAnimationFrame(animRef.current)
      onComplete(scoreRef.current, scoreRef.current >= winThreshold)
    }
  }, [gameOver])

  // Spawn targets periodically
  useEffect(() => {
    if (gameOver) return
    const spawner = setInterval(() => {
      if (targetsRef.current.filter(t => t.alive).length < 6) {
        spawnTarget()
      }
    }, 600)
    // Initial targets
    for (let i = 0; i < 3; i++) setTimeout(() => spawnTarget(), i * 300)
    return () => clearInterval(spawner)
  }, [gameOver, spawnTarget])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, W, H)

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H)
    skyGrad.addColorStop(0, '#87CEEB')
    skyGrad.addColorStop(1, '#E0F7FA')
    ctx.fillStyle = skyGrad
    ctx.fillRect(0, 0, W, H)

    // Ground
    ctx.fillStyle = '#8BC34A'
    ctx.fillRect(0, H - 40, W, 40)
    ctx.fillStyle = '#689F38'
    ctx.fillRect(0, H - 42, W, 4)

    // Clouds
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ;[{ x: 50, y: 40 }, { x: 180, y: 25 }, { x: 280, y: 50 }].forEach(c => {
      ctx.beginPath()
      ctx.arc(c.x, c.y, 20, 0, Math.PI * 2)
      ctx.arc(c.x + 18, c.y - 5, 15, 0, Math.PI * 2)
      ctx.arc(c.x - 15, c.y + 2, 13, 0, Math.PI * 2)
      ctx.fill()
    })

    // Targets
    targetsRef.current.forEach(t => {
      if (!t.alive) return
      t.x += t.dx
      t.y += t.dy
      // Bounce vertically
      if (t.y < 30 || t.y > H - 60) t.dy = -t.dy
      // Remove if off screen
      if (t.x < -50 || t.x > W + 50) t.alive = false

      ctx.font = `${t.size}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(t.emoji, t.x, t.y)
    })

    // Clean dead targets
    targetsRef.current = targetsRef.current.filter(t => t.alive || Date.now() - t.spawnTime < 5000)
  }, [])

  const gameLoop = useCallback(() => {
    draw()
    if (!gameOver) {
      animRef.current = requestAnimationFrame(gameLoop)
    }
  }, [draw, gameOver])

  useEffect(() => {
    animRef.current = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animRef.current)
  }, [gameLoop])

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameOver) return
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = W / rect.width
    const scaleY = H / rect.height
    let cx: number, cy: number
    if ('touches' in e) {
      cx = (e.touches[0].clientX - rect.left) * scaleX
      cy = (e.touches[0].clientY - rect.top) * scaleY
    } else {
      cx = (e.clientX - rect.left) * scaleX
      cy = (e.clientY - rect.top) * scaleY
    }

    let hit = false
    for (const t of targetsRef.current) {
      if (!t.alive) continue
      const dist = Math.sqrt((cx - t.x) ** 2 + (cy - t.y) ** 2)
      if (dist < t.size + 5) {
        t.alive = false
        scoreRef.current += t.points
        setScore(s => s + t.points)
        setHits(h => h + 1)
        setShowHit({ x: t.x, y: t.y, pts: t.points })
        setTimeout(() => setShowHit(null), 600)
        hit = true
        break
      }
    }
    if (!hit) {
      setMisses(m => m + 1)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 p-2">
      <div className="flex justify-between w-full max-w-[340px] px-2">
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Score</p>
          <p className="text-lg font-bold" style={{ color: primaryColor }}>{score}</p>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Hits</p>
          <p className="text-lg font-bold text-emerald-600">{hits}</p>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Time</p>
          <p className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>{timeLeft}s</p>
        </div>
      </div>
      <p className="text-xs text-surface-500">Click/tap targets to shoot! Goal: {winThreshold} pts</p>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="rounded-2xl cursor-crosshair touch-none shadow-lg"
          onClick={handleClick}
          onTouchStart={handleClick}
        />
        {showHit && (
          <div
            className="absolute text-lg font-bold animate-slide-up pointer-events-none"
            style={{ left: showHit.x, top: showHit.y - 20, color: primaryColor }}
          >
            +{showHit.pts}
          </div>
        )}
      </div>
      {gameOver && (
        <div className="text-center animate-fade-in">
          <p className="text-xl font-bold">{score >= winThreshold ? '🎯 Great Shot!' : '⏰ Time Up!'}</p>
          <p className="text-sm text-surface-500">Score: {score} | Accuracy: {hits > 0 ? Math.round(hits / (hits + misses) * 100) : 0}%</p>
        </div>
      )}
    </div>
  )
}
