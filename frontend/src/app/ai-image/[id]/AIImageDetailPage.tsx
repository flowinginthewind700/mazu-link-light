'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { Facebook, Twitter, Linkedin, Share2, Search, X, ArrowLeft } from 'lucide-react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import * as Dialog from '@radix-ui/react-dialog'
import { BottomNavbar } from '@/components/bottom-navbar'
import { Navigation } from '@/components/navigation'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { useRouter } from 'next/navigation'

// 导入您已经实现的组件
import { BilibiliEmbed, YouTubeEmbed, VideoEmbed } from '@/components/EmbedComponents'
import { CodeRenderer, BlockNode } from '@/components/MarkdownComponents'

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL

interface ImageDetails {
  id: string
  prompt: string
  url: string
  negativeprompt?: string
  seed?: string
}

const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const ImageZoomDialog: React.FC<{ isOpen: boolean; onClose: () => void; imageUrl: string }> = ({ isOpen, onClose, imageUrl }) => {
  const [dialogSize, setDialogSize] = useState({ width: 'auto', height: 'auto' });

  useEffect(() => {
    if (isOpen && imageUrl) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.onload = () => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;

        let width, height;

        if (imgWidth > screenWidth || imgHeight > screenHeight) {
          const widthRatio = screenWidth / imgWidth;
          const heightRatio = screenHeight / imgHeight;
          const ratio = Math.min(widthRatio, heightRatio) * 0.9; // 90% of the screen
          width = Math.round(imgWidth * ratio);
          height = Math.round(imgHeight * ratio);
        } else {
          width = imgWidth;
          height = imgHeight;
        }

        setDialogSize({ 
          width: `${width}px`, 
          height: `${height}px` 
        });
      };
    }
  }, [isOpen, imageUrl]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/75 z-[100]" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[101] flex items-center justify-center p-4"
          style={{ width: dialogSize.width, height: dialogSize.height }}
        >
          <TransformWrapper>
            <TransformComponent>
              <img
                src={imageUrl}
                alt="Zoomed image"
                className="w-full h-full object-contain rounded-lg shadow-xl"
                loading="lazy"
              />
            </TransformComponent>
          </TransformWrapper>
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default function AIImageDetailPage({ id }: { id: string }) {
  const router = useRouter()
  const [image, setImage] = useState<ImageDetails | null>(null)
  const [copied, setCopied] = useState(false)
  const [showZoom, setShowZoom] = useState(false)
  const [aspectRatio, setAspectRatio] = useState('1 / 1') // 默认为正方形

  useEffect(() => {
    fetchImageDetails()
  }, [id])

  useEffect(() => {
    if (image) {
      const img = document.createElement('img');
      img.onload = () => {
        setAspectRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
      };
      img.src = image.url;
    }
  }, [image]);

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

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const truncatedPrompt = truncateText(image?.prompt || '', 200);
    const text = `Explore Text2Image Example - ${truncatedPrompt} on AGIEntry`;
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
  
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(`${text} ${url}`);
        alert('Text and link copied to clipboard!');
        break;
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setShowZoom(true);
  };

  const components = {
    code: CodeRenderer as any,
    div: ({ node, ...props }: any) => <BlockNode node={node} {...props} />,
    a: ({ node, ...props }: any) => <a {...props} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" />,
    img: ({ node, ...props }: any) => (
      <img
        {...props}
        className="cursor-zoom-in rounded-lg shadow-md my-4"
        onClick={() => handleImageClick(props.src)}
        loading="lazy"
      />
    ),
  };

  if (!image) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Navigation
        currentPage=""
        showMobileMenu={false}
      />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-primary hover:underline"
        >
          <ArrowLeft className="mr-2" size={20} /> Back
        </button>

        {/* Image Preview */}
        <div 
          className="rounded-3xl overflow-hidden mb-8 shadow-xl relative"
          style={{ aspectRatio: aspectRatio }}
        >
          <Image
            src={image.url}
            alt={image.prompt}
            fill
            className="object-contain cursor-pointer"
            onClick={() => handleImageClick(image.url)}
          />
          <button
            onClick={() => handleImageClick(image.url)}
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full backdrop-blur-md bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            title="Zoom Image"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Prompt Section */}
        <div className="space-y-6 bg-card p-6 rounded-xl">
          <div>
            <h2 className="text-xl font-semibold mb-2">Prompt</h2>
            <div className="relative">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={components}
                className="text-muted-foreground pr-20 min-h-[4rem]"
              >
                {image.prompt}
              </ReactMarkdown>
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
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={components}
                className="text-muted-foreground"
              >
                {image.negativeprompt}
              </ReactMarkdown>
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
            <button onClick={() => handleShare('facebook')} className="p-2 rounded-full bg-[#1877f2] text-white hover:bg-[#1877f2]/90">
              <Facebook className="w-5 h-5" />
            </button>
            <button onClick={() => handleShare('twitter')} className="p-2 rounded-full bg-black text-white hover:bg-black/90">
              <Twitter className="w-5 h-5" />
            </button>
            <button onClick={() => handleShare('linkedin')} className="p-2 rounded-full bg-[#0a66c2] text-white hover:bg-[#0a66c2]/90">
              <Linkedin className="w-5 h-5" />
            </button>
            <button onClick={() => handleShare('copy')} className="p-2 rounded-full bg-[#ff4500] text-white hover:bg-[#ff4500]/90">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <ImageZoomDialog
          isOpen={showZoom}
          onClose={() => setShowZoom(false)}
          imageUrl={image.url}
        />
      </div>
    </>
  )
}
