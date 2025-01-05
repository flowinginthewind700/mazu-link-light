import React from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HeroSearchProps {
  selectedTopTab: string;
  selectedEngine: string;
  onTopTabChange: (value: string) => void;
  onEngineChange: (value: string) => void;
}

const topTabs = [
  { id: 'default', label: 'Default' },
  { id: 'search', label: 'Search' },
  { id: 'community', label: 'Community' },
  { id: 'images', label: 'Images' },
];

const searchOptions = {
  default: ['this site', 'google', 'bing', 'baidu', 'Perplexity'],
  search: ['google', 'bing', 'baidu', 'Perplexity'],
  community: ['huggingface', 'github'],
  images: ['civitai', 'openart', 'lexica'],
};

export const HeroSearch: React.FC<HeroSearchProps> = ({
  selectedTopTab,
  selectedEngine,
  onTopTabChange,
  onEngineChange,
}) => {
  return (
    <div className="text-center space-y-6">
      <Image
        src="/images/agientrylogo_large.jpg"
        alt="AI Tools Logo Large"
        width={120}
        height={40}
        className="mx-auto"
      />
      <Tabs value={selectedTopTab} onValueChange={onTopTabChange} className="w-full max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-4 p-1 rounded-full bg-muted/50 backdrop-blur-sm">
          {topTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-full transition-all duration-200 ease-in-out data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-lg"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="relative max-w-2xl mx-auto">
        <Input
          type="search"
          placeholder="Search AI tools..."
          className="w-full pl-4 pr-10 py-3 rounded-full bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out"
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      </div>
      <Tabs value={selectedEngine} onValueChange={onEngineChange} className="w-full max-w-2xl mx-auto">
        <TabsList className="justify-center bg-transparent">
          {searchOptions[selectedTopTab as keyof typeof searchOptions].map((engine) => (
            <TabsTrigger
              key={engine}
              value={engine}
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:underline transition-all duration-200 ease-in-out"
            >
              {engine}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
