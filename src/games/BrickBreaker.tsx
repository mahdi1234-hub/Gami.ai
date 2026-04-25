import { useRef, useEffect, useState, useCallback } from 'react'

interface BrickBreakerProps {
  primaryColor: string
  onComplete: (score: number, won: boolean) => void
  duration: number
  winThreshold: number
}

const W = 340
const H = 440
const PADDLE_W = 70
const PADDLE_H = 12
const BALL_R = 6
const BRICK_ROWS = 5
const BRICK_COLS = 8
const BRICK_W = W / BRICK_COLS - 4
const BRICK_H = 16
const BRICK_COLORS = ['#FF6B6B', '#FFEAA7', '#4ECDC4', '#45B7D1', '#DDA0DD']

interface Brick { x: number; y: number; alive: boolean; color: string }

export function BrickBreaker({ primaryColor, onComplete, duration = 90, winThreshold = 200 }: BrickBreakerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [gameOver, setGameOver] = useState(false)
  const [lives, setLives] = useState(3)

  const paddleRef = useRef(W / 2 - PADDLE_W / 2)
  const ballRef = useRef({ x: W / 2, y: H - 40, dx: 3, dy: -3 })
  const bricksRef = useRef<Brick[]>([])
  const scoreRef = useRef(0)
  const livesRef = useRef(3)
  const gameOverRef = useRef(false)
  const animRef = useRef(0)

  useEffect(() => {
    const bricks: Brick[] = []
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        bricks.push({
          x: c * (BRICK_W + 4) + 4,
          y: r * (BRICK_H + 4) + 40,
          alive: true,
          color: BRICK_COLORS[r],
        })
      }
    }
    bricksRef.current = bricks
  }, [])

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

  const resetBall = () => {
    ballRef.current = { x: W / 2, y: H - 40, dx: 3 * (Math.random() > 0.5 ? 1 : -1), dy: -3 }
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const ball = ballRef.current
    const paddle = paddleRef.current

    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, W, H)

    // Bricks
    bricksRef.current.forEach(b => {
      if (!b.alive) return
      ctx.fillStyle = b.color
      ctx.beginPath()
      ctx.roundRect(b.x, b.y, BRICK_W, BRICK_H, 3)
      ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.fillRect(b.x + 2, b.y + 2, BRICK_W - 4, 4)
    })

    // Paddle
    ctx.fillStyle = primaryColor
    ctx.beginPath()
    ctx.roundRect(paddle, H - 25, PADDLE_W, PADDLE_H, 6)
    ctx.fill()

    // Ball
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.beginPath()
    ctx.arc(ball.x - 2, ball.y - 2, 2, 0, Math.PI * 2)
    ctx.fill()

    // Lives
    for (let i = 0; i < livesRef.current; i++) {
      ctx.fillStyle = '#FF6B6B'
      ctx.beginPath()
      ctx.arc(15 + i * 20, 20, 6, 0, Math.PI * 2)
      ctx.fill()
    }

    // Score text
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${scoreRef.current}`, W - 10, 24)
  }, [primaryColor])

  const gameLoop = useCallback(() => {
    if (gameOverRef.current) return
    const ball = ballRef.current
    const paddle = paddleRef.current

    ball.x += ball.dx
    ball.y += ball.dy

    // Wall bounce
    if (ball.x <= BALL_R || ball.x >= W - BALL_R) ball.dx = -ball.dx
    if (ball.y <= BALL_R) ball.dy = -ball.dy

    // Bottom - lose life
    if (ball.y >= H) {
      livesRef.current--
      setLives(livesRef.current)
      if (livesRef.current <= 0) {
        gameOverRef.current = true
        setGameOver(true)
        onComplete(scoreRef.current, scoreRef.current >= winThreshold)
        return
      }
      resetBall()
    }

    // Paddle collision
    if (
      ball.y + BALL_R >= H - 25 &&
      ball.y + BALL_R <= H - 25 + PADDLE_H &&
      ball.x >= paddle &&
      ball.x <= paddle + PADDLE_W
    ) {
      ball.dy = -Math.abs(ball.dy)
      const hitPos = (ball.x - paddle) / PADDLE_W
      ball.dx = (hitPos - 0.5) * 6
    }

    // Brick collision
    bricksRef.current.forEach(brick => {
      if (!brick.alive) return
      if (
        ball.x + BALL_R > brick.x &&
        ball.x - BALL_R < brick.x + BRICK_W &&
        ball.y + BALL_R > brick.y &&
        ball.y - BALL_R < brick.y + BRICK_H
      ) {
        brick.alive = false
        ball.dy = -ball.dy
        scoreRef.current += 15
        setScore(scoreRef.current)

        // Check win
        if (bricksRef.current.every(b => !b.alive)) {
          gameOverRef.current = true
          setGameOver(true)
          onComplete(scoreRef.current, true)
        }
      }
    })

    draw()
    animRef.current = requestAnimationFrame(gameLoop)
  }, [draw, onComplete, winThreshold])

  useEffect(() => {
    animRef.current = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animRef.current)
  }, [gameLoop])

  const handleMove = (clientX: number) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const x = (clientX - rect.left) * (W / rect.width)
    paddleRef.current = Math.max(0, Math.min(W - PADDLE_W, x - PADDLE_W / 2))
  }

  return (
    <div className="flex flex-col items-center gap-3 p-2">
      <div className="flex justify-between w-full max-w-[340px]">
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Score</p>
          <p className="text-lg font-bold" style={{ color: primaryColor }}>{score}</p>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Lives</p>
          <p className="text-lg font-bold text-red-500">{'❤️'.repeat(lives)}</p>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Time</p>
          <p className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>{timeLeft}s</p>
        </div>
      </div>
      <p className="text-xs text-surface-500">Move paddle to bounce ball! Break all bricks!</p>
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
          <p className="text-xl font-bold">
            {bricksRef.current.every(b => !b.alive) ? '🧱 All Cleared!' : score >= winThreshold ? '🎉 You Won!' : '💔 Game Over'}
          </p>
          <p className="text-sm text-surface-500">Score: {score}</p>
        </div>
      )}
    </div>
  )
}
