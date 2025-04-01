// app/blog/page.tsx
import { Metadata } from "next"
import { BlogList } from "@/components/blog/blog-list"

export const metadata: Metadata = {
  title: "AI Blog | Latest Insights, Tutorials & News",
  description: "Stay updated with the latest insights, tutorials, and news about AI tools and technologies. Discover how to leverage AI for your projects and business.",
  keywords: "AI blog, artificial intelligence, AI tutorials, AI news, AI insights, machine learning, AI technology",
  openGraph: {
    title: "AI Blog | Latest Insights, Tutorials & News",
    description: "Stay updated with the latest insights, tutorials, and news about AI tools and technologies.",
    type: "website",
    locale: "en_US",
    siteName: "AI Tools Directory",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Blog | Latest Insights, Tutorials & News",
    description: "Stay updated with the latest insights, tutorials, and news about AI tools and technologies.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://mazu-link-light.vercel.app/blog",
  },
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">AI Blog</h1>
      <BlogList />
    </div>
  )
}