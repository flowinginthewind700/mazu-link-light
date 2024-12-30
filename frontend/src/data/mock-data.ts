import { BlogPost, Category } from '@/types/blog'

export const categories: Category[] = [
  { id: 'all', label: 'All' },
  { id: 'market', label: 'Market' },
  { id: 'ai', label: 'AI' },
  { id: 'user-guide', label: 'User Guide' },
  { id: 'stock', label: 'Stock' },
  { id: 'game', label: 'Game' },
  { id: 'tech', label: 'Tech' },
  { id: 'life', label: 'Life' },
]

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'DeepSeek V3 Preview: 685B MoE Model Achieves Top Performance',
    excerpt: 'DeepSeek has launched a preview of its V3 model, a 685B parameter Mixture-of-Experts model that is showing impressive results across various benchmarks.',
    date: '2024/12/26',
    image: '/placeholder.svg',
    category: 'ai'
  },
  {
    id: '2',
    title: 'U.S. Markets Soar Ahead of Christmas: Tech Stocks Shine',
    excerpt: 'On December 24, 2024, U.S. stock markets experienced a positive trading session led by tech giants and a notable surge in consumer confidence.',
    date: '2024/12/25',
    image: '/placeholder.svg',
    category: 'market'
  },
  {
    id: '3',
    title: 'GitHub Copilot Goes Free: 2000 Code Completions & More',
    excerpt: 'GitHub announces a free tier for Copilot, its AI-powered coding tool, now available to all users in VS Code. Get 2000 completions per month at no cost.',
    date: '2024/12/23',
    image: '/placeholder.svg',
    category: 'tech'
  },
  {
    id: '4',
    title: 'Market Buzz: Tech Stocks Shine as Honda and Nissan Rally',
    excerpt: 'On December 23, U.S. stock markets showed resilience with modest gains led by tech stocks and ongoing discussion about automotive sector developments.',
    date: '2024/12/24',
    image: '/placeholder.svg',
    category: 'market'
  },
  {
    id: '5',
    title: 'Market Rebound: Dow Soars Nearly 500 Points Amid Easing Inflation',
    excerpt: 'On December 20, 2024, U.S. stock markets rebounded sharply as inflation data eased concerns and the Dow gained significant ground.',
    date: '2024/12/23',
    image: '/placeholder.svg',
    category: 'market'
  },
  {
    id: '6',
    title: 'Google Unveils Gemini 2.0 Flash Thinking: 5x Faster Inference',
    excerpt: 'Google has launched the Gemini 2.0 Flash Thinking inference model, built on the Gemini 2 Flash architecture, delivering breakthrough performance.',
    date: '2024/12/20',
    image: '/placeholder.svg',
    category: 'ai'
  }
]

