import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Eraser } from 'lucide-react'; // 导入 Eraser 图标
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

  // 处理外部搜索
  const handleExternalSearch = () => {
    if (!searchQuery) return;

    let url = '';
    const encodedQuery = encodeURIComponent(searchQuery);

    switch (selectedEngine) {
      case 'google':
        url = `https://www.google.com/search?q=${encodedQuery}`;
        break;
      case 'baidu':
        url = `https://www.baidu.com/s?wd=${encodedQuery}`;
        break;
      case 'bing':
        url = `https://www.bing.com/search?q=${encodedQuery}`;
        break;
      case 'Perplexity':
        url = `https://www.perplexity.ai/search?q=${encodedQuery}&focus=internet`;
        break;
      case 'huggingface':
        url = `https://huggingface.co/search/full-text?q=${encodedQuery}`;
        break;
      case 'github':
        url = `https://github.com/search?q=${encodedQuery}&type=repositories`;
        break;
      case 'civitai':
        url = `https://civitai.com/?query=${encodedQuery}`;
        break;
      case 'openart':
        url = `https://openart.ai/discovery?q=${encodedQuery}`;
        break;
      case 'lexica':
        url = `https://lexica.art/?q=${encodedQuery}`;
        break;
      default:
        return; // 如果是 "this site"，不执行外部搜索
    }

    // 在新窗口打开外部搜索
    window.open(url, '_blank');
  };

  // 处理内部搜索
  const handleSearch = async () => {
    if (!searchQuery) return;

    // 如果是外部搜索引擎，执行外部搜索
    if (selectedEngine !== 'this site') {
      handleExternalSearch();
      return;
    }

    setLoading(true);

    const lowercaseQuery = searchQuery.toLowerCase();

    const query = `
      query {
        Get {
          Agitool(
            bm25: {
              query: "${lowercaseQuery}"
              properties: ["name", "description", "content"]
            }
          ) {
            strapiId
            name
            description
            content
            iconimageUrl
            accessLink
            internalPath
          }
        }
      }
    `;

    try {
      const response = await axios.post(WEAVIATE_URL, { query });
      const results = response.data.data.Get.Agitool;

      const mappedResults = results.map((tool: any) => ({
        ...tool,
        id: tool.strapiId,
        Description: tool.description,
        iconimage: {
          url: tool.iconimageUrl,
        },
      }));

      setSearchResults(mappedResults);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  // 清空搜索结果
  const clearSearchResults = () => {
    setSearchResults([]);
    setSearchQuery('');
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
        <div className="relative">
          {/* 清空搜索结果的按钮 */}
          <div className="flex justify-center mt-4">
            <button
              onClick={clearSearchResults}
              className="flex items-center px-4 py-2 text-sm text-red-500 hover:text-red-700 transition-colors duration-200"
            >
              <Eraser className="w-4 h-4 mr-2" />
              Clear Results
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {searchResults.map((tool) => (
              <ToolCard key={tool.id} tool={tool} apiUrl={process.env.NEXT_PUBLIC_CMS_API_BASE_URL || ''} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};