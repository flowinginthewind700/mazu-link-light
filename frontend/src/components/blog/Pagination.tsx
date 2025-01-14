// components/Pagination.tsx
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageRange = () => {
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
  }

  const pageNumbersToShow = getPageRange()

  return (
    <div className="mt-8 flex justify-center items-center gap-2">
      {pageNumbersToShow.map((page, index) => (
        typeof page === 'string' ?
          <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center">...</span> :
          <motion.button
            key={page}
            onClick={() => onPageChange(page)}
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
  )
}
