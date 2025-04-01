import { Metadata } from "next"

interface GenerateMetadataProps {
  title: string
  description: string
  keywords: string
  path: string
  type?: "article" | "website"
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  images?: {
    url: string
    width: number
    height: number
    alt: string
  }[]
}

export function generateMetadata({
  title,
  description,
  keywords,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  images = [
    {
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "AI Tools Directory",
    },
  ],
}: GenerateMetadataProps): Metadata {
  const baseUrl = "https://mazu-link-light.vercel.app"
  const fullUrl = `${baseUrl}${path}`

  const metadata: Metadata = {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type,
      locale: "en_US",
      siteName: "AI Tools Directory",
      url: fullUrl,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((img) => img.url),
    },
    alternates: {
      canonical: fullUrl,
    },
  }

  if (type === "article") {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      modifiedTime,
      authors,
    }
  }

  return metadata
} 