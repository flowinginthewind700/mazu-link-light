import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils"

interface AnimatedSectionTitleProps {
  title: string
  isActive: boolean
}

export function AnimatedSectionTitle({ title, isActive }: AnimatedSectionTitleProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (isActive) {
      setAnimate(true)
      const timer = setTimeout(() => setAnimate(false), 1000) // Animation duration
      return () => clearTimeout(timer)
    }
  }, [isActive])

  return (
    <h2 
      className={cn(
        "text-lg font-semibold flex items-center gap-2 transition-all duration-300 ease-in-out",
        animate && "text-primary scale-105"
      )}
    >
      <span className="w-2 h-2 bg-primary rounded-full"></span>
      {title}
    </h2>
  )
}

