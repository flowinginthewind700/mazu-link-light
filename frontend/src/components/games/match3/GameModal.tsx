"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Match3Game from "./Match3Game"
import { Moon, Sun } from "lucide-react"

export default function GameModal({ onClose }: { onClose: () => void }) {
  const { theme, setTheme } = useTheme()
  const [gameState, setGameState] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gameState")
      return saved ? JSON.parse(saved) : null
    }
    return null
  })

  useEffect(() => {
    if (gameState) {
      localStorage.setItem("gameState", JSON.stringify(gameState))
    }
  }, [gameState])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Cute Icon Match 3 Game</h2>
          <div className="flex items-center">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mr-2 sm:mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={onClose} className="text-2xl p-2">
              &times;
            </button>
          </div>
        </div>
        <Match3Game initialState={gameState} onStateChange={setGameState} />
      </div>
    </div>
  )
}


