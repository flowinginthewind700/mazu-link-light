"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import IconSelector from "../IconSelector"
import Fireworks from "./Fireworks"
import SmallFirework from "./SmallFirework"
import { Heart, Zap, Star, RefreshCw, Palette } from "lucide-react"

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
        })),
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

const removeMatches = (
  grid: CellType[][],
  matches: [number, number][],
  icons: string[],
): { newGrid: CellType[][]; affectedCells: [number, number][] } => {
  const newGrid = [...grid]
  const bombsToExplode: [number, number][] = []
  const affectedCells: [number, number][] = []

  matches.forEach(([row, col]) => {
    if (newGrid[row][col].isBomb) {
      bombsToExplode.push([row, col])
    }
  })

  bombsToExplode.forEach(([row, col]) => {
    const isRowMatch = matches.some(([r, c]) => r === row && Math.abs(c - col) <= 2)
    const isColMatch = matches.some(([r, c]) => c === col && Math.abs(r - row) <= 2)

    if (isRowMatch) {
      for (let i = 0; i < GRID_SIZE; i++) {
        newGrid[row][i] = {
          icon: icons[Math.floor(Math.random() * icons.length)],
          isBomb: Math.random() < BOMB_PROBABILITY,
        }
        affectedCells.push([row, i])
      }
    }
    if (isColMatch) {
      for (let i = 0; i < GRID_SIZE; i++) {
        newGrid[i][col] = {
          icon: icons[Math.floor(Math.random() * icons.length)],
          isBomb: Math.random() < BOMB_PROBABILITY,
        }
        affectedCells.push([i, col])
      }
    }
  })

  // Remove regular matches
  matches.forEach(([row, col]) => {
    if (!newGrid[row][col].isBomb) {
      for (let i = row; i > 0; i--) {
        newGrid[i][col] = newGrid[i - 1][col]
      }
      newGrid[0][col] = {
        icon: icons[Math.floor(Math.random() * icons.length)],
        isBomb: Math.random() < BOMB_PROBABILITY,
      }
    }
  })

  return { newGrid, affectedCells }
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
  const [fireworkCells, setFireworkCells] = useState<[number, number][]>([])
  const [showSmallFireworks, setShowSmallFireworks] = useState(false)

  const handleReset = useCallback(() => {
    if (icons.length >= 6) {
      setState({
        grid: createGrid(icons),
        score: 0,
        moves: 30,
      })
      setComboMultiplier(1)
      setIsShaking(false)
      setFireworkCells([])
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
        const { newGrid, affectedCells } = removeMatches(state.grid, matches, icons)

        // 触发小烟花效果
        if (affectedCells.length > 0) {
          setFireworkCells(affectedCells)
          setShowSmallFireworks(true)
        }

        // 延迟更新网格，给小烟花效果一些显示时间
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            grid: newGrid,
            score: prev.score + matches.length * comboMultiplier * 10,
          }))
          setComboMultiplier((prev) => Math.min(prev + 0.5, 4))

          // 触发大烟花效果
          if (matches.length > 3 || comboMultiplier > 1) {
            setShowFireworks(true)
            setTimeout(() => setShowFireworks(false), 5000)
          }

          // 检查连锁反应
          const newMatches = checkForMatches(newGrid)
          if (newMatches.length > 0) {
            checkAndUpdateGrid()
          } else {
            setShowSmallFireworks(false)
            setFireworkCells([])
          }
        }, 1000) // 给小烟花效果1秒的显示时间

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

  const handleStopFireworks = useCallback(() => {
    setShowFireworks(false)
  }, [])

  useEffect(() => {
    const handleInterrupt = () => {
      if (showSmallFireworks) {
        setShowSmallFireworks(false)
        setFireworkCells([])
      }
    }

    window.addEventListener("mousemove", handleInterrupt)
    window.addEventListener("click", handleInterrupt)

    return () => {
      window.removeEventListener("mousemove", handleInterrupt)
      window.removeEventListener("click", handleInterrupt)
    }
  }, [showSmallFireworks])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div
      className={`p-4 rounded-2xl shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-pink-100 text-black"}`}
    >
      <div className="mb-6 text-center">
       
        <div className="flex justify-center space-x-6">
          <div className="flex items-center">
            <Heart className="w-6 h-6 mr-2 text-red-500" />
            <p className="text-xl font-semibold">Score: {state.score}</p>
          </div>
          <div className="flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-500" />
            <p className="text-xl font-semibold">Moves: {state.moves}</p>
          </div>
          <div className="flex items-center">
            <Star className="w-6 h-6 mr-2 text-purple-500" />
            <p className="text-xl font-semibold">Combo: x{comboMultiplier.toFixed(1)}</p>
          </div>
        </div>
      </div>
      <div className="w-full max-w-[100vw] px-2 mx-auto mb-6">
        <motion.div
          className="grid gap-[1px] mb-6"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
          animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {state.grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <motion.button
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-full h-full aspect-square flex items-center justify-center ${
                    selected && selected[0] === rowIndex && selected[1] === colIndex ? "bg-yellow-300" : ""
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
                  <img src={cell.icon || "/placeholder.svg"} alt="icon" className="w-full h-full object-contain" />
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
                  {showSmallFireworks && fireworkCells.some(([r, c]) => r === rowIndex && c === colIndex) && (
                    <SmallFirework onComplete={() => {}} />
                  )}
                </motion.button>
              )),
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 flex items-center font-semibold text-lg shadow-md hover:shadow-lg"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Reset Game
        </button>
        <button
          onClick={() => setShowIconSelector(true)}
          className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-300 flex items-center font-semibold text-lg shadow-md hover:shadow-lg"
        >
          <Palette className="w-5 h-5 mr-2" />
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


