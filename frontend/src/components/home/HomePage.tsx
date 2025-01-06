'use client'

import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import { HeroSearch } from './HeroSearch'
import { FeaturedSection } from './FeaturedSection'
import { ToolCard } from './ToolCard'
import { AnimatedSectionTitle } from '@/components/animated-section-title'
import { BottomNavbar } from '@/components/bottom-navbar'
import { Category, Tool } from './types'

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
            <HeroSearch
              selectedTopTab={selectedTopTab}
              selectedEngine={selectedEngine}
              onTopTabChange={setSelectedTopTab}
              onEngineChange={setSelectedEngine}
            />

            {/* Featured Section */}
            <FeaturedSection
              selectedFeatureTab={selectedFeatureTab}
              setSelectedFeatureTab={setSelectedFeatureTab}
            />

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
                    <ToolCard key={tool.id} tool={tool} apiUrl={apiUrl || ''}  />
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
