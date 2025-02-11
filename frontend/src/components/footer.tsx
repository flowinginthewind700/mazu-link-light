import Link from 'next/link';

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
              <li>
                <Link href="/about" prefetch={false} className="text-sm text-muted-foreground hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" prefetch={false} className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" prefetch={false} className="text-sm text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
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
                <a
                  href="https://github.com/flowinginthewind700/mazu-link-light"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center"
                >
                  <img 
                    src="https://github.githubassets.com/favicons/favicon-dark.svg" 
                    className="w-5 h-5 mr-2" 
                    alt="GitHub"
                  />
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/intent/follow?screen_name=McQueenFu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2 text-[#1DA1F2]"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
                    />
                  </svg>
                  Author's Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/agientry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2 text-[#0088cc]"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.25 6.33l-1.45 6.88c-.2.92-.62 1.15-1.26.72l-3.49-2.58-1.68 1.62c-.18.18-.33.33-.66.33l.24-3.19 6.47-5.86c.27-.27-.06-.42-.42-.15l-8 5.1-3.45-1.08c-.9-.28-.91-.9.18-1.34l13.4-5.17c.75-.3 1.41.18 1.15 1.34z"
                    />
                  </svg>
                  Telegram Channel
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-4">Partners</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://llmstock.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-muted-foreground hover:text-primary flex items-center"
                >
                  <img
                    src="https://llmstock.com/favicon.ico"
                    alt="LLMStock"
                    className="w-5 h-5 mr-2 rounded"
                  />
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
  );
}
