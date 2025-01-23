// app/ai-image/page.tsx
import { loadSEOConfig } from '@/components/seo/seoConfig'
import { generateMetadata as generateSEOMetadata } from '@/components/seo/SEO'
import AIImagePageClient from './AIImagePageClient'

export const generateMetadata = () => {
  const seoConfig = loadSEOConfig()
  return generateSEOMetadata(seoConfig.aiImage) // 假设你的 SEO 配置中有 `aiImage` 部分
}

export default function AIImagePage() {
  return <AIImagePageClient />
}