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

        <linearGradient id="cometGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={gradient.start} stopOpacity="0" />
          <stop offset="30%" stopColor={gradient.mid} stopOpacity="0.5" />
          <stop offset="100%" stopColor={gradient.end} stopOpacity="1" />
        </linearGradient>

        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <line 
        x1="20" 
        y1="75" 
        x2="280" 
        y2="75" 
        stroke="url(#lineGradient)" 
        strokeWidth="3" 
        filter="url(#glow)"
      >
        <animate 
          attributeName="stroke-width" 
          values="3;4;3" 
          dur="2s" 
          repeatCount="indefinite" 
        />
      </line>

      <path
        id="cometPath"
        d="M20 75 Q 75 135 150 75 Q 225 15 280 75"
        stroke="url(#lineGradient)"
        strokeWidth="3"
        fill="none"
        filter="url(#glow)"
      >
        <animate 
          attributeName="stroke-width" 
          values="3;4;3" 
          dur="2s" 
          repeatCount="indefinite" 
        />
      </path>

      {/* 彗星主体（椭圆形） */}
      <ellipse 
        rx="8" 
        ry="4" 
        fill="url(#cometGradient)" 
        filter="url(#glow)"
      >
        <animateMotion
          dur="6s"
          repeatCount="indefinite"
          calcMode="linear"
          keyPoints="0;1;0"
          keyTimes="0;0.5;1"
          path="M20 75 Q 75 135 150 75 Q 225 15 280 75"
        />
      </ellipse>

      {/* 彗星拖尾 */}
      <path
        stroke="url(#cometGradient)"
        strokeWidth="5"
        fill="none"
        filter="url(#glow)"
      >
        <animateMotion
          dur="6s"
          repeatCount="indefinite"
          calcMode="linear"
          keyPoints="0;1;0"
          keyTimes="0;0.5;1"
          path="M20 75 Q 75 135 150 75 Q 225 15 280 75"
        />
        <animate
          attributeName="stroke-dasharray"
          values="0 80 30 80; 30 80 0 80; 0 80 30 80"
          keyTimes="0;0.5;1"
          dur="6s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-dashoffset"
          values="0;-80;0"
          keyTimes="0;0.5;1"
          dur="6s"
          repeatCount="indefinite"
        />
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