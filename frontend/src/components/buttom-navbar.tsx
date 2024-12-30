'use client'

import Link from 'next/link'
import { Home, Newspaper, Search, PlusCircle } from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Newspaper, label: 'Blog', href: '/blog' },
  { icon: Search, label: 'Tools', href: '/tools' },
  { icon: PlusCircle, label: 'Submit', href: '/submit' },
]

export function BottomNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border lg:hidden">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className="flex flex-col items-center p-2 text-foreground hover:text-primary">
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

