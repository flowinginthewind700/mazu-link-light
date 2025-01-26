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
  const darkGradient = {
    start: "#00F5FF",
    mid: "#00BFFF",
    end: "#1E90FF",
  }

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
      viewBox="0 0 300 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={gradient.start} />
          <stop offset="50%" stopColor={gradient.mid} />
          <stop offset="100%" stopColor={gradient.end} />
        </linearGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <line x1="20" y1="75" x2="280" y2="75" stroke="url(#lineGradient)" strokeWidth="3" filter="url(#glow)">
        <animate attributeName="stroke-width" values="3;4;3" dur="2s" repeatCount="indefinite" />
      </line>

      <path
        d="M20 75 Q 75 135 150 75 Q 225 15 280 75"
        stroke="url(#lineGradient)"
        strokeWidth="3"
        fill="none"
        filter="url(#glow)"
      >
        <animate attributeName="stroke-width" values="3;4;3" dur="2s" repeatCount="indefinite" />
      </path>

      <text
        x="20"
        y="55"
        fill={gradient.mid}
        fontSize="40"
        fontFamily="'Inter', sans-serif"
        fontWeight="bold"
        filter="url(#glow)"
        className="select-none"
      >
        AGI
      </text>

      <text
        x="190"
        y="115"
        fill={gradient.mid}
        fontSize="40"
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

