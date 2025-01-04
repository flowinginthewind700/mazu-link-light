import { FeatureTool } from './types';

export const featuredData: Record<string, FeatureTool[]> = {
  'agi-tools': [
    {
      id: '1',
      title: 'ChatGPT',
      description: 'Advanced AI language model for conversation',
      image: 'placeholder.svg',
      linkType: 'external',
      link: 'https://chat.openai.com'
    },
    {
      id: '2',
      title: 'Claude',
      description: 'Anthropic\'s AI assistant for analysis',
      image: '/placeholder.svg',
      linkType: 'external',
      link: 'https://www.anthropic.com'
    },
    {
      id: '3',
      title: 'Gemini',
      description: 'Google\'s multimodal AI model',
      image: '/placeholder.svg',
      linkType: 'external',
      link: 'https://deepmind.google/technologies/gemini/'
    },
    {
      id: '4',
      title: 'LLaMA',
      description: 'Open source language model',
      image: '/placeholder.svg',
      linkType: 'external',
      link: 'https://ai.meta.com/llama/'
    }
  ],
  'tools': [
    {
      id: '1',
      title: 'Image Compression',
      description: 'Optimize your images efficiently',
      image: '/placeholder.svg',
      linkType: 'internal',
      link: '/tool/image-compression'
    },
    {
      id: '2',
      title: 'Code Formatter',
      description: 'Format your code beautifully',
      image: '/placeholder.svg',
      linkType: 'internal',
      link: '/tool/code-formatter'
    },
    {
      id: '3',
      title: 'PDF Tools',
      description: 'Comprehensive PDF manipulation',
      image: '/placeholder.svg',
      linkType: 'internal',
      link: '/tool/pdf-tools'
    },
    {
      id: '4',
      title: 'File Converter',
      description: 'Convert between file formats',
      image: '/placeholder.svg',
      linkType: 'internal',
      link: '/tool/file-converter'
    }
  ],
  'blog': [
    {
      id: '1',
      title: 'AI Market Trends',
      description: 'Latest developments in AI industry',
      image: '/placeholder.svg',
      linkType: 'internal',
      link: '/blog/ai-market-trends'
    },
    {
      id: '2',
      title: 'Tech News',
      description: 'Breaking technology updates',
      image: '/placeholder.svg',
      linkType: 'internal',
      link: '/blog/tech-news'
    },
    {
      id: '3',
      title: 'AI Tutorials',
      description: 'Learn AI development',
      image: '/placeholder.svg',
      linkType: 'internal',
      link: '/blog/ai-tutorials'
    },
    {
      id: '4',
      title: 'Research Papers',
      description: 'Latest AI research findings',
      image: '/placeholder.svg',
      linkType: 'internal',
      link: '/blog/research-papers'
    }
  ],
  'ai-image': [
    {
      id: '1',
      title: 'Stable Diffusion',
      description: 'Generate amazing artwork',
      image: '/placeholder.svg',
      linkType: 'external',
      link: 'https://stability.ai/'
    },
    {
      id: '2',
      title: 'DALL-E 3',
      description: 'Create realistic images',
      image: '/placeholder.svg',
      linkType: 'external',
      link: 'https://openai.com/dall-e-3'
    },
    {
      id: '3',
      title: 'Midjourney',
      description: 'Professional AI art generation',
      image: '/placeholder.svg',
      linkType: 'external',
      link: 'https://www.midjourney.com/'
    },
    {
      id: '4',
      title: 'Imagen',
      description: 'Google\'s image generation AI',
      image: '/placeholder.svg',
      linkType: 'external',
      link: 'https://imagen.research.google/'
    }
  ]
};
