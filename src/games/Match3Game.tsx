import { useState, useEffect, useCallback } from 'react'

interface Match3Props {
  primaryColor: string
  onComplete: (score: number, won: boolean) => void
  duration: number
  winThreshold: number
}

const GRID_SIZE = 7
const TILE_TYPES = ['🍬', '🍭', '🍫', '🍩', '🧁', '🍪']
const TILE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']

type Cell = { type: number; key: number }

let keyCounter = 0
const newCell = (type?: number): Cell => ({
  type: type ?? Math.floor(Math.random() * TILE_TYPES.length),
  key: keyCounter++,
})

export function Match3Game({ primaryColor, onComplete, duration = 60, winThreshold = 300 }: Match3Props) {
  const [grid, setGrid] = useState<Cell[][]>([])
  const [selected, setSelected] = useState<[number, number] | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [gameOver, setGameOver] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [combo, setCombo] = useState(0)

  const initGrid = useCallback(() => {
    const g: Cell[][] = []
    for (let r = 0; r < GRID_SIZE; r++) {
      g[r] = []
      for (let c = 0; c < GRID_SIZE; c++) {
        let cell: Cell
        do {
          cell = newCell()
        } while (
          (c >= 2 && g[r][c - 1].type === cell.type && g[r][c - 2].type === cell.type) ||
          (r >= 2 && g[r - 1][c].type === cell.type && g[r - 2][c].type === cell.type)
        )
        g[r][c] = cell
      }
    }
    return g
  }, [])

  useEffect(() => {
    setGrid(initGrid())
  }, [initGrid])

  // Timer
  useEffect(() => {
    if (gameOver || grid.length === 0) return
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
  }, [gameOver, grid.length])

  useEffect(() => {
    if (gameOver) {
      onComplete(score, score >= winThreshold)
    }
  }, [gameOver])

  const findMatches = useCallback((g: Cell[][]): Set<string> => {
    const matches = new Set<string>()
    // Horizontal
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 2; c++) {
        if (g[r][c].type === g[r][c + 1].type && g[r][c].type === g[r][c + 2].type) {
          matches.add(`${r},${c}`)
          matches.add(`${r},${c + 1}`)
          matches.add(`${r},${c + 2}`)
        }
      }
    }
    // Vertical
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r < GRID_SIZE - 2; r++) {
        if (g[r][c].type === g[r + 1][c].type && g[r][c].type === g[r + 2][c].type) {
          matches.add(`${r},${c}`)
          matches.add(`${r + 1},${c}`)
          matches.add(`${r + 2},${c}`)
        }
      }
    }
    return matches
  }, [])

  const processMatches = useCallback((g: Cell[][]): Cell[][] => {
    let newGrid = g.map(row => [...row])
    let totalMatched = 0
    let chainCombo = 0

    let matches = findMatches(newGrid)
    while (matches.size > 0) {
      chainCombo++
      totalMatched += matches.size

      // Remove matched
      matches.forEach(key => {
        const [r, c] = key.split(',').map(Number)
        newGrid[r][c] = newCell(-1)
      })

      // Gravity - drop tiles down
      for (let c = 0; c < GRID_SIZE; c++) {
        let writePos = GRID_SIZE - 1
        for (let r = GRID_SIZE - 1; r >= 0; r--) {
          if (newGrid[r][c].type !== -1) {
            if (writePos !== r) {
              newGrid[writePos][c] = newGrid[r][c]
              newGrid[r][c] = newCell(-1)
            }
            writePos--
          }
        }
        // Fill empty from top
        for (let r = writePos; r >= 0; r--) {
          newGrid[r][c] = newCell()
        }
      }

      matches = findMatches(newGrid)
    }

    if (totalMatched > 0) {
      const points = totalMatched * 10 * chainCombo
      setScore(s => s + points)
      setCombo(chainCombo)
      setTimeout(() => setCombo(0), 1000)
    }

    return newGrid
  }, [findMatches])

  const swap = (r1: number, c1: number, r2: number, c2: number) => {
    if (animating || gameOver) return
    setAnimating(true)

    const newGrid = grid.map(row => [...row])
    const temp = newGrid[r1][c1]
    newGrid[r1][c1] = newGrid[r2][c2]
    newGrid[r2][c2] = temp

    const matches = findMatches(newGrid)
    if (matches.size > 0) {
      const processed = processMatches(newGrid)
      setGrid(processed)
    } else {
      // Swap back - invalid move
      setTimeout(() => {
        setGrid(grid)
      }, 200)
    }

    setTimeout(() => setAnimating(false), 300)
  }

  const handleClick = (r: number, c: number) => {
    if (animating || gameOver) return
    if (!selected) {
      setSelected([r, c])
    } else {
      const [sr, sc] = selected
      const isAdjacent = (Math.abs(sr - r) === 1 && sc === c) || (Math.abs(sc - c) === 1 && sr === r)
      if (isAdjacent) {
        swap(sr, sc, r, c)
      }
      setSelected(null)
    }
  }

  if (grid.length === 0) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="flex flex-col items-center gap-3 p-2">
      {/* HUD */}
      <div className="flex justify-between w-full max-w-[320px] px-2">
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Score</p>
          <p className="text-lg font-bold" style={{ color: primaryColor }}>{score}</p>
        </div>
        {combo > 1 && (
          <div className="bg-amber-100 text-amber-700 rounded-xl px-3 py-1.5 animate-scale-in">
            <p className="text-xs">Combo</p>
            <p className="text-lg font-bold">x{combo}</p>
          </div>
        )}
        <div className="bg-white/80 backdrop-blur rounded-xl px-3 py-1.5">
          <p className="text-xs text-surface-500">Time</p>
          <p className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>{timeLeft}s</p>
        </div>
      </div>

      {/* Goal */}
      <p className="text-xs text-surface-500">Match 3 or more to score! Goal: {winThreshold} pts</p>

      {/* Grid */}
      <div
        className="grid gap-1 p-2 rounded-2xl bg-white/50 backdrop-blur"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={cell.key}
              onClick={() => handleClick(r, c)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all duration-200 hover:scale-110 active:scale-90 ${
                selected && selected[0] === r && selected[1] === c
                  ? 'ring-2 ring-offset-1 scale-110'
                  : ''
              }`}
              style={{
                backgroundColor: `${TILE_COLORS[cell.type]}30`,
                borderColor: selected && selected[0] === r && selected[1] === c ? primaryColor : undefined,
              }}
            >
              {TILE_TYPES[cell.type]}
            </button>
          ))
        )}
      </div>

      {gameOver && (
        <div className="text-center animate-fade-in mt-2">
          <p className="text-xl font-bold">{score >= winThreshold ? '🎉 You Won!' : '⏰ Time Up!'}</p>
          <p className="text-sm text-surface-500">Final Score: {score}</p>
        </div>
      )}
    </div>
  )
}
