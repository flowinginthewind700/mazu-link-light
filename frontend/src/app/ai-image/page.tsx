'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { categories } from '@/data/ai-image-categories'
import { aiImages } from '@/data/ai-images'
import { BottomNavbar } from '@/components/bottom-navbar'
import { AIImageCard } from '@/components/ai-image-card'

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

export default function AIImagePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const imagesPerPage = 12
  const totalPages = Math.ceil(aiImages.length / imagesPerPage)

  const filteredImages = selectedCategory === 'all'
    ? aiImages
    : aiImages.filter(image => image.category === selectedCategory)

  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * imagesPerPage,
    currentPage * imagesPerPage
  )

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedImages.map((image) => (
                <motion.div key={image.id} variants={item}>
                  <AIImageCard image={image} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-md text-sm",
                    currentPage === page
                      ? "bg-primary text-primary-foreground font-bold"
                      : "bg-muted hover:bg-muted/80"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {page}
                </motion.button>
              ))}
            </div>
          </motion.main>
        </div>
      </div>
      <BottomNavbar />
    </div>
  )
}

