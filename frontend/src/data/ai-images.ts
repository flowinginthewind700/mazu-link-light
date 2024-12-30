export interface AIImage {
  id: string;
  title: string;
  url: string;
  category: string;
  prompt?: string;
  negativePrompt?: string;
}

export const aiImages: AIImage[] = [
  {
    id: '1',
    title: 'Futuristic City',
    url: '/placeholder.svg',
    category: 'sci-fi',
    prompt: 'A futuristic cityscape with flying cars and neon lights',
    negativePrompt: 'old buildings, vintage cars, natural landscapes',
  },
  {
    id: '2',
    title: 'Mountain Landscape',
    url: '/placeholder.svg',
    category: 'landscapes',
    prompt: 'Majestic snow-capped mountains with a clear lake in the foreground',
    negativePrompt: 'urban areas, people, vehicles',
  },
  {
    id: '3',
    title: 'Abstract Art',
    url: '/placeholder.svg',
    category: 'abstract',
    prompt: 'Vibrant abstract painting with swirling colors and geometric shapes',
    negativePrompt: 'recognizable objects, realistic scenes',
  },
  {
    id: '4',
    title: 'Lion Portrait',
    url: '/placeholder.svg',
    category: 'animals',
    prompt: 'Close-up portrait of a majestic lion with a flowing mane',
    negativePrompt: 'domestic animals, urban environments',
  },
  // Add more images here...
]

