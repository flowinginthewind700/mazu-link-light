import { NextApiRequest, NextApiResponse } from 'next'
import * as cheerio from 'cheerio'
import axios, { AxiosResponse } from 'axios'
import puppeteer from 'puppeteer'

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
const TIMEOUT = 10000 // 10 seconds
const MAX_RETRIES = 2

interface FaviconResult {
  url: string
  buffer: Buffer
  contentType: string
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<AxiosResponse> {
  try {
    return await axios.get(url, {
      timeout: TIMEOUT,
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.google.com/', // 模拟从 Google 跳转
        'Sec-Fetch-Dest': 'image', // 模拟浏览器请求图片
        'Sec-Fetch-Mode': 'no-cors', // 模拟浏览器的跨域请求模式
        'Sec-Fetch-Site': 'cross-site', // 模拟跨站请求
      },
    })
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying fetch for ${url}. Attempts left: ${retries - 1}`)
      return fetchWithRetry(url, retries - 1)
    }
    throw error
  }
}

async function findFaviconInHtml(html: string, baseUrl: string): Promise<string | null> {
  const $ = cheerio.load(html)
  const iconSelectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
    'link[rel="apple-touch-icon-precomposed"]',
    'meta[name="msapplication-TileImage"]'
  ]

  for (const selector of iconSelectors) {
    const href = $(selector).attr('href') || $(selector).attr('content')
    if (href) {
      return new URL(href, baseUrl).href
    }
  }

  return null
}

async function getFaviconWithPuppeteer(url: string): Promise<FaviconResult> {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle2' })

  // 查找 favicon 的 URL
  const faviconUrl = await page.evaluate(() => {
    const icon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]')
    return icon ? (icon as HTMLLinkElement).href : null
  })

  if (!faviconUrl) {
    await browser.close()
    throw new Error('No favicon found in HTML')
  }

  // 使用 axios 下载 favicon
  const response = await axios.get(faviconUrl, {
    responseType: 'arraybuffer',
    headers: {
      'User-Agent': USER_AGENT,
    },
  })

  await browser.close()

  if (response.headers['content-type']?.includes('image')) {
    return {
      url: faviconUrl,
      buffer: Buffer.from(response.data),
      contentType: response.headers['content-type'],
    }
  }

  throw new Error('Failed to fetch favicon')
}

async function getFavicon(url: string): Promise<FaviconResult> {
  const parsedUrl = new URL(url)
  const domain = parsedUrl.hostname
  const protocol = parsedUrl.protocol

  const faviconCandidates = [
    `${protocol}//${domain}/favicon.ico`,
    `${protocol}//${domain}/favicon.png`,
    `${protocol}//${domain}/apple-touch-icon.png`,
    `${protocol}//${domain}/apple-touch-icon-precomposed.png`,
    `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=64`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://${domain}/logo.svg`,
    `https://${domain}/logo.png`,
  ]

  for (const candidateUrl of faviconCandidates) {
    try {
      const response = await fetchWithRetry(candidateUrl)
      if (response.headers['content-type']?.includes('image')) {
        return {
          url: candidateUrl,
          buffer: Buffer.from(response.data),
          contentType: response.headers['content-type'],
        }
      }
    } catch (error) {
      console.log(`Failed to fetch favicon from ${candidateUrl}: ${error}`)
    }
  }

  // If direct attempts fail, try parsing HTML
  try {
    const htmlResponse = await fetchWithRetry(url)
    const html = htmlResponse.data.toString('utf-8')
    const foundFaviconUrl = await findFaviconInHtml(html, url)

    if (foundFaviconUrl) {
      const response = await fetchWithRetry(foundFaviconUrl)
      if (response.headers['content-type']?.includes('image')) {
        return {
          url: foundFaviconUrl,
          buffer: Buffer.from(response.data),
          contentType: response.headers['content-type'],
        }
      }
    }
  } catch (error) {
    console.log(`Failed to fetch or parse HTML for ${url}: ${error}`)
  }

  // Fallback to Puppeteer if all else fails
  try {
    console.log('Fallback to Puppeteer for favicon fetching')
    return await getFaviconWithPuppeteer(url)
  } catch (error) {
    console.log(`Failed to fetch favicon with Puppeteer: ${error}`)
  }

  throw new Error('No valid favicon found')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { url } = req.query
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing URL parameter' })
  }

  console.log(`Received request for favicon: ${url}`)

  try {
    const result = await getFavicon(url)

    res.setHeader('Content-Type', result.contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable') // Cache for 1 day
    res.status(200).send(result.buffer)

    console.log(`Successfully fetched favicon for ${url} from ${result.url}`)
  } catch (error) {
    console.error(`Error fetching favicon for ${url}:`, error)
    res.status(500).json({ error: `Failed to fetch favicon: ${error instanceof Error ? error.message : 'Unknown error'}` })
  }
}