'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { ThemeToggle } from '@/components/theme-toggle'
import { MobileMenu } from '@/components/mobile-menu'

interface NavigationProps {
  onCategorySelect?: (categoryId: string) => void;
  selectedCategory?: string;
  categories?: any[]; // 使用实际的类型替换 any
}

export function Navigation({ onCategorySelect, selectedCategory, categories = [] }: NavigationProps) {
  const pathname = usePathname()

  const getCurrentPage = (pathname: string): 'home' | 'blog' | 'tools' | 'ai-image' => {
    if (pathname.startsWith('/blog')) return 'blog'
    if (pathname.startsWith('/tools')) return 'tools'
    if (pathname.startsWith('/ai-image')) return 'ai-image'
    return 'home'
  }

  const currentPage = getCurrentPage(pathname)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden text-xl font-bold sm:inline-block">
              AI Tools Directory
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-primary",
                pathname === "/" ? "text-primary font-semibold" : "text-foreground/60"
              )}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className={cn(
                "transition-colors hover:text-primary",
                pathname.startsWith("/blog") ? "text-primary font-semibold" : "text-foreground/60"
              )}
            >
              Blog
            </Link>
            <Link
              href="/tools"
              className={cn(
                "transition-colors hover:text-primary",
                pathname.startsWith("/tools") ? "text-primary font-semibold" : "text-foreground/60"
              )}
            >
              Tools
            </Link>
            <Link
              href="/ai-image"
              className={cn(
                "transition-colors hover:text-primary",
                pathname.startsWith("/ai-image") ? "text-primary font-semibold" : "text-foreground/60"
              )}
            >
              AI Image
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* You can add a search input here if needed */}
          </div>
          <nav className="flex items-center space-x-2">
            <MobileMenu 
              categories={categories} 
              onSelectCategory={onCategorySelect || (() => {})} 
              currentPage={currentPage}
              selectedCategory={selectedCategory}
            />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

