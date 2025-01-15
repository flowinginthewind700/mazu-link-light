import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SquareArrowOutUpRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tool } from './types';
import { motion } from 'framer-motion';

interface ToolCardProps {
  tool: Tool;
  apiUrl: string;
  loading?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, apiUrl, loading }) => {
  const handleExternalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(tool.accessLink, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div className="relative space-y-5 overflow-hidden rounded-2xl bg-white/5 p-4 shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
            <div className="h-12 w-12 rounded-lg bg-white/5"></div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="h-4 w-3/5 rounded-lg bg-white/5"></div>
            <div className="h-3 w-4/5 rounded-lg bg-white/10"></div>
            <div className="h-3 w-2/5 rounded-lg bg-white/5"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:shadow-lg transition-all group"
    >
      <Link href={`/agitool/${tool.id}`} passHref>
        <div className="flex items-center gap-4 cursor-pointer">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <Image
              src={`${apiUrl}${tool.iconimage.formats?.thumbnail?.url || tool.iconimage.url}`}
              alt={tool.name}
              width={48}
              height={48}
              className="rounded-lg"
              loading="lazy"
            />
          </motion.div>
          <div>
            <h3 className="font-medium text-foreground group-hover:text-gray-900 dark:group-hover:text-gray-100">
              {tool.name}
            </h3>
            <p className="text-sm text-muted-foreground group-hover:text-gray-700 dark:group-hover:text-gray-300">
              {tool.Description}
            </p>
          </div>
        </div>
      </Link>
      {tool.accessLink && !tool.internalPath && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleExternalClick}
                className="absolute top-4 right-4 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
              >
                <SquareArrowOutUpRight className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Access External Tool</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ opacity: 0, x: '-100%' }}
        whileHover={{ opacity: 1, x: '100%' }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
};
