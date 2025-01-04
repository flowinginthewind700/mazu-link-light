import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Wrench, Newspaper, ImageIcon } from 'lucide-react';
import { FeaturedToolCard } from './FeaturedToolCard';
import { featuredData } from './featuredData';

interface FeaturedSectionProps {
  selectedFeatureTab: string;
  setSelectedFeatureTab: (tab: string) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  selectedFeatureTab,
  setSelectedFeatureTab,
}) => {
  const [sectionHeight, setSectionHeight] = useState('auto');
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (gridRef.current) {
        const gridItems = gridRef.current.children;
        if (gridItems.length > 0) {
          const itemHeight = gridItems[0].getBoundingClientRect().height;
          const gap = 16; // Assuming a gap of 16px, adjust if different
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

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Tab buttons - horizontal on mobile, vertical on desktop */}
        <div className="flex sm:flex-col gap-2 sm:border-r sm:pr-4 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
          <Button
            variant={selectedFeatureTab === 'agi-tools' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setSelectedFeatureTab('agi-tools')}
            className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0"
          >
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <Button
            variant={selectedFeatureTab === 'tools' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setSelectedFeatureTab('tools')}
            className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0"
          >
            <Wrench className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <Button
            variant={selectedFeatureTab === 'blog' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setSelectedFeatureTab('blog')}
            className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0"
          >
            <Newspaper className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <Button
            variant={selectedFeatureTab === 'ai-image' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setSelectedFeatureTab('ai-image')}
            className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0"
          >
            <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>

        {/* ScrollArea with dynamic height */}
        <ScrollArea className="flex-1" style={{ height: sectionHeight }}>
          <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 p-2">
            {featuredData[selectedFeatureTab as keyof typeof featuredData].map((item) => (
              <FeaturedToolCard key={item.id} tool={item} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
