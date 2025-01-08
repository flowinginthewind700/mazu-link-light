'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { cn } from '@/lib/utils'
import { BottomNavbar } from '@/components/bottom-navbar'
import { BlogCard } from '@/components/blog-card'
import dynamic from 'next/dynamic'
import { Navigation } from '@/components/navigation'

const PageViewTracker = dynamic(() => import('@/components/ga/PageViewTracker'), { ssr: false })

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL || '';
const POSTS_PER_PAGE = 9
const EXCLUDED_CATEGORY_IDS = ["1", "4"]; // IDs for market and stock categories

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

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  id: number;
  title: string;
  description: string;
  slug: string;
  date: string;
  category: Category;
  cover: Array<{
    formats: {
      small: {
        url: string;
      };
    };
  }>;
}

export default function BlogPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchBlogPosts()
  }, [selectedCategory, currentPage])

  const fetchCategories = async () => {
    try {
      const query = `
        query {
          categories(where: { id_nin: ${JSON.stringify(EXCLUDED_CATEGORY_IDS)} }) {
            id
            name
            slug
          }
        }
      `
      const response = await axios.post(`${apiUrl}/graphql`, { query })
      const fetchedCategories: Category[] = response.data.data.categories
      setCategories([{ id: 'all', name: 'All', slug: 'all' }, ...fetchedCategories])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchBlogPosts = async () => {
    try {
      let query: string;
      let variables: Record<string, any>;

      if (selectedCategory === 'all') {
        query = `
          query($start: Int!, $limit: Int!) {
            posts(
              where: { category: { id_nin: ${JSON.stringify(EXCLUDED_CATEGORY_IDS)} } }
              start: $start
              limit: $limit
              sort: "date:DESC"
            ) {
              id
              title
              description
              slug
              date
              category {
                id
                name
                slug
              }
              cover {
                formats
              }
            }
            postsConnection(where: { category: { id_nin: ${JSON.stringify(EXCLUDED_CATEGORY_IDS)} } }) {
              aggregate {
                count
              }
            }
          }
        `;
        variables = {
          start: (currentPage - 1) * POSTS_PER_PAGE,
          limit: POSTS_PER_PAGE,
        }
      } else {
        query = `
          query($start: Int!, $limit: Int!, $categoryId: ID!) {
            posts(
              where: { category: { id: $categoryId, id_nin: ${JSON.stringify(EXCLUDED_CATEGORY_IDS)} } }
              start: $start
              limit: $limit
              sort: "date:DESC"
            ) {
              id
              title
              description
              slug
              date
              category {
                id
                name
                slug
              }
              cover {
                formats
              }
            }
            postsConnection(where: { category: { id: $categoryId, id_nin: ${JSON.stringify(EXCLUDED_CATEGORY_IDS)} } }) {
              aggregate {
                count
              }
            }
          }
        `;
        variables = {
          start: (currentPage - 1) * POSTS_PER_PAGE,
          limit: POSTS_PER_PAGE,
          categoryId: selectedCategory,
        }
      }

      const response = await axios.post(`${apiUrl}/graphql`, { query, variables })
      const fetchedPosts: BlogPost[] = response.data.data.posts;
      setBlogPosts(fetchedPosts);
      const totalCount = response.data.data.postsConnection.aggregate.count;
      setTotalPages(Math.ceil(totalCount / POSTS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setBlogPosts([]);
      setTotalPages(0);
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPageRange = () => {
    const range = [];

    if (totalPages <= 9) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      range.push(1);
      let low = Math.max(2, currentPage - 3);
      let high = Math.min(totalPages - 1, currentPage + 3);

      if (currentPage - 1 <= 4) {
        high = 7;
      }

      if (totalPages - currentPage <= 4) {
        low = Math.max(2, totalPages - 6);
      }

      if (low > 2) range.push('...');
      for (let i = low; i <= high; i++) {
        range.push(i);
      }
      if (high < totalPages - 1) range.push('...');

      range.push(totalPages);
    }

    return range;
  }

  const pageNumbersToShow = getPageRange();

  return (
    <>
      <Navigation
        onCategorySelect={handleCategorySelect}
        categories={categories}
        selectedCategory={selectedCategory}
      />
      <div className="min-h-screen bg-background">
        <PageViewTracker />
        <div className="container mx-auto px-4 py-8">
          <div className="lg:flex lg:gap-8">
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

            <motion.main
              className="flex-1"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map((post) => (
                  <motion.div key={post.id} variants={item} className="w-full">
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex justify-center items-center gap-2">
                {pageNumbersToShow.map((page, index) => (
                  typeof page === 'string' ?
                    <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center">...</span> :
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
    </>
  )
}
