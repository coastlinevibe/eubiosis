"use client";

import { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

interface BenefitItem {
  title: string;
  description: string;
}

interface BenefitGridProps {
  benefits: BenefitItem[];
}

export function BenefitGrid({ benefits }: BenefitGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const effectiveHoveredIndex = hoveredIndex;

  return (
    <section ref={sectionRef} className="py-2 px-4" style={{ backgroundColor: '#fefefc' }} suppressHydrationWarning>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="grid lg:grid-cols-3 grid-cols-1 gap-8 items-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Left Side - Heading */}
          <motion.div 
            className="text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <span className="text-[#8bccc2] font-semibold text-sm uppercase tracking-wider block mb-4">
              Natural Gut Health. Real Results.
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text">
              Key Benefits
            </h2>
          </motion.div>

          {/* Middle - Separator Line */}
          <motion.div 
            className="hidden lg:flex justify-center"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          >
            <div className="relative w-40 h-px">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8bccc2] to-transparent rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#78b4aa] to-transparent rounded-full opacity-80"></div>
            </div>
          </motion.div>

          {/* Right Side - Description */}
          <motion.div 
            className="text-left lg:text-right"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <p className="text-base lg:text-lg text-text/70 leading-relaxed">
              Discover what makes our formula exceptional with these certified benefits
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.8 + (index * 0.1), 
                ease: "easeOut" 
              }}
              className={`
                relative p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 
                cursor-pointer transition-all duration-500 hover:scale-110 hover:bg-white/90 hover:-translate-y-6 hover:shadow-2xl hover:rotate-1
                transform-gpu animate-float-${index % 4}
                ${effectiveHoveredIndex === index ? 'scale-110 bg-white/90 -translate-y-6 shadow-2xl rotate-1 animate-paused' : ''}
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Real Image Background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Image 
                  src={`/images/${benefit.title.replace(/%/g, '%25').replace(/\s+/g, '%20')}.png`}
                  alt={benefit.title}
                  fill
                  sizes="200px"
                  className="object-cover"
                  priority={index < 4} // Prioritize first 4 images
                  loading={index < 4 ? "eager" : "lazy"} // Eager load first 4, lazy load rest
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  onError={(e) => {
                    // Fallback to SVG if image fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="text-center h-full flex flex-col justify-center">
                {/* Video Placeholder Button - Centered by default, moves up on hover */}
                <div className={`
                  relative mb-4 transition-all duration-500 ease-out
                  ${effectiveHoveredIndex === index ? '-translate-y-8' : ''}
                `}>
                  {/* Tooltip - appears on hover */}
                  {effectiveHoveredIndex === index && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[#8bccc2] text-white text-sm px-3 py-1 rounded-lg shadow-lg z-20 whitespace-nowrap animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                      Click here
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#8bccc2]"></div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => setSelectedVideoIndex(index)}
                    className={`
                      w-16 h-16 bg-gradient-to-br from-[#8bccc2] to-[#78b4aa] 
                      flex items-center justify-center mx-auto transition-all duration-300
                      hover:scale-110 hover:rotate-12 relative overflow-hidden
                      ${effectiveHoveredIndex === index ? 'scale-110 rotate-12' : ''}
                    `}
                    style={{ borderRadius: '9px' }}
                  >
                    {/* Video placeholder background pattern */}
                    <div className="absolute inset-0 bg-black/20 opacity-50">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-6 h-4 bg-white/30 rounded-sm relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Play className={`
                      w-6 h-6 text-white transition-all duration-300 relative z-10
                      ${effectiveHoveredIndex === index ? 'rotate-12' : ''}
                    `} fill="white" />
                  </button>
                </div>
                
                {/* Title - Hidden by default, appears on hover */}
                <h3 className={`
                  text-xl font-bold text-[#8bccc2] mb-3 transition-all duration-500 ease-out
                  ${effectiveHoveredIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
                `}>
                  {benefit.title}
                </h3>
                
                {/* Description - Hidden by default, appears on hover */}
                <p className={`
                  text-sm text-text/70 leading-relaxed transition-all duration-700 ease-out delay-100
                  ${effectiveHoveredIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}>
                  {benefit.description}
                </p>
                
                {/* Progress Bar - Hidden by default, appears on hover */}
                <div className={`
                  h-1 bg-gradient-to-r from-[#8bccc2] to-[#78b4aa] mx-auto rounded-full mt-4
                  transition-all duration-500 ease-out delay-200
                  ${effectiveHoveredIndex === index ? 'w-full opacity-100' : 'w-0 opacity-0'}
                `}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Video Modal */}
      {selectedVideoIndex !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full bg-white rounded-2xl p-8 shadow-2xl">
            <button
              onClick={() => setSelectedVideoIndex(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {benefits[selectedVideoIndex].title}
              </h3>
              
              {/* Large Video Placeholder */}
              <div className="relative bg-gradient-to-br from-[#8bccc2] to-[#78b4aa] rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-video flex items-center justify-center relative">
                  {/* Video placeholder background pattern */}
                  <div className="absolute inset-0 bg-black/30">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-16 bg-white/20 rounded-lg relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Large Play Button */}
                  <div className="relative z-10 flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                      <Play className="w-10 h-10 text-white ml-1" fill="white" />
                    </div>
                    <p className="text-white text-lg font-medium">Video Coming Soon</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
                {benefits[selectedVideoIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
