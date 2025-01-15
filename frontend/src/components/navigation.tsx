'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { ThemeToggle } from '@/components/theme-toggle'
import { MobileMenu } from '@/components/mobile-menu'

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

interface NavLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink = React.memo(({ href, isActive, children }: NavLinkProps) => (
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

  const currentPage = useMemo(() => {
    if (propCurrentPage) return propCurrentPage
    if (pathname.startsWith('/home')) return 'home'
    if (pathname.startsWith('/blog')) return 'blog'
    if (pathname.startsWith('/tools')) return 'tools'
    if (pathname.startsWith('/ai-image')) return 'ai-image'
    return ''
  }, [propCurrentPage, pathname])

  const navLinks = useMemo(() => [
    { href: "/", label: "Home", isActive: currentPage === 'home' },
    { href: "/blog", label: "Blog", isActive: currentPage === 'blog' },
    { href: "/tools", label: "Tools", isActive: currentPage === 'tools' },
    { href: "/ai-image", label: "AI Image", isActive: currentPage === 'ai-image' },
  ], [currentPage])

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
            {navLinks.map(({ href, label, isActive }) => (
              <NavLink key={href} href={href} isActive={isActive}>
                {label}
              </NavLink>
            ))}
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
