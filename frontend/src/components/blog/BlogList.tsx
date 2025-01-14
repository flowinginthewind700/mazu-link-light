// components/BlogList.tsx
import { motion } from 'framer-motion'
import { BlogCard } from '@/components/blog-card'
import { BlogPost } from '@/components/blog/types'
import { Eraser } from 'lucide-react'

interface BlogListProps {
  posts: BlogPost[]
  searchQuery: string
  onClearSearch: () => void
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

export const BlogList: React.FC<BlogListProps> = ({ posts, searchQuery, onClearSearch }) => (
  <motion.div
    variants={container}
    initial="hidden"
    animate="visible"
  >
    {searchQuery && (
      <div className="flex justify-center mb-4">
        <button
          onClick={onClearSearch}
          className="flex items-center px-4 py-2 text-sm text-red-500 hover:text-red-700 transition-colors duration-200"
        >
          <Eraser className="w-4 h-4 mr-2" />
          Clear Search Results
        </button>
      </div>
    )}
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <motion.div key={post.id} variants={item} className="w-full">
          <BlogCard post={post} />
        </motion.div>
      ))}
    </div>
  </motion.div>
)
