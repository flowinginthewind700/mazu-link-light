import React from 'react';
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
  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Tab buttons - horizontal on mobile, vertical on desktop */}
        <div className="flex sm:flex-col gap-2 sm:border-r sm:pr-4 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
          <Button
            variant={selectedFeatureTab === 'agi-tools' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setSelectedFeatureTab('agi-tools')}
            className="h-12 w-12 flex-shrink-0"
          >
            <Sparkles className="h-6 w-6" />
          </Button>
          <Button
            variant={selectedFeatureTab === 'tools' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setSelectedFeatureTab('tools')}
            className="h-12 w-12 flex-shrink-0"
          >
            <Wrench className="h-6 w-6" />
          </Button>
          <Button
            variant={selectedFeatureTab === 'blog' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setSelectedFeatureTab('blog')}
            className="h-12 w-12 flex-shrink-0"
          >
            <Newspaper className="h-6 w-6" />
          </Button>
          <Button
            variant={selectedFeatureTab === 'ai-image' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setSelectedFeatureTab('ai-image')}
            className="h-12 w-12 flex-shrink-0"
          >
            <ImageIcon className="h-6 w-6" />
          </Button>
        </div>

        {/* ScrollArea with dynamic height */}
        <ScrollArea className="flex-1 h-[300px] sm:h-[400px]">
          <div className="grid grid-cols-2 gap-4 p-2">
            {featuredData[selectedFeatureTab as keyof typeof featuredData].map((item) => (
              <FeaturedToolCard key={item.id} tool={item} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
