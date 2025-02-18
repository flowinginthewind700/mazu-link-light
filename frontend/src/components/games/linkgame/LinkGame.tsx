"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Star, Clock, Zap } from "lucide-react"
import IconSelector from "../IconSelector"

const GRID_SIZE = 8 // 增加格子大小
const ICON_TYPES = 8 // 增加图标种类
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
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;
  if (grid[startRow][startCol] !== grid[endRow][endCol]) return false;

  // 检查直接相邻或直线连接
  if (checkStraightLine(start, end, grid)) return true;

  // 检查单拐角连接
  if (checkOneCorner(start, end, grid)) return true;

  // 检查双拐角连接
  if (checkTwoCorners(start, end, grid)) return true;

  return false;
};

// 辅助函数：检查直线路径
const checkStraightLine = (start: [number, number], end: [number, number], grid: CellType[][]): boolean => {
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;

  // 同一行
  if (startRow === endRow) {
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);
    for (let col = minCol + 1; col < maxCol; col++) {
      if (grid[startRow][col] !== EMPTY_CELL) return false;
    }
    return true;
  }

  // 同一列
  if (startCol === endCol) {
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    for (let row = minRow + 1; row < maxRow; row++) {
      if (grid[row][startCol] !== EMPTY_CELL) return false;
    }
    return true;
  }

  return false;
};

// 辅助函数：检查单拐角路径
const checkOneCorner = (start: [number, number], end: [number, number], grid: CellType[][]): boolean => {
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;

  // 拐点1：同一行或同一列
  const corner1 = [startRow, endCol] as [number, number];
  if (grid[corner1[0]][corner1[1]] === EMPTY_CELL) {
    if (checkStraightLine(start, corner1, grid) && checkStraightLine(corner1, end, grid)) {
      return true;
    }
  }

  const corner2 = [endRow, startCol] as [number, number];
  if (grid[corner2[0]][corner2[1]] === EMPTY_CELL) {
    if (checkStraightLine(start, corner2, grid) && checkStraightLine(corner2, end, grid)) {
      return true;
    }
  }

  return false;
};

// 辅助函数：检查双拐角路径
const checkTwoCorners = (start: [number, number], end: [number, number], grid: CellType[][]): boolean => {
  // 需要遍历所有可能的中间点，检查是否存在两个拐角的路径
  // 这里简化处理，检查四个方向的延伸
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;

  // 横向扩展
  for (let col = 0; col < GRID_SIZE; col++) {
    if (col === startCol || col === endCol) continue;
    const corner1 = [startRow, col] as [number, number];
    const corner2 = [endRow, col] as [number, number];
    if (
      grid[corner1[0]][corner1[1]] === EMPTY_CELL &&
      grid[corner2[0]][corner2[1]] === EMPTY_CELL &&
      checkStraightLine(start, corner1, grid) &&
      checkStraightLine(corner1, corner2, grid) &&
      checkStraightLine(corner2, end, grid)
    ) {
      return true;
    }
  }

  // 纵向扩展
  for (let row = 0; row < GRID_SIZE; row++) {
    if (row === startRow || row === endRow) continue;
    const corner1 = [row, startCol] as [number, number];
    const corner2 = [row, endCol] as [number, number];
    if (
      grid[corner1[0]][corner1[1]] === EMPTY_CELL &&
      grid[corner2[0]][corner2[1]] === EMPTY_CELL &&
      checkStraightLine(start, corner1, grid) &&
      checkStraightLine(corner1, corner2, grid) &&
      checkStraightLine(corner2, end, grid)
    ) {
      return true;
    }
  }

  return false;
};

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
  const [linkingEffect, setLinkingEffect] = useState<{ start: [number, number]; end: [number, number]; path: [number, number][] } | null>(null)

  useEffect(() => {
    const storedIconsString = localStorage.getItem("gameIcons") || localStorage.getItem("iconPaths")
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

        // Create a path effect for the connection between the two icons
        const path = getPathBetweenPoints(selected, [row, col], state.grid)
        setLinkingEffect({ start: selected, end: [row, col], path })
        setTimeout(() => setLinkingEffect(null), 1000)
      } else {
        setSelected([row, col])
      }
    } else {
      setSelected([row, col])
    }
  }

  // Function to find the path between two points (start and end)
  const getPathBetweenPoints = (start: [number, number], end: [number, number], grid: CellType[][]): [number, number][] => {
    const path: [number, number][] = [];
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
  
    // 直接直线连接
    if (checkStraightLine(start, end, grid)) {
      if (startRow === endRow) {
        const minCol = Math.min(startCol, endCol);
        const maxCol = Math.max(startCol, endCol);
        for (let col = minCol; col <= maxCol; col++) {
          path.push([startRow, col]);
        }
      } else {
        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        for (let row = minRow; row <= maxRow; row++) {
          path.push([row, startCol]);
        }
      }
      return path;
    }
  
    // 单拐角连接
    if (checkOneCorner(start, end, grid)) {
      let corner: [number, number];
      if (grid[startRow][endCol] === EMPTY_CELL) {
        corner = [startRow, endCol];
      } else {
        corner = [endRow, startCol];
      }
      // 从起点到拐点
      const path1 = getPathBetweenPoints(start, corner, grid);
      // 从拐点到终点，排除拐点重复
      const path2 = getPathBetweenPoints(corner, end, grid).slice(1);
      return [...path1, ...path2];
    }
  
    // 双拐角连接，这里需要找到实际的路径
    // 这里简化处理，假设路径是通过横向或纵向扩展
    // 实际实现可能需要更复杂的路径查找，但为示例，这里假设存在两个拐点
    // 注意：这部分可能需要更复杂的逻辑，这里仅作示例
    // 例如，横向扩展的情况
    for (let col = 0; col < GRID_SIZE; col++) {
      const corner1 = [startRow, col];
      const corner2 = [endRow, col];
      if (
        col !== startCol &&
        col !== endCol &&
        checkStraightLine(start, corner1, grid) &&
        checkStraightLine(corner1, corner2, grid) &&
        checkStraightLine(corner2, end, grid)
      ) {
        const path1 = getPathBetweenPoints(start, corner1, grid);
        const path2 = getPathBetweenPoints(corner1, corner2, grid).slice(1);
        const path3 = getPathBetweenPoints(corner2, end, grid).slice(1);
        return [...path1, ...path2, ...path3];
      }
    }
  
    // 纵向扩展的情况
    for (let row = 0; row < GRID_SIZE; row++) {
      const corner1 = [row, startCol];
      const corner2 = [row, endCol];
      if (
        row !== startRow &&
        row !== endRow &&
        checkStraightLine(start, corner1, grid) &&
        checkStraightLine(corner1, corner2, grid) &&
        checkStraightLine(corner2, end, grid)
      ) {
        const path1 = getPathBetweenPoints(start, corner1, grid);
        const path2 = getPathBetweenPoints(corner1, corner2, grid).slice(1);
        const path3 = getPathBetweenPoints(corner2, end, grid).slice(1);
        return [...path1, ...path2, ...path3];
      }
    }
  
    // 如果未找到路径，返回空（理论上不会发生，因为isValidPath已通过）
    return [];
  };
  

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
                  <motion.div
                    className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-800 dark:to-purple-800"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={cell || "/placeholder.svg"} alt="icon" className="w-3/4 h-3/4 object-contain" />
                  </motion.div>
                )}
              </motion.button>
            )),
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Draw connection line */}
      {linkingEffect && (
        <motion.div
          className="absolute"
          style={{
            top: `${linkingEffect.start[0] * 12}%`,
            left: `${linkingEffect.start[1] * 12}%`,
            width: `${Math.abs(linkingEffect.start[0] - linkingEffect.end[0]) * 12}%`,
            height: `${Math.abs(linkingEffect.start[1] - linkingEffect.end[1]) * 12}%`,
            transformOrigin: "center",
          }}
          animate={{ opacity: 0, scale: 1.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-lg" />
        </motion.div>
      )}

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