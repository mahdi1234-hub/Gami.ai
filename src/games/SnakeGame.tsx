import { useState, useEffect, useRef, useCallback } from 'react'

interface SnakeGameProps {
  primaryColor: string
  onComplete: (score: number, won: boolean) => void
  duration: number
  winThreshold: number
}

const GRID = 20
const CELL = 16
const W = GRID * CELL
const H = GRID * CELL

type Point = { x: number; y: number }
type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export function SnakeGame({ primaryColor, onComplete, duration = 60, winThreshold = 100 }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }])
  const dirRef = useRef<Dir>('RIGHT')
  const foodRef = useRef<Point>({ x: 15, y: 10 })
  const scoreRef = useRef(0)
  const gameOverRef = useRef(false)
  const loopRef = useRef<ReturnType<typeof setInterval>>()

  const placeFood = useCallback(() => {
    let pos: Point
    do {
      pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }
    } while (snakeRef.current.some(s => s.x === pos.x && s.y === pos.y))
    foodRef.current = pos
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    // Background
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, W, H)

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, H)
      ctx.moveTo(0, i * CELL); ctx.lineTo(W, i * CELL)
      ctx.stroke()
    }

    // Food
    const f = foodRef.current
    ctx.fillStyle = '#FF6B6B'
    ctx.beginPath()
    ctx.arc(f.x * CELL + CELL / 2, f.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = `${CELL - 2}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🍎', f.x * CELL + CELL / 2, f.y * CELL + CELL / 2)

    // Snake
    snakeRef.current.forEach((seg, i) => {
      const brightness = 1 - (i / snakeRef.current.length) * 0.5
      ctx.fillStyle = i === 0 ? primaryColor : `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, ${brightness})`
      ctx.beginPath()
      ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 3)
      ctx.fill()
    })

    // Eyes on head
    const head = snakeRef.current[0]
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(head.x * CELL + CELL / 2 - 3, head.y * CELL + CELL / 2 - 2, 2, 0, Math.PI * 2)
    ctx.arc(head.x * CELL + CELL / 2 + 3, head.y * CELL + CELL / 2 - 2, 2, 0, Math.PI * 2)
    ctx.fill()
  }, [primaryColor])

  const tick = useCallback(() => {
    if (gameOverRef.current) return
    const snake = [...snakeRef.current]
    const head = { ...snake[0] }

    switch (dirRef.current) {
      case 'UP': head.y--; break
      case 'DOWN': head.y++; break
      case 'LEFT': head.x--; break
      case 'RIGHT': head.x++; break
    }

    // Wall collision
    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
      gameOverRef.current = true
      setGameOver(true)
      onComplete(scoreRef.current, scoreRef.current >= winThreshold)
      return
    }

    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      gameOverRef.current = true
      setGameOver(true)
      onComplete(scoreRef.current, scoreRef.current >= winThreshold)
      return
    }

    snake.unshift(head)

    // Eat food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      scoreRef.current += 10
      setScore(scoreRef.current)
      placeFood()
    } else {
      snake.pop()
    }

    snakeRef.current = snake
    draw()
  }, [draw, placeFood, onComplete, winThreshold])

  useEffect(() => {
    if (!started || gameOver) return
    loopRef.current = setInterval(tick, 120)
    return () => clearInterval(loopRef.current)
  }, [started, gameOver, tick])

  // Timer
  useEffect(() => {
    if (!started || gameOver) return
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
  }, [started, gameOver, onComplete, winThreshold])

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!started) { setStarted(true); draw() }
      const d = dirRef.current
      if ((e.key === 'ArrowUp' || e.key === 'w') && d !== 'DOWN') dirRef.current = 'UP'
      if ((e.key === 'ArrowDown' || e.key === 's') && d !== 'UP') dirRef.current = 'DOWN'
      if ((e.key === 'ArrowLeft' || e.key === 'a') && d !== 'RIGHT') dirRef.current = 'LEFT'
      if ((e.key === 'ArrowRight' || e.key === 'd') && d !== 'LEFT') dirRef.current = 'RIGHT'
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [started, draw])

  useEffect(() => { draw() }, [draw])

  // Touch controls
  const touchStart = useRef<Point | null>(null)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    if (!started) setStarted(true)
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    const d = dirRef.current
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20 && d !== 'LEFT') dirRef.current = 'RIGHT'
      if (dx < -20 && d !== 'RIGHT') dirRef.current = 'LEFT'
    } else {
      if (dy > 20 && d !== 'UP') dirRef.current = 'DOWN'
      if (dy < -20 && d !== 'DOWN') dirRef.current = 'UP'
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 p-2">
      <div className="flex justify-between w-full max-w-[320px]">
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Score</p>
          <p className="text-lg font-bold" style={{ color: primaryColor }}>{score}</p>
        </div>
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Time</p>
          <p className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>{timeLeft}s</p>
        </div>
      </div>
      {!started && <p className="text-xs text-surface-500">Swipe or use arrow keys to move. Goal: {winThreshold} pts</p>}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-2xl shadow-lg touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
      {/* Mobile d-pad */}
      <div className="grid grid-cols-3 gap-1 w-32">
        <div />
        <button onClick={() => { if (!started) setStarted(true); if (dirRef.current !== 'DOWN') dirRef.current = 'UP' }} className="p-3 bg-white/60 rounded-xl text-center font-bold">↑</button>
        <div />
        <button onClick={() => { if (!started) setStarted(true); if (dirRef.current !== 'RIGHT') dirRef.current = 'LEFT' }} className="p-3 bg-white/60 rounded-xl text-center font-bold">←</button>
        <button onClick={() => { if (!started) setStarted(true); if (dirRef.current !== 'UP') dirRef.current = 'DOWN' }} className="p-3 bg-white/60 rounded-xl text-center font-bold">↓</button>
        <button onClick={() => { if (!started) setStarted(true); if (dirRef.current !== 'LEFT') dirRef.current = 'RIGHT' }} className="p-3 bg-white/60 rounded-xl text-center font-bold">→</button>
      </div>
      {gameOver && (
        <div className="text-center animate-fade-in">
          <p className="text-xl font-bold">{score >= winThreshold ? '🐍 You Won!' : 'Game Over!'}</p>
          <p className="text-sm text-surface-500">Score: {score}</p>
        </div>
      )}
    </div>
  )
}
