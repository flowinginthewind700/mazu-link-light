import React from 'react';
import { motion } from 'framer-motion';

interface AGIEntryLogoProps {
  className?: string;
}

const AGIEntryLogo: React.FC<AGIEntryLogoProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-32 h-32 ${className}`}>
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 dark:from-purple-700 dark:to-blue-700 rounded-2xl shadow-lg overflow-hidden"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 rounded-2xl m-1" />
      <div className="absolute inset-0 flex flex-col justify-between p-2">
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">AGI</div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 self-end">Entry</div>
      </div>
      <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-purple-500 dark:border-purple-400 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-blue-500 dark:border-blue-400 rounded-bl-2xl" />
    </div>
  );
};

export default AGIEntryLogo;
