// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Footer } from '@/components/footer'
import dynamic from 'next/dynamic'
import { BottomNavbar } from '@/components/bottom-navbar'
import { GoogleAdSense } from '@/components/ads/GoogleAdSense'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

const Analytics = dynamic(() => import('@/components/ga/GoogleAnalytics'), { ssr: false })

export const metadata: Metadata = {
  metadataBase: new URL('https://aitools.directory'),
  title: {
    default: 'AI Tools Directory - Discover Latest AI Tools & Technologies',
    template: '%s | AI Tools Directory'
  },
  description: 'Explore the comprehensive directory of AI tools and technologies. Find the best AI solutions for developers, researchers, and enthusiasts. Updated daily with the latest AI innovations.',
  keywords: ['AI tools', 'artificial intelligence', 'machine learning', 'AI directory', 'AI resources', 'AI software', 'AI applications', 'AI development tools'],
  authors: [{ name: 'AI Tools Directory Team' }],
  creator: 'AI Tools Directory',
  publisher: 'AI Tools Directory',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: 'https://aitools.directory',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aitools.directory',
    siteName: 'AI Tools Directory',
    title: 'AI Tools Directory - Discover Latest AI Tools & Technologies',
    description: 'Explore the comprehensive directory of AI tools and technologies. Find the best AI solutions for developers, researchers, and enthusiasts.',
    images: [
      {
        url: 'https://aitools.directory/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Tools Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools Directory - Discover Latest AI Tools & Technologies',
    description: 'Explore the comprehensive directory of AI tools and technologies. Find the best AI solutions for developers, researchers, and enthusiasts.',
    images: ['https://aitools.directory/twitter-image.jpg'],
    creator: '@aitoolsdirectory',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "AI Tools Directory",
              "url": "https://aitools.directory",
              "description": "Comprehensive directory of AI tools and technologies",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://aitools.directory/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Footer />
          <BottomNavbar />
          <Analytics />
          <GoogleAdSense />
        </ThemeProvider>
      </body>
    </html>
  )
}
