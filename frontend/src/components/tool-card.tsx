import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Tool } from '@/data/tools-data'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const CardContentComponent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full glass-card hover-glow animated-border">
        <CardHeader className="p-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardTitle className="text-lg gradient-text">{tool.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <motion.div 
            className="relative aspect-[16/9] w-full overflow-hidden rounded-lg group"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 shine-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Image
              src={tool.image}
              alt={tool.name}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          </motion.div>
          <motion.div 
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {tool.tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.2 }}
                  className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors duration-200 hover-glow"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return tool.internalPath ? (
    <Link href={tool.internalPath} className="block h-full">{CardContentComponent}</Link>
  ) : (
    CardContentComponent
  )
}
