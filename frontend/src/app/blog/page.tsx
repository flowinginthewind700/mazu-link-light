'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { categories, blogPosts } from '@/data/mock-data'
import { categories as blogCategories } from '@/data/blog-categories'
import { BottomNavbar } from '@/components/bottom-navbar'

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

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 9
  const totalPages = 20 // Assuming 20 pages total

  // Generate page numbers to display
  const getPageNumbers = (current: number, total: number) => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, current - 2)
    let end = Math.min(total, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages)

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Remove Navigation component from here */}
      <div className="container mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Categories - Desktop and Mobile */}
          <aside className="mb-6 lg:w-48 lg:flex-shrink-0">
            <div className="flex flex-wrap gap-2 lg:flex-col">
              {blogCategories.map((category) => (
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
            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  className="group rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
                  variants={item}
                >
                  <motion.div 
                    className="aspect-video relative overflow-hidden rounded-t-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </motion.div>
                  <div className="p-4 space-y-2">
                    <h2 className="font-semibold line-clamp-2 text-lg">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                    <time className="text-xs text-muted-foreground">
                      {post.date}
                    </time>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Pagination */}
            <motion.div 
              className="mt-8 flex justify-center items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-md",
                  currentPage === 1 
                    ? "bg-muted/50 cursor-not-allowed" 
                    : "bg-muted hover:bg-muted/80"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="First page"
              >
                <span className="sr-only">First page</span>
                «
              </motion.button>
              <motion.button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-md",
                  currentPage === 1 
                    ? "bg-muted/50 cursor-not-allowed" 
                    : "bg-muted hover:bg-muted/80"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Previous page"
              >
                <span className="sr-only">Previous page</span>
                ‹
              </motion.button>
              {pageNumbers.map((page) => (
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
              <motion.button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-md",
                  currentPage === totalPages 
                    ? "bg-muted/50 cursor-not-allowed" 
                    : "bg-muted hover:bg-muted/80"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Next page"
              >
                <span className="sr-only">Next page</span>
                ›
              </motion.button>
              <motion.button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-md",
                  currentPage === totalPages 
                    ? "bg-muted/50 cursor-not-allowed" 
                    : "bg-muted hover:bg-muted/80"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Last page"
              >
                <span className="sr-only">Last page</span>
                »
              </motion.button>
            </motion.div>
          </motion.main>
        </div>
      </div>
      <BottomNavbar />
    </div>
  )
}

