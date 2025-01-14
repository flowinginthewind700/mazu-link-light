// components/SearchBar.tsx
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  onSearch: (query: string) => void
  onClearSearch: () => void
  searchQuery: string // 接收父组件的 searchQuery
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClearSearch, searchQuery }) => {
  const [query, setQuery] = useState(searchQuery) // 初始化 query 为 searchQuery

  // 当父组件的 searchQuery 变化时，同步更新 query
  useEffect(() => {
    setQuery(searchQuery)
  }, [searchQuery])

  const handleSearch = () => {
    onSearch(query)
  }

  const handleClearSearch = () => {
    setQuery('') // 清空输入框
    onClearSearch() // 调用父组件的清除逻辑
  }

  return (
    <div className="relative max-w-2xl mx-auto mb-8">
      <Input
        type="search"
        placeholder="Search blog posts"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        className="w-full pl-4 pr-10 py-3 rounded-full bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out"
      />
      <Search
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
        onClick={handleSearch}
      />
      {query && (
        <button
          onClick={handleClearSearch}
          className="absolute right-12 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
        >
          ×
        </button>
      )}
    </div>
  )
}