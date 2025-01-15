'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import axios from 'axios';
import { Category, Tool } from './types';

import dynamic from 'next/dynamic';

const HeroSearch = dynamic(() => import('./HeroSearch').then(mod => mod.default), {
  loading: () => <p>Loading...</p>,
});
const FeaturedSection = dynamic(() => import('./FeaturedSection').then(mod => mod.default), {
  loading: () => <p>Loading...</p>,
});
const ToolCard = dynamic(() => import('./ToolCard').then(mod => mod.default), {
  loading: () => <p>Loading...</p>,
});
const AnimatedSectionTitle = dynamic(() => import('@/components/animated-section-title').then(mod => mod.default), {
  loading: () => <p>Loading...</p>,
});
const BottomNavbar = dynamic(() => import('@/components/bottom-navbar').then(mod => mod.default), {
  loading: () => <p>Loading...</p>,
});
const Navigation = dynamic(() => import('@/components/navigation').then(mod => mod.default), {
  loading: () => <p>Loading...</p>,
});
const WavyBackground = dynamic(() => import('@/components/ui/wavy-background').then(mod => mod.default), {
  loading: () => <p>Loading...</p>,
});
const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL;
const TOOLS_PER_CATEGORY = 24;

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

  const fetchCategoriesAndTools = useCallback(async () => {
    const cachedData = localStorage.getItem('categoriesAndTools');
    if (cachedData) {
      const { categories, toolsByCategory } = JSON.parse(cachedData);
      setCategories(categories);
      setToolsByCategory(toolsByCategory);
      setLoading(false);
      return;
    }

    try {
      const query = `
        query {
          agitoolcategories {
            id
            name
            agitools(limit: ${TOOLS_PER_CATEGORY}) {
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
        }
      `;
      const response = await axios.post(`${apiUrl}/graphql`, { query });
      const categoriesWithTools = response.data.data.agitoolcategories;

      setCategories(categoriesWithTools);

      const toolsByCategory = categoriesWithTools.reduce((acc, category) => {
        acc[category.id] = category.agitools;
        return acc;
      }, {} as Record<string, Tool[]>);

      setToolsByCategory(toolsByCategory);

      localStorage.setItem('categoriesAndTools', JSON.stringify({ categories: categoriesWithTools, toolsByCategory }));
    } catch (error) {
      console.error('Error fetching categories and tools:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesAndTools();
  }, [fetchCategoriesAndTools]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    scrollToSection(categoryId);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    sectionRefs.current[sectionId]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setAnimatingSection(sectionId);
    setTimeout(() => setAnimatingSection(''), 1000);
  }, []);

  useEffect(() => {
    const observers = categories.map(category => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !toolsByCategory[category.id]) {
              fetchToolsForCategory(category.id);
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
  }, [categories, toolsByCategory]);

  return (
    <>
      <Navigation
        onCategorySelect={handleCategorySelect}
        categories={categories}
        scrollToCategoryFromMobile={(categoryId) => scrollToSection(categoryId)}
        currentPage="home"
        showMobileMenu={true}
      />
      <Head>
        <link rel="canonical" href="https://agientry.com" />
      </Head>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
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
        }) }}
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