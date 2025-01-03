import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import dynamic from 'next/dynamic'

const inter = Inter({ subsets: ['latin'] })

const Analytics = dynamic(() => import('@/components/ga/GoogleAnalytics'), { ssr: false })

export const metadata: Metadata = {
  title: 'AI Tools Directory',
  description: 'A comprehensive directory of AI tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="futuristic-bg-light dark:futuristic-bg-dark tech-pattern min-h-screen">
            <Navigation />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
