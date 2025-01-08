'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression'
import JSZip from 'jszip'
import { Upload, Download } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Navigation } from '@/components/navigation'
import { BottomNavbar } from '@/components/bottom-navbar'

interface CompressedImage {
  id: string
  originalFile: File
  compressedFile: File
  originalSize: number
  compressedSize: number
  thumbnail: string
  status: 'processing' | 'complete' | 'error'
}

export default function ImageCompressionPage() {
  const [images, setImages] = useState<CompressedImage[]>([])
  const [quality, setQuality] = useState(80)
  const [convertToWebP, setConvertToWebP] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const compressImage = async (file: File): Promise<CompressedImage> => {
    const options = {
      maxSizeMB: 5,
      maxWidthOrHeight: 2048,
      useWebWorker: true,
      fileType: convertToWebP ? 'image/webp' : file.type,
      quality: quality / 100,
    }

    try {
      const compressedFile = await imageCompression(file, options)
      const thumbnail = await createThumbnail(file)
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        originalFile: file,
        compressedFile,
        originalSize: file.size,
        compressedSize: compressedFile.size,
        thumbnail,
        status: 'complete'
      }
    } catch (error) {
      console.error('Error compressing image:', error)
      throw error
    }
  }

  const createThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true)
    const newImages: CompressedImage[] = []

    for (const file of acceptedFiles) {
      try {
        const compressedImage = await compressImage(file)
        newImages.push(compressedImage)
      } catch (error) {
        console.error('Error processing image:', error)
      }
    }

    setImages(prev => [...prev, ...newImages])
    setIsProcessing(false)
  }, [quality, convertToWebP])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 20,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const downloadImage = async (image: CompressedImage) => {
    const link = document.createElement('a')
    const blob = await image.compressedFile.arrayBuffer()
    const url = URL.createObjectURL(new Blob([blob]))
    link.href = url
    link.download = `compressed-${image.originalFile.name}${convertToWebP ? '.webp' : ''}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const downloadAllImages = async () => {
    const zip = new JSZip()

    for (const image of images) {
      const blob = await image.compressedFile.arrayBuffer()
      zip.file(`compressed-${image.originalFile.name}${convertToWebP ? '.webp' : ''}`, blob)
    }

    const content = await zip.generateAsync({ type: 'blob' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(content)
    link.download = 'compressed-images.zip'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  const getTotalSavings = () => {
    const originalTotal = images.reduce((acc, img) => acc + img.originalSize, 0)
    const compressedTotal = images.reduce((acc, img) => acc + img.compressedSize, 0)
    const savedBytes = originalTotal - compressedTotal
    const savedPercentage = ((savedBytes / originalTotal) * 100) || 0
    return Math.round(savedPercentage)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  return (
    <><Navigation
    currentPage=""
  />
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">zippic</h1>
        <p className="text-xl text-muted-foreground">
          Smart Image Compression for Faster Websites
        </p>
      </div>

      <div 
        {...getRootProps()} 
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg mb-2">Drop your images here!</p>
        <p className="text-sm text-muted-foreground">Up to 20 images, max 5 MB each.</p>
      </div>

      <div className="mt-8 space-y-6">
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Advanced Settings</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Quality ({quality}%)</Label>
              </div>
              <Slider
                value={[quality]}
                onValueChange={([value]) => setQuality(value)}
                min={0}
                max={100}
                step={1}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Convert to WebP</Label>
              <Switch
                checked={convertToWebP}
                onCheckedChange={setConvertToWebP}
              />
            </div>
          </div>
        </div>

        {images.length > 0 && (
          <div className="bg-card rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  Saved you {getTotalSavings()}%
                </h2>
                <p className="text-sm text-muted-foreground">
                  {images.length} images optimized
                </p>
              </div>
              <Button onClick={downloadAllImages} disabled={isProcessing}>
                <Download className="w-4 h-4 mr-2" />
                Download all images
              </Button>
            </div>

            <div className="space-y-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={image.thumbnail}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-medium mb-1">
                        {image.originalFile.name}
                        {convertToWebP ? '.webp' : ''}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(image.originalSize)} → {formatFileSize(image.compressedSize)}{' '}
                        <span className="text-green-500">
                          ({Math.round((1 - image.compressedSize / image.originalSize) * 100)}%)
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadImage(image)}
                      disabled={image.status === 'processing'}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-green-500">
                      {image.status === 'complete' ? 'Complete' : 'Processing...'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    <BottomNavbar />
    </>
  )
}

