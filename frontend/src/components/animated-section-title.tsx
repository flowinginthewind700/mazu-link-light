import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

// Extend HTMLAttributes to include className and other standard props
interface AnimatedSectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  title: string;
  isActive: boolean;
}

export function AnimatedSectionTitle({ 
  title, 
  isActive, 
  className, 
  ...props 
}: AnimatedSectionTitleProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isActive) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <motion.h2
      className={cn(
        "relative text-lg font-semibold flex items-center gap-3 transition-all duration-300 ease-in-out",
        "text-gray-800 dark:text-gray-100",
        animate && "text-green-600 dark:text-green-400 scale-105",
        className
      )}
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* Animated Indicator */}
      <motion.span
        className="relative flex-shrink-0 w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700"
        animate={{
          scale: animate ? [1, 1.3, 1] : 1,
          boxShadow: animate 
            ? ["0 0 0 0 rgba(34, 197, 94, 0.7)", "0 0 8px 2px rgba(34, 197, 94, 0.7)", "0 0 0 0 rgba(34, 197, 94, 0.7)"]
            : "0 0 0 0 rgba(34, 197, 94, 0)",
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Subtle glow effect */}
        <span className="absolute inset-0 rounded-full bg-green-400/20 dark:bg-green-500/20 animate-pulse" />
      </motion.span>

      {/* Title Text */}
      <span className="relative z-10">{title}</span>

      {/* Underline Gradient Effect */}
      <motion.span
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent"
        initial={{ width: 0 }}
        animate={{ width: animate ? "100%" : "0%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </motion.h2>
  );
}