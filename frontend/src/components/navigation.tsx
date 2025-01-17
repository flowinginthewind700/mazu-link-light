'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { ThemeToggle } from '@/components/theme-toggle'
import { MobileMenu } from '@/components/mobile-menu'
import { motion } from "framer-motion"

interface Category {
  id: string;
  name: string;
  slug?: string;
}

interface NavigationProps {
  onCategorySelect?: (categoryId: string) => void;
  selectedCategory?: string;
  categories?: Category[];
  scrollToCategoryFromMobile?: (categoryId: string) => void;
  currentPage: 'home' | 'blog' | 'tools' | 'ai-image' | '';
  showMobileMenu?: boolean;
}

interface NavItem {
  name: string;
  url: string;
}

const NavLink = React.memo(({ href, isActive, children }: { href: string; isActive: boolean; children: React.ReactNode }) => (
  <Link
    href={href}
    className={cn(
      "transition-colors hover:text-primary",
      isActive ? "text-primary font-semibold" : "text-foreground/60"
    )}
  >
    {children}
  </Link>
))

NavLink.displayName = 'NavLink'

export const Navigation = React.memo(function Navigation({
  onCategorySelect,
  selectedCategory,
  categories = [],
  scrollToCategoryFromMobile,
  currentPage: propCurrentPage,
  showMobileMenu = false
}: NavigationProps) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  const currentPage = useMemo(() => {
    if (propCurrentPage) return propCurrentPage
    if (pathname.startsWith('/home')) return 'home'
    if (pathname.startsWith('/blog')) return 'blog'
    if (pathname.startsWith('/tools')) return 'tools'
    if (pathname.startsWith('/ai-image')) return 'ai-image'
    return ''
  }, [propCurrentPage, pathname])

  useEffect(() => {
    setActiveTab(currentPage)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [currentPage])

  const navItems: NavItem[] = useMemo(() => [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: "Tools", url: "/tools" },
    { name: "AI Image", url: "/ai-image" },
  ], [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden text-xl font-bold sm:inline-block">
              AI Tools Directory
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <div className="flex items-center gap-3 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
              {navItems.map((item) => {
                const isActive = activeTab === item.name.toLowerCase()
                return (
                  <Link
                    key={item.name}
                    href={item.url}
                    onClick={() => setActiveTab(item.name.toLowerCase())}
                    className={cn(
                      "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                      "text-foreground/80 hover:text-primary",
                      isActive && "bg-muted text-primary"
                    )}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="lamp"
                        className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                          <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                          <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                          <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                        </div>
                      </motion.div>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* You can add a search input here if needed */}
          </div>
          <nav className="flex items-center space-x-2">
            {showMobileMenu && (
              <MobileMenu
                categories={categories}
                onSelectCategory={onCategorySelect || (() => {})}
                currentPage={currentPage}
                selectedCategory={selectedCategory}
                scrollToCategoryFromMobile={scrollToCategoryFromMobile}
              />
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
})

Navigation.displayName = 'Navigation'

export default Navigation
