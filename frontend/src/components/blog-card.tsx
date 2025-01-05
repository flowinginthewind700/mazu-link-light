import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL || '';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  slug: string;
  date: string;
  category: {
    name: string;
    slug: string;
  };
  cover: Array<{
    formats: {
      small: {
        url: string;
      };
    };
  }>;
}

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const coverImage = post.cover && post.cover[0]?.formats?.small?.url
  ? `${apiUrl}${post.cover[0].formats.small.url}`
  : '/images/default_blog.jpg'

  return (
    <Link href={`/blog/${post.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="relative aspect-video"
        >
          <Image
            src={coverImage}
            alt={post.title}
            layout="fill"
            objectFit="cover"
          />
        </motion.div>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h2>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.description}</p>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{new Date(post.date).toLocaleDateString()}</span>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
              {post.category.name}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

