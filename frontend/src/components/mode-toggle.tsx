"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Wind } from 'lucide-react'
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const themes = ["light", "dark", "system", "ghibli"]
              const currentIndex = themes.indexOf(theme || "system")
              const nextIndex = (currentIndex + 1) % themes.length
              setTheme(themes[nextIndex])
            }}
            className="relative overflow-hidden button-glow hover-glow"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem]" />}
                {theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem]" />}
                {theme === "system" && <Monitor className="h-[1.2rem] w-[1.2rem]" />}
                {theme === "ghibli" && <Wind className="h-[1.2rem] w-[1.2rem]" />}
              </motion.div>
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="glass-effect">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            Switch Theme
          </motion.div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
