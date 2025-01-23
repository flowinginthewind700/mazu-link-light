// components/SEO.tsx
import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  canonical: string
  keywords: string
  og: {
    title: string
    url: string
    description: string
    image: string
  }
}

export const generateMetadata = ({ title, description, canonical, keywords, og }: SEOProps): Metadata => {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: og.title,
      description: og.description,
      url: og.url,
      images: [
        {
          url: og.image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: og.title,
      description: og.description,
      images: [og.image],
    },
  }
}