import { useState, useRef, useEffect, useCallback } from 'react'

interface ShadowFightProps {
  primaryColor: string
  onComplete: (score: number, won: boolean) => void
  duration: number
  winThreshold: number
}

const W = 360
const H = 480
const GROUND_Y = H - 60
const GRAVITY = 0.6
const JUMP_FORCE = -12

interface Fighter {
  x: number
  y: number
  vy: number
  width: number
  height: number
  health: number
  maxHealth: number
  facing: 1 | -1
  state: 'idle' | 'walk' | 'jump' | 'punch' | 'kick' | 'block' | 'hit' | 'special'
  stateTimer: number
  comboCount: number
  specialReady: boolean
  isPlayer: boolean
  color: string
  shadowColor: string
}

function createFighter(x: number, facing: 1 | -1, isPlayer: boolean, color: string, shadow: string): Fighter {
  return {
    x, y: GROUND_Y, vy: 0,
    width: 40, height: 80,
    health: 100, maxHealth: 100,
    facing, state: 'idle', stateTimer: 0,
    comboCount: 0, specialReady: false,
    isPlayer, color, shadowColor: shadow,
  }
}

export function ShadowFight({ primaryColor, onComplete, duration = 90, winThreshold = 1 }: ShadowFightProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playerHealth, setPlayerHealth] = useState(100)
  const [enemyHealth, setEnemyHealth] = useState(100)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [gameOver, setGameOver] = useState(false)
  const [round, setRound] = useState(1)
  const [playerWins, setPlayerWins] = useState(0)
  const [enemyWins, setEnemyWins] = useState(0)
  const [showRoundText, setShowRoundText] = useState('ROUND 1')
  const [combo, setCombo] = useState(0)

  const playerRef = useRef(createFighter(80, 1, true, '#1a1a2e', '#000'))
  const enemyRef = useRef(createFighter(W - 120, -1, false, '#4a0000', '#300'))
  const keysRef = useRef<Set<string>>(new Set())
  const gameOverRef = useRef(false)
  const animRef = useRef(0)
  const lastAiAction = useRef(0)

  // Timer
  useEffect(() => {
    if (gameOver) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          endRound()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameOver, round])

  // Round intro
  useEffect(() => {
    setShowRoundText(`ROUND ${round}`)
    setTimeout(() => setShowRoundText('FIGHT!'), 1000)
    setTimeout(() => setShowRoundText(''), 2000)
  }, [round])

  const endRound = useCallback(() => {
    const p = playerRef.current
    const e = enemyRef.current
    if (p.health > e.health) {
      setPlayerWins(w => {
        const newW = w + 1
        if (newW >= 2) {
          gameOverRef.current = true
          setGameOver(true)
          onComplete(100, true)
        } else {
          resetRound()
          setRound(r => r + 1)
          setTimeLeft(duration)
        }
        return newW
      })
    } else {
      setEnemyWins(w => {
        const newW = w + 1
        if (newW >= 2) {
          gameOverRef.current = true
          setGameOver(true)
          onComplete(0, false)
        } else {
          resetRound()
          setRound(r => r + 1)
          setTimeLeft(duration)
        }
        return newW
      })
    }
  }, [duration, onComplete])

  const resetRound = () => {
    playerRef.current = createFighter(80, 1, true, '#1a1a2e', '#000')
    enemyRef.current = createFighter(W - 120, -1, false, '#4a0000', '#300')
    setPlayerHealth(100)
    setEnemyHealth(100)
  }

  const dealDamage = (attacker: Fighter, defender: Fighter, dmg: number) => {
    if (defender.state === 'block') dmg = Math.floor(dmg * 0.2)
    defender.health = Math.max(0, defender.health - dmg)
    defender.state = 'hit'
    defender.stateTimer = 15
    if (defender.isPlayer) setPlayerHealth(defender.health)
    else setEnemyHealth(defender.health)

    if (attacker.isPlayer) {
      attacker.comboCount++
      setCombo(attacker.comboCount)
      if (attacker.comboCount >= 5) attacker.specialReady = true
    }

    if (defender.health <= 0) endRound()
  }

  const getAttackRange = (f: Fighter) => {
    if (f.state === 'kick') return 55
    if (f.state === 'special') return 70
    return 45
  }

  const getAttackDamage = (f: Fighter) => {
    if (f.state === 'special') return 25
    if (f.state === 'kick') return 12
    return 8
  }

  // AI logic
  const aiThink = useCallback(() => {
    const e = enemyRef.current
    const p = playerRef.current
    if (e.state !== 'idle' && e.state !== 'walk') return

    const dist = Math.abs(e.x - p.x)
    const now = Date.now()
    if (now - lastAiAction.current < 300) return
    lastAiAction.current = now

    if (dist < 60) {
      const r = Math.random()
      if (r < 0.15) { e.state = 'block'; e.stateTimer = 30 }
      else if (r < 0.45) { e.state = 'punch'; e.stateTimer = 20 }
      else if (r < 0.7) { e.state = 'kick'; e.stateTimer = 25 }
      else if (r < 0.8 && e.y === GROUND_Y) { e.vy = JUMP_FORCE; e.state = 'jump'; e.stateTimer = 30 }
      else { e.x += e.facing * 3 }
    } else if (dist < 150) {
      e.x += (p.x > e.x ? 2 : -2)
      e.state = 'walk'
      if (Math.random() < 0.1 && e.y === GROUND_Y) { e.vy = JUMP_FORCE; e.state = 'jump'; e.stateTimer = 30 }
    } else {
      e.x += (p.x > e.x ? 3 : -3)
      e.state = 'walk'
    }
  }, [])

  const drawFighter = useCallback((ctx: CanvasRenderingContext2D, f: Fighter) => {
    const cx = f.x
    const cy = f.y
    const dir = f.facing

    // Shadow on ground
    ctx.fillStyle = 'rgba(0,0,0,0.15)'
    ctx.beginPath()
    ctx.ellipse(cx, GROUND_Y + 5, 25, 6, 0, 0, Math.PI * 2)
    ctx.fill()

    // Body silhouette
    ctx.fillStyle = f.state === 'hit' ? '#ff4444' : f.color
    ctx.shadowColor = f.shadowColor
    ctx.shadowBlur = 15

    // Torso
    ctx.fillRect(cx - 8, cy - 65, 16, 35)

    // Head
    ctx.beginPath()
    ctx.arc(cx, cy - 75, 12, 0, Math.PI * 2)
    ctx.fill()

    // Legs
    const legSpread = f.state === 'walk' ? Math.sin(Date.now() / 100) * 8 : f.state === 'kick' ? 15 * dir : 0
    ctx.fillRect(cx - 6 + legSpread, cy - 30, 6, 30)
    ctx.fillRect(cx - legSpread, cy - 30, 6, 30)

    // Arms
    ctx.shadowBlur = 0
    if (f.state === 'punch') {
      // Extended punch arm
      ctx.fillRect(cx, cy - 60, 30 * dir, 6)
      ctx.fillRect(cx - 10 * dir, cy - 55, 8, 6)
    } else if (f.state === 'kick') {
      ctx.fillRect(cx - 10 * dir, cy - 58, 8, 6)
      ctx.fillRect(cx + 5 * dir, cy - 58, 8, 6)
    } else if (f.state === 'block') {
      ctx.fillRect(cx - 5, cy - 65, 10, 6)
      ctx.fillRect(cx - 5, cy - 55, 10, 6)
      // Shield effect
      ctx.strokeStyle = 'rgba(100,200,255,0.5)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(cx + 10 * dir, cy - 50, 20, 0, Math.PI * 2)
      ctx.stroke()
    } else if (f.state === 'special') {
      // Energy attack
      ctx.fillStyle = primaryColor
      ctx.shadowColor = primaryColor
      ctx.shadowBlur = 20
      ctx.fillRect(cx, cy - 60, 50 * dir, 8)
      ctx.beginPath()
      ctx.arc(cx + 50 * dir, cy - 56, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.fillStyle = f.color
    } else {
      ctx.fillRect(cx + 5 * dir, cy - 58, 8, 6)
      ctx.fillRect(cx - 15 * dir, cy - 55, 8, 6)
    }

    // Eyes (glowing)
    ctx.fillStyle = f.isPlayer ? '#4FC3F7' : '#ff4444'
    ctx.shadowColor = f.isPlayer ? '#4FC3F7' : '#ff4444'
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(cx + 4 * dir, cy - 77, 2, 0, Math.PI * 2)
    ctx.arc(cx + 8 * dir, cy - 77, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }, [primaryColor])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    // Dark background
    const bg = ctx.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0, '#0a0a1a')
    bg.addColorStop(1, '#1a1a3e')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // Moon
    ctx.fillStyle = 'rgba(200,200,255,0.1)'
    ctx.beginPath()
    ctx.arc(W - 60, 60, 30, 0, Math.PI * 2)
    ctx.fill()

    // Ground
    ctx.fillStyle = '#111'
    ctx.fillRect(0, GROUND_Y + 10, W, H - GROUND_Y)
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, GROUND_Y + 10)
    ctx.lineTo(W, GROUND_Y + 10)
    ctx.stroke()

    // Fighters
    drawFighter(ctx, playerRef.current)
    drawFighter(ctx, enemyRef.current)

    // Health bars
    const drawHealthBar = (x: number, health: number, max: number, color: string, label: string) => {
      ctx.fillStyle = '#333'
      ctx.fillRect(x, 15, 140, 14)
      ctx.fillStyle = health > max * 0.3 ? color : '#ff4444'
      ctx.fillRect(x + 1, 16, (health / max) * 138, 12)
      ctx.fillStyle = '#fff'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(label, x + 70, 25)
    }
    drawHealthBar(10, playerRef.current.health, 100, '#4FC3F7', 'PLAYER')
    drawHealthBar(W - 150, enemyRef.current.health, 100, '#ff4444', 'ENEMY')

    // Round indicators
    ctx.fillStyle = '#fff'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`Round ${round}`, W / 2, 15)

    // Win dots
    for (let i = 0; i < 2; i++) {
      ctx.fillStyle = i < playerWins ? '#4FC3F7' : '#333'
      ctx.beginPath(); ctx.arc(W / 2 - 20 + i * 12, 28, 4, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = i < enemyWins ? '#ff4444' : '#333'
      ctx.beginPath(); ctx.arc(W / 2 + 10 + i * 12, 28, 4, 0, Math.PI * 2); ctx.fill()
    }

    // Special meter
    if (playerRef.current.specialReady) {
      ctx.fillStyle = primaryColor
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('SPECIAL READY! [S]', 10, H - 70)
    }
  }, [drawFighter, round, playerWins, enemyWins, primaryColor])

  const gameLoop = useCallback(() => {
    if (gameOverRef.current) return
    const p = playerRef.current
    const e = enemyRef.current
    const keys = keysRef.current

    // Player input
    if (p.state === 'idle' || p.state === 'walk') {
      if (keys.has('ArrowLeft') || keys.has('a')) { p.x -= 4; p.facing = -1; p.state = 'walk' }
      else if (keys.has('ArrowRight') || keys.has('d')) { p.x += 4; p.facing = 1; p.state = 'walk' }
      else p.state = 'idle'

      if ((keys.has('ArrowUp') || keys.has('w')) && p.y >= GROUND_Y) {
        p.vy = JUMP_FORCE; p.state = 'jump'; p.stateTimer = 30
      }
      if (keys.has('z') || keys.has('j')) { p.state = 'punch'; p.stateTimer = 15 }
      if (keys.has('x') || keys.has('k')) { p.state = 'kick'; p.stateTimer = 20 }
      if (keys.has('c') || keys.has('l')) { p.state = 'block'; p.stateTimer = 20 }
      if ((keys.has('s') || keys.has('v')) && p.specialReady) {
        p.state = 'special'; p.stateTimer = 25; p.specialReady = false; p.comboCount = 0; setCombo(0)
      }
    }

    // Face opponent
    if (p.state === 'idle' || p.state === 'walk') p.facing = e.x > p.x ? 1 : -1
    if (e.state === 'idle' || e.state === 'walk') e.facing = p.x > e.x ? 1 : -1

    // Physics
    ;[p, e].forEach(f => {
      f.vy += GRAVITY
      f.y += f.vy
      if (f.y > GROUND_Y) { f.y = GROUND_Y; f.vy = 0 }
      f.x = Math.max(20, Math.min(W - 20, f.x))

      if (f.stateTimer > 0) {
        f.stateTimer--
        if (f.stateTimer === 0 && f.state !== 'idle' && f.state !== 'walk') {
          f.state = 'idle'
        }
      }
    })

    // Attack collision
    const checkAttack = (attacker: Fighter, defender: Fighter) => {
      if ((attacker.state === 'punch' || attacker.state === 'kick' || attacker.state === 'special') && attacker.stateTimer === 10) {
        const range = getAttackRange(attacker)
        const dist = Math.abs(attacker.x - defender.x)
        if (dist < range) {
          dealDamage(attacker, defender, getAttackDamage(attacker))
        }
      }
    }
    checkAttack(p, e)
    checkAttack(e, p)

    // AI
    aiThink()

    draw()
    animRef.current = requestAnimationFrame(gameLoop)
  }, [draw, aiThink, endRound])

  useEffect(() => {
    animRef.current = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animRef.current)
  }, [gameLoop])

  // Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => { keysRef.current.add(e.key.toLowerCase()); e.preventDefault() }
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase())
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  // Touch controls
  const handleBtn = (action: string, pressed: boolean) => {
    if (pressed) keysRef.current.add(action)
    else keysRef.current.delete(action)
  }

  return (
    <div className="flex flex-col items-center gap-2 p-1">
      <div className="flex justify-between w-full max-w-[360px] text-xs">
        <span className="text-blue-400 font-bold">P: {playerWins}/2</span>
        <span className="font-bold" style={{ color: primaryColor }}>⏱ {timeLeft}s</span>
        <span className="text-red-400 font-bold">E: {enemyWins}/2</span>
      </div>

      <div className="relative">
        <canvas ref={canvasRef} width={W} height={H} className="rounded-2xl shadow-xl" />
        {showRoundText && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-4xl font-black text-white drop-shadow-lg animate-scale-in" style={{ textShadow: `0 0 30px ${primaryColor}` }}>
              {showRoundText}
            </span>
          </div>
        )}
        {combo > 2 && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 text-sm font-bold animate-scale-in" style={{ color: primaryColor }}>
            {combo} HIT COMBO!
          </div>
        )}
      </div>

      {/* Mobile controls */}
      <div className="flex gap-2 w-full max-w-[360px]">
        <div className="flex gap-1">
          <button onTouchStart={() => handleBtn('a', true)} onTouchEnd={() => handleBtn('a', false)} onMouseDown={() => handleBtn('a', true)} onMouseUp={() => handleBtn('a', false)} className="w-12 h-12 bg-surface-800 text-white rounded-xl flex items-center justify-center font-bold text-lg active:bg-surface-600">←</button>
          <button onTouchStart={() => handleBtn('d', true)} onTouchEnd={() => handleBtn('d', false)} onMouseDown={() => handleBtn('d', true)} onMouseUp={() => handleBtn('d', false)} className="w-12 h-12 bg-surface-800 text-white rounded-xl flex items-center justify-center font-bold text-lg active:bg-surface-600">→</button>
          <button onTouchStart={() => handleBtn('w', true)} onTouchEnd={() => handleBtn('w', false)} onMouseDown={() => handleBtn('w', true)} onMouseUp={() => handleBtn('w', false)} className="w-12 h-12 bg-surface-800 text-white rounded-xl flex items-center justify-center font-bold text-sm active:bg-surface-600">Jump</button>
        </div>
        <div className="flex-1" />
        <div className="flex gap-1">
          <button onTouchStart={() => handleBtn('j', true)} onTouchEnd={() => handleBtn('j', false)} onMouseDown={() => handleBtn('j', true)} onMouseUp={() => handleBtn('j', false)} className="w-12 h-12 bg-blue-700 text-white rounded-xl flex items-center justify-center font-bold text-xs active:bg-blue-500">Punch</button>
          <button onTouchStart={() => handleBtn('k', true)} onTouchEnd={() => handleBtn('k', false)} onMouseDown={() => handleBtn('k', true)} onMouseUp={() => handleBtn('k', false)} className="w-12 h-12 bg-red-700 text-white rounded-xl flex items-center justify-center font-bold text-xs active:bg-red-500">Kick</button>
          <button onTouchStart={() => handleBtn('l', true)} onTouchEnd={() => handleBtn('l', false)} onMouseDown={() => handleBtn('l', true)} onMouseUp={() => handleBtn('l', false)} className="w-12 h-12 bg-green-700 text-white rounded-xl flex items-center justify-center font-bold text-xs active:bg-green-500">Block</button>
          <button onTouchStart={() => handleBtn('v', true)} onTouchEnd={() => handleBtn('v', false)} onMouseDown={() => handleBtn('v', true)} onMouseUp={() => handleBtn('v', false)} className="w-12 h-12 text-white rounded-xl flex items-center justify-center font-bold text-xs active:opacity-70" style={{ backgroundColor: primaryColor }}>SP</button>
        </div>
      </div>

      <div className="text-[10px] text-surface-400 text-center">
        Keys: ←→ Move | ↑ Jump | Z Punch | X Kick | C Block | S Special
      </div>

      {gameOver && (
        <div className="text-center animate-fade-in">
          <p className="text-xl font-bold">{playerWins >= 2 ? '🏆 VICTORY!' : '💀 DEFEATED'}</p>
          <p className="text-sm text-surface-500">Best of 3 rounds</p>
        </div>
      )}
    </div>
  )
}
