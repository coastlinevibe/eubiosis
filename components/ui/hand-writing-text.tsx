"use client";

import { motion } from "framer-motion";

interface HandWrittenTitleProps {
  title?: string;
  subtitle?: string;
  color?: string;
  normalPrice?: string;
  otoPrice?: string;
  savings?: string;
}

function HandWrittenTitle({
  title = "Hand Written",
  subtitle = "Optional subtitle",
  color = "#000000",
  normalPrice,
  otoPrice,
  savings,
}: HandWrittenTitleProps) {


  return (
    <div 
      className="relative w-80 h-48 mx-auto"
      style={{
        transform: 'rotate(-15deg) scale(0.85)'
      }}
    >
      <div className="absolute inset-0">
        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 600"
          className="w-full h-full"
        >
          <title>KokonutUI</title>
          <motion.path
            d="M 950 90 C 1250 300, 1050 480, 600 520C 250 520, 150 480, 150 300C 150 120, 350 80, 600 80C 850 80, 950 180, 950 180"
            fill="none"
            strokeWidth="12"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 1, 0], 
              opacity: [0, 1, 1, 0] 
            }}
            transition={{ 
              duration: 6, 
              ease: "easeInOut",
              repeat: Infinity,
              times: [0, 0.3, 0.7, 1]
            }}
          />
        </motion.svg>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
        {normalPrice && otoPrice ? (
          // New pricing format
          <>
            <motion.p
              className="text-sm text-red-500 line-through font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 1, 0] }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                times: [0, 0.3, 0.4, 0.7, 1]
              }}
            >
              {normalPrice}
            </motion.p>
            <motion.h1
              className="text-2xl font-bold text-black tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: [0, 0, 1, 1, 0],
                y: [10, 10, 0, 0, 10]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                times: [0, 0.35, 0.45, 0.7, 1]
              }}
            >
              {otoPrice}
            </motion.h1>
            {savings && (
              <motion.p
                className="text-lg text-green-600 font-semibold mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 1, 1, 0] }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  times: [0, 0.4, 0.5, 0.7, 1]
                }}
              >
                {savings}
              </motion.p>
            )}
          </>
        ) : (
          // Original format
          <>
            <motion.h1
              className="text-2xl font-bold text-black tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                className="text-lg text-green-600 font-semibold mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.8 }}
              >
                {subtitle}
              </motion.p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export { HandWrittenTitle };