"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Match3Game from "./Match3Game"
import { Moon, Sun } from "lucide-react"

export default function GameModal({ onClose, customIcons }: { onClose: () => void; customIcons?: string[] }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [gameState, setGameState] = useState(null)

  // 只在客户端加载游戏状态
  useEffect(() => {
    const saved = localStorage.getItem("gameState")
    setGameState(saved ? JSON.parse(saved) : null)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && gameState) {
      localStorage.setItem("gameState", JSON.stringify(gameState))
    }
  }, [gameState, mounted])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`relative rounded-xl p-8 shadow-2xl ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
        {/* 标题栏 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#00aaff] to-[#00fff7] bg-clip-text text-transparent">
            Cute Pet Match3
          </h2>
          
          <div className="flex items-center gap-4">
            {/* 主题切换按钮 */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-[#00aaff] hover:text-[#0099ee] transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-6 h-6" strokeWidth={1.5} />
              ) : (
                <Moon className="w-6 h-6" strokeWidth={1.5} />
              )}
            </button>

            {/* 关闭按钮 */}
            <button 
              onClick={onClose}
              className="text-3xl text-[#00aaff] hover:text-[#0099ee] transition-colors"
            >
              &times;
            </button>
          </div>
        </div>

        {/* 游戏主体 */}
        <div className="border-2 border-[#00aaff]/20 rounded-lg overflow-hidden">
          <Match3Game 
            initialState={gameState} 
            onStateChange={setGameState} 
            customIcons={customIcons} 
          />
        </div>

        {/* 装饰边框 */}
        <div className="absolute inset-0 border-2 border-[#00aaff]/10 rounded-xl pointer-events-none" />
      </div>
    </div>
  )
}
