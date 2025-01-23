// app/blog/BlogPageClient.tsx
'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { CategorySelect } from '@/components/blog/CategorySelect'
import { BlogList } from '@/components/blog/BlogList'
import { Pagination } from '@/components/blog/Pagination'
import { SearchBar } from '@/components/blog/SearchBar'
import { fetchCategories, fetchBlogPosts, searchBlogPosts } from '@/components/blog/api'
import { Category, BlogPost } from '@/components/blog/types'

const POSTS_PER_PAGE = 9
const EXCLUDED_CATEGORY_IDS = ['1', '4']

export default function BlogPageClient() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<BlogPost[]>([])

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])

  useEffect(() => {
    if (!searchQuery) {
      fetchBlogPosts(selectedCategory, currentPage, POSTS_PER_PAGE, EXCLUDED_CATEGORY_IDS)
        .then(({ posts, totalCount }) => {
          setBlogPosts(posts)
          setTotalPages(Math.ceil(totalCount / POSTS_PER_PAGE))
        })
    }
  }, [selectedCategory, currentPage, searchQuery])

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
    setSearchQuery('')
    setSearchResults([])
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query) {
      const results = await searchBlogPosts(query)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const clearSearchResults = () => {
    setSearchQuery('')
    setSearchResults([])
  }

  return (
    <>
      <Navigation
        onCategorySelect={handleCategorySelect}
        categories={categories}
        selectedCategory={selectedCategory}
        currentPage="blog"
        showMobileMenu={true}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <SearchBar
            onSearch={handleSearch}
            onClearSearch={clearSearchResults}
            searchQuery={searchQuery}
          />
          <div className="lg:flex lg:gap-8">
            <CategorySelect
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
            <main className="flex-1">
              <BlogList
                posts={searchQuery ? searchResults : blogPosts}
                searchQuery={searchQuery}
                onClearSearch={clearSearchResults}
              />
              {!searchQuery && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}