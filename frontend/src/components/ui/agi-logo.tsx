"use client"

import type { CSSProperties } from "react"

interface AGILogoProps {
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
  theme?: "light" | "dark"
}

export default function AGILogo({
  width = 400,
  height = 300,
  className = "",
  style = {},
  theme = "dark",
}: AGILogoProps) {
  // 深色模式使用青色系渐变
  const darkGradient = {
    start: "#00F5FF",
    mid: "#00BFFF",
    end: "#1E90FF",
  }

  // 浅色模式使用深蓝色系渐变
  const lightGradient = {
    start: "#0066CC",
    mid: "#0033CC",
    end: "#000099",
  }

  const gradient = theme === "dark" ? darkGradient : lightGradient

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        {/* 定义渐变 */}
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={gradient.start} />
          <stop offset="50%" stopColor={gradient.mid} />
          <stop offset="100%" stopColor={gradient.end} />
        </linearGradient>

        {/* 定义动画路径 */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 横线 */}
      <line x1="100" y1="150" x2="300" y2="150" stroke="url(#lineGradient)" strokeWidth="2" filter="url(#glow)">
        <animate attributeName="stroke-width" values="2;3;2" dur="2s" repeatCount="indefinite" />
      </line>

      {/* 曲线 */}
      <path
        d="M100 150 Q 150 220 200 150 Q 250 80 300 150"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#glow)"
      >
        <animate attributeName="stroke-width" values="2;3;2" dur="2s" repeatCount="indefinite" />
      </path>

      {/* AGI文字 */}
      <text
        x="100"
        y="130"
        fill={gradient.mid}
        fontSize="36"
        fontFamily="'Inter', sans-serif"
        fontWeight="bold"
        filter="url(#glow)"
        className="select-none"
      >
        AGI
      </text>

      {/* Entry文字 */}
      <text
        x="220"
        y="190"
        fill={gradient.mid}
        fontSize="36"
        fontFamily="'Inter', sans-serif"
        fontWeight="bold"
        filter="url(#glow)"
        className="select-none"
      >
        Entry
      </text>
    </svg>
  )
}

