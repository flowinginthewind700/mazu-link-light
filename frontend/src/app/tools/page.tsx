import { Metadata } from 'next'
import { ToolList } from "@/components/tools/tool-list"
import { motion } from "framer-motion"

export const metadata: Metadata = {
  title: "AI Tools Directory | Browse All AI Tools",
  description: "Browse our comprehensive collection of AI tools. Find the perfect AI solutions for content creation, image generation, coding, and more. Compare features and choose the best tools for your needs.",
  keywords: "AI tools directory, artificial intelligence tools, AI solutions, content creation tools, image generation AI, coding AI tools, machine learning tools",
  openGraph: {
    title: "AI Tools Directory | Browse All AI Tools",
    description: "Browse our comprehensive collection of AI tools. Find the perfect AI solutions for content creation, image generation, coding, and more.",
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
    title: "AI Tools Directory | Browse All AI Tools",
    description: "Browse our comprehensive collection of AI tools. Find the perfect AI solutions for content creation, image generation, coding, and more.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://mazu-link-light.vercel.app/tools",
  },
}

"use client"

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">AI Tools Directory</h1>
        <p className="text-xl text-muted-foreground">
          Discover and compare the best AI tools for your needs
        </p>
      </motion.div>
      <ToolList />
    </div>
  )
}
