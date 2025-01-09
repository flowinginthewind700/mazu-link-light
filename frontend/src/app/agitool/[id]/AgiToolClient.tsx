// app/agitool/[id]/AgiToolClient.tsx
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

export default function AgiToolClient() {
  const params = useParams();
  const router = useRouter();
  const [tool, setTool] = useState<AgiTool | null>(null);

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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">{tool.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={`${apiUrl}${tool.screenshot?.url || tool.imagelarge?.url}`}
                  alt={tool.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {tool.agitooltags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.tagname}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-lg">{tool.Description}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">By: {tool.author.name}</span>
                </div>
                {tool.author.twitter && (
                  <div className="flex items-center gap-2">
                    <Twitter className="w-4 h-4" />
                    <a
                      href={`https://twitter.com/${tool.author.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      @{tool.author.twitter}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Submitted: {new Date(tool.submissionDate).toLocaleDateString()}</span>
                </div>
                <div className="text-sm">
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
                <Button onClick={() => handleShare('facebook')} className="flex-1">
                  <Facebook className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button onClick={() => handleShare('twitter')} className="flex-1">
                  <Twitter className="w-4 h-4 mr-2" />
                  Tweet
                </Button>
                <Button onClick={() => handleShare('linkedin')} className="flex-1">
                  <Linkedin className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button onClick={() => handleShare('copy')} className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="prose dark:prose-invert max-w-none p-6">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeRenderer,
                div: BlockNode,
                a: ({ node, ...props }: any) => (
                  <a {...props} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" />
                ),
              }}
            >
              {tool.content}
            </ReactMarkdown>
          </CardContent>
        </Card>
      </div>
    </>
  );
}