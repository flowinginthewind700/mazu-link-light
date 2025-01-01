"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { BottomNavbar } from '@/components/bottom-navbar'
import { AIImageCard } from '@/components/ai-image-card'

// 环境变量
const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL || '';
const IMAGES_PER_PAGE = 12

// 动画配置
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

// 类型接口
interface Category {
  id: string;
  name: string;
}

interface ImageData {
  id: string;
  prompt: string;
  url: string;
}

export default function AIImagePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [exampleData, setExampleData] = useState<ImageData[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchExampleData()
  }, [selectedCategory, currentPage])

  const fetchCategories = async () => {
    try {
      const query = `
        query {
          imagecategories {
            id
            name
          }
        }
      `
      const response = await axios.post(`${apiUrl}/graphql`, { query })
      const fetchedCategories: Category[] = response.data.data.imagecategories
      setCategories([{ id: 'all', name: 'All' }, ...fetchedCategories])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchExampleData = async () => {
    try {
      let query: string;
      let variables: Record<string, any>;

      if (selectedCategory === 'all') {
        query = `
          query($start: Int!, $limit: Int!) {
            t2Iexamples(start: $start, limit: $limit, sort: "id:DESC") {
              id
              prompt
              img {
                url
              }
            }
            t2IexamplesConnection {
              aggregate {
                count
              }
            }
          }
        `
        variables = {
          start: (currentPage - 1) * IMAGES_PER_PAGE,
          limit: IMAGES_PER_PAGE,
        }
      } else {
        query = `
          query($start: Int!, $limit: Int!, $category: ID!) {
            t2Iexamples(
              where: { imagecategory: { id: $category } }
              start: $start
              limit: $limit
              sort: "id:DESC"
            ) {
              id
              prompt
              img {
                url
              }
            }
            t2IexamplesConnection(where: { imagecategory: { id: $category } }) {
              aggregate {
                count
              }
            }
          }
        `
        variables = {
          start: (currentPage - 1) * IMAGES_PER_PAGE,
          limit: IMAGES_PER_PAGE,
          category: selectedCategory,
        }
      }

      const response = await axios.post(`${apiUrl}/graphql`, { query, variables })
      const fetchedData: ImageData[] = response.data.data.t2Iexamples.map((example: any) => ({
        id: example.id,            
        prompt: example.prompt,
        url: `${apiUrl}${example.img[0].url}`,
      }))
      setExampleData(fetchedData)
      const totalCount = response.data.data.t2IexamplesConnection.aggregate.count
      setTotalPages(Math.ceil(totalCount / IMAGES_PER_PAGE))
    } catch (error) {
      console.error('Error fetching example data:', error)
      setExampleData([])
      setTotalPages(0)
    }
  }

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
          {/* 类别 - 桌面和移动端 */}
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
                  {category.name}
                </motion.button>
              ))}
            </div>
          </aside>

          {/* 主要内容 */}
          <motion.main 
            className="flex-1"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {exampleData.map((image) => (
                <motion.div key={image.id} variants={item}>
                  <AIImageCard image={image} />
                </motion.div>
              ))}
            </div>

            {/* 分页 */}
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
