'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import axios from 'axios';
import { HeroSearch } from './HeroSearch';
import { FeaturedSection } from './FeaturedSection';
import { ToolCard } from './ToolCard';
import { AnimatedSectionTitle } from '@/components/animated-section-title';
import { BottomNavbar } from '@/components/bottom-navbar';
import { Category, Tool } from './types';
import { Navigation } from '@/components/navigation';
import { WavyBackground } from '@/components/ui/wavy-background';

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL;
const TOOLS_PER_CATEGORY = 24;
const CACHE_EXPIRY_TIME = 30 * 1000; // 30 seconds

export default function HomePage() {
  const [selectedTopTab, setSelectedTopTab] = useState('default');
  const [selectedEngine, setSelectedEngine] = useState('this site');
  const [activeSection, setActiveSection] = useState('');
  const [animatingSection, setAnimatingSection] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [toolsByCategory, setToolsByCategory] = useState<Record<string, Tool[]>>({});
  const [selectedFeatureTab, setSelectedFeatureTab] = useState('agi-tools');
  const [loading, setLoading] = useState<boolean>(true);

  const sectionRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});

  const loadFromCache = () => {
    const cachedData = localStorage.getItem('categoriesAndTools');
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const now = Date.now();
      if (now - timestamp < CACHE_EXPIRY_TIME) {
        setCategories(data.categories);
        setToolsByCategory(data.toolsByCategory);
        setLoading(false);
        return true;
      }
    }
    return false;
  };

  const saveToCache = (data: { categories: Category[]; toolsByCategory: Record<string, Tool[]> }) => {
    localStorage.setItem(
      'categoriesAndTools',
      JSON.stringify({ data, timestamp: Date.now() })
    );
  };

  const fetchCategoriesAndTools = useCallback(async () => {
    if (loadFromCache()) {
      return;
    }

    try {
      const categoriesQuery = `
        query {
          agitoolcategories {
            id
            name
          }
        }
      `;
      const categoriesResponse = await axios.post(`${apiUrl}/graphql`, { query: categoriesQuery });
      const fetchedCategories = categoriesResponse.data.data.agitoolcategories;

      const toolsPromises = fetchedCategories.map(async (category: Category) => {
        const toolsQuery = `
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
        `;
        const toolsResponse = await axios.post(`${apiUrl}/graphql`, {
          query: toolsQuery,
          variables: { categoryId: category.id },
        });
        return { categoryId: category.id, tools: toolsResponse.data.data.agitools };
      });

      const toolsResults = await Promise.all(toolsPromises);
      const newToolsByCategory = toolsResults.reduce((acc, { categoryId, tools }) => {
        acc[categoryId] = tools;
        return acc;
      }, {} as Record<string, Tool[]>);

      setCategories(fetchedCategories);
      setToolsByCategory(newToolsByCategory);

      saveToCache({ categories: fetchedCategories, toolsByCategory: newToolsByCategory });
    } catch (error) {
      console.error('Error fetching categories and tools:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesAndTools();
  }, [fetchCategoriesAndTools]);

  useEffect(() => {
    if (categories.length > 0) {
      sectionRefs.current = categories.reduce((acc, category) => {
        acc[category.id] = React.createRef<HTMLDivElement>();
        return acc;
      }, {} as Record<string, React.RefObject<HTMLDivElement>>);
    }
  }, [categories]);

  const scrollToSection = useCallback((sectionId: string, retryCount = 0) => {
    const maxRetries = 3;
    const retryDelay = 100; // ms

    const performScroll = () => {
      const sectionRef = sectionRefs.current[sectionId];
      if (sectionRef && sectionRef.current) {
        sectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        setAnimatingSection(sectionId);
        setTimeout(() => setAnimatingSection(''), 1000);
        return true;
      }
      return false;
    };

    if (!performScroll() && retryCount < maxRetries) {
      setTimeout(() => {
        scrollToSection(sectionId, retryCount + 1);
      }, retryDelay);
    }
  }, []);

  const handleCategorySelect = useCallback((categoryId: string) => {
    scrollToSection(categoryId);
  }, [scrollToSection]);

  useEffect(() => {
    const observers = categories.map(category => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(category.id);
            }
          });
        },
        { threshold: 0.5 }
      );

      if (sectionRefs.current[category.id]?.current) {
        observer.observe(sectionRefs.current[category.id].current!);
      }

      return observer;
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [categories]);

  return (
    <>
      <Navigation
        onCategorySelect={handleCategorySelect}
        categories={categories}
        scrollToCategoryFromMobile={scrollToSection}
        currentPage="home"
        showMobileMenu={true}
      />
      <Head>
        <link rel="canonical" href="https://agientry.com" />
      </Head>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          })
        }}
      />
      <div className="min-h-screen bg-background text-foreground pb-20">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading
                      ? Array.from({ length: 6 }).map((_, index) => (
                          <ToolCard
                            key={index}
                            tool={{
                              id: index.toString(),
                              name: 'Loading AI tool...',
                              Description: 'Loading AI tool...',
                              iconimage: { url: '/placeholder.svg' },
                              accessLink: '',
                              internalPath: '',
                            }}
                            apiUrl={apiUrl || ''}
                            loading={true}
                          />
                        ))
                      : toolsByCategory[category.id]?.map((tool) => (
                          <ToolCard key={tool.id} tool={tool} apiUrl={apiUrl || ''} />
                        ))}
                  </div>
                </div>
              ))}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
