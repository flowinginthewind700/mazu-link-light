"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/components/lib/utils";

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  backgroundFill?: string;
  waveOpacity?: number;
  height?: string;
  animate?: boolean;
  [key: string]: any;
}

export const WavyBackground: React.FC<WavyBackgroundProps> = ({
  children,
  className,
  containerClassName,
  colors,
  backgroundFill,
  waveOpacity = 0.5,
  height = "400px",
  animate = true,
  ...props
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener("change", handleChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  const waveColors = colors ?? (isDarkMode
    ? ["#1e40af", "#3730a3", "#6d28d9", "#86198f", "#0f766e"]
    : ["#60a5fa", "#818cf8", "#a78bfa", "#e879f9", "#34d399"]
  );

  const fillColor = backgroundFill || (isDarkMode ? "rgba(17, 24, 39, 0.7)" : "rgba(255, 255, 255, 0.7)");

  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden",
        containerClassName
      )}
      style={{ height }}
    >
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 30,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 z-0 opacity-70 blur-2xl transition duration-1000",
          isDarkMode
            ? "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900 via-purple-900 to-pink-900"
            : "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-400 via-purple-400 to-pink-400"
        )}
      />
      {waveColors.map((color, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: color,
            opacity: waveOpacity * 0.15,
          }}
          animate={{
            y: ["0%", "100%", "0%"],
            x: [`${index * 5}%`, `${(index + 1) * 10}%`, `${index * 5}%`],
          }}
          transition={{
            duration: 15 + index * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: fillColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: waveOpacity }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className={cn("relative z-10", className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default WavyBackground;
