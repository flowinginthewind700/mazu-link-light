"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FeaturedToolCard } from "./FeaturedToolCard";
import axios from "axios";
import { WavyBackground } from "@/components/ui/wavy-background";
import { cn } from "@/components/lib/utils";

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
const CACHE_EXPIRY_TIME = 30 * 1000; // 30 秒

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  selectedFeatureTab,
  setSelectedFeatureTab,
}) => {
  const [sectionHeight, setSectionHeight] = useState("auto");
  const gridRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<FeaturedCategory[]>([]);
  const [featuredTools, setFeaturedTools] = useState<Record<string, FeatureTool[]>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // 从 localStorage 加载缓存数据
  const loadFromCache = () => {
    const cachedData = localStorage.getItem("featuredData");
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const now = Date.now();
      if (now - timestamp < CACHE_EXPIRY_TIME) {
        setCategories(data.categories);
        setFeaturedTools(data.featuredTools);
        setLoading(false);
        return true; // 缓存有效
      }
    }
    return false; // 缓存无效或不存在
  };

  // 保存数据到 localStorage
  const saveToCache = (data: { categories: FeaturedCategory[]; featuredTools: Record<string, FeatureTool[]> }) => {
    localStorage.setItem(
      "featuredData",
      JSON.stringify({ data, timestamp: Date.now() })
    );
  };

  // 一次性获取所有分类及其工具数据
  const fetchCategoriesAndTools = useCallback(async () => {
    // 先尝试从缓存加载
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

      // 更新状态
      setCategories(fetchedCategories);
      setFeaturedTools(featuredTools);

      // 保存到缓存
      saveToCache({ categories: fetchedCategories, featuredTools });
    } catch (error) {
      console.error("Error fetching featured categories and tools:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoriesAndTools();
  }, [fetchCategoriesAndTools]);

  // 动态调整高度
  useEffect(() => {
    const updateHeight = () => {
      if (gridRef.current) {
        const gridItems = gridRef.current.children;
        if (gridItems.length > 0) {
          const itemHeight = gridItems[0].getBoundingClientRect().height;
          const gap = 16;

          // 根据屏幕宽度动态计算列数
          let columns = 2; // 移动端默认 2 列
          if (window.innerWidth >= 768) {
            columns = 3; // 桌面端 3 列
          }
          if (window.innerWidth >= 1024) {
            columns = 4; // 大屏幕桌面端 4 列
          }

          // 根据列数计算行数
          const rows = Math.ceil(gridItems.length / columns);
          const newHeight = rows * (itemHeight + gap) - gap;
          setSectionHeight(`${newHeight}px`);
        }
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, [selectedFeatureTab, featuredTools, loading]);

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
      height={sectionHeight} // 动态设置高度
      className="rounded-lg overflow-hidden" // 添加圆角和溢出隐藏
      backgroundFill="rgba(255, 255, 255, 0.5)" // 浅色模式背景
      waveOpacity={0.3} // 波浪透明度
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

          <ScrollArea className="flex-1" style={{ height: sectionHeight }}>
            {loading ? (
              renderSkeleton()
            ) : (
              <div
                ref={gridRef}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-2"
              >
                {featuredTools[selectedFeatureTab]?.map((item) => (
                  <FeaturedToolCard key={item.id} tool={item} />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </Card>
    </WavyBackground>
  );
};