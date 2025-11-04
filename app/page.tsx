'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Zap, Shield, Sparkles, Droplet } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion';
import { EubiosisFeatures } from '@/components/ui/eubiosis-features'
import { BenefitGrid } from '@/components/ui/benefit-carousel'
import { AnimatedKeyIngredients } from '@/components/ui/animated-key-ingredients'
import EubiosisHero from '@/components/ui/eubiosis-hero'
import EubiosisTestimonials from '@/components/ui/eubiosis-testimonials'
import useExitIntent from '@/components/ui/exit-intent-popup'
import BottomNav from '@/components/BottomNav'
import { productSchema } from '@/lib/seo'

export default function Home() {
  const { ExitIntentPopup } = useExitIntent();
  
  // Add scroll state for bottom nav visibility
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Add state for view mode
  const [viewMode, setViewMode] = useState<'hero-only' | 'illness-selected' | 'browsing'>('hero-only');
  const [selectedIllness, setSelectedIllness] = useState<string | null>(null);
  const [cycling, setCycling] = useState(false);
  
  const illnesses = ['IBS', 'Diabetes', 'Anxiety', 'Depression', 'Autoimmune', 'Digestive Issues'];
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleIllnessClick = (illness: string) => {
    setCycling(false);
    setSelectedIllness(illness);
    setViewMode('illness-selected');
  }

  const handleBrowsingClick = () => {
    setCycling(true);
    setSelectedIllness(illnesses[0]);
    setViewMode('illness-selected');
  }

  const handleLearnMoreClick = () => {
    setViewMode('browsing');
    setSelectedIllness(null);
    // Scroll to the "What is eubiosis?" section after a short delay to allow the component to render
    setTimeout(() => {
      scrollToSection('what-is-eubiosis');
    }, 100);
  }

  const handlePrevIllness = () => {
    setSelectedIllness(prev => {
      if (prev === null) return illnesses[0];
      const currentIndex = illnesses.indexOf(prev);
      const prevIndex = (currentIndex - 1 + illnesses.length) % illnesses.length;
      return illnesses[prevIndex];
    });
  };

  const handleNextIllness = () => {
    setSelectedIllness(prev => {
      if (prev === null) return illnesses[0];
      const currentIndex = illnesses.indexOf(prev);
      const nextIndex = (currentIndex + 1) % illnesses.length;
      return illnesses[nextIndex];
    });
  };

  const handleDirectIllnessChange = (illnessName: string) => {
    setCycling(false);
    setSelectedIllness(illnessName);
  };

  const handleResetToHero = () => {
    setCycling(false);
    setViewMode('hero-only');
    setSelectedIllness(null);
    setHasScrolled(false); // Reset scroll state when going back to hero
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const benefits = [
    {
      title: "100% Natural",
      description: "Made from pure, natural ingredients without any artificial additives or synthetic compounds."
    },
    {
      title: "Vegan",
      description: "Completely plant-based formula suitable for vegans and vegetarians with no animal-derived ingredients."
    },
    {
      title: "Non GMO",
      description: "Free from genetically modified organisms, ensuring natural genetic integrity in all ingredients."
    },
    {
      title: "Gluten Free",
      description: "Safe for those with celiac disease or gluten sensitivity, certified gluten-free formulation."
    },
    {
      title: "Dairy Free",
      description: "Contains no dairy products, making it suitable for lactose intolerant individuals."
    },
    {
      title: "Allergen Free",
      description: "Carefully formulated to avoid common allergens, safe for sensitive individuals."
    },
    {
      title: "Recyclable",
      description: "Environmentally conscious packaging that can be recycled to reduce environmental impact."
    },
    {
      title: "Third Party Tested",
      description: "Independently verified for purity, potency, and safety by certified testing laboratories."
    }
  ];

  useEffect(() => {
    /** 
        very simply js to capture mouse position 
        and set variables to the % location. Everything else is css/svg.
    **/
    function moveBg(e: PointerEvent) {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        (e.target as HTMLElement).style.setProperty('--x', String((e.clientX - rect.x) / rect.width * 100));
        (e.target as HTMLElement).style.setProperty('--y', String((e.clientY - rect.y) / rect.height * 100));
    }
    document.querySelectorAll('.gooey-btn').forEach(button => {
      button.addEventListener('pointermove', moveBg as EventListener)
    });

    /** just some JS for the intro animation, nothing here is needed
    for the gooey interaction. **/
    let x: any;
    function intro() {
        let i = 4; 
        let buttons = document.querySelectorAll('.gooey-btn');
        buttons.forEach($b => {
          ($b as HTMLElement).style.setProperty( "--a", '100%' );
        });
        x = setInterval(() => {
            buttons.forEach($b => {
              ($b as HTMLElement).style.setProperty( 
                  "--x", String(((Math.cos(i) + 2) / 3.6) * 100)
              );
              ($b as HTMLElement).style.setProperty( 
                  "--y", String(((Math.sin(i) + 2) / 3.6) * 100)
              );
            });
            i+= 0.03;
            if ( i > 11.5 ) {
                clearInterval(x);
                buttons.forEach($b => {
                  ($b as HTMLElement).style.setProperty( "--a", '' );
                });
            }
        },16);
    }
    intro();
    document.querySelectorAll('.gooey-btn').forEach(button => {
      button.addEventListener('pointerover', (e) => {
        clearInterval(x);
        (e.target as HTMLElement).style.setProperty( "--a", '' );
      });
    });

    // Add console message when dev tools are opened
    const checkDevTools = () => {
      if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
        console.clear();
        console.log('%cEUBIOSIS', 'font-size: 72px; font-weight: bold; color: #8bccc2; text-align: center; margin: 20px;');
        console.log('%cWelcome to Eubiosis! 🌱', 'font-size: 24px; color: #78b4aa; text-align: center; margin: 10px;');
        console.log('%cGut Health. Real Results.', 'font-size: 18px; color: #666; text-align: center; margin: 10px;');
      }
    };

    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.shiftKey && e.key === 'C') || (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        console.clear();
        console.log('%cEUBIOSIS', 'font-size: 72px; font-weight: bold; color: #8bccc2; text-align: center; margin: 20px;');
        console.log('%cWelcome to Eubiosis! 🌱', 'font-size: 24px; color: #78b4aa; text-align: center; margin: 10px;');
        console.log('%cGut Health. Real Results.', 'font-size: 18px; color: #666; text-align: center; margin: 10px;');
        return false;
      }
    });

    // Check for dev tools periodically
    const devToolsInterval = setInterval(checkDevTools, 1000);

    // Handle scroll for bottom nav visibility
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      document.querySelectorAll('.gooey-btn').forEach(button => {
        button.removeEventListener('pointermove', moveBg as EventListener)
        button.removeEventListener('pointerover', () => {})
      })
      if (x) clearInterval(x)
      clearInterval(devToolsInterval);
      window.removeEventListener('scroll', handleScroll);
    }
  }, [])

  useEffect(() => {
    const handleDirectChange = (event: CustomEvent) => {
      handleDirectIllnessChange(event.detail);
    };
    
    window.addEventListener('changeIllness', handleDirectChange as EventListener);
    
    return () => {
      window.removeEventListener('changeIllness', handleDirectChange as EventListener);
    };
  }, []);

  return (
    <main>
      <AnimatePresence mode="wait">
        {/* Hero Section - Only show in hero-only and browsing modes */}
        {(viewMode === 'hero-only' || viewMode === 'browsing') && (
          <motion.section
            key="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-[#e8f4f8] to-white"
            style={{
              backgroundImage: 'url(/images/hero%20bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}
          >
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 z-0"></div>
            
            {/* Hero Section */}
            <EubiosisHero onIllnessClick={handleIllnessClick} onBrowsingClick={handleBrowsingClick} onLearnMoreClick={handleLearnMoreClick} />
          </motion.section>
        )}
        
        {/* What is Eubiosis - Show when illness selected */}
        {viewMode === 'illness-selected' && (
          <motion.div
            key="features"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ 
              opacity: 0, 
              x: -100, 
              scale: 0.8,
              rotateY: -15,
              transition: { 
                duration: 0.8, 
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                stiffness: 100
              } 
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <EubiosisFeatures illness={selectedIllness} onBrowsingClick={handleBrowsingClick} onResetToHero={handleResetToHero} onPrevIllness={handlePrevIllness} onNextIllness={handleNextIllness} onLearnMoreClick={handleLearnMoreClick} cycling={cycling} />
          </motion.div>
        )}

        {/* What is Eubiosis - Show when browsing */}
        {viewMode === 'browsing' && (
          <motion.div
            key="what-is-eubiosis"
            id="what-is-eubiosis"
            initial={{ opacity: 0, y: 100, scale: 0.9, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
            transition={{
              duration: 1.2,
              delay: 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 80
            }}
          >
            <EubiosisFeatures illness={null} onBrowsingClick={handleBrowsingClick} onResetToHero={handleResetToHero} onPrevIllness={handlePrevIllness} onNextIllness={handleNextIllness} onLearnMoreClick={handleLearnMoreClick} cycling={cycling} />
          </motion.div>
        )}

        {/* Key Benefits - Only in browsing mode */}
        {viewMode === 'browsing' && (
          <motion.div
            key="benefits"
            initial={{ opacity: 0, y: 100, scale: 0.9, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
            transition={{ 
              duration: 1.2, 
              delay: 0.3, 
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 80
            }}
          >
            <BenefitGrid benefits={benefits} />
          </motion.div>
        )}

        {/* Key Ingredients - Only in browsing mode */}
        {viewMode === 'browsing' && (
          <motion.div
            key="ingredients"
            initial={{ opacity: 0, y: 100, scale: 0.9, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
            transition={{ 
              duration: 1.2, 
              delay: 0.5, 
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 80
            }}
          >
            <AnimatedKeyIngredients />
          </motion.div>
        )}

        {/* Testimonials - Only in browsing mode */}
        {viewMode === 'browsing' && (
          <motion.section
            key="testimonials"
            initial={{ opacity: 0, y: 100, scale: 0.9, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
            transition={{
              duration: 1.2,
              delay: 0.7, 
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 80
            }}
            className="w-full py-2"
            style={{ backgroundColor: '#fefefc' }}
          >
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
              {/* Header Section */}
              <motion.div
                className="grid lg:grid-cols-3 grid-cols-1 gap-8 items-center mb-8 max-w-7xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Left Side - Heading */}
                <motion.div
                  className="text-left"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                  <span className="text-[#8bccc2] font-semibold text-sm uppercase tracking-wider block mb-4">
                    Natural Gut Health. Real Results.
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text">
                    What Our Customers Say
                  </h2>
                </motion.div>

                {/* Middle - Separator Line */}
                <motion.div
                  className="hidden lg:flex justify-center"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
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
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                >
                  <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                    Real stories from people who have transformed their gut health with Eubiosis
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              >
                <EubiosisTestimonials />
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* CTA Section - Only in browsing mode */}
        {viewMode === 'browsing' && (
          <motion.div
            key="cta"
            initial={{ opacity: 0, scale: 0.7, rotateY: 30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
            transition={{ 
              duration: 1.4, 
              delay: 0.9, 
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 60
            }}
            className="w-full"
          >
            <Image
              src="/images/Website Banner.png"
              alt="Start your journey to gut balance today"
              width={1200}
              height={500}
              className="w-full h-auto object-cover"
              priority={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SVG Filter for Gooey Buttons - Exact CodePen */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="goo" x="-50%" y="-50%" width="200%" height="200%">
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 1"></feFuncA>
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="5"></feGaussianBlur>
          <feComponentTransfer>
            <feFuncA type="table" tableValues="-5 11"></feFuncA>
          </feComponentTransfer>
        </filter>
      </svg>

      {/* Exit Intent Popup */}
      <ExitIntentPopup />

      {/* Bottom Navigation - Only show when scrolled, regardless of view mode */}
      {hasScrolled && (
        <BottomNav viewMode={viewMode} onResetToHero={handleResetToHero} illness={selectedIllness} />
      )}

      {/* Product Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
    </main>
  )
}
