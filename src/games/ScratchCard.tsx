import { useRef, useState, useEffect, useCallback } from 'react'

interface ScratchCardProps {
  primaryColor: string
  onComplete: (score: number, won: boolean) => void
  prize: string
}

export function ScratchCard({ primaryColor, onComplete, prize = '20% OFF' }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScratching, setIsScratching] = useState(false)
  const [percentScratched, setPercentScratched] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    
    // Draw scratch overlay
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#C0C0C0')
    gradient.addColorStop(0.5, '#D4D4D4')
    gradient.addColorStop(1, '#B0B0B0')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add "SCRATCH HERE" text
    ctx.fillStyle = '#888'
    ctx.font = 'bold 24px Plus Jakarta Sans, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2 - 15)
    ctx.font = '14px Plus Jakarta Sans, sans-serif'
    ctx.fillText('Use your finger or mouse', canvas.width / 2, canvas.height / 2 + 15)

    // Decorative dots
    for (let i = 0; i < 50; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1 + Math.random() * 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.2})`
      ctx.fill()
    }
  }, [])

  useEffect(() => {
    initCanvas()
  }, [initCanvas])

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.globalCompositeOperation = 'destination-out'

    if (lastPos.current) {
      ctx.beginPath()
      ctx.moveTo(lastPos.current.x, lastPos.current.y)
      ctx.lineTo(x, y)
      ctx.lineWidth = 45
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
    }

    ctx.beginPath()
    ctx.arc(x, y, 22, 0, Math.PI * 2)
    ctx.fill()

    lastPos.current = { x, y }
    checkProgress(ctx, canvas)
  }

  const checkProgress = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let transparent = 0
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++
    }
    const pct = (transparent / (imageData.data.length / 4)) * 100
    setPercentScratched(pct)

    if (pct > 55 && !revealed) {
      setRevealed(true)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      onComplete(100, true)
    }
  }

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsScratching(true)
    const pos = getPos(e)
    lastPos.current = pos
    scratch(pos.x, pos.y)
  }

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isScratching) return
    const pos = getPos(e)
    scratch(pos.x, pos.y)
  }

  const handleEnd = () => {
    setIsScratching(false)
    lastPos.current = null
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{ width: 320, height: 200 }}>
        {/* Prize underneath */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ backgroundColor: `${primaryColor}15` }}
        >
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-2xl font-bold" style={{ color: primaryColor }}>{prize}</p>
          <p className="text-sm text-surface-500">Your prize!</p>
        </div>

        {/* Scratch canvas on top */}
        <canvas
          ref={canvasRef}
          width={320}
          height={200}
          className="absolute inset-0 cursor-pointer touch-none"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>

      <div className="w-64 h-2 bg-surface-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.min(percentScratched, 100)}%`, backgroundColor: primaryColor }}
        />
      </div>
      <p className="text-sm text-surface-500">
        {revealed ? 'Prize revealed!' : `Scratch to reveal - ${Math.round(percentScratched)}% done`}
      </p>
    </div>
  )
}
