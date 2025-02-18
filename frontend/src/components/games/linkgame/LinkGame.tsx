"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Star, Clock, Zap } from "lucide-react"
import IconSelector from "../IconSelector"

const GRID_SIZE = 6
const ICON_TYPES = 6
const EMPTY_CELL = null

type CellType = string | null

type GameState = {
  grid: CellType[][]
  score: number
  timeLeft: number
  hints: number
}

type LinkGameProps = {
  onClose: () => void
}

const getRandomIcons = (icons: string[], count: number) => {
  const shuffled = [...icons].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

const createGrid = (icons: string[]): CellType[][] => {
  const allIcons = icons.flatMap((icon) => [icon, icon, icon, icon]) // Each icon appears 4 times
  const shuffled = allIcons.sort(() => 0.5 - Math.random())
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => shuffled.splice(0, GRID_SIZE))
}

const isValidPath = (grid: CellType[][], start: [number, number], end: [number, number]): boolean => {
  const [startRow, startCol] = start
  const [endRow, endCol] = end

  // Check straight line
  if (startRow === endRow) {
    const minCol = Math.min(startCol, endCol)
    const maxCol = Math.max(startCol, endCol)
    for (let col = minCol + 1; col < maxCol; col++) {
      if (grid[startRow][col] !== EMPTY_CELL) return false
    }
    return true
  }

  if (startCol === endCol) {
    const minRow = Math.min(startRow, endRow)
    const maxRow = Math.max(startRow, endRow)
    for (let row = minRow + 1; row < maxRow; row++) {
      if (grid[row][startCol] !== EMPTY_CELL) return false
    }
    return true
  }

  // Check one-corner path
  if (grid[startRow][endCol] === EMPTY_CELL && isValidPath(grid, [startRow, endCol], end)) return true
  if (grid[endRow][startCol] === EMPTY_CELL && isValidPath(grid, [endRow, startCol], end)) return true

  return false
}

const isDeadlock = (grid: CellType[][]) => {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] !== EMPTY_CELL) {
        for (let x = 0; x < GRID_SIZE; x++) {
          for (let y = 0; y < GRID_SIZE; y++) {
            if (grid[x][y] !== EMPTY_CELL && (i !== x || j !== y) && grid[i][j] === grid[x][y]) {
              if (isValidPath(grid, [i, j], [x, y])) {
                return false
              }
            }
          }
        }
      }
    }
  }
  return true
}

export default function LinkGame({ onClose }: LinkGameProps) {
  const { theme } = useTheme()
  const [icons, setIcons] = useState<string[]>([])
  const [state, setState] = useState<GameState>({
    grid: [],
    score: 0,
    timeLeft: 180,
    hints: 3,
  })
  const [selected, setSelected] = useState<[number, number] | null>(null)
  const [showIconSelector, setShowIconSelector] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedIconsString = localStorage.getItem("linkGameIcons") || localStorage.getItem("iconPaths")
    let storedIcons: string[] = []

    if (storedIconsString) {
      try {
        storedIcons = JSON.parse(storedIconsString)
      } catch (error) {
        console.error("Failed to parse icons from localStorage:", error)
      }
    }

    if (storedIcons.length >= ICON_TYPES) {
      setIcons(storedIcons.slice(0, ICON_TYPES))
    } else {
      // Fallback to default icons if not enough stored icons
      setIcons(Array.from({ length: ICON_TYPES }, (_, i) => `/icons/icon${i + 1}.svg`))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading && icons.length >= ICON_TYPES) {
      handleReset()
    }
  }, [icons, isLoading])

  const handleCellClick = (row: number, col: number) => {
    if (state.grid[row][col] === EMPTY_CELL) return

    if (selected) {
      const [selectedRow, selectedCol] = selected
      if (selectedRow === row && selectedCol === col) {
        setSelected(null)
        return
      }

      if (
        state.grid[selectedRow][selectedCol] === state.grid[row][col] &&
        isValidPath(state.grid, selected, [row, col])
      ) {
        const newGrid = [...state.grid]
        newGrid[selectedRow][selectedCol] = EMPTY_CELL
        newGrid[row][col] = EMPTY_CELL
        setState((prev) => ({
          ...prev,
          grid: newGrid,
          score: prev.score + 10,
        }))
        setSelected(null)
      } else {
        setSelected([row, col])
      }
    } else {
      setSelected([row, col])
    }
  }

  const handleReset = useCallback(() => {
    let newGrid
    do {
      newGrid = createGrid(icons)
    } while (isDeadlock(newGrid))

    setState({
      grid: newGrid,
      score: 0,
      timeLeft: 180,
      hints: 3,
    })
  }, [icons])

  const handleIconSelection = (selectedIcons: string[]) => {
    setIcons(selectedIcons)
    localStorage.setItem("linkGameIcons", JSON.stringify(selectedIcons))
    setState((prev) => ({
      ...prev,
      grid: createGrid(selectedIcons),
    }))
    setShowIconSelector(false)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => ({
        ...prev,
        timeLeft: Math.max(0, prev.timeLeft - 1),
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const cellSize = typeof window !== "undefined" ? (window.innerWidth < 640 ? "w-8 h-8" : "w-10 h-10") : "w-10 h-10"

  return (
    <div
      className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-pink-100 text-black"} max-w-full overflow-hidden`}
    >
      <div className="mb-4 sm:mb-6 text-center">
        <div className="flex justify-center space-x-4 sm:space-x-6">
          <div className="flex flex-col items-center">
            <div className="bg-yellow-200 dark:bg-yellow-700 rounded-full p-3 mb-2">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <p className="text-lg font-bold">{state.score}</p>
            <p className="text-xs">Score</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-red-200 dark:bg-red-700 rounded-full p-3 mb-2">
              <Clock className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
            <p className="text-lg font-bold">{state.timeLeft}</p>
            <p className="text-xs">Time Left</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-200 dark:bg-blue-700 rounded-full p-3 mb-2">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <p className="text-lg font-bold">{state.hints}</p>
            <p className="text-xs">Hints</p>
          </div>
        </div>
      </div>
      <motion.div
        className="grid gap-1 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          maxWidth: typeof window !== "undefined" ? (window.innerWidth < 640 ? "320px" : "400px") : "400px",
        }}
      >
        <AnimatePresence>
          {state.grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                className={`${cellSize} flex items-center justify-center rounded-lg ${
                  selected && selected[0] === rowIndex && selected[1] === colIndex
                    ? "bg-yellow-300 dark:bg-yellow-600"
                    : theme === "dark"
                      ? "bg-gray-700"
                      : "bg-white"
                } shadow-md hover:shadow-lg transition-shadow duration-300`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                layout
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {cell && (
                  <div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-800 dark:to-purple-800">
                    <img src={cell || "/placeholder.svg"} alt="icon" className="w-3/4 h-3/4 object-contain" />
                  </div>
                )}
              </motion.button>
            )),
          )}
        </AnimatePresence>
      </motion.div>
      <div className="mt-4 sm:mt-8 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6">
        <motion.button
          onClick={handleReset}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 transform transition duration-200 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🌟 New Game! 🌟
        </motion.button>
        <motion.button
          onClick={() => setShowIconSelector(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full hover:from-green-600 hover:to-blue-600 transform transition duration-200 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🎨 Choose Cute Icons! 🎨
        </motion.button>
      </div>
      {showIconSelector && (
        <IconSelector
          onSelect={handleIconSelection}
          onClose={() => setShowIconSelector(false)}
          currentIcons={icons}
          iconCount={ICON_TYPES}
        />
      )}
    </div>
  )
}

