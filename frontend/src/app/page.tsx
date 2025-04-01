import { Metadata } from 'next'
import { Hero } from "@/components/home/hero"
import { FeaturedTools } from "@/components/home/featured-tools"
import { LatestBlogs } from "@/components/home/latest-blogs"
import { Newsletter } from "@/components/home/newsletter"

import { loadSEOConfig } from '@/components/seo/seoConfig'
import { generateMetadata as generateSEOMetadata } from '@/components/seo/SEO'

export const metadata: Metadata = {
  title: "AI Tools Directory | Discover the Best AI Tools for Your Needs",
  description: "Explore our comprehensive directory of AI tools. Find the perfect AI solutions for content creation, image generation, coding, and more. Stay updated with the latest AI innovations.",
  keywords: "AI tools, artificial intelligence, AI directory, content creation, image generation, AI solutions, machine learning tools",
  openGraph: {
    title: "AI Tools Directory | Discover the Best AI Tools for Your Needs",
    description: "Explore our comprehensive directory of AI tools. Find the perfect AI solutions for content creation, image generation, coding, and more.",
    type: "website",
    locale: "en_US",
    siteName: "AI Tools Directory",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Tools Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools Directory | Discover the Best AI Tools for Your Needs",
    description: "Explore our comprehensive directory of AI tools. Find the perfect AI solutions for content creation, image generation, coding, and more.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://mazu-link-light.vercel.app",
  },
}

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
