// components/SearchBar.tsx
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    onSearch(query)
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
    </div>
  )
}
