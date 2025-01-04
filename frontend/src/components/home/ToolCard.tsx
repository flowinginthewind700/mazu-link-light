import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tool } from './types';

interface ToolCardProps {
  tool: Tool;
  apiUrl: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, apiUrl }) => {
  return (
    <Link href={`/agitool/${tool.id}`} className="block">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 p-4 rounded-lg border hover:shadow-md transition-shadow bg-background/50 backdrop-blur-sm card-hover-effect glow-effect"
      >
        <Image
          src={`${apiUrl}${tool.iconimage.formats?.thumbnail?.url || tool.iconimage.url}`}
          alt={tool.name}
          width={40}
          height={40}
          className="rounded-lg"
        />
        <div>
          <h3 className="font-medium hover:underline">{tool.name}</h3>
          <p className="text-sm text-muted-foreground">{tool.Description}</p>
        </div>
      </motion.div>
    </Link>
  );
};
