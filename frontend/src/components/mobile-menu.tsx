'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface Category {
  id: string;
  name: string;
  slug?: string;
}

interface MobileMenuProps {
  categories: Category[]
  onSelectCategory: (id: string) => void
  currentPage: 'home' | 'blog' | 'tools' | 'ai-image'
  selectedCategory?: string
  scrollToCategoryFromMobile?: (categoryId: string) => void
}

export function MobileMenu({ 
  categories, 
  onSelectCategory, 
  currentPage, 
  selectedCategory,
  scrollToCategoryFromMobile 
}: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const categoriesArray = Array.isArray(categories) ? categories : [];

  const handleSelectCategory = (category: Category) => {
    if (currentPage === 'home' && scrollToCategoryFromMobile) {
      scrollToCategoryFromMobile(category.id);
    } else {
      onSelectCategory(category.id)
    }
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <h2 className="text-lg font-semibold mb-4">
          {currentPage === 'home' 
            ? 'AI Tools Categories' 
            : currentPage === 'blog' 
              ? 'Blog Categories' 
              : currentPage === 'tools'
                ? 'Tools Categories'
                : 'AI Image Categories'}
        </h2>
        <nav className="flex flex-col gap-4">
          {categoriesArray.length === 0 && (
            <p className="text-muted-foreground p-2">No categories available</p>
          )}
          {categoriesArray.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              className="justify-start"
              onClick={() => handleSelectCategory(category)}
            >
              {category.name}
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
