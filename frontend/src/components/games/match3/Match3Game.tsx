"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { GameState } from "./types"; // 确保导入 GameState 类型

const DEFAULT_ICONS = ["🐶", "🐱", "🐰", "🐼", "🦊", "🐨"];
const GRID_SIZE = 6;
const MIN_MATCH = 3;

export type GameState = {
    grid: string[][];
    score: number;
    moves: number;
  };

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

  // 其他逻辑保持不变...
}