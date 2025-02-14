"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { GameState } from "./types"; // 确保导入 GameState 类型

const DEFAULT_ICONS = ["🐶", "🐱", "🐰", "🐼", "🦊", "🐨"];
const GRID_SIZE = 6;
const MIN_MATCH = 3;

type Match3GameProps = {
  initialState: GameState | null; // 明确类型为 GameState | null
  onStateChange: (state: GameState) => void; // 明确类型为 (state: GameState) => void
  customIcons?: string[];
};

const createGrid = (icons: string[]) => {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() =>
      Array(GRID_SIZE)
        .fill(null)
        .map(() => icons[Math.floor(Math.random() * icons.length)]),
    );
};

const checkForMatches = (grid: string[][]) => {
  const matches: [number, number][] = [];

  // Check rows and columns
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE - 2; j++) {
      if (grid[i][j] === grid[i][j + 1] && grid[i][j] === grid[i][j + 2]) {
        matches.push([i, j], [i, j + 1], [i, j + 2]);
      }
      if (grid[j][i] === grid[j + 1][i] && grid[j][i] === grid[j + 2][i]) {
        matches.push([j, i], [j + 1, i], [j + 2, i]);
      }
    }
  }

  return matches;
};

const removeMatches = (grid: string[][], matches: [number, number][], icons: string[]) => {
  const newGrid = [...grid];
  matches.forEach(([row, col]) => {
    for (let i = row; i > 0; i--) {
      newGrid[i][col] = newGrid[i - 1][col];
    }
    newGrid[0][col] = icons[Math.floor(Math.random() * icons.length)];
  });
  return newGrid;
};

const checkForDeadlock = (grid: string[][]) => {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (j < GRID_SIZE - 1) {
        const tempGrid = [...grid.map((row) => [...row])];
        [tempGrid[i][j], tempGrid[i][j + 1]] = [tempGrid[i][j + 1], tempGrid[i][j]];
        if (checkForMatches(tempGrid).length > 0) return false;
      }
      if (i < GRID_SIZE - 1) {
        const tempGrid = [...grid.map((row) => [...row])];
        [tempGrid[i][j], tempGrid[i + 1][j]] = [tempGrid[i + 1][j], tempGrid[i][j]];
        if (checkForMatches(tempGrid).length > 0) return false;
      }
    }
  }
  return true;
};

export default function Match3Game({ initialState, onStateChange, customIcons }: Match3GameProps) {
  const { theme } = useTheme();
  const [icons, setIcons] = useState<string[]>(DEFAULT_ICONS);
  const [gameName, setGameName] = useState("Cute Pet Match 3");

  useEffect(() => {
    // 从 localStorage 加载图标 URL
    const storedIcons = JSON.parse(localStorage.getItem("gameIcons") || []);
    if (storedIcons.length >= 6) {
      setIcons(storedIcons);
      setGameName("Cute AI Icon Match 3");
    } else {
      setIcons(DEFAULT_ICONS);
      setGameName("Cute Pet Match 3");
    }
  }, []);

  const [state, setState] = useState<GameState>(
    initialState || {
      grid: createGrid(icons),
      score: 0,
      moves: 30,
    },
  );

  useEffect(() => {
    onStateChange(state); // 确保传递正确的类型
  }, [state, onStateChange]);

  useEffect(() => {
    const checkAndUpdateGrid = () => {
      const matches = checkForMatches(state.grid);
      if (matches.length > 0) {
        setTimeout(() => {
          const newGrid = removeMatches(state.grid, matches, icons);
          setState((prev) => ({
            ...prev,
            grid: newGrid,
            score: prev.score + matches.length * comboMultiplier * 10,
          }));
          setComboMultiplier((prev) => Math.min(prev + 0.5, 4));
        }, 300);
        return true;
      }
      return false;
    };

    const hasMatches = checkAndUpdateGrid();
    if (!hasMatches) {
      if (checkForDeadlock(state.grid)) {
        setIsShaking(true);
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            grid: createGrid(icons),
          }));
          setIsShaking(false);
        }, 500);
      }
      setComboMultiplier(1);
    }
  }, [state.grid, icons, comboMultiplier]);

  const handleCellClick = (row: number, col: number) => {
    if (selected) {
      if (
        (Math.abs(selected[0] - row) === 1 && selected[1] === col) ||
        (Math.abs(selected[1] - col) === 1 && selected[0] === row)
      ) {
        const newGrid = [...state.grid.map((r) => [...r])];
        [newGrid[selected[0]][selected[1]], newGrid[row][col]] = [newGrid[row][col], newGrid[selected[0]][selected[1]]];
        setState((prev) => ({
          ...prev,
          grid: newGrid,
          moves: prev.moves - 1,
        }));
      }
      setSelected(null);
    } else {
      setSelected([row, col]);
    }
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-pink-100 text-black"}`}
    >
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold mb-2">{gameName}</h1>
        <p className="text-2xl font-bold">Score: {state.score}</p>
        <p className="text-xl">Moves left: {state.moves}</p>
        <p className="text-lg">Combo: x{comboMultiplier.toFixed(1)}</p>
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
                className={`w-12 h-12 flex items-center justify-center text-2xl rounded-lg ${
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
                {icons.includes(cell) && icons[0].startsWith("http") ? (
                  <img src={cell || "/placeholder.svg"} alt="icon" className="w-8 h-8 object-contain" />
                ) : (
                  cell
                )}
              </motion.button>
            )),
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}