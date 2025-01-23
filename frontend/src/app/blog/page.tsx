// app/blog/page.tsx
import { loadSEOConfig } from '@/components/seo/seoConfig'
import { generateMetadata as generateSEOMetadata } from '@/components/seo/SEO'
import BlogPageClient from './BlogPageClient'

export const generateMetadata = () => {
  const seoConfig = loadSEOConfig()
  return generateSEOMetadata(seoConfig.blog)
}

export default function BlogPage() {
  return <BlogPageClient />
}