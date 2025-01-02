export interface Tool {
  id: string;
  name: string;
  description: string;
  image: string;
  pricing: string;
  tags: string[];
  accessLink: string;
  codeLink?: string;
  author: string;
  submissionDate: string;
  content: string;
  category: string;
  internalPath?: string;
}

export const toolsData: Tool[] = [
  {
    id: 'image-compression',
    name: 'Image Compression',
    description: 'Smart image compression tool for optimizing website performance',
    image: '/images/imagecompression.jpg',
    pricing: 'Free',
    tags: ['Image', 'Compression', 'Optimization'],
    accessLink: '/tools/image-compression',
    author: 'AI Tools Directory',
    submissionDate: '2024-01-02',
    category: 'image',
    internalPath: '/tools/image-compression',
    content: `
# Image Compression Tool

Our smart image compression tool helps you optimize images for better website performance. 
Features include:

- Drag and drop interface
- Batch processing up to 20 images
- Quality adjustment
- WebP conversion
- Individual and bulk downloads
- Client-side processing
- No file size limits

## How to Use

1. Drop your images in the upload area
2. Adjust compression settings
3. Download compressed images individually or in bulk
4. Enjoy faster website loading times!
    `,
  },
  // ... other tools
];

export const tools = toolsData;

