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
    image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=150&h=150&fit=crop",
    position: { top: "5%", left: "8%" },
    delay: 0.5
  },
  {
    id: 2,
    title: "42 Probiotic Strains",
    description: "Diverse beneficial bacteria that restore and maintain optimal gut microbiome balance.",
    image: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=150&h=150&fit=crop",
    position: { top: "8%", right: "5%" },
    delay: 1.0
  },
  {
    id: 3,
    title: "Raw Honey",
    description: "Natural prebiotic delivery system that protects and nourishes beneficial bacteria.",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=150&h=150&fit=crop",
    position: { top: "60%", left: "2%" },
    delay: 1.5
  },
  {
    id: 4,
    title: "Organic Herbs",
    description: "Carefully selected botanical extracts that support digestive wellness and vitality.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop",
    position: { top: "65%", right: "2%" },
    delay: 2.0
  }
];

export function AnimatedKeyIngredients() {
  const [isVisible, setIsVisible] = useState(false);
  const [particlePositions, setParticlePositions] = useState<{left: string, top: string}[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section ref={sectionRef} className="pt-6 pb-40 px-4" style={{ backgroundColor: '#fefefc' }}>
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
        <div className="relative min-h-[500px] flex items-center justify-center">
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
                width={350}
                height={400}
                className="drop-shadow-2xl"
                sizes="350px"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#8bccc2]/20 to-[#8bccc2]/10 rounded-full blur-3xl scale-110 -z-10" />
            </div>
          </div>

          {/* Ingredient Cards */}
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className={cn(
                "absolute w-64 transition-all duration-1000 ease-out",
                isVisible 
                  ? "opacity-100 translate-y-0 scale-100" 
                  : "opacity-0 translate-y-8 scale-90"
              )}
              style={{
                ...ingredient.position,
                transitionDelay: `${ingredient.delay}s`
              }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                {/* Ingredient Image */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-16 h-16 rounded-[9px] overflow-hidden ring-4 ring-[#8bccc2]/20">
                    <Image
                      src={ingredient.image}
                      alt={ingredient.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {ingredient.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
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
          ))}

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
