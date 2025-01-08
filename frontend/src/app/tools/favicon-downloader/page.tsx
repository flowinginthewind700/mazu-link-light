'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { BottomNavbar } from '@/components/bottom-navbar'

export default function FaviconDownloader() {
  const [url, setUrl] = useState('')
  const [favicon, setFavicon] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getFavicon = async (url: string): Promise<string | null> => {
    try {
      console.log('Attempting to fetch favicon from:', url)
      const response = await fetch(`/api/favicon?url=${encodeURIComponent(url)}`)
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch favicon: ${errorText}`)
      }
      const blob = await response.blob()
      return URL.createObjectURL(blob)
    } catch (error) {
      console.error('Error in getFavicon:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFavicon(null)

    let urlToFetch = url.trim()
    if (!/^https?:\/\//i.test(urlToFetch)) {
      urlToFetch = `https://${urlToFetch}`
    }

    try {
      const faviconUrl = await getFavicon(urlToFetch)
      if (faviconUrl) {
        setFavicon(faviconUrl)
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

  const handleDownload = (format: 'png' | 'ico') => {
    if (!favicon) return

    const link = document.createElement('a')
    link.href = favicon
    link.download = `favicon.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <><Navigation
    currentPage=""
  />
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
                <Image src={favicon} alt="Favicon" width={64} height={64} className="rounded-lg" />
              </div>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => handleDownload('png')}>Download PNG</Button>
                <Button onClick={() => handleDownload('ico')}>Download ICO</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    <BottomNavbar />
    </>
  )
}
