import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Code, Calendar, User } from 'lucide-react'
import Markdown from 'react-markdown'

interface ToolInfo {
  id: string
  name: string
  description: string
  image: string
  pricing: string
  tags: string[]
  accessLink: string
  codeLink?: string
  author: string
  submissionDate: string
  content: string
}

interface ExternalToolInfoProps {
  tool: ToolInfo
  similarTools: ToolInfo[]
}

export function ExternalToolInfo({ tool, similarTools }: ExternalToolInfoProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardContent className="p-6">
            <Image
              src={tool.image}
              alt={tool.name}
              width={600}
              height={400}
              className="w-full h-auto rounded-lg"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{tool.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{tool.description}</p>
            <div>
              <strong>Pricing:</strong> {tool.pricing}
            </div>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink size={16} />
              <Link href={tool.accessLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Access Tool
              </Link>
            </div>
            {tool.codeLink && (
              <div className="flex items-center gap-2">
                <Code size={16} />
                <Link href={tool.codeLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  View Code
                </Link>
              </div>
            )}
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Submitted by: {tool.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Submission Date: {tool.submissionDate}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-12">
        <CardContent className="p-6">
          <Markdown className="prose dark:prose-invert max-w-none">
            {tool.content}
          </Markdown>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-6">Similar Tools</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {similarTools.map((similarTool) => (
          <Card key={similarTool.id}>
            <CardHeader>
              <CardTitle>{similarTool.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{similarTool.description}</p>
              <Link href={`/tool/${similarTool.id}`}>
                <Button variant="outline">Learn More</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

