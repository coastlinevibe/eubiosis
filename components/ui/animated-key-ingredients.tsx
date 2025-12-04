"use client"

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Ingredient {
  id: number;
  title: string;
  description: string;
  image: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  delay: number;
}

const ingredients: Ingredient[] = [
  {
    id: 1,
    title: "Fulvic Acid",
    description: "Boosts nutrient transport and cellular absorption for maximum effectiveness.",
    image: "/images/Fulvic Acid.avif",
    position: { top: "5%", left: "8%" },
    delay: 0.5
  },
  {
    id: 2,
    title: "42 Probiotic Strains",
    description: "Diverse beneficial bacteria that restore and maintain optimal gut microbiome balance.",
    image: "/images/42 Probiotic Strains.webp",
    position: { top: "8%", right: "5%" },
    delay: 1.0
  },
  {
    id: 3,
    title: "Raw Honey",
    description: "Natural prebiotic delivery system that protects and nourishes beneficial bacteria.",
    image: "/images/Raw Honey.jpg",
    position: { top: "60%", left: "2%" },
    delay: 1.5
  },
  {
    id: 4,
    title: "Untouched African Soil",
    description: "Pristine soil microorganisms that provide essential minerals and beneficial bacteria.",
    image: "/images/Untouched African Soil.jpg",
    position: { top: "65%", right: "2%" },
    delay: 2.0
  }
];

// Mobile positions for cards around bottle - 2 column layout
const mobilePositions = [
  { top: "5%", left: "2%" },      // Left top
  { top: "5%", right: "2%", left: "auto" },  // Right top
  { top: "auto", bottom: "5%", left: "2%" }, // Left bottom
  { top: "auto", bottom: "5%", right: "2%", left: "auto" }  // Right bottom
];

export function AnimatedKeyIngredients() {
  const [isVisible, setIsVisible] = useState(false);
  const [particlePositions, setParticlePositions] = useState<{left: string, top: string}[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const doodleBackgroundStyle = {
    backgroundImage:
      "linear-gradient(rgba(246,242,234,0.90), rgba(246,242,234,0.90)), url(/images/webbg.jpg)",
    backgroundSize: '300px',
    backgroundPosition: 'center',
    backgroundRepeat: 'repeat',
  } as const;

  useEffect(() => {
    // Generate random positions only on client
    setParticlePositions(
      [...Array(8)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }))
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="pt-6 pb-40 px-4" style={doodleBackgroundStyle}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-8 items-center mb-8">
          {/* Left Side - Heading */}
          <div className="text-left">
            <span className="text-[#8bccc2] font-semibold text-sm uppercase tracking-wider block mb-4">
              Natural Gut Health. Real Results.
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text">
              Key Ingredients
            </h2>
          </div>

          {/* Middle - Separator Line */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-40 h-px">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8bccc2] to-transparent rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#78b4aa] to-transparent rounded-full opacity-80"></div>
            </div>
          </div>

          {/* Right Side - Description */}
          <div className="text-left lg:text-right">
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              Each ingredient is carefully selected and scientifically proven to support optimal gut health and overall wellness
            </p>
          </div>
        </div>

        {/* Ingredients Layout */}
        <div className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center px-2 md:px-0">
          {/* Central Bottle */}
          <div 
            className={cn(
              "relative z-10 transition-all duration-1000 ease-out",
              isVisible 
                ? "opacity-100 scale-100 translate-y-0" 
                : "opacity-0 scale-75 translate-y-8"
            )}
            style={{ transitionDelay: '0.2s' }}
          >
            <div className="relative">
              <Image
                src="/images/bottles/bottle-combo.png"
                alt="Eubiosis Bottles"
                width={280}
                height={320}
                className="drop-shadow-2xl md:w-[350px] md:h-[400px]"
                sizes="(max-width: 768px) 280px, 350px"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#8bccc2]/20 to-[#8bccc2]/10 rounded-full blur-3xl scale-110 -z-10" />
            </div>
          </div>

          {/* Ingredient Cards */}
          {ingredients.map((ingredient, index) => {
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            const position = isMobile ? mobilePositions[index] : ingredient.position;
            
            return (
            <div
              key={ingredient.id}
              className={cn(
                "absolute w-40 md:w-64 transition-all duration-1000 ease-out z-20",
                isVisible 
                  ? "opacity-100 translate-y-0 scale-100" 
                  : "opacity-0 translate-y-8 scale-90"
              )}
              style={{
                ...position,
                transitionDelay: `${ingredient.delay}s`
              }}
            >
              <div className="bg-white rounded-lg md:rounded-2xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                {/* Ingredient Image */}
                <div className="flex justify-center mb-2 md:mb-4">
                  <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-[9px] overflow-hidden ring-4 ring-[#8bccc2]/20">
                    <Image
                      src={ingredient.image}
                      alt={ingredient.title}
                      fill
                      sizes="(max-width: 768px) 48px, 64px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">
                    {ingredient.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    {ingredient.description}
                  </p>
                </div>

                {/* Connection Line to Bottle */}
                <div 
                  className={cn(
                    "absolute w-px bg-gradient-to-r from-[#8bccc2]/40 to-transparent transition-all duration-1000",
                    isVisible ? "opacity-100" : "opacity-0"
                  )}
                  style={{
                    height: '60px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    ...(ingredient.position.top ? { bottom: '-60px' } : { top: '-60px' }),
                    transitionDelay: `${ingredient.delay + 0.5}s`
                  }}
                />
              </div>
            </div>
            );
          })}

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating particles */}
            {particlePositions.map((pos, i) => (
              <div
                key={i}
                className={cn(
                  "absolute w-2 h-2 bg-[#8bccc2]/20 rounded-full transition-all duration-1000",
                  isVisible ? "opacity-100" : "opacity-0"
                )}
                style={{
                  left: pos.left,
                  top: pos.top,
                  animationDelay: `${i * 0.5}s`,
                  animation: isVisible ? 'float 6s ease-in-out infinite' : 'none'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(90deg); }
          50% { transform: translateY(-5px) rotate(180deg); }
          75% { transform: translateY(-15px) rotate(270deg); }
        }
      `}</style>
    </section>
  );
}
