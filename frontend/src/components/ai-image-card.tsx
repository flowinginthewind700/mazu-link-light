'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Info, Search, Sparkles, Copy, Check, X } from 'lucide-react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import * as Dialog from '@radix-ui/react-dialog'
import { useAnalyticsEvent } from '@/components/ga/useAnalyticsEvent'

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
  const [dialogSize, setDialogSize] = useState<{ width: string; height: string }>({ width: 'auto', height: 'auto' });
  const [aspectRatio, setAspectRatio] = useState('1 / 1') // 默认为正方形
  const router = useRouter()
  const trackEvent = useAnalyticsEvent()

  useEffect(() => {
    const img = document.createElement('img');
    img.onload = () => {
      setAspectRatio(`${img.width} / ${img.height}`);
    };
    img.src = image.url;
  }, [image.url]);

  useEffect(() => {
    if (showZoom) {
      const img = document.createElement('img') as HTMLImageElement;
      img.src = image.url;
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
      img.onerror = () => {
        console.error('Image failed to load:', image.url);
      };
    }
  }, [showZoom, image]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    trackEvent({
      action: 'copy_text',
      category: 'engagement',
      label: image.id
    })
  }

  const handleInfoClick = () => {
    setShowInfo(true)
    trackEvent({
      action: 'view_image_info',
      category: 'engagement',
      label: image.id
    })
  }

  const handleZoomClick = () => {
    setShowZoom(true)
    trackEvent({
      action: 'zoom_image',
      category: 'engagement',
      label: image.id
    })
  }

  const handleViewDetails = () => {
    trackEvent({
      action: 'view_image_details',
      category: 'navigation',
      label: image.id
    })
    router.push(`/ai-image/${image.id}`)
  }

  return (
    <div 
      className="relative group rounded-2xl overflow-hidden" 
      style={{ aspectRatio: aspectRatio }}
      onDoubleClick={handleZoomClick} // 双击触发放大
    >
      <Image 
        src={image.url} 
        alt={image.prompt}
        fill
        className="object-contain transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Overlay buttons */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <button
          onClick={handleInfoClick}
          className="w-10 h-10 rounded-full backdrop-blur-md bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          title="Image Info"
        >
          <Info className="w-5 h-5 text-white" />
        </button>
        <Dialog.Root open={showZoom} onOpenChange={setShowZoom}>
          <Dialog.Trigger asChild>
            <button
              onClick={handleZoomClick}
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
          onClick={handleViewDetails}
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