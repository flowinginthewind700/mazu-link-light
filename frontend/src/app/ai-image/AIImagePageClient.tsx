// app/ai-image/AIImagePageClient.tsx
'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { cn } from '@/lib/utils'
import { BottomNavbar } from '@/components/bottom-navbar'
import { AIImageCard } from '@/components/ai-image-card'
import dynamic from 'next/dynamic'
import { Navigation } from '@/components/navigation'
import Image from 'next/image'
import debounce from 'lodash/debounce'

const PageViewTracker = dynamic(() => import('@/components/ga/PageViewTracker'), { ssr: false })

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL || ''
const IMAGES_PER_PAGE = 12

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
}

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}

interface Category {
  id: string
  name: string
}

interface ImageData {
  id: string
  prompt: string
  url: string
  negativePrompt?: string
}

export default function AIImagePageClient() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [exampleData, setExampleData] = useState<ImageData[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchCategories = useCallback(async () => {
    try {
      const query = `
        query {
          imagecategory1s {
            id
            name
          }
        }
      `
      const response = await axios.post(`${apiUrl}/graphql`, { query })
      const fetchedCategories: Category[] = response.data.data.imagecategory1s
      setCategories([{ id: 'all', name: 'All' }, ...fetchedCategories])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  const fetchExampleData = useCallback(async () => {
    setLoading(true)
    try {
      let query: string
      let variables: Record<string, any>

      if (selectedCategory === 'all') {
        query = `
          query($start: Int!, $limit: Int!) {
            t2Iexamples(start: $start, limit: $limit, sort: "id:DESC") {
              id
              prompt
              img {
                url
              }
              negativeprompt
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
              negativeprompt
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
        negativePrompt: example.negativeprompt,
      }))
      setExampleData(fetchedData)
      const totalCount = response.data.data.t2IexamplesConnection.aggregate.count
      setTotalPages(Math.ceil(totalCount / IMAGES_PER_PAGE))
    } catch (error) {
      console.error('Error fetching example data:', error)
      setExampleData([])
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, currentPage])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchExampleData()
  }, [fetchExampleData])

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const getPageRange = useCallback(() => {
    const range = []

    if (totalPages <= 9) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i)
      }
    } else {
      range.push(1)
      let low = Math.max(2, currentPage - 3)
      let high = Math.min(totalPages - 1, currentPage + 3)

      if (currentPage - 1 <= 4) {
        high = 7
      }

      if (totalPages - currentPage <= 4) {
        low = Math.max(2, totalPages - 6)
      }

      if (low > 2) range.push('...')
      for (let i = low; i <= high; i++) {
        range.push(i)
      }
      if (high < totalPages - 1) range.push('...')

      range.push(totalPages)
    }

    return range
  }, [totalPages, currentPage])

  const pageNumbersToShow = useMemo(() => getPageRange(), [getPageRange])

  return (
    <>
      <Navigation
        onCategorySelect={handleCategorySelect}
        categories={categories}
        selectedCategory={selectedCategory}
        currentPage="ai-image"
        showMobileMenu={true}
      />
      <div className="min-h-screen bg-background">
        <PageViewTracker />
        <div className="container mx-auto px-4 py-8">
          <div className="lg:flex lg:gap-8">
            <aside className="mb-6 lg:w-48 lg:flex-shrink-0">
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
              />
            </aside>

            <motion.main
              className="flex-1"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              <ImageGrid
                loading={loading}
                exampleData={exampleData}
              />

              <Pagination
                pageNumbersToShow={pageNumbersToShow}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </motion.main>
          </div>
        </div>
      </div>
    </>
  )
}

const CategoryList = React.memo(({ categories, selectedCategory, onCategorySelect }: {
  categories: Category[]
  selectedCategory: string
  onCategorySelect: (categoryId: string) => void
}) => (
  <div className="flex flex-wrap gap-2 lg:flex-col">
    {categories.map((category) => (
      <motion.button
        key={category.id}
        onClick={() => onCategorySelect(category.id)}
        className={cn(
          'rounded-full px-4 py-2 text-sm font-medium transition-colors',
          selectedCategory === category.id
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {category.name}
      </motion.button>
    ))}
  </div>
))

const ImageGrid = React.memo(({ loading, exampleData }: {
  loading: boolean
  exampleData: ImageData[]
}) => (
  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <AnimatePresence>
      {loading
        ? Array.from({ length: IMAGES_PER_PAGE }).map((_, index) => (
            <ImagePlaceholder key={index} />
          ))
        : exampleData.map((image) => (
            <motion.div key={image.id} variants={item} className="w-full">
              <AIImageCard image={image} />
            </motion.div>
          ))}
    </AnimatePresence>
  </div>
))

const ImagePlaceholder = () => (
  <motion.div variants={item} className="w-full">
    <div className="relative space-y-5 overflow-hidden rounded-2xl bg-white/5 p-4 shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
      <div className="h-48 w-full rounded-lg bg-white/5">
        <Image
          src="/placeholder.svg"
          alt="Loading..."
          width={400}
          height={400}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-3/5 rounded-lg bg-white/5"></div>
        <div className="h-3 w-4/5 rounded-lg bg-white/10"></div>
      </div>
    </div>
  </motion.div>
)

const Pagination = React.memo(({ pageNumbersToShow, currentPage, onPageChange }: {
  pageNumbersToShow: (number | string)[]
  currentPage: number
  onPageChange: (page: number) => void
}) => {
  const debouncedOnPageChange = debounce(onPageChange, 300)

  return (
    <div className="mt-8 flex justify-center items-center gap-2">
      {pageNumbersToShow.map((page, index) =>
        typeof page === 'string' ? (
          <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center">
            ...
          </span>
        ) : (
          <motion.button
            key={page}
            onClick={() => debouncedOnPageChange(page)}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded-md text-sm',
              currentPage === page
                ? 'bg-primary text-primary-foreground font-bold'
                : 'bg-muted hover:bg-muted/80'
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {page}
          </motion.button>
        )
      )}
    </div>
  )
})

CategoryList.displayName = 'CategoryList'
ImageGrid.displayName = 'ImageGrid'
Pagination.displayName = 'Pagination'