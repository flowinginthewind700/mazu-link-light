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
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Minimize2, Maximize2 } from 'lucide-react';

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
  const [isMinimalView, setIsMinimalView] = useState(false); 

  const sectionRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});

  useEffect(() => {
    const savedView = localStorage.getItem('viewMode');
    if (savedView === null) {
      setIsMinimalView(false);
      localStorage.setItem('viewMode', 'detailed');
    } else {
      setIsMinimalView(savedView === 'minimal');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('viewMode', isMinimalView ? 'minimal' : 'detailed');
  }, [isMinimalView]);

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
    if (categories.length > 0 && Object.keys(toolsByCategory).length > 0) {
      const allIcons = Object.values(toolsByCategory)
        .flat()
        .map((tool) => tool.iconimage?.url ? `${apiUrl}${tool.iconimage.url}` : null)
        .filter((url) => url);
      localStorage.setItem('gameIcons', JSON.stringify(allIcons));
    }
  }, [categories, toolsByCategory]);

  useEffect(() => {
    if (categories.length > 0) {
      sectionRefs.current = categories.reduce((acc, category) => {
        acc[category.id] = React.createRef<HTMLDivElement>();
        return acc;
      }, {} as Record<string, React.RefObject<HTMLDivElement>>);
    }
  }, [categories]);

  const scrollToSection = useCallback((sectionId: string) => {
    const sectionElement = sectionRefs.current[sectionId]?.current;
    if (sectionElement) {
      sectionElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      setTimeout(() => {
        const rect = sectionElement.getBoundingClientRect();
        const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
        if (!isInView) {
          sectionElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 1000);
    }

    setAnimatingSection(sectionId);
    setTimeout(() => setAnimatingSection(''), 1000);
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

  const renderMinimalView = () => {
    const allTools = Object.values(toolsByCategory).flat();

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 relative bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-green-900/30 rounded-xl p-6 shadow-lg"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 12 }).map((_, index) => (
                <ToolCard
                  key={index}
                  tool={{
                    id: index.toString(),
                    name: 'Loading...',
                    Description: '',
                    iconimage: { url: '/placeholder.svg' },
                    accessLink: '',
                    internalPath: '',
                  }}
                  apiUrl={apiUrl || ''}
                  loading={true}
                />
              ))
            : allTools.map((tool) => (
                <TooltipProvider key={tool.id}>
                  <motion.div
                    whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 255, 128, 0.2)' }}
                    className="flex flex-col items-center gap-2"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative w-16 h-16 group">
                          <button
                            onClick={() => tool.accessLink && window.open(tool.accessLink, '_blank', 'noopener,noreferrer')}
                            className="w-full h-full relative rounded-lg overflow-hidden border border-green-200/50 dark:border-green-800/50"
                          >
                            <Image
                              src={
                                tool.iconimage?.formats?.thumbnail?.url
                                  ? `${apiUrl}${tool.iconimage.formats.thumbnail.url}`
                                  : `${apiUrl}${tool.iconimage?.url || '/placeholder.svg'}`
                              }
                              alt={tool.name}
                              fill
                              style={{ objectFit: 'cover' }}
                              className="rounded-lg transition-transform group-hover:scale-110"
                              loading="lazy"
                            />
                          </button>
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
                            <div className="absolute bottom-0 right-0 w-0 h-[2px] bg-gradient-to-l from-transparent via-green-400 to-transparent transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-green-50 dark:bg-green-900/80 border-green-200 dark:border-green-700">
                        <p className="text-green-800 dark:text-green-200">Visit {tool.name}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={`/agitool/${tool.id}`}
                          className="text-sm text-center truncate w-20 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        >
                          {tool.name}
                        </a>
                      </TooltipTrigger>
                      <TooltipContent className="bg-green-50 dark:bg-green-900/80 border-green-200 dark:border-green-700">
                        <p className="text-green-800 dark:text-green-200">View details for {tool.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                </TooltipProvider>
              ))}
        </div>
      </motion.div>
    );
  };

  const renderDetailedView = () => (
    <>
      {categories.map((category) => (
        <motion.div
          key={category.id}
          ref={sectionRefs.current[category.id]}
          className="relative space-y-4 scroll-mt-24 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-green-900/30 rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {animatingSection === category.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
              style={{ top: 0 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-transparent to-green-400/20 animate-pulse" />
            </motion.div>
          )}
          <AnimatedSectionTitle
            title={category.name}
            isActive={animatingSection === category.id}
            className="text-green-800 dark:text-green-200"
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
                  <motion.div
                    key={tool.id}
                    whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 255, 128, 0.2)' }}
                  >
                    <ToolCard tool={tool} apiUrl={apiUrl || ''} />
                  </motion.div>
                ))}
          </div>
        </motion.div>
      ))}
    </>
  );

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-green-50 dark:from-gray-950 dark:to-green-950 text-foreground pb-20 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,128,0.1)_0,rgba(0,255,128,0)_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,255,128,0.05)_0,rgba(0,255,128,0)_70%)]" />
        </div>
        
        <div className="container mx-auto px-4 py-2 relative z-10">
          <div className="lg:flex lg:gap-6">
            <aside className="hidden lg:block w-48 space-y-4 sticky top-24 h-fit">
              <nav className="space-y-2 p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-md backdrop-blur-md border border-green-200/50 dark:border-green-800/50">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => scrollToSection(category.id)}
                    className="flex w-full items-center gap-2 p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 text-left transition-colors duration-200 ease-in-out text-green-800 dark:text-green-200"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm">{category.name}</span>
                  </motion.button>
                ))}
              </nav>
            </aside>

            <main className="flex-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 dark:bg-gray-900/80 rounded-xl p-6 shadow-md backdrop-blur-md border border-green-200/50 dark:border-green-800/50"
              >
                <HeroSearch
                  selectedTopTab={selectedTopTab}
                  selectedEngine={selectedEngine}
                  onTopTabChange={setSelectedTopTab}
                  onEngineChange={setSelectedEngine}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/80 dark:bg-gray-900/80 rounded-xl p-6 shadow-md backdrop-blur-md border border-green-200/50 dark:border-green-800/50"
              >
                <FeaturedSection
                  selectedFeatureTab={selectedFeatureTab}
                  setSelectedFeatureTab={setSelectedFeatureTab}
                />
              </motion.div>

              <div className="flex justify-end mb-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMinimalView(!isMinimalView)}
                    className="w-32 flex items-center justify-center gap-2 bg-white/80 dark:bg-gray-900/80 border-green-400/50 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 shadow-md"
                  >
                    {isMinimalView ? (
                      <>
                        <Maximize2 className="w-4 h-4" />
                        Detailed
                      </>
                    ) : (
                      <>
                        <Minimize2 className="w-4 h-4" />
                        Minimal
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>

              {isMinimalView ? renderMinimalView() : renderDetailedView()}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}