"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FeaturedToolCard } from "./FeaturedToolCard";
import axios from "axios";
import { WavyBackground } from "@/components/ui/wavy-background";
import { motion } from "framer-motion";

interface FeaturedCategory {
  id: number;
  name: string;
  priority: number;
  icon: {
    url: string;
  };
}

interface FeatureTool {
  id: number;
  title: string;
  description: string;
  linkType: "internal" | "external";
  link: string;
  image: {
    url: string;
  };
}

interface FeaturedSectionProps {
  selectedFeatureTab: string;
  setSelectedFeatureTab: (tab: string) => void;
}

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL;
const CACHE_EXPIRY_TIME = 30 * 1000; // 30 seconds

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  selectedFeatureTab,
  setSelectedFeatureTab,
}) => {
  const [categories, setCategories] = useState<FeaturedCategory[]>([]);
  const [featuredTools, setFeaturedTools] = useState<Record<string, FeatureTool[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const loadFromCache = () => {
    const cachedData = localStorage.getItem("featuredData");
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const now = Date.now();
      if (now - timestamp < CACHE_EXPIRY_TIME) {
        setCategories(data.categories);
        setFeaturedTools(data.featuredTools);
        setLoading(false);
        return true;
      }
    }
    return false;
  };

  const saveToCache = (data: { categories: FeaturedCategory[]; featuredTools: Record<string, FeatureTool[]> }) => {
    localStorage.setItem(
      "featuredData",
      JSON.stringify({ data, timestamp: Date.now() })
    );
  };

  const fetchCategoriesAndTools = useCallback(async () => {
    if (loadFromCache()) {
      return;
    }

    try {
      const query = `
        query {
          agifeaturetoolcategories {
            id
            name
            priority
            icon {
              url
            }
            agifeaturecards {
              id
              title
              description
              linkType
              link
              image {
                url
              }
            }
          }
        }
      `;
      const response = await axios.post(`${apiUrl}/graphql`, { query });
      const fetchedCategories = response.data.data.agifeaturetoolcategories;

      const featuredTools = fetchedCategories.reduce((acc: Record<string, FeatureTool[]>, category: FeaturedCategory & { agifeaturecards: FeatureTool[] }) => {
        acc[category.name] = category.agifeaturecards;
        return acc;
      }, {} as Record<string, FeatureTool[]>);

      setCategories(fetchedCategories);
      setFeaturedTools(featuredTools);
      saveToCache({ categories: fetchedCategories, featuredTools });
    } catch (error) {
      console.error("Error fetching featured categories and tools:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContentHeight = useCallback(() => {
    if (scrollAreaRef.current) {
      const contentElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (contentElement) {
        const items = contentElement.querySelectorAll('.featured-tool-card');
        if (items.length === 0) return;

        const itemHeight = items[0].getBoundingClientRect().height;
        const gap = 16;

        let columns = 2;
        if (window.innerWidth >= 640) columns = 3;
        if (window.innerWidth >= 768) columns = 4;

        const rows = Math.ceil(items.length / columns);
        const calculatedHeight = rows * (itemHeight + gap) - gap;
        const maxHeight = window.innerHeight * 0.6;

        setContentHeight(Math.min(calculatedHeight, maxHeight));
      }
    }
  }, []);

  useEffect(() => {
    fetchCategoriesAndTools();
  }, [fetchCategoriesAndTools]);

  useEffect(() => {
    updateContentHeight();
    window.addEventListener('resize', updateContentHeight);
    const observer = new MutationObserver(updateContentHeight);
    if (scrollAreaRef.current) {
      observer.observe(scrollAreaRef.current, { childList: true, subtree: true });
    }
    return () => {
      window.removeEventListener('resize', updateContentHeight);
      observer.disconnect();
    };
  }, [selectedFeatureTab, updateContentHeight]);

  const renderSkeleton = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="w-full">
            <div className="relative space-y-5 overflow-hidden rounded-2xl bg-white/10 dark:bg-gray-800/10 p-4 backdrop-blur-sm">
              <div className="h-24 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-3 w-3/5 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="h-3 w-4/5 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="h-3 w-2/5 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <WavyBackground
      colors={['#38bdf8', '#818cf8', '#c084fc', '#e879f9', '#22d3ee']}
      waveOpacity={0.3}
      height="auto"
      animate={true}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-lg overflow-hidden shadow-xl"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <ScrollArea className="flex-shrink-0 sm:w-auto">
            <div className="flex sm:flex-col gap-2 pb-2 sm:pb-0">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedFeatureTab === category.name ? "default" : "ghost"}
                  size="icon"
                  onClick={() => {
                    setSelectedFeatureTab(category.name);
                  }}
                  className={`h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 transition-all duration-200 ${
                    selectedFeatureTab === category.name
                      ? "bg-blue-500/50 dark:bg-blue-500/30 text-white dark:text-blue-200 shadow-lg"
                      : "hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {category.icon && category.icon.url && (
                    <Image
                      src={`${apiUrl}${category.icon.url}`}
                      alt={category.name}
                      width={24}
                      height={24}
                    />
                  )}
                </Button>
              ))}
            </div>
          </ScrollArea>

          <ScrollArea 
            className="flex-1" 
            ref={scrollAreaRef}
            style={{ height: `${contentHeight}px` }}
          >
            {loading ? (
              renderSkeleton()
            ) : (
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {featuredTools[selectedFeatureTab]?.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FeaturedToolCard tool={item} className="featured-tool-card" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </ScrollArea>
        </div>
      </motion.div>
    </WavyBackground>
  );
};

export default FeaturedSection;
