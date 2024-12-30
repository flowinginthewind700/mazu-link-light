export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
}

export const tools: Tool[] = [
  {
    id: '1',
    name: 'Outpaint image with flux model',
    description: 'Outpaint the image with the flux model, guided by prompts.',
    category: 'image',
    image: '/placeholder.svg',
  },
  {
    id: '2',
    name: 'Face retoucher',
    description: 'Retouches faces to smooth skin and remove blemishes.',
    category: 'image',
    image: '/placeholder.svg',
  },
  {
    id: '3',
    name: 'Background Remover',
    description: 'Remove the background from your image with our AI-powered tool.',
    category: 'image',
    image: '/placeholder.svg',
  },
  {
    id: '4',
    name: 'Face to sticker',
    description: 'Create sticker from face.',
    category: 'image',
    image: '/placeholder.svg',
  },
  {
    id: '5',
    name: 'AuraSr V2 Upscaler',
    description: 'Upscale your image with our AuraSr AI tool.',
    category: 'image',
    image: '/placeholder.svg',
  },
  {
    id: '6',
    name: 'Creative Upscaler',
    description: 'Creative way to upscale your image to add details with prompt.',
    category: 'image',
    image: '/placeholder.svg',
  },
]

