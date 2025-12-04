"use client";

import { useState, useRef } from "react";
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const effectiveHoveredIndex = hoveredIndex;
  const doodleBackgroundStyle = {
    backgroundImage:
      "linear-gradient(rgba(246,242,234,0.90), rgba(246,242,234,0.90)), url(/images/webbg.jpg)",
    backgroundSize: '300px',
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat',
  } as const;

  return (
    <section ref={sectionRef} className="py-2 px-4" style={doodleBackgroundStyle} suppressHydrationWarning>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="grid lg:grid-cols-3 grid-cols-1 gap-4 md:gap-8 items-center mb-6 md:mb-8"
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
              Key Features
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
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4 max-w-4xl mx-auto"
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
                relative rounded-xl sm:rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 
                cursor-pointer transition-all duration-500 hover:scale-110 hover:bg-white/90 hover:-translate-y-6 hover:shadow-2xl hover:rotate-1
                transform-gpu animate-float-${index % 4} aspect-square flex items-center justify-center
                ${effectiveHoveredIndex === index ? 'scale-110 bg-white/90 -translate-y-6 shadow-2xl rotate-1 animate-paused' : ''}
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Real Image Background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none rounded-2xl overflow-hidden">
                <Image 
                  src={`/images/${benefit.title.replace(/%/g, '%25').replace(/\s+/g, '%20')}.png`}
                  alt={benefit.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain"
                  priority={index < 4}
                  loading={index < 4 ? "eager" : "lazy"}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="text-center w-full h-full flex flex-col justify-center items-center p-3 sm:p-4 md:p-6">
                {/* Title - Hidden by default, appears on hover */}
                <h3 className={`
                  text-lg md:text-xl font-bold text-[#8bccc2] mb-2 md:mb-3 transition-all duration-500 ease-out
                  ${effectiveHoveredIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
                `}>
                  {benefit.title}
                </h3>
                
                {/* Description - Hidden by default, appears on hover */}
                <p className={`
                  text-xs md:text-sm text-text/70 leading-relaxed transition-all duration-700 ease-out delay-100
                  ${effectiveHoveredIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}>
                  {benefit.description}
                </p>
                
                {/* Progress Bar - Hidden by default, appears on hover */}
                <div className={`
                  h-1 bg-gradient-to-r from-[#8bccc2] to-[#78b4aa] mx-auto rounded-full mt-3 md:mt-4
                  transition-all duration-500 ease-out delay-200
                  ${effectiveHoveredIndex === index ? 'w-full opacity-100' : 'w-0 opacity-0'}
                `}></div>

                {/* Press to read more - Shows on normal state, hidden on hover */}
                <div className={`
                  text-xs md:text-sm text-[#8bccc2] font-semibold transition-all duration-500 ease-out
                  ${effectiveHoveredIndex === index ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
                `}>
                  Press to read more
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
