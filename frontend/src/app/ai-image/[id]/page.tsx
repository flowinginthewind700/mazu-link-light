'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { Facebook, Twitter, Linkedin, Share2 } from 'lucide-react'

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL

interface ImageDetails {
  id: string
  prompt: string
  url: string
  negativeprompt?: string
  seed?: string
}

export default function AIImageDetailPage() {
  const { id } = useParams()
  const [image, setImage] = useState<ImageDetails | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchImageDetails()
  }, [id])

  const fetchImageDetails = async () => {
    try {
      const query = `
        query($id: ID!) {
          t2Iexample(id: $id) {
            id
            prompt
            negativeprompt
            seed
            img {
              url
            }
          }
        }
      `
      const variables = { id }
      const response = await axios.post(`${apiUrl}/graphql`, { query, variables })
      const fetchedImage = response.data.data.t2Iexample
      setImage({
        id: fetchedImage.id,
        prompt: fetchedImage.prompt,
        url: `${apiUrl}${fetchedImage.img[0].url}`,
        negativeprompt: fetchedImage.negativeprompt,
        seed: fetchedImage.seed,
      })
    } catch (error) {
      console.error('Error fetching image details:', error)
    }
  }

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
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Image Preview */}
      <div className="rounded-3xl overflow-hidden mb-8 shadow-xl">
        <Image
          src={image.url}
          alt={image.prompt}
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

        {image.negativeprompt && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Negative Prompt</h2>
            <p className="text-muted-foreground">
              {image.negativeprompt}
            </p>
          </div>
        )}

        {image.seed && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Seed</h2>
            <p className="text-muted-foreground">
              {image.seed}
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

