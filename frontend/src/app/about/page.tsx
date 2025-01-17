import { Metadata } from 'next'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/navigation';

export const metadata: Metadata = {
  title: 'About AI Tools Directory',
  description: 'Learn more about our AI Tools Directory project',
}

export default function AboutPage() {
  return (
    <><Navigation currentPage="" showMobileMenu={false} />
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">About AI Tools Directory</h1>
      
      <div className="mb-12">
        <svg className="w-full h-64" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="200" fill="#f0f4f8" />
          <circle cx="200" cy="100" r="80" fill="#3b82f6" />
          <path d="M160 100 L240 100 M200 60 L200 140" stroke="white" strokeWidth="8" />
          <circle cx="120" cy="60" r="20" fill="#10b981" />
          <circle cx="280" cy="60" r="20" fill="#f59e0b" />
          <circle cx="120" cy="140" r="20" fill="#ef4444" />
          <circle cx="280" cy="140" r="20" fill="#8b5cf6" />
        </svg>
      </div>

      <div className="space-y-6 text-lg">
        <p>
          Welcome to the AI Tools Directory, an open-source project dedicated to cataloging and showcasing the latest advancements in artificial intelligence tools and technologies.
        </p>
        <p>
          Our mission is to provide a comprehensive, user-friendly platform where developers, researchers, and AI enthusiasts can discover, compare, and learn about various AI tools available in the market.
        </p>
        <p>
          We believe in the power of community and open-source collaboration. That's why our project is freely available on GitHub, allowing anyone to contribute, suggest improvements, or adapt the platform for their own needs.
        </p>
        <div className="flex justify-center mt-8">
          <Button asChild>
            <a href="https://github.com/flowinginthewind700/mazu-link-light" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <Github className="mr-2 h-4 w-4" /> View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </div>
    </>
  )
}

