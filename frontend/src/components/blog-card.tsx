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
      <motion.div 
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Card className="overflow-hidden h-full transition-all duration-300 bg-gradient-to-br from-gray-100/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl">
          <CardContent className="p-4">
            <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
              <Image
                src={coverImage}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
            <h2 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-800 dark:text-gray-200">{post.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{post.description}</p>
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span>{new Date(post.date).toLocaleDateString()}</span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                {post.category.name}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}
