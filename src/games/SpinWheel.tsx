import { useState, useRef, useCallback } from 'react'

interface SpinWheelProps {
  primaryColor: string
  onComplete: (score: number, won: boolean) => void
  prizes: string[]
}

const DEFAULT_PRIZES = ['20% OFF', 'Free Ship', 'Try Again', '50% OFF', '10% OFF', 'Try Again', 'Free Item', '5% OFF']
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']

export function SpinWheel({ primaryColor, onComplete, prizes = DEFAULT_PRIZES }: SpinWheelProps) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const segmentAngle = 360 / prizes.length

  const drawWheel = useCallback((ctx: CanvasRenderingContext2D, size: number) => {
    const center = size / 2
    const radius = center - 10

    prizes.forEach((prize, i) => {
      const startAngle = (i * segmentAngle - 90) * (Math.PI / 180)
      const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180)

      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.arc(center, center, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()

      // Text
      ctx.save()
      ctx.translate(center, center)
      ctx.rotate(startAngle + (endAngle - startAngle) / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 13px Plus Jakarta Sans, sans-serif'
      ctx.shadowColor = 'rgba(0,0,0,0.3)'
      ctx.shadowBlur = 2
      ctx.fillText(prize, radius - 20, 5)
      ctx.restore()
    })

    // Center circle
    ctx.beginPath()
    ctx.arc(center, center, 25, 0, Math.PI * 2)
    ctx.fillStyle = primaryColor
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('SPIN', center, center)
  }, [prizes, segmentAngle, primaryColor])

  const handleSpin = () => {
    if (spinning) return
    setSpinning(true)
    setResult(null)

    const extraSpins = 5 + Math.random() * 5
    const targetAngle = Math.random() * 360
    const totalRotation = extraSpins * 360 + targetAngle

    setRotation(prev => prev + totalRotation)

    setTimeout(() => {
      const finalAngle = (rotation + totalRotation) % 360
      const winIndex = Math.floor((360 - finalAngle) / segmentAngle) % prizes.length
      const prize = prizes[winIndex]
      const won = !prize.toLowerCase().includes('try again')
      setResult(prize)
      setSpinning(false)
      onComplete(won ? 100 : 0, won)
    }, 4000)
  }

  // Draw on mount and when needed
  const canvasCallback = useCallback((node: HTMLCanvasElement | null) => {
    if (node) {
      const ctx = node.getContext('2d')
      if (ctx) {
        const size = node.width
        ctx.clearRect(0, 0, size, size)
        drawWheel(ctx, size)
      }
    }
  }, [drawWheel])

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Pointer */}
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent" style={{ borderTopColor: primaryColor }} />
        </div>

        <div
          className="transition-transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: spinning ? '4s' : '0s',
            transitionTimingFunction: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)',
          }}
        >
          <canvas
            ref={(node) => { canvasRef.current = node; canvasCallback(node) }}
            width={320}
            height={320}
            className="rounded-full shadow-lg"
          />
        </div>
      </div>

      {result ? (
        <div className="text-center animate-fade-in">
          <p className="text-2xl font-bold" style={{ color: primaryColor }}>{result}</p>
          <p className="text-sm text-surface-500 mt-1">
            {result.toLowerCase().includes('try again') ? 'Better luck next time!' : 'Congratulations! You won!'}
          </p>
        </div>
      ) : (
        <button
          onClick={handleSpin}
          disabled={spinning}
          className="px-8 py-3 rounded-full text-white font-semibold text-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: primaryColor }}
        >
          {spinning ? 'Spinning...' : 'SPIN THE WHEEL'}
        </button>
      )}
    </div>
  )
}
