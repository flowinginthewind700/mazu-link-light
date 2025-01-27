import { Metadata } from 'next'
import HomePage from '@/components/home/HomePage'

import { loadSEOConfig } from '@/components/seo/seoConfig'
import { generateMetadata as generateSEOMetadata } from '@/components/seo/SEO'

export async function generateMetadata(): Promise<Metadata> {
  const seoConfig = loadSEOConfig()
  return generateSEOMetadata(seoConfig.home)
}

export default function Page() {
  return <HomePage />
}
