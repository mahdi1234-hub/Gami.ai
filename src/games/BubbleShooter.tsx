import { useState, useRef, useEffect, useCallback } from 'react'

interface BubbleShooterProps {
  primaryColor: string
  onComplete: (score: number, won: boolean) => void
  duration: number
  winThreshold: number
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
const COLS = 8
const ROWS = 8
const BUBBLE_R = 18
const W = COLS * BUBBLE_R * 2 + BUBBLE_R
const H = 400

interface Bubble {
  x: number
  y: number
  color: number
  id: number
}

let bubbleId = 0

export function BubbleShooter({ primaryColor, onComplete, duration = 60, winThreshold = 200 }: BubbleShooterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [gameOver, setGameOver] = useState(false)
  const bubblesRef = useRef<Bubble[]>([])
  const shooterRef = useRef({ x: W / 2, y: H - 30, angle: -Math.PI / 2, color: Math.floor(Math.random() * COLORS.length) })
  const projectileRef = useRef<{ x: number; y: number; dx: number; dy: number; color: number } | null>(null)
  const animRef = useRef<number>(0)
  const scoreRef = useRef(0)

  const initBubbles = useCallback(() => {
    const bubbles: Bubble[] = []
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < COLS; c++) {
        const offset = r % 2 === 1 ? BUBBLE_R : 0
        bubbles.push({
          x: c * BUBBLE_R * 2 + BUBBLE_R + offset,
          y: r * BUBBLE_R * 1.8 + BUBBLE_R + 10,
          color: Math.floor(Math.random() * COLORS.length),
          id: bubbleId++,
        })
      }
    }
    bubblesRef.current = bubbles
  }, [])

  useEffect(() => {
    initBubbles()
  }, [initBubbles])

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

  const findCluster = (bubbles: Bubble[], target: Bubble): Set<number> => {
    const visited = new Set<number>()
    const stack = [target]
    while (stack.length > 0) {
      const b = stack.pop()!
      if (visited.has(b.id)) continue
      visited.add(b.id)
      bubbles.forEach(other => {
        if (!visited.has(other.id) && other.color === target.color) {
          const dist = Math.sqrt((b.x - other.x) ** 2 + (b.y - other.y) ** 2)
          if (dist < BUBBLE_R * 2.5) stack.push(other)
        }
      })
    }
    return visited
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, W, H)

    // Background
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, W, H)

    // Grid bubbles
    bubblesRef.current.forEach(b => {
      ctx.beginPath()
      ctx.arc(b.x, b.y, BUBBLE_R - 1, 0, Math.PI * 2)
      ctx.fillStyle = COLORS[b.color]
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 1
      ctx.stroke()
      // Shine
      ctx.beginPath()
      ctx.arc(b.x - 4, b.y - 4, 5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.fill()
    })

    // Projectile
    const proj = projectileRef.current
    if (proj) {
      ctx.beginPath()
      ctx.arc(proj.x, proj.y, BUBBLE_R - 1, 0, Math.PI * 2)
      ctx.fillStyle = COLORS[proj.color]
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Shooter
    const s = shooterRef.current
    ctx.beginPath()
    ctx.arc(s.x, s.y, BUBBLE_R, 0, Math.PI * 2)
    ctx.fillStyle = COLORS[s.color]
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()

    // Aim line
    ctx.beginPath()
    ctx.moveTo(s.x, s.y)
    ctx.lineTo(s.x + Math.cos(s.angle) * 60, s.y + Math.sin(s.angle) * 60)
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.stroke()
    ctx.setLineDash([])
  }, [])

  const gameLoop = useCallback(() => {
    const proj = projectileRef.current
    if (proj) {
      proj.x += proj.dx
      proj.y += proj.dy

      // Wall bounce
      if (proj.x < BUBBLE_R || proj.x > W - BUBBLE_R) proj.dx = -proj.dx

      // Top wall - stick
      if (proj.y < BUBBLE_R + 10) {
        const newBubble: Bubble = { x: proj.x, y: proj.y, color: proj.color, id: bubbleId++ }
        bubblesRef.current.push(newBubble)
        projectileRef.current = null
        checkMatches(newBubble)
        shooterRef.current.color = Math.floor(Math.random() * COLORS.length)
      }

      // Collision with grid bubbles
      for (const b of bubblesRef.current) {
        const dist = Math.sqrt((proj.x - b.x) ** 2 + (proj.y - b.y) ** 2)
        if (dist < BUBBLE_R * 2) {
          const newBubble: Bubble = { x: proj.x, y: proj.y, color: proj.color, id: bubbleId++ }
          bubblesRef.current.push(newBubble)
          projectileRef.current = null
          checkMatches(newBubble)
          shooterRef.current.color = Math.floor(Math.random() * COLORS.length)
          break
        }
      }
    }

    draw()
    if (!gameOver) {
      animRef.current = requestAnimationFrame(gameLoop)
    }
  }, [draw, gameOver])

  useEffect(() => {
    animRef.current = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animRef.current)
  }, [gameLoop])

  const checkMatches = (newBubble: Bubble) => {
    const cluster = findCluster(bubblesRef.current, newBubble)
    if (cluster.size >= 3) {
      bubblesRef.current = bubblesRef.current.filter(b => !cluster.has(b.id))
      const pts = cluster.size * 15
      scoreRef.current += pts
      setScore(s => s + pts)

      if (bubblesRef.current.length === 0) {
        setGameOver(true)
      }
    }
  }

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = W / rect.width
    const scaleY = H / rect.height
    let clientX: number, clientY: number
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }
    const mx = (clientX - rect.left) * scaleX
    const my = (clientY - rect.top) * scaleY
    const s = shooterRef.current
    s.angle = Math.atan2(my - s.y, mx - s.x)
    if (s.angle > -0.1) s.angle = -0.1
    if (s.angle < -Math.PI + 0.1) s.angle = -Math.PI + 0.1
  }

  const handleShoot = () => {
    if (projectileRef.current || gameOver) return
    const s = shooterRef.current
    const speed = 8
    projectileRef.current = {
      x: s.x,
      y: s.y,
      dx: Math.cos(s.angle) * speed,
      dy: Math.sin(s.angle) * speed,
      color: s.color,
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 p-2">
      <div className="flex justify-between w-full max-w-[320px] px-2">
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Score</p>
          <p className="text-lg font-bold" style={{ color: primaryColor }}>{score}</p>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Time</p>
          <p className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>{timeLeft}s</p>
        </div>
      </div>
      <p className="text-xs text-surface-500">Aim & click to shoot! Match 3+ bubbles. Goal: {winThreshold} pts</p>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-2xl cursor-crosshair touch-none"
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        onClick={handleShoot}
        onTouchEnd={handleShoot}
      />
      {gameOver && (
        <div className="text-center animate-fade-in">
          <p className="text-xl font-bold">{score >= winThreshold ? '🎉 You Won!' : '⏰ Time Up!'}</p>
          <p className="text-sm text-surface-500">Final Score: {score}</p>
        </div>
      )}
    </div>
  )
}
