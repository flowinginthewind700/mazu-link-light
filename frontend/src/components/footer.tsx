import Link from 'next/link'
import { Github, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI Tools Directory</h3>
            <p className="text-sm text-muted-foreground">
              Discover and explore the latest AI tools and technologies.
            </p>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li>
                <a href="mailto:yongtaofu@gmail.com" className="text-sm text-muted-foreground hover:text-primary">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/flowinginthewind700/mazu-link-light" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary flex items-center">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="https://x.com/intent/follow?screen_name=McQueenFu" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary flex items-center">
                  <Twitter className="w-4 h-4 mr-2" />
                  Author's Twitter
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold mb-4">Partners</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://llmstock.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                  LLMStock
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AI Tools Directory. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

