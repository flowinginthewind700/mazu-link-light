'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { HeroSearch } from './HeroSearch';
import { FeaturedSection } from './FeaturedSection';
import { ToolCard } from './ToolCard';
import { AnimatedSectionTitle } from '@/components/animated-section-title';
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
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tool | 'category'; direction: 'asc' | 'desc' | 'default' } | null>(null);

  const sectionRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});

  // Load view mode from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem('displayMode') as 'card' | 'grid' | 'table' | null;
    setViewMode(savedView && ['card', 'grid', 'table'].includes(savedView) ? savedView : 'card');
  }, []);

  // Fetch categories and tools
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, toolsResponse] = await Promise.all([
          axios.get(`${apiUrl}/categories`),
          axios.get(`${apiUrl}/agitools`)
        ]);

        const categoriesData = categoriesResponse.data;
        const toolsData = toolsResponse.data;

        setCategories(categoriesData);
        
        // Group tools by category
        const groupedTools = toolsData.reduce((acc: Record<string, Tool[]>, tool: Tool) => {
          const category = tool.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(tool);
          return acc;
        }, {});

        setToolsByCategory(groupedTools);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  const scrollToSection = useCallback((sectionId: string) => {
    setAnimatingSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => setAnimatingSection(''), 1000);
  }, []);

  const handleCategorySelect = useCallback((categoryId: string) => {
    scrollToSection(categoryId);
  }, [scrollToSection]);

  // Intersection Observer for section highlighting
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
    if (!sortConfig || sortConfig.direction === 'default') return tools;
    return [...tools].sort((a, b) => {
      if (sortConfig.key === 'category') {
        return sortConfig.direction === 'asc' 
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      }

      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle string values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle number values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      // Handle dates
      if (sortConfig.key === 'submissionDate') {
        const aDate = new Date(aValue as string).getTime();
        const bDate = new Date(bValue as string).getTime();
        return sortConfig.direction === 'asc'
          ? aDate - bDate
          : bDate - aDate;
      }

      // Default case: convert to strings and compare
      const aString = String(aValue || '');
      const bString = String(bValue || '');
      return sortConfig.direction === 'asc'
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <WavyBackground className="absolute inset-0">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover the Latest AI Tools & Technologies
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300">
              Your comprehensive directory for AI solutions
            </p>
            <HeroSearch />
          </div>
        </WavyBackground>
      </section>

      {/* Featured Tools Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <AnimatedSectionTitle title="Featured AI Tools" />
          <FeaturedSection />
        </div>
      </section>

      {/* Categories and Tools */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Categories Sidebar */}
            <aside className="md:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h2 className="text-xl font-bold mb-4">Categories</h2>
                <nav className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        activeSection === category.id
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Tools Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-4">
                  <Button
                    variant={viewMode === 'card' ? 'default' : 'outline'}
                    onClick={() => setViewMode('card')}
                  >
                    <PanelLeft className="w-4 h-4 mr-2" />
                    Card
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    onClick={() => setViewMode('table')}
                  >
                    <Sheet className="w-4 h-4 mr-2" />
                    Table
                  </Button>
                </div>
                <div className="flex gap-2">
                  <select
                    className="px-4 py-2 rounded-lg border"
                    value={selectedTopTab}
                    onChange={(e) => setSelectedTopTab(e.target.value)}
                  >
                    <option value="default">All Tools</option>
                    <option value="newest">Newest</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    id={category.id}
                    ref={sectionRefs.current[category.id] = React.createRef()}
                    className={`transition-opacity duration-500 ${
                      animatingSection === category.id ? 'opacity-50' : 'opacity-100'
                    }`}
                  >
                    <h2 className="text-2xl font-bold mb-6">{category.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortTools(toolsByCategory[category.id] || [])
                        .slice(0, TOOLS_PER_CATEGORY)
                        .map((tool) => (
                          <ToolCard key={tool.id} tool={tool} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Latest AI Tools</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Subscribe to our newsletter to receive updates about new AI tools and technologies
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border"
            />
            <Button>Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}