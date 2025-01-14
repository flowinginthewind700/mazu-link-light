'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, User, Twitter, Facebook, Linkedin, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Navigation } from '@/components/navigation';
import { BottomNavbar } from '@/components/bottom-navbar';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL || '';

interface AgiTool {
  id: string;
  name: string;
  Description: string;
  price: string;
  accessLink: string;
  internalPath: string | null;
  author: {
    name: string;
    avatar: string;
    twitter: string;
  };
  submissionDate: string;
  content: string;
  screenshot: {
    url: string;
  };
  imagelarge: {
    url: string;
  };
  agitooltags: Array<{
    id: string;
    tagname: string;
  }>;
}

const CodeRenderer = ({ node, ...props }: any) => (
  <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded" {...props} />
);

const BlockNode = ({ node, ...props }: any) => (
  <div className="my-4" {...props} />
);

const ImageZoomDialog: React.FC<{ isOpen: boolean; onClose: () => void; imageUrl: string }> = ({ isOpen, onClose, imageUrl }) => {
  const [dialogSize, setDialogSize] = useState({ width: 'auto', height: 'auto' });

  useEffect(() => {
    if (isOpen && imageUrl) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.onload = () => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;

        let width, height;

        if (imgWidth > screenWidth || imgHeight > screenHeight) {
          const widthRatio = screenWidth / imgWidth;
          const heightRatio = screenHeight / imgHeight;
          const ratio = Math.min(widthRatio, heightRatio) * 0.9; // 90% of the screen
          width = Math.round(imgWidth * ratio);
          height = Math.round(imgHeight * ratio);
        } else {
          width = imgWidth;
          height = imgHeight;
        }

        setDialogSize({ 
          width: `${width}px`, 
          height: `${height}px` 
        });
      };
    }
  }, [isOpen, imageUrl]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/75 z-[100]" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[101] flex items-center justify-center p-4"
          style={{ width: dialogSize.width, height: dialogSize.height }}
        >
          <TransformWrapper>
            <TransformComponent>
              <img src={imageUrl} alt="Zoomed image" className="w-full h-full object-contain rounded-lg shadow-xl" />
            </TransformComponent>
          </TransformWrapper>
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default function AgiToolClient() {
  const params = useParams();
  const router = useRouter();
  const [tool, setTool] = useState<AgiTool | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchToolDetails();
  }, [params.id]);

  const fetchToolDetails = async () => {
    try {
      const query = `
        query($id: ID!) {
          agitool(id: $id) {
            id
            name
            Description
            price
            accessLink
            internalPath
            author {
              name
              avatar
              twitter
            }
            submissionDate
            content
            screenshot {
              url
            }
            imagelarge {
              url
            }
            agitooltags {
              id
              tagname
            }
          }
        }
      `;
      const response = await axios.post(`${apiUrl}/graphql`, {
        query,
        variables: { id: params.id },
      });
      setTool(response.data.data.agitool);
    } catch (error) {
      console.error('Error fetching tool details:', error);
    }
  };

  const handleAccessTool = () => {
    if (tool?.internalPath) {
      router.push(tool.internalPath);
    } else if (tool?.accessLink) {
      window.open(tool.accessLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `AGIEntry tool share: ${tool?.name} -- ${tool?.Description}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedText}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(`${text} ${url}`);
        alert('Link and title copied to clipboard!');
        break;
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setZoomedImage(imageUrl);
  };

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navigation currentPage="" showMobileMenu={false} />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl dark:text-white">{tool.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={`${apiUrl}${tool.screenshot?.url || tool.imagelarge?.url}`}
                  alt={tool.name}
                  fill
                  className="object-cover cursor-zoom-in"
                  onClick={() => handleImageClick(`${apiUrl}${tool.screenshot?.url || tool.imagelarge?.url}`)
                  loading="lazy"
                }
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {tool.agitooltags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="dark:bg-gray-700 dark:text-gray-200">
                    {tag.tagname}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-lg dark:text-gray-300">{tool.Description}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 dark:text-gray-300" />
                  <span className="text-sm dark:text-gray-300">By: {tool.author.name}</span>
                </div>
                {tool.author.twitter && (
                  <div className="flex items-center gap-2">
                    <Twitter className="w-4 h-4 dark:text-gray-300" />
                    <a
                      href={`https://x.com/intent/follow?screen_name=${tool.author.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline dark:text-blue-400"
                    >
                      @{tool.author.twitter}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 dark:text-gray-300" />
                  <span className="text-sm dark:text-gray-300">Submitted: {new Date(tool.submissionDate).toLocaleDateString()}</span>
                </div>
                <div className="text-sm dark:text-gray-300">
                  <strong>Pricing:</strong> {tool.price}
                </div>
              </div>
              <Button onClick={handleAccessTool} className="w-full">
                <span className="flex items-center justify-center gap-2">
                  {tool.internalPath ? 'Use Tool' : 'Access Tool'}
                  {!tool.internalPath && <ExternalLink className="w-4 h-4" />}
                </span>
              </Button>
              <div className="flex gap-4">
                <button onClick={() => handleShare('facebook')} className="p-2 rounded-full bg-[#1877f2] text-white hover:bg-[#1877f2]/90">
                  <Facebook className="w-5 h-5" />
                </button>
                <button onClick={() => handleShare('twitter')} className="p-2 rounded-full bg-[#1da1f2] text-white hover:bg-[#1da1f2]/90">
                  <Twitter className="w-5 h-5" />
                </button>
                <button onClick={() => handleShare('linkedin')} className="p-2 rounded-full bg-[#0a66c2] text-white hover:bg-[#0a66c2]/90">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button onClick={() => handleShare('copy')} className="p-2 rounded-full bg-[#ff4500] text-white hover:bg-[#ff4500]/90">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="prose dark:prose-invert max-w-none p-4">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeRenderer,
                div: BlockNode,
                a: ({ node, ...props }: any) => (
                  <a {...props} className="text-blue-500 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer" />
                ),
                img: ({ node, ...props }: any) => (
                  <img
                    {...props}
                    className="cursor-zoom-in"
                    onClick={() => handleImageClick(props.src)}
                  />
                ),
              }}
            >
              {tool.content}
            </ReactMarkdown>
          </CardContent>
        </Card>
      </div>

      <ImageZoomDialog
        isOpen={!!zoomedImage}
        onClose={() => setZoomedImage(null)}
        imageUrl={zoomedImage || ''}
      />
    </>
  );
}