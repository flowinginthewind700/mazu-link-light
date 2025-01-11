"use client";
import React, { useEffect, useRef, useState } from "react";
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

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  selectedFeatureTab,
  setSelectedFeatureTab,
}) => {
  const [sectionHeight, setSectionHeight] = useState("auto");
  const gridRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<FeaturedCategory[]>([]);
  const [featuredTools, setFeaturedTools] = useState<Record<string, FeatureTool[]>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchFeaturedTools(categories[0].name);
    }
  }, [categories]);

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
  }, [selectedFeatureTab, featuredTools]); // 依赖 featuredTools，内容加载完成后更新高度

  const fetchCategories = async () => {
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
          }
        }
      `;
      const response = await axios.post(`${apiUrl}/graphql`, { query });
      const fetchedCategories = response.data.data.agifeaturetoolcategories;
      setCategories(fetchedCategories);
      if (fetchedCategories.length > 0) {
        setSelectedFeatureTab(fetchedCategories[0].name);
      }
    } catch (error) {
      console.error("Error fetching featured categories:", error);
    }
  };

  const fetchFeaturedTools = async (category: string) => {
    try {
      const query = `
        query($category: String!) {
          agifeaturecards(where: { agifeaturetoolcategory: { name: $category } }) {
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
      `;
      const response = await axios.post(`${apiUrl}/graphql`, {
        query,
        variables: { category },
      });
      setFeaturedTools((prev) => ({
        ...prev,
        [category]: response.data.data.agifeaturecards,
      }));
    } catch (error) {
      console.error("Error fetching featured tools:", error);
    }
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
                  if (!featuredTools[category.name]) {
                    fetchFeaturedTools(category.name);
                  }
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
            <div
              ref={gridRef}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-2"
            >
              {featuredTools[selectedFeatureTab]?.map((item) => (
                <FeaturedToolCard key={item.id} tool={item} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </WavyBackground>
  );
};