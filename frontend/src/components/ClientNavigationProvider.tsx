'use client'

import { NavigationProvider } from '@/components/contexts/NavigationContext'

export function ClientNavigationProvider({ children }: { children: React.ReactNode }) {
  return <NavigationProvider>{children}</NavigationProvider>
}
