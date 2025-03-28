import { Metadata } from 'next'
import HomePage from '@/components/home/HomePage'

import { loadSEOConfig } from '@/components/seo/seoConfig'
import { generateMetadata as generateSEOMetadata } from '@/components/seo/SEO'

export async function generateMetadata(): Promise<Metadata> {
  const seoConfig = loadSEOConfig()
  return {
    ...generateSEOMetadata(seoConfig.home),
    alternates: {
      canonical: 'https://aitools.directory',
    },
    openGraph: {
      title: 'AI Tools Directory - Discover Latest AI Tools & Technologies',
      description: 'Explore the comprehensive directory of AI tools and technologies. Find the best AI solutions for developers, researchers, and enthusiasts.',
      url: 'https://aitools.directory',
      siteName: 'AI Tools Directory',
      images: [
        {
          url: 'https://aitools.directory/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'AI Tools Directory',
        },
      ],
    },
  }
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <HomePage />
    </main>
  )
}
