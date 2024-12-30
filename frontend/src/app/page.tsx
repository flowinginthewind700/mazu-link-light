'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimatedSectionTitle } from '@/components/animated-section-title'
import { categories } from '@/data/categories'
import { motion } from 'framer-motion'
import { BottomNavbar } from '@/components/bottom-navbar'

const topTabs = [
  { id: 'default', label: 'Default' },
  { id: 'search', label: 'Search' },
  { id: 'community', label: 'Community' },
  { id: 'images', label: 'Images' },
]

const searchOptions = {
  default: ['this site', 'google', 'bing', 'baidu', 'Perplexity'],
  search: ['google', 'bing', 'baidu', 'Perplexity'],
  community: ['huggingface', 'github'],
  images: ['civitai', 'openart', 'lexica'],
}

export default function HomePage() {
  const [selectedTopTab, setSelectedTopTab] = useState('default')
  const [selectedEngine, setSelectedEngine] = useState(searchOptions.default[0])
  const [activeSection, setActiveSection] = useState('')
  const [animatingSection, setAnimatingSection] = useState('')

  // Refs for each section
  const sectionRefs = categories.reduce((acc, category) => {
    acc[category.id] = useRef<HTMLDivElement>(null)
    return acc
  }, {} as Record<string, React.RefObject<HTMLDivElement>>)

  // Function to scroll to section
  const scrollToSection = (sectionId: string) => {
    sectionRefs[sectionId]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    setAnimatingSection(sectionId)
    setTimeout(() => setAnimatingSection(''), 1000) // Reset after animation
  }

  // Handle top tab change
  const handleTopTabChange = (value: string) => {
    setSelectedTopTab(value)
    setSelectedEngine(searchOptions[value as keyof typeof searchOptions][0])
  }

  // Use Intersection Observer to detect which section is in view
  useEffect(() => {
    const observers = categories.map(category => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(category.id)
            }
          })
        },
        { threshold: 0.5 } // Trigger when 50% of the section is visible
      )

      if (sectionRefs[category.id].current) {
        observer.observe(sectionRefs[category.id].current!)
      }

      return observer
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-48 space-y-4 sticky top-24 h-fit">
            <nav className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToSection(category.id)}
                  className="flex w-full items-center gap-2 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground text-left"
                >
                  <span className="text-sm">{category.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Hero Search */}
            <div className="text-center space-y-6">
              <Image
                src="/placeholder.svg"
                alt="AI Tools Logo Large"
                width={120}
                height={40}
                className="mx-auto"
              />
              <Tabs value={selectedTopTab} onValueChange={handleTopTabChange} className="w-full max-w-2xl mx-auto">
                <TabsList className="grid w-full grid-cols-4">
                  {topTabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <div className="relative max-w-2xl mx-auto">
                <Input
                  type="search"
                  placeholder="Search AI tools..."
                  className="w-full pl-4 pr-10 py-3 rounded-full"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
              <Tabs value={selectedEngine} onValueChange={setSelectedEngine} className="w-full max-w-2xl mx-auto">
                <TabsList className="justify-center bg-transparent">
                  {searchOptions[selectedTopTab as keyof typeof searchOptions].map((engine) => (
                    <TabsTrigger
                      key={engine}
                      value={engine}
                      className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:underline"
                    >
                      {engine}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Featured Tools */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <motion.div
                  key={item}
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative aspect-[2/1] rounded-lg overflow-hidden bg-gradient-to-r from-accent to-accent/50 hover:shadow-lg transition-shadow"
                >
                  <Image
                    src="/placeholder.svg"
                    alt={`Featured Tool ${item}`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Tool Sections */}
            {categories.map((category) => (
              <div
                key={category.id}
                ref={sectionRefs[category.id]}
                className="space-y-4 scroll-mt-24"
              >
                <AnimatedSectionTitle 
                  title={category.label} 
                  isActive={animatingSection === category.id}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <motion.div
                      key={item}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-3 p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <Image
                        src="/placeholder.svg"
                        alt={`Tool ${item}`}
                        width={40}
                        height={40}
                        className="rounded-lg"
                      />
                      <div>
                        <h3 className="font-medium">Tool Name</h3>
                        <p className="text-sm text-muted-foreground">Tool description goes here...</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>
      {/* Bottom Navbar (mobile only) */}
      <BottomNavbar />
    </div>
  )
}

