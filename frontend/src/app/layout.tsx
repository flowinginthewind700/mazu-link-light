// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Footer } from '@/components/footer'
import dynamic from 'next/dynamic'
import { BottomNavbar } from '@/components/bottom-navbar'
import { GoogleAdSense } from '@/components/ads/GoogleAdSense'
import { Navbar } from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

const Analytics = dynamic(() => import('@/components/ga/GoogleAnalytics'), { ssr: false })

export const metadata: Metadata = {
  title: 'Mazu Link - AI Tools Directory',
  description: 'Discover and explore the best AI tools for your needs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen bg-background">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
            <div className="absolute inset-0 tech-pattern opacity-5" />
            <div className="relative">
              <Navbar />
              <main className="container py-6">{children}</main>
            </div>
          </div>
        </ThemeProvider>
        <Analytics />
        <BottomNavbar />
        <GoogleAdSense />
      </body>
    </html>
  )
}
