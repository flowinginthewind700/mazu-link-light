"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import IconSelector from "./IconSelector"
import Fireworks from "./Fireworks"

const DEFAULT_ICONS = ["🐶", "🐱", "🐰", "🐼", "🦊", "🐨"]
const GRID_SIZE = 6
const MIN_MATCH = 3
const BOMB_PROBABILITY = 0.05

type CellType = {
  icon: string
  isBomb: boolean
}

type GameState = {
  grid: CellType[][]
  score: number
  moves: number
}

type Match3GameProps = {
  initialState: GameState | null
  onStateChange: (state: GameState) => void
}

const getRandomIcons = (icons: string[], count: number) => {
  const shuffled = [...icons].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

const createGrid = (icons: string[]): CellType[][] => {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() =>
      Array(GRID_SIZE)
        .fill(null)
        .map(() => ({
          icon: icons[Math.floor(Math.random() * icons.length)],
          isBomb: Math.random() < BOMB_PROBABILITY,
        }))
    )
}

const checkForMatches = (grid: CellType[][]) => {
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    return []
  }
  const matches: [number, number][] = []

  // Check rows and columns
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE - 2; j++) {
      if (grid[i][j].icon === grid[i][j + 1].icon && grid[i][j].icon === grid[i][j + 2].icon) {
        matches.push([i, j], [i, j + 1], [i, j + 2])
      }
      if (grid[j][i].icon === grid[j + 1][i].icon && grid[j][i].icon === grid[j + 2][i].icon) {
        matches.push([j, i], [j + 1, i], [j + 2, i])
      }
    }
  }

  return matches
}

const removeMatches = (grid: CellType[][], matches: [number, number][], icons: string[]) => {
  const newGrid = [...grid]
  const bombsToExplode: [number, number][] = []
  const affectedRows: Set<number> = new Set()
  const affectedCols: Set<number> = new Set()

  matches.forEach(([row, col]) => {
    if (newGrid[row][col].isBomb) {
      bombsToExplode.push([row, col])
    }
    for (let i = row; i > 0; i--) {
      newGrid[i][col] = newGrid[i - 1][col]
    }
    newGrid[0][col] = {
      icon: icons[Math.floor(Math.random() * icons.length)],
      isBomb: Math.random() < BOMB_PROBABILITY,
    }

    // Track rows and columns affected by the matches
    affectedRows.add(row)
    affectedCols.add(col)
  })

  return { newGrid, bombsToExplode, affectedRows, affectedCols }
}

const checkForDeadlock = (grid: CellType[][]) => {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (j < GRID_SIZE - 1) {
        const tempGrid = [...grid.map((row) => [...row])]
        ;[tempGrid[i][j], tempGrid[i][j + 1]] = [tempGrid[i][j + 1], tempGrid[i][j]]
        if (checkForMatches(tempGrid).length > 0) return false
      }
      if (i < GRID_SIZE - 1) {
        const tempGrid = [...grid.map((row) => [...row])]
        ;[tempGrid[i][j], tempGrid[i + 1][j]] = [tempGrid[i + 1][j], tempGrid[i][j]]
        if (checkForMatches(tempGrid).length > 0) return false
      }
    }
  }
  return true
}

export default function Match3Game({ initialState, onStateChange }: Match3GameProps) {
  const { theme } = useTheme()
  const [icons, setIcons] = useState<string[]>([])
  const [gameName, setGameName] = useState<string>("Cute Pet Match 3")
  const [state, setState] = useState<GameState>(() => ({
    grid: [],
    score: 0,
    moves: 30,
  }))
  const [selected, setSelected] = useState<[number, number] | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const [comboMultiplier, setComboMultiplier] = useState(1)
  const [showIconSelector, setShowIconSelector] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showFireworks, setShowFireworks] = useState(false)
  const [explodingBombs, setExplodingBombs] = useState<[number, number][]>([])
  
  // New state variables to track affected rows and columns
  const [affectedRows, setAffectedRows] = useState<Set<number>>(new Set())
  const [affectedCols, setAffectedCols] = useState<Set<number>>(new Set())

  const handleReset = useCallback(() => {
    if (icons.length >= 6) {
      setState({
        grid: createGrid(icons),
        score: 0,
        moves: 30,
      })
      setComboMultiplier(1)
      setIsShaking(false)
      setExplodingBombs([])
    }
  }, [icons])

  useEffect(() => {
    const storedIconsString = localStorage.getItem("gameIcons")
    let storedIcons: string[] = []

    if (storedIconsString) {
      try {
        storedIcons = JSON.parse(storedIconsString)
      } catch (error) {
        console.error("Failed to parse gameIcons from localStorage:", error)
      }
    }

    if (storedIcons.length >= 6) {
      const selectedIcons = getRandomIcons(storedIcons, 6)
      setIcons(selectedIcons)
      setGameName("Cute AI Icon Match 3")
    } else {
      setIcons(DEFAULT_ICONS)
      setGameName("Cute Pet Match 3")
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading && icons.length >= 6) {
      handleReset()
    }
  }, [icons, isLoading, handleReset])

  useEffect(() => {
    onStateChange(state)
  }, [state, onStateChange])

  useEffect(() => {
    if (!state.grid || state.grid.length === 0) {
      return
    }

    const checkAndUpdateGrid = () => {
      const matches = checkForMatches(state.grid)
      if (matches.length > 0) {
        setTimeout(() => {
          const { newGrid, bombsToExplode, affectedRows: newAffectedRows, affectedCols: newAffectedCols } = removeMatches(state.grid, matches, icons)
          setState((prev) => ({
            ...prev,
            grid: newGrid,
            score: prev.score + matches.length * comboMultiplier * 10,
          }))
          setComboMultiplier((prev) => Math.min(prev + 0.5, 4))

          // Trigger fireworks effect
          if (matches.length > 3 || comboMultiplier > 1) {
            setShowFireworks(true)
            setTimeout(() => setShowFireworks(false), 5000)
          }

          // Handle bomb explosions
          if (bombsToExplode.length > 0) {
            setExplodingBombs(bombsToExplode)
            setTimeout(() => {
              setExplodingBombs([])
              const adjacentCells = bombsToExplode.flatMap(([row, col]) => [
                [row - 1, col],
                [row + 1, col],
                [row, col - 1],
                [row, col + 1],
              ])
              const validAdjacentCells = adjacentCells.filter(
                ([r, c]) => r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE
              )
              checkAndUpdateGrid()
            }, 500) // Wait for bomb explosion animation to complete
          } else {
            // Check for chain reactions
            const newMatches = checkForMatches(newGrid)
            if (newMatches.length > 0) {
              checkAndUpdateGrid()
            }
          }

          // Set the affected rows and columns for laser effect
          setAffectedRows(newAffectedRows)
          setAffectedCols(newAffectedCols)
        }, 300)
        return true
      }
      return false
    }

    const hasMatches = checkAndUpdateGrid()
    if (!hasMatches) {
      if (checkForDeadlock(state.grid)) {
        setIsShaking(true)
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            grid: createGrid(icons),
          }))
          setIsShaking(false)
        }, 500)
      }
      setComboMultiplier(1)
    }
  }, [state.grid, icons, comboMultiplier])

  const handleIconSelection = (selectedIcons: string[]) => {
    setIcons(selectedIcons)
    localStorage.setItem("gameIcons", JSON.stringify(selectedIcons))
    setState((prev) => ({
      ...prev,
      grid: createGrid(selectedIcons),
    }))
    setShowIconSelector(false)
  }

  const handleCellClick = (row: number, col: number) => {
    if (selected) {
      if (
        (Math.abs(selected[0] - row) === 1 && selected[1] === col) ||
        (Math.abs(selected[1] - col) === 1 && selected[0] === row)
      ) {
        const newGrid = [...state.grid.map((r) => [...r])]
        ;[newGrid[selected[0]][selected[1]], newGrid[row][col]] = [
          newGrid[row][col],
          newGrid[selected[0]][selected[1]],
        ]

        // Check for matches after swapping
        const matches = checkForMatches(newGrid)
        if (matches.length > 0) {
          setState((prev) => ({
            ...prev,
            grid: newGrid,
            moves: prev.moves - 1,
          }))
        } else {
          // If no matches, swap back
          ;[newGrid[selected[0]][selected[1]], newGrid[row][col]] = [
            newGrid[row][col],
            newGrid[selected[0]][selected[1]],
          ]
        }
      }
      setSelected(null)
    } else {
      setSelected([row, col])
    }
  }

  const handleStopFireworks = useCallback(() => {
    setShowFireworks(false)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div
      className={`p-4 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-pink-100 text-black"}`}
    >
      <div className="mb-4 text-center">
        <p className="text-xl">Score: {state.score}</p>
        <p className="text-lg">Moves left: {state.moves}</p>
        <p className="text-md">Combo: x{comboMultiplier.toFixed(1)}</p>
      </div>
      <motion.div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
        animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence>
          {state.grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                className={`w-12 h-12 flex items-center justify-center rounded-lg ${
                  selected && selected[0] === rowIndex && selected[1] === colIndex
                    ? "bg-yellow-300"
                    : theme === "dark"
                    ? "bg-gray-700"
                    : "bg-white"
                } ${cell.isBomb ? "relative overflow-hidden" : ""}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                layout
                initial={{ opacity: 0, scale: 0, rotate: 180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: -180 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <img src={cell.icon || "/placeholder.svg"} alt="icon" className="w-8 h-8 object-contain" />
                {cell.isBomb && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0.7, scale: 0.8 }}
                    animate={{
                      opacity: [0.7, 1, 0.7],
                      scale: [0.8, 1.1, 0.8],
                      rotate: 360,
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-full h-full text-yellow-400"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </motion.div>
                )}
                {explodingBombs.some(([r, c]) => r === rowIndex && c === colIndex) && (
                  <motion.div
                    className="absolute inset-0 bg-red-500 rounded-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                {/* Laser effect for row or column explosions */}
                {(affectedRows.has(rowIndex) || affectedCols.has(colIndex)) && (
                  <motion.div
                    className="absolute inset-0 bg-transparent border-l-4 border-r-4 border-t-4 border-b-4 border-red-500"
                    animate={{
                      opacity: 1,
                      scaleX: 1,
                      scaleY: 1,
                      rotate: 0,
                    }}
                    initial={{
                      opacity: 0,
                      scaleX: 0,
                      scaleY: 0,
                      rotate: -180,
                    }}
                    transition={{ type: "spring", stiffness: 150, damping: 30 }}
                  />
                )}
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </motion.div>
      <div className="mt-4 flex justify-center space-x-4">
        <button onClick={handleReset} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Reset Game
        </button>
        <button
          onClick={() => setShowIconSelector(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Select Icons
        </button>
      </div>
      {showIconSelector && (
        <IconSelector onSelect={handleIconSelection} onClose={() => setShowIconSelector(false)} currentIcons={icons} />
      )}
      {showFireworks && <Fireworks onStop={handleStopFireworks} />}
    </div>
  )
}
