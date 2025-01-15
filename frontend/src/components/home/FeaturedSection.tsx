"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FeaturedToolCard } from "./FeaturedToolCard";
import axios from "axios";
import { WavyBackground } from "@/components/ui/wavy-background";

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
        const gap = 16; // 假设间隔是 16px，根据实际情况调整

        let columns = 2; // 默认为移动端的 2 列
        if (window.innerWidth >= 640) columns = 3; // sm 断点
        if (window.innerWidth >= 768) columns = 4; // md 断点

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
            <div className="relative space-y-5 overflow-hidden rounded-2xl bg-white/5 p-4 shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
              <div className="h-24 rounded-lg bg-white/5"></div>
              <div className="space-y-3">
                <div className="h-3 w-3/5 rounded-lg bg-white/5"></div>
                <div className="h-3 w-4/5 rounded-lg bg-white/10"></div>
                <div className="h-3 w-2/5 rounded-lg bg-white/5"></div>
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
      waveOpacity={0.5}
      height="auto"
      animate={true}
    >
      <Card className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex sm:flex-col gap-2 sm:border-r sm:pr-4 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
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
                    ? "bg-blue-100/50 dark:bg-blue-900/50 backdrop-blur-sm text-blue-600 dark:text-blue-300"
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

          <ScrollArea 
            className="flex-1" 
            ref={scrollAreaRef}
            style={{ height: `${contentHeight}px` }}
          >
            {loading ? (
              renderSkeleton()
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-2">
                {featuredTools[selectedFeatureTab]?.map((item) => (
                  <FeaturedToolCard key={item.id} tool={item} className="featured-tool-card" />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </Card>
    </WavyBackground>
  );
};

export default FeaturedSection;
