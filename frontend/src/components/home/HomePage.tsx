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
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PanelLeft, LayoutGrid, Sheet, ExternalLink } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'card' | 'grid' | 'table'>('card');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tool | 'category'; direction: 'asc' | 'desc' } | null>(null);

  const sectionRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});

  // Load view mode from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem('displayMode') as 'card' | 'grid' | 'table' | null;
    setViewMode(savedView && ['card', 'grid', 'table'].includes(savedView) ? savedView : 'card');
  }, []);

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem('displayMode', viewMode);
  }, [viewMode]);

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
    if (loadFromCache()) return;

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
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const rect = sectionElement.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    const observers = categories.map((category) => {
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

    return () => observers.forEach((observer) => observer.disconnect());
  }, [categories]);

  const sortTools = (tools: Tool[]) => {
    if (!sortConfig) return tools;
    return [...tools].sort((a, b) => {
      let aValue: string, bValue: string;
      if (sortConfig.key === 'category') {
        aValue = categories.find(cat => toolsByCategory[cat.id]?.includes(a))?.name || '';
        bValue = categories.find(cat => toolsByCategory[cat.id]?.includes(b))?.name || '';
      } else {
        aValue = String(a[sortConfig.key as keyof Tool] || '');
        bValue = String(b[sortConfig.key as keyof Tool] || '');
      }
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  };

  const handleSort = (key: keyof Tool | 'category') => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const renderCardView = () => (
    <>
      {categories.map((category) => (
        <div key={category.id} ref={sectionRefs.current[category.id]} className="relative space-y-4 scroll-mt-24">
          {animatingSection === category.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 pointer-events-none"
              style={{ top: 0 }}
            >
              <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
                <motion.div
                  initial={{ opacity: 0.5, width: "15rem" }}
                  animate={{ opacity: 1, width: "30rem" }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
                >
                  <div className="absolute w-[100%] left-0 bg-background h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
                  <div className="absolute w-40 h-[100%] left-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0.5, width: "15rem" }}
                  animate={{ opacity: 1, width: "30rem" }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]"
                >
                  <div className="absolute w-40 h-[100%] right-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
                  <div className="absolute w-[100%] right-0 bg-background h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
                </motion.div>
              </div>
            </motion.div>
          )}
          <AnimatedSectionTitle title={category.name} isActive={animatingSection === category.id} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <ToolCard
                    key={index}
                    tool={{ id: `${index}`, name: 'Loading...', Description: '', iconimage: { url: '/placeholder.svg' }, accessLink: '', internalPath: '' }}
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
    </>
  );

  const renderGridView = () => {
    const allTools = Object.values(toolsByCategory).flat();
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 12 }).map((_, index) => (
                <ToolCard
                  key={index}
                  tool={{ id: `${index}`, name: 'Loading...', Description: '', iconimage: { url: '/placeholder.svg' }, accessLink: '', internalPath: '' }}
                  apiUrl={apiUrl || ''}
                  loading={true}
                />
              ))
            : allTools.map((tool) => (
                <TooltipProvider key={tool.id}>
                  <div className="flex flex-col items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative w-16 h-16 group">
                          <button
                            onClick={() => tool.accessLink && window.open(tool.accessLink, '_blank', 'noopener,noreferrer')}
                            className="w-full h-full relative rounded-lg overflow-hidden"
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
                        </div>
                      </TooltipTrigger>
                      <TooltipContent><p>Visit {tool.name}</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a href={`/agitool/${tool.id}`} className="text-sm text-center truncate w-20 hover:text-primary transition-colors">
                          {tool.name}
                        </a>
                      </TooltipTrigger>
                      <TooltipContent><p>View details for {tool.name}</p></TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              ))}
        </div>
      </div>
    );
  };

  const renderTableView = () => {
    const allTools = sortTools(Object.values(toolsByCategory).flat());
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">Icon</th>
              <th className="p-2 text-left cursor-pointer" onClick={() => handleSort('name')}>
                Name {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-2 text-left cursor-pointer" onClick={() => handleSort('category')}>
                Category {sortConfig?.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-2 text-left">Access</th>
              <th className="p-2 text-left cursor-pointer" onClick={() => handleSort('Description')}>
                Description {sortConfig?.key === 'Description' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
            ) : allTools.map((tool) => (
              <tr key={tool.id} className="border-b hover:bg-muted/50">
                <td className="p-2">
                  <Image
                    src={tool.iconimage?.url ? `${apiUrl}${tool.iconimage.url}` : '/placeholder.svg'}
                    alt={tool.name}
                    width={24}
                    height={24}
                    className="rounded"
                  />
                </td>
                <td className="p-2">{tool.name}</td>
                <td className="p-2">
                  {categories.find(cat => toolsByCategory[cat.id]?.includes(tool))?.name || 'Uncategorized'}
                </td>
                <td className="p-2">
                  {tool.accessLink && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a href={tool.accessLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 text-primary hover:text-primary/80" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent><p>{tool.accessLink}</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </td>
                <td className="p-2 max-w-xs">
                  <div className="line-clamp-2">{tool.Description}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

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
        <div className="container mx-auto px-4 py-2">
          <div className="lg:flex lg:gap-2">
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
              <div className="flex justify-end mb-4 gap-2">
                <Button
                  variant={viewMode === 'card' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className="flex items-center gap-2"
                >
                  <PanelLeft className="w-4 h-4" /> Card
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="flex items-center gap-2"
                >
                  <LayoutGrid className="w-4 h-4" /> Grid
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="flex items-center gap-2"
                >
                  <Sheet className="w-4 h-4" /> Table
                </Button>
              </div>

              {viewMode === 'card' && renderCardView()}
              {viewMode === 'grid' && renderGridView()}
              {viewMode === 'table' && renderTableView()}
            </main>
          </div>
        </div>
      </div>
      <BottomNavbar />
    </>
  );
}