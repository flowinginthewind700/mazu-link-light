import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ToolCard } from './ToolCard';

const WEAVIATE_URL = 'http://weaviate:8080/v1/graphql';

export const HeroSearch: React.FC<HeroSearchProps> = ({
  selectedTopTab,
  selectedEngine,
  onTopTabChange,
  onEngineChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 搜索函数
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
            id
            name
            description
            content
          }
        }
      }
    `;

    try {
      const response = await axios.post(WEAVIATE_URL, { query });
      setSearchResults(response.data.data.Get.Agitool);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center space-y-6">
      {/* 其他代码保持不变 */}
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