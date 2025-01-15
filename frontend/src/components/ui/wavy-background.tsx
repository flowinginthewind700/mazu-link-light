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
    ? ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]
    : ["#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#06b6d4"]
  );

  const fillColor = backgroundFill || (isDarkMode ? "rgba(31, 41, 55, 0.5)" : "rgba(255, 255, 255, 0.5)");

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
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 z-0 opacity-60 blur-xl transition duration-500",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
        )}
      />
      {waveColors.map((color, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: color,
            opacity: waveOpacity * 0.2,
          }}
          animate={{
            y: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 10 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: fillColor, opacity: waveOpacity }}
      />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};

export default WavyBackground;
