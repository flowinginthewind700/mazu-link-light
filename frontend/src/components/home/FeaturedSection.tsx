import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FeaturedToolCard } from './FeaturedToolCard';
import axios from 'axios';

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
  linkType: 'internal' | 'external';
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
  const [sectionHeight, setSectionHeight] = useState('auto');
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
          const rows = Math.ceil(gridItems.length / (window.innerWidth >= 768 ? 4 : 2));
          const newHeight = Math.min(2, rows) * (itemHeight + gap) - gap;
          setSectionHeight(`${newHeight}px`);
        }
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, [selectedFeatureTab]);

  const fetchCategories = async () => {
    try {
      const query = `
        query {
          featuredData {
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
      setCategories(response.data.data.featuredData);
      if (response.data.data.featuredData.length > 0) {
        setSelectedFeatureTab(response.data.data.featuredData[0].name);
      }
    } catch (error) {
      console.error('Error fetching featured categories:', error);
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
        variables: { category }
      });
      setFeaturedTools(prev => ({
        ...prev,
        [category]: response.data.data.agifeaturecards
      }));
    } catch (error) {
      console.error('Error fetching featured tools:', error);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex sm:flex-col gap-2 sm:border-r sm:pr-4 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedFeatureTab === category.name ? 'default' : 'ghost'}
              size="icon"
              onClick={() => {
                setSelectedFeatureTab(category.name);
                if (!featuredTools[category.name]) {
                  fetchFeaturedTools(category.name);
                }
              }}
              className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0"
            >
              <Image
                src={`${apiUrl}${category.icon.url}`}
                alt={category.name}
                width={24}
                height={24}
              />
            </Button>
          ))}
        </div>

        <ScrollArea className="flex-1" style={{ height: sectionHeight }}>
          <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 p-2">
            {featuredTools[selectedFeatureTab]?.map((item) => (
              <FeaturedToolCard key={item.id} tool={item} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
