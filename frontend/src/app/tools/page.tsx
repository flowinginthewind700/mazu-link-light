'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ToolCard } from '@/components/tool-card'
import { categories } from '@/data/tools-categories'
import { toolsData } from '@/data/tools-data'
import { BottomNavbar } from '@/components/bottom-navbar'
import { Navigation } from '@/components/navigation'

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredTools = selectedCategory === 'all' 
    ? toolsData
    : toolsData.filter(tool => tool.category === selectedCategory)

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  return (
    <><Navigation
    onCategorySelect={handleCategorySelect}
    categories={categories}
    selectedCategory={selectedCategory}
  />
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Categories - Desktop and Mobile */}
          <aside className="mb-6 lg:w-48 lg:flex-shrink-0">
            <div className="flex flex-wrap gap-2 lg:flex-col">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.label}
                </motion.button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <motion.main 
            className="flex-1"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <motion.div key={tool.id} variants={item}>
                  <ToolCard tool={tool} />
                </motion.div>
              ))}
            </div>
          </motion.main>
        </div>
      </div>
      <BottomNavbar />
    </div>
    </>
  )
}

