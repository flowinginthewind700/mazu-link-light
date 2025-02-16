"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface SmallFireworkProps {
  onComplete: () => void
}

const SmallFirework: React.FC<SmallFireworkProps> = ({ onComplete }) => {
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const particles = particlesRef.current
    if (!particles) return

    const particleCount = 20
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "absolute w-1 h-1 rounded-full"
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      particles.appendChild(particle)

      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 20 + 10
      const duration = Math.random() * 0.5 + 0.5
      const delay = Math.random() * 0.2

      particle.animate(
        [
          { transform: "translate(-50%, -50%) scale(0)", opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px) scale(1)`,
            opacity: 0,
          },
        ],
        {
          duration: duration * 1000,
          delay: delay * 1000,
          easing: "cubic-bezier(0,0,0.2,1)",
          fill: "forwards",
        },
      )
    }

    const timeout = setTimeout(() => {
      onComplete()
    }, 1000)

    return () => clearTimeout(timeout)
  }, [onComplete])

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div ref={particlesRef} className="w-full h-full relative" />
    </motion.div>
  )
}

export default SmallFirework

