'use client'

import { useParams } from 'next/navigation'
import { ExternalToolInfo } from '@/components/external-tool-info'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { BottomNavbar } from '@/components/bottom-navbar'

interface ToolInfo {
  id: string
  name: string
  description: string
  image: string
  pricing: string
  tags: string[]
  accessLink: string
  codeLink?: string
  author: string
  submissionDate: string
  content: string
}

// Sample data for demonstration
const toolsData: { [key: string]: ToolInfo } = {
  '1': {
    id: '1',
    name: 'AI Image Generator',
    description: 'Generate stunning images with AI',
    image: '/placeholder.svg',
    pricing: 'Free tier available, Pro plans start at $9.99/month',
    tags: ['AI', 'Image Generation', 'Creative'],
    accessLink: 'https://example.com/ai-image-generator',
    codeLink: 'https://github.com/example/ai-image-generator',
    author: 'John Doe',
    submissionDate: '2023-05-15',
    content: `
# AI Image Generator

This tool uses advanced AI algorithms to generate high-quality images based on text descriptions. Whether you're a designer, marketer, or just looking for some creative inspiration, our AI Image Generator can help bring your ideas to life.

## Features

- Text-to-image generation
- Style transfer
- Image editing and manipulation
- Batch processing

## How to Use

1. Enter a detailed description of the image you want to generate
2. Choose a style or artistic influence (optional)
3. Click "Generate" and wait for the AI to create your image
4. Download or further edit the generated image

Our AI Image Generator is constantly learning and improving, so the quality of generated images will continue to get better over time.
    `,
  },
  // Add more tool data as needed
}

const similarToolsData: ToolInfo[] = [
  {
    id: '2',
    name: 'AI Text Summarizer',
    description: 'Summarize long texts quickly and accurately',
    image: '/placeholder.svg',
    pricing: 'Free for up to 100 summaries/month, $4.99/month for unlimited',
    tags: ['AI', 'Text Processing', 'Productivity'],
    accessLink: 'https://example.com/ai-text-summarizer',
    author: 'Jane Smith',
    submissionDate: '2023-05-20',
    content: 'AI Text Summarizer content goes here...',
  },
  {
    id: '3',
    name: 'AI Code Assistant',
    description: 'Get help with coding tasks and bug fixing',
    image: '/placeholder.svg',
    pricing: '$9.99/month for individual developers, team plans available',
    tags: ['AI', 'Coding', 'Developer Tools'],
    accessLink: 'https://example.com/ai-code-assistant',
    codeLink: 'https://github.com/example/ai-code-assistant',
    author: 'Alex Johnson',
    submissionDate: '2023-05-25',
    content: 'AI Code Assistant content goes here...',
  },
]

export default function ToolPage() {
  const params = useParams()
  const toolId = params.id as string

  const tool = toolsData[toolId]

  if (!tool) {
    return <div>Tool not found</div>
  }

  return (
    <><Navigation
    currentPage=""
    showMobileMenu={false}
  />
    <div className="min-h-screen bg-background text-foreground">
      <ExternalToolInfo tool={tool} similarTools={similarToolsData} />
      {/* <Footer /> */}
    </div>
    </>
  )
}

