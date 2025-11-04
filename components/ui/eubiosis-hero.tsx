import React, { useState, useEffect, useRef } from 'react';
import { TextSplit } from './split-text';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, ShoppingBag } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const EubiosisHero = ({ onIllnessClick, onBrowsingClick, onLearnMoreClick }: { onIllnessClick?: (illness: string) => void; onBrowsingClick?: () => void; onLearnMoreClick?: () => void }) => {
  const [mouseGradientStyle, setMouseGradientStyle] = useState({
    left: '0px',
    top: '0px',
    opacity: 0,
  });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const floatingElementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const animateWords = () => {
      const wordElements = document.querySelectorAll('.word-animate');
      wordElements.forEach(word => {
        const delay = parseInt(word.getAttribute('data-delay') || '0') || 0;
        setTimeout(() => {
          if (word) (word as HTMLElement).style.animation = 'word-appear 0.8s ease-out forwards';
        }, delay);
      });
    };
    const timeoutId = setTimeout(animateWords, 500);
    return () => clearTimeout(timeoutId);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMouseGradientStyle({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        opacity: 1,
      });
    };
    const handleMouseLeave = () => {
      setMouseGradientStyle(prev => ({ ...prev, opacity: 0 }));
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const handleClick = (e: MouseEvent) => {
      const newRipple: Ripple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== newRipple.id)), 1000);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [mounted]);
  
  useEffect(() => {
    if (!mounted) return;
    
    const wordElements = document.querySelectorAll('.word-animate');
    const handleMouseEnter = (e: Event) => { 
      if (e.target) (e.target as HTMLElement).style.textShadow = '0 0 20px rgba(74, 174, 155, 0.5)'; 
    };
    const handleMouseLeave = (e: Event) => { 
      if (e.target) (e.target as HTMLElement).style.textShadow = 'none'; 
    };
    wordElements.forEach(word => {
      word.addEventListener('mouseenter', handleMouseEnter);
      word.addEventListener('mouseleave', handleMouseLeave);
    });
    return () => {
      wordElements.forEach(word => {
        if (word) {
          word.removeEventListener('mouseenter', handleMouseEnter);
          word.removeEventListener('mouseleave', handleMouseLeave);
        }
      });
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const elements = document.querySelectorAll('.floating-element-animate');
    floatingElementsRef.current = Array.from(elements) as HTMLElement[];
    const handleScroll = () => {
      if (!scrolled) {
        setScrolled(true);
        floatingElementsRef.current.forEach((el, index) => {
          setTimeout(() => {
            if (el) {
              el.style.animationPlayState = 'running';
              el.style.opacity = ''; 
            }
          }, (parseFloat(el.style.animationDelay || "0") * 1000) + index * 100);
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        #mouse-gradient-eubiosis {
          position: fixed;
          pointer-events: none;
          border-radius: 9999px;
          background-image: radial-gradient(circle, rgba(74, 174, 155, 0.08), rgba(74, 174, 155, 0.05), transparent 70%);
          transform: translate(-50%, -50%);
          will-change: left, top, opacity;
          transition: left 70ms linear, top 70ms linear, opacity 300ms ease-out;
        }
        @keyframes word-appear { 
          0% { opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(10px); } 
          50% { opacity: 0.8; transform: translateY(10px) scale(0.95); filter: blur(2px); } 
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } 
        }
        @keyframes grid-draw { 
          0% { stroke-dashoffset: 1000; opacity: 0; } 
          50% { opacity: 0.3; } 
          100% { stroke-dashoffset: 0; opacity: 0.15; } 
        }
        @keyframes pulse-glow { 
          0%, 100% { opacity: 0.1; transform: scale(1); } 
          50% { opacity: 0.3; transform: scale(1.1); } 
        }
        .word-animate { 
          display: inline-block; 
          opacity: 0; 
          margin: 0 0.1em; 
          transition: color 0.3s ease, transform 0.3s ease; 
        }
        .word-animate:hover { 
          color: #8dcdc6; 
          transform: translateY(-2px); 
        }
        .grid-line { 
          stroke: rgba(141, 205, 198, 0.2); 
          stroke-width: 0.5; 
          opacity: 0; 
          stroke-dasharray: 5 5; 
          stroke-dashoffset: 1000; 
          animation: grid-draw 2s ease-out forwards; 
        }
        .detail-dot { 
          fill: #8dcdc6; 
          opacity: 0; 
          animation: pulse-glow 3s ease-in-out infinite; 
        }
        .corner-element-animate { 
          position: absolute; 
          width: 40px; 
          height: 40px; 
          border: 1px solid rgba(141, 205, 198, 0.2); 
          opacity: 0; 
          animation: word-appear 1s ease-out forwards; 
        }
        .text-decoration-animate { 
          position: relative; 
        }
        .text-decoration-animate::after { 
          content: ''; 
          position: absolute; 
          bottom: -4px; 
          left: 0; 
          width: 0; 
          height: 1px; 
          background: linear-gradient(90deg, transparent, #8dcdc6, transparent); 
          animation: underline-grow 2s ease-out forwards; 
          animation-delay: 2s; 
        }
        @keyframes underline-grow { 
          to { width: 100%; } 
        }
        .floating-element-animate { 
          position: absolute; 
          width: 2px; 
          height: 2px; 
          background: #8dcdc6; 
          border-radius: 50%; 
          opacity: 0; 
          animation: float 4s ease-in-out infinite; 
          animation-play-state: paused; 
        }
        @keyframes float { 
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; } 
          25% { transform: translateY(-10px) translateX(5px); opacity: 0.6; } 
          50% { transform: translateY(-5px) translateX(-3px); opacity: 0.4; } 
          75% { transform: translateY(-15px) translateX(7px); opacity: 0.8; } 
        }
        .ripple-effect { 
          position: fixed; 
          width: 4px; 
          height: 4px; 
          background: rgba(74, 174, 155, 0.6); 
          border-radius: 50%; 
          transform: translate(-50%, -50%); 
          pointer-events: none; 
          animation: pulse-glow 1s ease-out forwards; 
          z-index: 9999; 
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden">
        
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="gridEubiosisResponsive" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(74, 174, 155, 0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridEubiosisResponsive)" />
          <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line" style={{ animationDelay: '0.5s' }} />
          <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line" style={{ animationDelay: '1s' }} />
          <line x1="20%" y1="0" x2="20%" y2="100%" className="grid-line" style={{ animationDelay: '1.5s' }} />
          <line x1="80%" y1="0" x2="80%" y2="100%" className="grid-line" style={{ animationDelay: '2s' }} />
          <line x1="50%" y1="0" x2="50%" y2="100%" className="grid-line" style={{ animationDelay: '2.5s', opacity: '0.05' }} />
          <line x1="0" y1="50%" x2="100%" y2="50%" className="grid-line" style={{ animationDelay: '3s', opacity: '0.05' }} />
          <circle cx="20%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '3s' }} />
          <circle cx="80%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '3.2s' }} />
          <circle cx="20%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.4s' }} />
          <circle cx="80%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.6s' }} />
          <circle cx="50%" cy="50%" r="1.5" className="detail-dot" style={{ animationDelay: '4s' }} />
        </svg>

        {/* Responsive Corner Elements */}
        <div className="corner-element-animate top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8" style={{ animationDelay: '4s' }}>
          <div className="absolute top-0 left-0 w-2 h-2 bg-accent opacity-30 rounded-full"></div>
        </div>
        <div className="corner-element-animate top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8" style={{ animationDelay: '4.2s' }}>
          <div className="absolute top-0 right-0 w-2 h-2 bg-accent opacity-30 rounded-full"></div>
        </div>
        <div className="corner-element-animate bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8" style={{ animationDelay: '4.4s' }}>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-accent opacity-30 rounded-full"></div>
        </div>
        <div className="corner-element-animate bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8" style={{ animationDelay: '4.6s' }}>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-accent opacity-30 rounded-full"></div>
        </div>

        <div className="floating-element-animate" style={{ top: '25%', left: '15%', animationDelay: '0.5s' }}></div>
        <div className="floating-element-animate" style={{ top: '60%', left: '85%', animationDelay: '1s' }}></div>
        <div className="floating-element-animate" style={{ top: '40%', left: '10%', animationDelay: '1.5s' }}></div>
        <div className="floating-element-animate" style={{ top: '75%', left: '90%', animationDelay: '2s' }}></div>

        {/* Responsive Main Content Padding */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 py-4 sm:px-8 sm:py-6 md:px-16 md:py-20 mt-0 sm:-mt-20">
          
          {/* Mobile Hero Text - Shows above image on mobile */}
          <div className="lg:hidden w-full text-center mb-6 mt-4">
            <h2 className="text-[21px] sm:text-[25px] font-mono font-medium text-white uppercase tracking-[0.3em] opacity-90 mb-2">
              EUBIOSIS
            </h2>
            <h2 className="text-[15px] font-mono font-light text-white/80 uppercase tracking-[0.2em] opacity-80">
              NOURISH, HEAL, THRIVE
            </h2>
          </div>

          {/* Mobile Product Image - Shows after text on mobile */}
          <motion.div 
            className="lg:hidden w-full max-w-sm h-[180px] sm:h-[220px] flex items-center justify-center relative -mb-24"
            animate={{ 
              opacity: isDropdownOpen ? 0 : 1,
              scale: isDropdownOpen ? 0.95 : 1,
              y: isDropdownOpen ? -20 : 0,
              height: isDropdownOpen ? 0 : 'auto',
              marginBottom: isDropdownOpen ? 0 : '0'
            }}
            transition={{ 
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
              opacity: { duration: 0.3 },
              height: { duration: 0.4 },
              marginBottom: { duration: 0.4 }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              <Image
                src="/images/bottles/bottle-combo.png"
                alt="Eubiosis Bottle Combo"
                width={300}
                height={250}
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                priority
              />
              {/* Mobile shadow and glow */}
              <motion.div 
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2/3 h-6 bg-black/15 rounded-full blur-lg"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-[#8bccc2]/8 via-transparent to-transparent rounded-full blur-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              />
            </motion.div>
          </motion.div>
          
          {/* Two Column Layout */}
          <motion.div 
            className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-16 items-center"
            animate={{
              y: isDropdownOpen ? -120 : 0 // Move up by approximately the image height on mobile
            }}
            transition={{ 
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: isDropdownOpen ? 0.1 : 0 // Small delay when moving up
            }}
          >
            
            <div className="text-left relative pt-10">
              {/* Main Heading */}
              <h1 className="text-[37px] sm:text-[49px] md:text-[61px] lg:text-[73px] font-extralight leading-tight tracking-tight text-white text-decoration-animate mb-8">
                <div className="mb-4 md:mb-6">
                  <span className="word-animate" data-delay="1200">Restore</span>{' '}
                  <span className="word-animate" data-delay="1400">your</span>{' '}
                  <span className="word-animate" data-delay="1600">gut,</span>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-thin text-white/90 leading-relaxed tracking-wide">
                  <span className="word-animate" data-delay="1800">reclaim</span>{' '}
                  <span className="word-animate" data-delay="2000">your</span>{' '}
                  <span className="word-animate" data-delay="2200">vitality</span>
                </div>
              </h1>


              {/* Illness Buttons - Desktop: Grid, Mobile: Dropdown */}
              <div className="mt-8 w-full">
                {/* Desktop: Show all buttons in grid */}
                <div className="hidden lg:flex lg:flex-wrap gap-4 mb-4">
                  <button
                    key="IBS"
                    onClick={() => onIllnessClick?.('IBS')}
                    className="btn-diabetes"
                    style={{ fontSize: '14px' }}
                  >
                    IBS
                  </button>
                  <button
                    key="Diabetes"
                    onClick={() => onIllnessClick?.('Diabetes')}
                    className="btn-ibs"
                    style={{ fontSize: '14px' }}
                  >
                    Diabetes
                  </button>
                  <button
                    key="Anxiety"
                    onClick={() => onIllnessClick?.('Anxiety')}
                    className="btn-anxiety"
                    style={{ fontSize: '14px' }}
                  >
                    Anxiety
                  </button>
                  <button
                    key="Depression"
                    onClick={() => onIllnessClick?.('Depression')}
                    className="btn-depression"
                    style={{ fontSize: '14px' }}
                  >
                    Depression
                  </button>
                  <button
                    key="Autoimmune"
                    onClick={() => onIllnessClick?.('Autoimmune')}
                    className="btn-autoimmune"
                    style={{ fontSize: '14px' }}
                  >
                    Autoimmune
                  </button>
                  <button
                    key="Digestive Issues"
                    onClick={() => onIllnessClick?.('Digestive Issues')}
                    className="btn-digestive"
                    style={{ fontSize: '14px' }}
                  >
                    Digestive
                  </button>
                  <button
                    key="Just Browsing"
                    onClick={() => onBrowsingClick?.()}
                    className="btn-browsing"
                    style={{ gridColumn: 'span 1' }}
                  >
                    Just Browsing
                  </button>
                </div>

                {/* Mobile: Dropdown trigger */}
                <div className="lg:hidden mb-4">
                  <motion.button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-gradient-to-r from-[#4AAE9B]/20 to-[#3d9585]/20 border border-[#4AAE9B]/30 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-[#4AAE9B]/30 hover:to-[#3d9585]/30 transition-all duration-300"
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Choose Your Health Concern</span>
                    <motion.div
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </motion.button>

                  {/* Mobile dropdown content */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: isDropdownOpen ? 'auto' : 0,
                      opacity: isDropdownOpen ? 1 : 0 
                    }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      opacity: { duration: 0.2 }
                    }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {[
                      { name: 'IBS', className: 'btn-diabetes' },
                        { name: 'Diabetes', className: 'btn-ibs' },
                        { name: 'Anxiety', className: 'btn-anxiety' },
                        { name: 'Depression', className: 'btn-depression' },
                        { name: 'Autoimmune', className: 'btn-autoimmune' },
                        { name: 'Digestive Issues', className: 'btn-digestive' },
                        { name: 'Just Browsing', className: 'btn-browsing' }
                      ].map((button, index) => (
                        <motion.button
                          key={button.name}
                          onClick={() => {
                            if (button.name === 'Just Browsing') {
                              onBrowsingClick?.();
                            } else {
                              onIllnessClick?.(button.name);
                            }
                            setIsDropdownOpen(false);
                          }}
                          className={button.className}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            delay: index * 0.05,
                            duration: 0.3,
                            ease: "easeOut"
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {button.name}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Additional Action Buttons */}
              <div className="mt-6 flex justify-start gap-4 items-center">
                <button className="btn-secondary" onClick={onLearnMoreClick}>
                  LEARN MORE
                </button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/eubiosis-bottle/size-s/quantity-1">
                        <button className="btn p-4 flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6" />
                        </button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Shop Now</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Detail Lines for Left Column */}
              <div className="absolute -left-6 sm:-left-8 top-1/2 transform -translate-y-1/2 w-3 sm:w-4 h-px bg-white/30 opacity-0 hidden lg:block" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '5.0s' }}></div>
            </div>

            {/* Right Column - Product Image */}
            <div className="hidden lg:flex justify-center items-center">
              <motion.div 
                className="w-full max-w-lg h-[500px] flex items-center justify-center relative"
                initial={{ opacity: 0, x: 100, scale: 0.9, rotateY: 15 }}
                animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                transition={{ 
                  duration: 1.2, 
                  delay: 0.8, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 100
                }}
              >
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
                >
                  <Image
                    src="/images/bottles/bottle-combo.png"
                    alt="Eubiosis Bottle Combo"
                    width={500}
                    height={500}
                    className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                    priority
                  />
                </motion.div>
                {/* Shadow underneath with animation */}
                <motion.div 
                  className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-black/20 rounded-full blur-xl"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.8, ease: "easeOut" }}
                />
                {/* Ambient glow effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-[#8bccc2]/10 via-transparent to-transparent rounded-full blur-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                />
              </motion.div>
            </div>

          </motion.div>
        </div>

        {/* Responsive Mouse Gradient */}
        <div 
          id="mouse-gradient-eubiosis"
          className="w-60 h-60 blur-xl sm:w-80 sm:h-80 sm:blur-2xl md:w-96 md:h-96 md:blur-3xl opacity-0"
          style={{
            left: mouseGradientStyle.left,
            top: mouseGradientStyle.top,
          }}
        ></div>

        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="ripple-effect"
            style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
          />
        ))}
      </div>
    </>
  );
};

export default EubiosisHero;
