'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

export const items = [
  {
    id: 1,
    url: '/images/gallery/1.jpg',
    title: 'Eubiosis-S Gallery Image 1',
  },
  {
    id: 2,
    url: '/images/gallery/2.jpg',
    title: 'Eubiosis-S Gallery Image 2',
  },
  {
    id: 3,
    url: '/images/gallery/3.jpg',
    title: 'Eubiosis-S Gallery Image 3',
  },
  {
    id: 4,
    url: '/images/gallery/4.jpg',
    title: 'Eubiosis-S Gallery Image 4',
  },
  {
    id: 5,
    url: '/images/gallery/5.jpg',
    title: 'Eubiosis-S Gallery Image 5',
  },
  {
    id: 6,
    url: '/images/gallery/6.jpg',
    title: 'Eubiosis-S Gallery Image 6',
  },
  {
    id: 7,
    url: '/images/gallery/9.jpg',
    title: 'Eubiosis-S Gallery Image 9',
  },
  {
    id: 8,
    url: '/images/gallery/10.jpg',
    title: 'Eubiosis-S Gallery Image 10',
  },
  {
    id: 9,
    url: '/images/gallery/11.jpg',
    title: 'Eubiosis-S Gallery Image 11',
  },
  {
    id: 10,
    url: '/images/gallery/11a.jpg',
    title: 'Eubiosis-S Gallery Image 11a',
  },
  {
    id: 11,
    url: '/images/gallery/11b.jpg',
    title: 'Eubiosis-S Gallery Image 11b',
  },
  {
    id: 12,
    url: '/images/gallery/12.jpg',
    title: 'Eubiosis-S Gallery Image 12',
  },
  {
    id: 13,
    url: '/images/gallery/12a.jpg',
    title: 'Eubiosis-S Gallery Image 12a',
  },
  {
    id: 14,
    url: '/images/gallery/12b.jpg',
    title: 'Eubiosis-S Gallery Image 12b',
  },
  {
    id: 15,
    url: '/images/gallery/12c.jpg',
    title: 'Eubiosis-S Gallery Image 12c',
  },
  {
    id: 16,
    url: '/images/gallery/13.jpg',
    title: 'Eubiosis-S Gallery Image 13',
  },
  {
    id: 17,
    url: '/images/gallery/13a.jpg',
    title: 'Eubiosis-S Gallery Image 13a',
  },
  {
    id: 18,
    url: '/images/gallery/13b.jpg',
    title: 'Eubiosis-S Gallery Image 13b',
  },
  {
    id: 19,
    url: '/images/gallery/13c.jpg',
    title: 'Eubiosis-S Gallery Image 13c',
  },
  {
    id: 20,
    url: '/images/gallery/16.jpg',
    title: 'Eubiosis-S Gallery Image 16',
  },
  {
    id: 21,
    url: '/images/gallery/16a.jpg',
    title: 'Eubiosis-S Gallery Image 16a',
  },
  {
    id: 22,
    url: '/images/gallery/18.jpg',
    title: 'Eubiosis-S Gallery Image 18',
  },
  {
    id: 23,
    url: '/images/gallery/18a.jpg',
    title: 'Eubiosis-S Gallery Image 18a',
  },
  {
    id: 24,
    url: '/images/gallery/19.jpg',
    title: 'Eubiosis-S Gallery Image 19',
  },

  {
    id: 26,
    url: '/images/gallery/24.jpg',
    title: 'Eubiosis-S Gallery Image 24',
  },
];

export function FramerCarousel() {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance functionality
  const [itemsPerView, setItemsPerView] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else {
        setItemsPerView(2);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        const maxIndex = items.length - itemsPerView;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 2700); // 2.7 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, itemsPerView]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 1;
      const slideWidth = containerWidth / itemsPerView;
      const targetX = -index * slideWidth;
      animate(x, targetX, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      });
    }
  }, [index, x, itemsPerView]);

  return (
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      {/* Section Title */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-black mb-4">
          Gut Balance Gallery
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#4AAE9B] to-[#F1C56B] mx-auto rounded-full"></div>
      </motion.div>

      <div className='flex flex-col gap-6'>
        <div 
          className='relative overflow-hidden rounded-2xl shadow-2xl' 
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div className='flex' style={{ x }}>
            {items.map((item) => (
              <div key={item.id} className={`shrink-0 h-[50vh] sm:h-[70vh] lg:h-[90vh] min-h-[300px] sm:min-h-[500px] lg:min-h-[800px] px-2 flex items-center justify-center ${itemsPerView === 1 ? 'w-full' : 'w-1/2'}`}>
                <img
                  src={item.url}
                  alt={item.title}
                  className='max-w-full max-h-full object-contain rounded-xl select-none pointer-events-none'
                  draggable={false}
                />
              </div>
            ))}
          </motion.div>

          {/* Previous Button */}
          <motion.button
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className={`absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 z-10 ${
              index === 0
                ? 'opacity-40 cursor-not-allowed'
                : 'bg-white/90 hover:scale-110 hover:bg-white hover:shadow-2xl opacity-80'
            }`}
          >
            <svg
              className='w-5 h-5 sm:w-8 sm:h-8'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </motion.button>

          {/* Next Button */}
          <motion.button
            disabled={index >= items.length - itemsPerView}
            onClick={() => setIndex((i) => Math.min(items.length - itemsPerView, i + 1))}
            className={`absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 z-10 ${
              index >= items.length - itemsPerView
                ? 'opacity-40 cursor-not-allowed'
                : 'bg-white/90 hover:scale-110 hover:bg-white hover:shadow-2xl opacity-80'
            }`}
          >
            <svg
              className='w-5 h-5 sm:w-8 sm:h-8'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </motion.button>

          {/* Progress Indicator */}
          <div className='absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 p-2 sm:p-3 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg overflow-x-auto max-w-[90%]'>
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 sm:h-3 rounded-full transition-all duration-300 hover:scale-110 flex-shrink-0 ${
                  i === index ? 'w-8 sm:w-10 bg-white shadow-md' : 'w-2 sm:w-3 bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}