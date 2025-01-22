'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'

export default function FaviconDownloader() {
  const [url, setUrl] = useState('')
  const [favicon, setFavicon] = useState<string | null>(null)
  const [faviconType, setFaviconType] = useState<'svg' | 'png' | 'ico' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getFavicon = async (url: string): Promise<{ url: string; type: 'svg' | 'png' | 'ico' } | null> => {
    try {
      console.log('Attempting to fetch favicon from:', url)
      const response = await fetch(`/api/favicon?url=${encodeURIComponent(url)}`)
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch favicon: ${errorText}`)
      }

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      // 根据 Content-Type 判断 favicon 的类型
      const contentType = response.headers.get('content-type')
      let type: 'svg' | 'png' | 'ico' = 'png' // 默认类型
      if (contentType?.includes('svg')) {
        type = 'svg'
      } else if (contentType?.includes('ico')) {
        type = 'ico'
      }

      return { url: blobUrl, type }
    } catch (error) {
      console.error('Error in getFavicon:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFavicon(null)
    setFaviconType(null)

    let urlToFetch = url.trim()
    if (!/^https?:\/\//i.test(urlToFetch)) {
      urlToFetch = `https://${urlToFetch}`
    }

    try {
      const result = await getFavicon(urlToFetch)
      if (result) {
        setFavicon(result.url)
        setFaviconType(result.type)
      } else {
        throw new Error('Unable to fetch favicon')
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred while fetching the favicon.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (format: 'svg' | 'png' | 'ico') => {
    if (!favicon) return

    if (format === 'svg') {
      // 直接下载 SVG
      const link = document.createElement('a')
      link.href = favicon
      link.download = `favicon.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // 将 SVG 转换为 PNG
      convertSvgToPng(favicon, 144, 144).then((pngUrl) => {
        const link = document.createElement('a')
        link.href = pngUrl
        link.download = `favicon.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    }
  }

  const convertSvgToPng = async (svgUrl: string, width: number, height: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = svgUrl
      img.crossOrigin = 'Anonymous' // 允许跨域

      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Could not create canvas context'))
          return
        }

        // 绘制 SVG 到 canvas
        ctx.drawImage(img, 0, 0, width, height)

        // 将 canvas 转换为 PNG
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to convert canvas to PNG'))
            return
          }
          const pngUrl = URL.createObjectURL(blob)
          resolve(pngUrl)
        }, 'image/png')
      }

      img.onerror = (error) => {
        reject(new Error('Failed to load SVG image'))
      }
    })
  }

  return (
    <>
      <Navigation currentPage="" />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <ToastContainer />
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Favicon Downloader</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Enter website URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Fetching...' : 'Get Favicon'}
                </Button>
              </div>
            </form>

            {favicon && (
              <div className="mt-8 space-y-4">
                <div className="flex justify-center">
                  <Image
                    src={favicon}
                    alt="Favicon"
                    width={144}
                    height={144}
                    className="rounded-lg"
                  />
                </div>
                <div className="flex justify-center space-x-4">
                  {/* 显示下载按钮 */}
                  {faviconType === 'svg' && (
                    <>
                      <Button onClick={() => handleDownload('svg')}>Download SVG</Button>
                      <Button onClick={() => handleDownload('png')}>Download PNG (144x144)</Button>
                    </>
                  )}
                  {faviconType !== 'svg' && (
                    <>
                      <Button onClick={() => handleDownload('png')}>Download PNG</Button>
                      <Button onClick={() => handleDownload('ico')}>Download ICO</Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}