import { Metadata } from 'next'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ToolCard } from '@/components/tool-card'
import { categories } from '@/data/tools-categories'
import { toolsData } from '@/data/tools-data'
import { BottomNavbar } from '@/components/bottom-navbar'
import { Navigation } from '@/components/navigation'

export const metadata: Metadata = {
  title: "AI Tools Directory | Browse All AI Tools",
  description: "Browse our comprehensive collection of AI tools. Find the perfect AI solutions for content creation, image generation, coding, and more. Compare features and choose the best tools for your needs.",
  keywords: "AI tools directory, artificial intelligence tools, AI solutions, content creation tools, image generation AI, coding AI tools, machine learning tools",
  openGraph: {
    title: "AI Tools Directory | Browse All AI Tools",
    description: "Browse our comprehensive collection of AI tools. Find the perfect AI solutions for content creation, image generation, coding, and more.",
    type: "website",
    locale: "en_US",
    siteName: "AI Tools Directory",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Tools Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools Directory | Browse All AI Tools",
    description: "Browse our comprehensive collection of AI tools. Find the perfect AI solutions for content creation, image generation, coding, and more.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://mazu-link-light.vercel.app/tools",
  },
}

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

"use client"

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredTools = selectedCategory === 'all' 
    ? toolsData
    : toolsData.filter(tool => tool.category === selectedCategory)

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  return (
    <>
      <Navigation
        onCategorySelect={handleCategorySelect}
        categories={categories}
        selectedCategory={selectedCategory}
        currentPage="tools"
        showMobileMenu={true}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">AI Tools Directory</h1>
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTools.map((tool) => (
              <motion.div key={tool.id} variants={item}>
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <BottomNavbar currentPage="tools" />
    </>
  )
}
