'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Newspaper, Search, Image, PlusCircle, PocketKnife } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Newspaper, label: 'Blog', href: '/blog' },
  { icon: PocketKnife, label: 'Tools', href: '/tools' },
  { icon: Image, label: 'AI Images', href: '/ai-image' },
  // { icon: PlusCircle, label: 'Submit', href: '/submit' },
]

export function BottomNavbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border lg:hidden z-50">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className={cn(
                'flex flex-col items-center p-2 text-foreground hover:text-primary',
                pathname === item.href && 'text-primary font-semibold'
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}