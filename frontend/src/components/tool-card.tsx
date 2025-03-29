import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tool } from '@/components/home/types'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const CardContentComponent = (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
      itemScope
      itemType="https://schema.org/SoftwareApplication"
      itemProp="applicationCategory"
      aria-label={`${tool.name} - AI Tool`}
    >
      <Card className="overflow-hidden h-full">
        <CardHeader className="p-4">
          <CardTitle className="text-lg" itemProp="name">{tool.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <motion.div 
            className="relative aspect-[16/9] w-full overflow-hidden rounded-lg"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={tool.image}
              alt={`${tool.name} - AI tool for ${tool.tags.join(', ')}`}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              itemProp="image"
            />
          </motion.div>
          <motion.div 
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-sm text-muted-foreground" itemProp="description">{tool.description}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                  itemProp="keywords"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {tool.pricing && (
              <p className="mt-2 text-sm text-muted-foreground" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <span itemProp="price">{tool.pricing}</span>
              </p>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.article>
  )

  return tool.internalPath ? (
    <Link 
      href={tool.internalPath}
      aria-label={`View details for ${tool.name}`}
      itemProp="url"
    >
      {CardContentComponent}
    </Link>
  ) : (
    CardContentComponent
  )
}
