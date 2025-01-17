'use client'

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
}

interface DesktopNavBarProps {
  items: NavItem[]
  currentPage: string
}

export function DesktopNavBar({ items, currentPage }: DesktopNavBarProps) {
  const [activeTab, setActiveTab] = useState(currentPage)

  return (
    <div className="hidden md:flex items-center gap-3 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
      {items.map((item) => {
        const isActive = activeTab === item.name.toLowerCase()

        return (
          <Link
            key={item.name}
            href={item.url}
            onClick={() => setActiveTab(item.name.toLowerCase())}
            className={cn(
              "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
              "text-foreground/80 hover:text-primary",
              isActive && "bg-muted text-primary"
            )}
          >
            <span>{item.name}</span>
            {isActive && (
              <motion.div
                layoutId="lamp"
                className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                  <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                  <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                  <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                </div>
              </motion.div>
            )}
          </Link>
        )
      })}
    </div>
  )
}
