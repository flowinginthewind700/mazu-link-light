'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Facebook, Twitter, Linkedin, Share2 } from 'lucide-react'
import { aiImages, AIImage } from '@/data/ai-images'

export default function AIImageDetailPage() {
  const { id } = useParams()
  const [image, setImage] = useState<AIImage | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const foundImage = aiImages.find(img => img.id === id)
    setImage(foundImage || null)
  }, [id])

  const handleCopyPrompt = () => {
    if (image?.prompt) {
      navigator.clipboard.writeText(image.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!image) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Image not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Image Preview */}
      <div className="rounded-3xl overflow-hidden mb-8 shadow-xl">
        <Image
          src={image.url}
          alt={image.title}
          width={1200}
          height={600}
          className="w-full h-[60vh] object-cover"
        />
      </div>

      {/* Prompt Section */}
      <div className="space-y-6 bg-card p-6 rounded-xl">
        <div>
          <h2 className="text-xl font-semibold mb-2">Prompt</h2>
          <div className="relative">
            <p className="text-muted-foreground pr-20 min-h-[4rem]">
              {image.prompt}
            </p>
            <button
              onClick={handleCopyPrompt}
              className="absolute right-0 top-0 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {image.negativePrompt && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Negative Prompt</h2>
            <p className="text-muted-foreground">
              {image.negativePrompt}
            </p>
          </div>
        )}

        {/* Social Share */}
        <div className="flex gap-4 pt-4 border-t">
          <button className="p-2 rounded-full bg-[#1877f2] text-white hover:bg-[#1877f2]/90">
            <Facebook className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full bg-[#1da1f2] text-white hover:bg-[#1da1f2]/90">
            <Twitter className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full bg-[#0a66c2] text-white hover:bg-[#0a66c2]/90">
            <Linkedin className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full bg-[#ff4500] text-white hover:bg-[#ff4500]/90">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

