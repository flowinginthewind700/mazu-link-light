// components/CategorySelect.tsx
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Category } from '@/components/blog/types'

interface CategorySelectProps {
  categories: Category[]
  selectedCategory: string
  onCategorySelect: (categoryId: string) => void
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => (
  <aside className="mb-6 lg:w-48 lg:flex-shrink-0">
    <div className="flex flex-wrap gap-2 lg:flex-col">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
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
)
