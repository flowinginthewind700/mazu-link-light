'use client'

import React, { useRef, useState, useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import axios from 'axios'
import { HeroSearch } from './HeroSearch'
import { FeaturedSection } from './FeaturedSection'
import { ToolCard } from './ToolCard'
import { AnimatedSectionTitle } from '@/components/animated-section-title'
import { BottomNavbar } from '@/components/bottom-navbar'
import { Category, Tool } from './types'
import { Navigation } from '@/components/navigation'

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL
const TOOLS_PER_CATEGORY = 24

export default function HomePage() {
  const [selectedTopTab, setSelectedTopTab] = useState('default')
  const [selectedEngine, setSelectedEngine] = useState('this site')
  const [activeSection, setActiveSection] = useState('')
  const [animatingSection, setAnimatingSection] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [toolsByCategory, setToolsByCategory] = useState<Record<string, Tool[]>>({})
  const [selectedFeatureTab, setSelectedFeatureTab] = useState('agi-tools')

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

  const handleCategorySelect = (categoryId: string) => {
    scrollToSection(categoryId);
  };

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
accessLink
internalPath
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AGI Entry",
    "url": "https://agientry.com",
    "description": "A comprehensive directory of AI and AGI tools including chatbots, image generators, and coding assistants.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://agientry.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
    <Navigation
        onCategorySelect={handleCategorySelect}
        categories={categories}
      />
      <Head>
        <link rel="canonical" href="https://agientry.com" />
      </Head>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Explore AI & AGI Tools</h1>
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
              <HeroSearch
                selectedTopTab={selectedTopTab}
                selectedEngine={selectedEngine}
                onTopTabChange={setSelectedTopTab}
                onEngineChange={setSelectedEngine}
              />

              <FeaturedSection
                selectedFeatureTab={selectedFeatureTab}
                setSelectedFeatureTab={setSelectedFeatureTab}
              />

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
                  {/* <p className="text-muted-foreground mb-4">
Explore the best {category.name.toLowerCase()} tools for AI and AGI applications.
</p> */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {toolsByCategory[category.id]?.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} apiUrl={apiUrl || ''} />
                    ))}
                  </div>
                </div>
              ))}
            </main>
          </div>
        </div>
        <BottomNavbar />
      </div>
    </>
  )
}