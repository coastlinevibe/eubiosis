"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextSplitProps {
  children: string;
  className?: string;
  topClassName?: string;
  bottomClassName?: string;
  maxMove?: number;
  falloff?: number;
  autoDemo?: boolean;
  autoDemoDelay?: number;
  align?: 'left' | 'center' | 'right';
}

export const TextSplit = ({
  children,
  className,
  topClassName,
  bottomClassName,
  maxMove = 50,
  falloff = 0.3,
  autoDemo = false,
  autoDemoDelay = 1000,
  align = 'center',
}: TextSplitProps) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [demoIndex, setDemoIndex] = useState<number | null>(null);

  useEffect(() => {
    if (autoDemo) {
      const timer = setTimeout(() => {
        // Start demo animation from the middle of the text
        const middleIndex = Math.floor(children.length / 2);
        setDemoIndex(middleIndex);
        
        // Animate through the text
        let currentIndex = 0;
        const demoInterval = setInterval(() => {
          setDemoIndex(currentIndex);
          currentIndex++;
          
          if (currentIndex >= children.length) {
            // Reset and end demo
            setTimeout(() => {
              setDemoIndex(null);
            }, 500);
            clearInterval(demoInterval);
          }
        }, 150);
        
        return () => clearInterval(demoInterval);
      }, autoDemoDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoDemo, autoDemoDelay, children.length]);

  const getOffset = (index: number) => {
    const activeIndex = hoverIndex !== null ? hoverIndex : demoIndex;
    if (activeIndex === null) return 0;
    const distance = Math.abs(index - activeIndex);
    return Math.max(0, maxMove * (1 - distance * falloff));
  };

  const getJustifyClass = () => {
    switch (align) {
      case 'left': return 'justify-start';
      case 'right': return 'justify-end';
      default: return 'justify-center';
    }
  };

  return (
    <div
      className={cn(`relative flex items-center ${getJustifyClass()}`, className)}
    >
      {children.split("").map((char, index) => {
        const offset = getOffset(index);
        const displayChar = char === " " ? "\u00A0" : char;

        return (
          <div
            key={`${char}-${index}`}
            className="relative flex flex-col h-[1em] w-auto leading-none"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <motion.span
              initial={false}
              animate={{
                y: `-${offset}%`,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn("overflow-hidden", topClassName)}
            >
              {displayChar}
            </motion.span>

            <motion.span
              initial={false}
              animate={{
                y: `${offset}%`,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn("overflow-hidden", bottomClassName)}
            >
              <span className="block -translate-y-1/2">{displayChar}</span>
            </motion.span>
          </div>
        );
      })}
    </div>
  );
};
