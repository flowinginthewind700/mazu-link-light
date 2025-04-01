// app/ai-image/page.tsx
import { Metadata } from "next"
import { AIImageList } from "@/components/ai-image/ai-image-list"

export const metadata: Metadata = {
  title: "AI Image Generation Tools | Create Amazing Images with AI",
  description: "Discover the best AI image generation tools. Create stunning artwork, illustrations, and designs using artificial intelligence. Compare features and find the perfect tool for your creative needs.",
  keywords: "AI image generation, AI art tools, image creation AI, AI design tools, artificial intelligence art, AI illustration tools, image generation AI",
  openGraph: {
    title: "AI Image Generation Tools | Create Amazing Images with AI",
    description: "Discover the best AI image generation tools. Create stunning artwork, illustrations, and designs using artificial intelligence.",
    type: "website",
    locale: "en_US",
    siteName: "AI Tools Directory",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Image Generation Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Image Generation Tools | Create Amazing Images with AI",
    description: "Discover the best AI image generation tools. Create stunning artwork, illustrations, and designs using artificial intelligence.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://mazu-link-light.vercel.app/ai-image",
  },
}

export default function AIImagePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">AI Image Generation Tools</h1>
      <AIImageList />
    </div>
  )
}