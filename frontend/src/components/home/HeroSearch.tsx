import React, { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolCard } from './ToolCard';
import axios from 'axios';
import { Tool } from './types'; // 导入 Tool 类型

// 定义 HeroSearchProps 接口
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

const WEAVIATE_URL = '/api/weaviate';
// const WEAVIATE_URL = 'http://weaviate:8080/v1/graphql';

export const HeroSearch: React.FC<HeroSearchProps> = ({
  selectedTopTab,
  selectedEngine,
  onTopTabChange,
  onEngineChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[]>([]); // 指定类型为 Tool[]
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) return;
  
    setLoading(true);
  
    const query = `
      query {
        Get {
          Agitool(
            nearText: {
              concepts: ["${searchQuery}"]
              certainty: 0.7
            }
          ) {
            strapiId
            name
            description
            content
            iconimage {
              url
            }
            accessLink
            internalPath
          }
        }
      }
    `;
  
    try {
      const response = await axios.post(WEAVIATE_URL, { query });
      const results = response.data.data.Get.Agitool;
  
      // 将 strapiId 映射回 id
      const mappedResults = results.map((tool: any) => ({
        ...tool,
        id: tool.strapiId, // 将 strapiId 赋值给 id
        Description: tool.description,
      }));
  
      setSearchResults(mappedResults);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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

      {/* 显示搜索结果 */}
      {loading && <p>Loading...</p>}
      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((tool) => (
            <ToolCard key={tool.id} tool={tool} apiUrl={process.env.NEXT_PUBLIC_CMS_API_BASE_URL || ''} />
          ))}
        </div>
      )}
    </div>
  );
};