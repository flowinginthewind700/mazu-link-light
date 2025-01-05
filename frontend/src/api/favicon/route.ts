import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

async function fetchWithBrowserHeaders(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://www.google.com/',
    },
  })
}

async function findFaviconInHtml(html: string, baseUrl: string): Promise<string | null> {
  const $ = cheerio.load(html)
  const iconSelectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
    'link[rel="apple-touch-icon-precomposed"]'
  ]

  for (const selector of iconSelectors) {
    const href = $(selector).attr('href')
    if (href) {
      return new URL(href, baseUrl).href
    }
  }

  return null
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url).searchParams.get('url')
  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  console.log('Received request for favicon:', url)

  try {
    const parsedUrl = new URL(url)
    const domain = parsedUrl.hostname
    const protocol = parsedUrl.protocol

    // Try to fetch favicon.ico directly
    const faviconUrl = `${protocol}//${domain}/favicon.ico`
    console.log('Attempting to fetch favicon from:', faviconUrl)
    
    let response = await fetchWithBrowserHeaders(faviconUrl)
    
    // If favicon.ico fails, try to parse HTML for favicon link
    if (!response.ok) {
      console.log('Direct favicon.ico failed, attempting to parse HTML')
      response = await fetchWithBrowserHeaders(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch HTML from ${url}. Status: ${response.status}`)
      }
      
      const html = await response.text()
      const foundFaviconUrl = await findFaviconInHtml(html, url)
      
      if (foundFaviconUrl) {
        console.log('Found favicon URL in HTML:', foundFaviconUrl)
        response = await fetchWithBrowserHeaders(foundFaviconUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch favicon from ${foundFaviconUrl}. Status: ${response.status}`)
        }
      } else {
        throw new Error('No favicon found in HTML')
      }
    }

    const contentType = response.headers.get('Content-Type')
    if (!contentType || !contentType.includes('image')) {
      throw new Error(`Invalid content type for favicon: ${contentType}`)
    }

    const faviconBuffer = await response.arrayBuffer()
    return new NextResponse(faviconBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error fetching favicon:', error)
    return new NextResponse(`Failed to fetch favicon: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 })
  }
}

