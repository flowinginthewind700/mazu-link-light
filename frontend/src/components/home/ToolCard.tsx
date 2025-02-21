import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Info } from 'lucide-react';
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
    if (tool.accessLink) {
      window.open(tool.accessLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-4 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div className="relative space-y-5 overflow-hidden rounded-2xl bg-white/5 p-4 shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
            <div className="h-16 w-16 rounded-lg bg-white/5"></div>
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
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative rounded-lg bg-white dark:bg-gray-800 p-4 hover:shadow-xl transition-all group"
    >
      {/* 移除了外层的 overflow-hidden，避免影响 Tooltip */}
      <Link href={`/agitool/${tool.id}`} passHref>
        <div className="flex items-center gap-4 cursor-pointer relative z-10">
          <motion.div 
            whileHover={{ rotate: 360 }} 
            transition={{ duration: 0.5 }}
            className="relative w-16 h-16 rounded-lg overflow-hidden shadow-md"
          >
            <Image
              src={`${apiUrl}${tool.iconimage.formats?.thumbnail?.url || tool.iconimage.url}`}
              alt={tool.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground group-hover:text-gray-900 dark:group-hover:text-gray-100 truncate">
                {tool.name}
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to view details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-muted-foreground group-hover:text-gray-700 dark:group-hover:text-gray-300 line-clamp-2">
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
                initial={{ scale: 0.9 }}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExternalClick}
                className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground transition-all duration-300 shadow-md group-hover:opacity-100 opacity-70 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 group-hover:from-green-600 group-hover:to-green-400 dark:group-hover:from-green-700 dark:group-hover:to-green-500 hover:from-green-500 hover:to-green-300 dark:hover:from-green-600 dark:hover:to-green-400 z-20"
              >
                <ExternalLink className="w-5 h-5" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-gray-900 text-white z-30">
              <p>Visit external tool</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Border Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 border-2 border-transparent rounded-lg"
          whileHover={{
            borderColor: "rgba(108, 117, 125, 0.5)",
          }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/10 to-transparent animate-[shine_3s_infinite]" />
      </div>
    </motion.div>
  );
};

export default ToolCard;