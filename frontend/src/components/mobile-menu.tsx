'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface Category {
  id: string;
  label: string;
}

interface MobileMenuProps {
  categories: Category[]
  onSelectCategory: (id: string) => void
  currentPage: 'home' | 'blog' | 'tools' | 'ai-image'
  selectedCategory?: string
}

export function MobileMenu({ categories, onSelectCategory, currentPage, selectedCategory }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  const handleSelectCategory = (id: string) => {
    if (currentPage === 'home') {
      // For home page, scroll to the corresponding section
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      // For other pages, use the provided handler
      onSelectCategory(id)
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
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              className="justify-start"
              onClick={() => handleSelectCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

