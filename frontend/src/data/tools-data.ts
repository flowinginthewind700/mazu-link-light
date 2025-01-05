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
  {
    id: 'favicon-downloader',
    name: 'Favicon Downloader',
    description: 'Download favicons from any website',
    image: '/images/favicondownloader.jpg',
    pricing: 'Free',
    tags: ['Web', 'Icon', 'Download'],
    accessLink: '/tools/favicon-downloader',
    author: 'AI Tools Directory',
    submissionDate: '2024-01-03',
    category: 'web',
    internalPath: '/tools/favicon-downloader',
    content: `
# Favicon Downloader

Our Favicon Downloader tool allows you to easily download favicons from any website. Features include:

- Automatic URL protocol detection (https/http)
- Support for both PNG and ICO formats
- Simple and intuitive user interface
- Fast and efficient favicon retrieval

## How to Use

1. Enter the website URL in the input field
2. Click "Get Favicon" to fetch the icon
3. Once loaded, choose to download as PNG or ICO
4. Enjoy your downloaded favicon!

This tool is perfect for designers, developers, or anyone who needs to quickly grab a website's favicon.
    `,
  },
  // ... other tools
];

export const tools = toolsData;

