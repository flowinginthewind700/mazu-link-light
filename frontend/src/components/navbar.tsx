"use client";

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 glass-effect"
    >
      <div className="container flex h-14 items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mr-4 flex"
        >
          <Link href="/" className="mr-6 flex items-center space-x-2 group">
            <motion.span 
              className="font-bold gradient-text"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Mazu Link
            </motion.span>
          </Link>
        </motion.div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/tools"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover-glow"
              >
                Tools
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover-glow"
              >
                About
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/contact"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover-glow"
              >
                Contact
              </Link>
            </motion.div>
          </nav>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="hover-glow"
          >
            <ModeToggle />
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
} 