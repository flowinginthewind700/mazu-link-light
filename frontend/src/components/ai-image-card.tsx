'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Info, Search, Sparkles, Copy, Check, X } from 'lucide-react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import * as Dialog from '@radix-ui/react-dialog'

interface AIImageProps {
  id: string
  prompt: string
  url: string
  negativePrompt?: string
}

interface AIImageCardProps {
  image: AIImageProps
}

export function AIImageCard({ image }: AIImageCardProps) {
  const [showInfo, setShowInfo] = useState(false)
  const [showZoom, setShowZoom] = useState(false)
  const [copied, setCopied] = useState(false)
  const [dialogSize, setDialogSize] = useState({ width: 'auto', height: 'auto' });
  const router = useRouter()

  useEffect(() => {
    if (showZoom) {
      const img: HTMLImageElement = new Image();
      img.src = image.url;
      img.onload = () => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const imgWidth = img.width;
        const imgHeight = img.height;
  
        let width, height;
  
        if (imgWidth > screenWidth || imgHeight > screenHeight) {
          const widthRatio = screenWidth / imgWidth;
          const heightRatio = screenHeight / imgHeight;
          const ratio = Math.min(widthRatio, heightRatio) * 0.9; // 90% of the screen
          width = imgWidth * ratio;
          height = imgHeight * ratio;
        } else {
          width = imgWidth;
          height = imgHeight;
        }
  
        setDialogSize({ width, height });
      };
      img.onerror = () => {
        console.error('Image failed to load:', image.url);
      };
    }
  }, [showZoom, image]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group rounded-2xl overflow-hidden">
      <Image 
        src={image.url} 
        alt={image.prompt}
        width={300}
        height={200}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      {/* Overlay buttons */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <button
          onClick={() => setShowInfo(true)}
          className="w-10 h-10 rounded-full backdrop-blur-md bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          title="Image Info"
        >
          <Info className="w-5 h-5 text-white" />
        </button>
        <Dialog.Root open={showZoom} onOpenChange={setShowZoom}>
          <Dialog.Trigger asChild>
            <button
              className="w-10 h-10 rounded-full backdrop-blur-md bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              title="Zoom Image"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/75 z-[100]" />
            <Dialog.Content
              className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[101] flex items-center justify-center p-4"
              style={{ width: dialogSize.width, height: dialogSize.height }}
            >
              <TransformWrapper>
                <TransformComponent>
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-full object-contain rounded-lg shadow-xl"
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
        <button
          onClick={() => router.push(`/ai-image/${image.id}`)}
          className="w-10 h-10 rounded-full backdrop-blur-md bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          title="View Details"
        >
          <Sparkles className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Info Dialog */}
      <Dialog.Root open={showInfo} onOpenChange={setShowInfo}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[100]" />
          <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[101] bg-background rounded-lg max-w-2xl w-[90vw] max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 space-y-6 flex-1 overflow-auto">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Image Information</h2>
                <Dialog.Close asChild>
                  <button
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Prompt</h3>
                <div className="relative border rounded-lg p-4 bg-muted/50">
                  <p className="pr-12 whitespace-pre-wrap text-muted-foreground">
                    {image.prompt}
                  </p>
                  <button
                    onClick={() => handleCopy(image.prompt)}
                    className="absolute right-2 top-2 p-2 hover:bg-muted rounded-md"
                    title="Copy prompt"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              {image.negativePrompt && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Negative Prompt</h3>
                  <div className="relative border rounded-lg p-4 bg-muted/50">
                    <p className="pr-12 whitespace-pre-wrap text-muted-foreground">
                      {image.negativePrompt}
                    </p>
                    <button
                      onClick={() => handleCopy(image.negativePrompt!)}
                      className="absolute right-2 top-2 p-2 hover:bg-muted rounded-md"
                      title="Copy negative prompt"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
