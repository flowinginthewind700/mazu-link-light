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

  const darkModeColors = [
    "#004d40", // 深绿
    "#01579b", // 深蓝
    "#4a148c", // 深紫
    "#e65100", // 深橙
    "#880e4f", // 深粉
  ];

  const lightModeColors = [
    "#e0f2f1", // 非常淡的绿
    "#e1f5fe", // 非常淡的蓝
    "#f3e5f5", // 非常淡的紫
    "#fff3e0", // 非常淡的橙
    "#fce4ec", // 非常淡的粉
  ];

  const waveColors = colors ?? (isDarkMode ? darkModeColors : lightModeColors);

  const fillColor = backgroundFill || (isDarkMode ? "rgba(10, 15, 24, 0.7)" : "rgba(255, 255, 255, 0.5)");

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
        "relative rounded-3xl overflow-hidden",
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
          "absolute inset-0 z-0 opacity-60 group-hover:opacity-100 blur-xl transition duration-500",
          isDarkMode
            ? "bg-[radial-gradient(circle_farthest-side_at_0_100%,#004d40,transparent),radial-gradient(circle_farthest-side_at_100%_0,#4a148c,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#e65100,transparent),radial-gradient(circle_farthest-side_at_0_0,#01579b,#0a0f18)]"
            : "bg-[radial-gradient(circle_farthest-side_at_0_100%,#e0f2f1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#f3e5f5,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#fff3e0,transparent),radial-gradient(circle_farthest-side_at_0_0,#e1f5fe,#ffffff)]"
        )}
      />
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
          "absolute inset-0 z-[1]",
          isDarkMode
            ? "bg-[radial-gradient(circle_farthest-side_at_0_100%,#004d40,transparent),radial-gradient(circle_farthest-side_at_100%_0,#4a148c,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#e65100,transparent),radial-gradient(circle_farthest-side_at_0_0,#01579b,#0a0f18)]"
            : "bg-[radial-gradient(circle_farthest-side_at_0_100%,#e0f2f1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#f3e5f5,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#fff3e0,transparent),radial-gradient(circle_farthest-side_at_0_0,#e1f5fe,#ffffff)]"
        )}
      />
      {waveColors.map((color, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: color,
            opacity: isDarkMode ? waveOpacity * 0.3 : waveOpacity * 0.2,
          }}
          animate={{
            y: ["0%", "100%", "0%"],
            x: [`${index * 5}%`, `${(index + 1) * 10}%`, `${index * 5}%`],
          }}
          transition={{
            duration: 10 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: fillColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isDarkMode ? waveOpacity * 0.8 : waveOpacity * 0.5 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className={cn("relative z-20", className)}
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
