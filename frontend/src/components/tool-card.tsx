import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Tool } from '@/data/tools-data'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className="overflow-hidden h-full">
        <CardHeader className="p-4">
          <CardTitle className="text-lg">{tool.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <motion.div 
            className="relative aspect-[16/9] w-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={tool.image}
              alt={tool.name}
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.div 
            className="p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-sm text-muted-foreground">{tool.description}</p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

