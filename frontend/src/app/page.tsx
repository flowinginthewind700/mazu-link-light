import { Metadata } from 'next'
import { Hero } from "@/components/home/hero"
import { FeaturedTools } from "@/components/home/featured-tools"
import { LatestBlogs } from "@/components/home/latest-blogs"
import { Newsletter } from "@/components/home/newsletter"

import { loadSEOConfig } from '@/components/seo/seoConfig'
import { generateMetadata as generateSEOMetadata } from '@/components/seo/SEO'

export async function generateMetadata(): Promise<Metadata> {
  const seoConfig = loadSEOConfig()
  return generateSEOMetadata(seoConfig.home)
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Hero />
      <FeaturedTools />
      <LatestBlogs />
      <Newsletter />
    </main>
  )
}
