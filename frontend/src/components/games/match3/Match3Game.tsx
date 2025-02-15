"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import IconSelector from "./IconSelector"

const DEFAULT_ICONS = ["🐶", "🐱", "🐰", "🐼", "🦊", "🐨"]
const GRID_SIZE = 6
const MIN_MATCH = 3

type GameState = {
  grid: string[][]
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

const createGrid = (icons: string[]) => {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() =>
      Array(GRID_SIZE)
        .fill(null)
        .map(() => icons[Math.floor(Math.random() * icons.length)]),
    )
}

const checkForMatches = (grid: string[][]) => {
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    return []
  }
  const matches: [number, number][] = []

  // Check rows and columns
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE - 2; j++) {
      if (grid[i][j] === grid[i][j + 1] && grid[i][j] === grid[i][j + 2]) {
        matches.push([i, j], [i, j + 1], [i, j + 2])
      }
      if (grid[j][i] === grid[j + 1][i] && grid[j][i] === grid[j + 2][i]) {
        matches.push([j, i], [j + 1, i], [j + 2, i])
      }
    }
  }

  return matches
}

const removeMatches = (grid: string[][], matches: [number, number][], icons: string[]) => {
  const newGrid = [...grid]
  matches.forEach(([row, col]) => {
    for (let i = row; i > 0; i--) {
      newGrid[i][col] = newGrid[i - 1][col]
    }
    newGrid[0][col] = icons[Math.floor(Math.random() * icons.length)]
  })
  return newGrid
}

const checkForDeadlock = (grid: string[][]) => {
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

  const handleReset = useCallback(() => {
    if (icons.length >= 6) {
      setState({
        grid: createGrid(icons),
        score: 0,
        moves: 30,
      })
      setComboMultiplier(1)
      setIsShaking(false)
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
          const newGrid = removeMatches(state.grid, matches, icons)
          setState((prev) => ({
            ...prev,
            grid: newGrid,
            score: prev.score + matches.length * comboMultiplier * 10,
          }))
          setComboMultiplier((prev) => Math.min(prev + 0.5, 4))
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
        ;[newGrid[selected[0]][selected[1]], newGrid[row][col]] = [newGrid[row][col], newGrid[selected[0]][selected[1]]]

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

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div
      className={`p-4 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-pink-100 text-black"}`}
    >
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold">{gameName}</h2>
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
                }`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                layout
                initial={{ opacity: 0, scale: 0, rotate: 180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: -180 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <img src={cell || "/placeholder.svg"} alt="icon" className="w-8 h-8 object-contain" />
              </motion.button>
            )),
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
    </div>
  )
}

