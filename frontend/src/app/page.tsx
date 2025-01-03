'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimatedSectionTitle } from '@/components/animated-section-title'
import { motion } from 'framer-motion'
import { BottomNavbar } from '@/components/bottom-navbar'

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL || '';
const TOOLS_PER_CATEGORY = 24

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

interface Category {
  id: string;
  name: string;
}

interface Tool {
  id: string;
  name: string;
  Description: string;
  iconimage: {
    formats: any;
    url: string;
  };
}

export default function HomePage() {
  const [selectedTopTab, setSelectedTopTab] = useState(topTabs[0].id)
  const [selectedEngine, setSelectedEngine] = useState(searchOptions.default[0])
  const [activeSection, setActiveSection] = useState('')
  const [animatingSection, setAnimatingSection] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [toolsByCategory, setToolsByCategory] = useState<Record<string, Tool[]>>({})

  const sectionRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (categories.length > 0) {
      sectionRefs.current = categories.reduce((acc, category) => {
        acc[category.id] = React.createRef<HTMLDivElement>();
        return acc;
      }, {} as Record<string, React.RefObject<HTMLDivElement>>);
      
      categories.forEach(category => {
        fetchToolsForCategory(category.id);
      });
    }
  }, [categories])

  const fetchCategories = async () => {
    try {
      const query = `
        query {
          agitoolcategories {
            id
            name
          }
        }
      `
      const response = await axios.post(`${apiUrl}/graphql`, { query })
      setCategories(response.data.data.agitoolcategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchToolsForCategory = async (categoryId: string) => {
    try {
      const query = `
        query($categoryId: ID!) {
          agitools(
            where: { agitoolcategory: { id: $categoryId } }
            limit: ${TOOLS_PER_CATEGORY}
          ) {
            id
            name
            Description
            iconimage {
              formats
              url
            }
          }
        }
      `
      const response = await axios.post(`${apiUrl}/graphql`, { 
        query,
        variables: { categoryId }
      })
      
      setToolsByCategory(prev => ({
        ...prev,
        [categoryId]: response.data.data.agitools
      }))
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  }

  const scrollToSection = (sectionId: string) => {
    sectionRefs.current[sectionId]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    setAnimatingSection(sectionId)
    setTimeout(() => setAnimatingSection(''), 1000)
  }

  const handleTopTabChange = (value: string) => {
    setSelectedTopTab(value)
    setSelectedEngine(searchOptions[value as keyof typeof searchOptions][0])
  }

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
        { threshold: 0.5 }
      )

      if (sectionRefs.current[category.id]?.current) {
        observer.observe(sectionRefs.current[category.id].current!)
      }

      return observer
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [categories])

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
                  className="flex w-full items-center gap-2 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground text-left transition-colors duration-200 ease-in-out glow-effect"
                >
                  <span className="text-sm">{category.name}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Hero Search */}
            <div className="text-center space-y-6">
              <Image
                src="/images/agientrylogo_large.jpg"
                alt="AI Tools Logo Large"
                width={120}
                height={40}
                className="mx-auto"
              />
              <Tabs value={selectedTopTab} onValueChange={handleTopTabChange} className="w-full max-w-2xl mx-auto">
                <TabsList className="grid w-full grid-cols-4 p-1 rounded-full bg-muted/50 backdrop-blur-sm">
                  {topTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="rounded-full transition-all duration-200 ease-in-out data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-lg"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <div className="relative max-w-2xl mx-auto">
                <Input
                  type="search"
                  placeholder="Search AI tools..."
                  className="w-full pl-4 pr-10 py-3 rounded-full bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
              <Tabs value={selectedEngine} onValueChange={setSelectedEngine} className="w-full max-w-2xl mx-auto">
                <TabsList className="justify-center bg-transparent">
                  {searchOptions[selectedTopTab as keyof typeof searchOptions].map((engine) => (
                    <TabsTrigger
                      key={engine}
                      value={engine}
                      className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:underline transition-all duration-200 ease-in-out"
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
                  className="relative aspect-[2/1] rounded-lg overflow-hidden bg-gradient-to-r from-accent to-accent/50 hover:shadow-lg transition-shadow card-hover-effect glow-effect"
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
                ref={sectionRefs.current[category.id]}
                className="space-y-4 scroll-mt-24"
              >
                <AnimatedSectionTitle 
                  title={category.name} 
                  isActive={animatingSection === category.id}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {toolsByCategory[category.id]?.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/agitool/${tool.id}`}
                      className="block"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-3 p-4 rounded-lg border hover:shadow-md transition-shadow bg-background/50 backdrop-blur-sm card-hover-effect glow-effect"
                      >
                        <Image
                          src={`${apiUrl}${tool.iconimage.formats?.thumbnail?.url || tool.iconimage.url}`}
                          alt={tool.name}
                          width={40}
                          height={40}
                          className="rounded-lg"
                        />
                        <div>
                          <h3 className="font-medium hover:underline">{tool.name}</h3>
                          <p className="text-sm text-muted-foreground">{tool.Description}</p>
                        </div>
                      </motion.div>
                    </Link>
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

