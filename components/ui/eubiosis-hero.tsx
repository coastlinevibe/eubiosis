import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, ShoppingBag } from 'lucide-react';


const EubiosisHero = ({ onIllnessClick, onBrowsingClick, onLearnMoreClick }: { onIllnessClick?: (illness: string) => void; onBrowsingClick?: () => void; onLearnMoreClick?: () => void }) => {

  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);




  




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
          opacity: 1;
          margin: 0 0.1em; 
          transition: color 0.3s ease, transform 0.3s ease, text-shadow 0.3s ease;
          animation: word-appear 0.8s ease-out forwards;
        }
        .word-animate:hover { 
          color: #8dcdc6; 
          transform: translateY(-2px);
          text-shadow: 0 0 20px rgba(74, 174, 155, 0.5);
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
          opacity: 0.2;
          animation: float 4s ease-in-out infinite; 
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
        /* Scrollbar styling for dropdown */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(141, 205, 198, 0.1);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(141, 205, 198, 0.5);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(141, 205, 198, 0.8);
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

        {/* Responsive Corner Elements - Hidden */}
        <div className="corner-element-animate top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 hidden" style={{ animationDelay: '4s' }}>
          <div className="absolute top-0 left-0 w-2 h-2 bg-accent opacity-30 rounded-full"></div>
        </div>
        <div className="corner-element-animate top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 hidden" style={{ animationDelay: '4.2s' }}>
          <div className="absolute top-0 right-0 w-2 h-2 bg-accent opacity-30 rounded-full"></div>
        </div>
        <div className="corner-element-animate bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 hidden" style={{ animationDelay: '4.4s' }}>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-accent opacity-30 rounded-full"></div>
        </div>
        <div className="corner-element-animate bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 hidden" style={{ animationDelay: '4.6s' }}>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-accent opacity-30 rounded-full"></div>
        </div>

        <div className="floating-element-animate" style={{ top: '25%', left: '15%', animationDelay: '0.5s' }}></div>
        <div className="floating-element-animate" style={{ top: '60%', left: '85%', animationDelay: '1s' }}></div>
        <div className="floating-element-animate" style={{ top: '40%', left: '10%', animationDelay: '1.5s' }}></div>
        <div className="floating-element-animate" style={{ top: '75%', left: '90%', animationDelay: '2s' }}></div>

        {/* Responsive Main Content Padding */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 py-4 sm:px-8 sm:py-6 md:px-16 md:py-20 mt-0 sm:-mt-20">
          
          {/* Mobile Hero Text - Shows above image on mobile */}
          <motion.div 
            className="lg:hidden w-full text-center mb-6 mt-10"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <motion.div 
              className="inline-flex items-center justify-center gap-3 px-5 py-3 rounded-[9px] border border-[#8dcdc6]/50 bg-gradient-to-r from-black via-black to-[#8dcdc6]/20 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            >
              <span className="text-[13px] font-semibold tracking-[0.4em] text-white uppercase">EUBIOSIS-S</span>
              <span className="text-[13px] font-light tracking-[0.3em] text-[#8dcdc6] uppercase">Supplement</span>
            </motion.div>
            <motion.p 
              className="mt-3 text-[13px] font-mono font-light text-white/75 uppercase tracking-[0.2em]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            >
              Nourish • Heal • Thrive
            </motion.p>
          </motion.div>
          
          {/* Two Column Layout */}
          <motion.div 
            className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-16 items-center"
          >
            
            <div className="text-center lg:text-left relative pt-0 lg:pt-2">
              <motion.div 
                className="hidden lg:inline-flex items-center gap-3 mb-2 lg:mt-10 px-6 py-3 rounded-[9px] border border-[#8dcdc6]/50 bg-gradient-to-r from-black via-black to-[#8dcdc6]/20 shadow-[0_20px_45px_rgba(0,0,0,0.45)]"
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              >
                <span className="text-[13px] sm:text-[14px] font-semibold tracking-[0.45em] text-white uppercase">EUBIOSIS-S</span>
                <span className="text-[13px] sm:text-[14px] font-light tracking-[0.35em] text-[#8dcdc6] uppercase">Supplement</span>
              </motion.div>
              {/* Main Heading */}
              <h1 className="text-[37px] sm:text-[49px] md:text-[61px] lg:text-[73px] font-extralight leading-tight tracking-tight text-white text-decoration-animate mb-8">
                <div className="mb-4 md:mb-6 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <span className="word-animate" data-delay="1200">Rebalance</span>{' '}
                  <span className="word-animate" data-delay="1400">Your</span>{' '}
                  <span className="word-animate" data-delay="1600">Gut.</span>
                  {/* Mobile Product Image - Inline with "Gut" text */}
                  <motion.div 
                    className="lg:hidden inline-flex items-center justify-center w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] relative"
                    initial={{ opacity: 0, y: 30, scale: 0.8, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    transition={{ 
                      duration: 0.8,
                      delay: 1.8,
                      ease: "easeOut",
                    }}
                  >
                    <Image
                      src="/images/bottles/bottle-combo.png"
                      alt="Eubiosis Bottle"
                      width={70}
                      height={70}
                      className="w-full h-full object-contain relative z-10 drop-shadow-xl"
                      priority
                    />
                  </motion.div>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-thin text-white/90 leading-relaxed tracking-wide">
                  <span className="word-animate" data-delay="1800">Rediscover</span>{' '}
                  <span className="word-animate" data-delay="2000">Your</span>{' '}
                  <span className="word-animate" data-delay="2200">Health.</span>
                </div>
              </h1>


              {/* Illness Buttons - Desktop: Grid, Mobile: Dropdown */}
              <div className="mt-8 w-full">
                {/* Desktop: Show all buttons in grid */}
                <div className="hidden lg:grid lg:grid-cols-4 gap-4 mb-4">
                  {/* First Row: Irritable Bowel Syndrome / Western Lifestyle */}
                  <button
                    key="IBS"
                    onClick={() => onIllnessClick?.('IBS')}
                    className="btn-diabetes"
                    style={{ fontSize: '12px', gridColumn: 'span 2' }}
                  >
                    Irritable Bowel Syndrome
                  </button>
                  <button
                    key="Western Lifestyle"
                    onClick={() => onIllnessClick?.('Western Lifestyle')}
                    className="btn-depression"
                    style={{ fontSize: '14px', gridColumn: 'span 2' }}
                  >
                    Western Lifestyle
                  </button>
                  
                  {/* Second Row: Diabetes / Skin Health / Auto-Immune / Digestive */}
                  <button
                    key="Diabetes"
                    onClick={() => onIllnessClick?.('Diabetes')}
                    className="btn-ibs"
                    style={{ fontSize: '14px' }}
                  >
                    Diabetes
                  </button>
                  <button
                    key="Skin Health"
                    onClick={() => onIllnessClick?.('Skin Health')}
                    className="btn-anxiety"
                    style={{ fontSize: '14px' }}
                  >
                    Skin Health
                  </button>
                  <button
                    key="Autoimmune"
                    onClick={() => onIllnessClick?.('Autoimmune')}
                    className="btn-autoimmune"
                    style={{ fontSize: '14px' }}
                  >
                    Auto-Immune
                  </button>
                  <button
                    key="Digestive Issues"
                    onClick={() => onIllnessClick?.('Digestive Issues')}
                    className="btn-digestive"
                    style={{ fontSize: '14px' }}
                  >
                    Digestive
                  </button>
                  
                  {/* Third Row: Just Browsing */}
                  <button
                    key="Just Browsing"
                    onClick={() => onBrowsingClick?.()}
                    className="btn-browsing"
                    style={{ gridColumn: 'span 4' }}
                  >
                    Just Browsing
                  </button>
                </div>

                {/* Mobile: Dropdown trigger */}
                <motion.div 
                  className="lg:hidden mb-4"
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 2.0, ease: "easeOut" }}
                >
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
                    className="overflow-y-auto max-h-[300px] sm:max-h-none sm:overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-2 mt-3 pr-3 pb-12 sm:pr-0 sm:pb-0">
                      {[
                        { name: 'Irritable Bowel Syndrome', key: 'IBS', className: 'btn-diabetes' },
                        { name: 'Diabetes', key: 'Diabetes', className: 'btn-ibs' },
                        { name: 'Skin Health', key: 'Skin Health', className: 'btn-anxiety' },
                        { name: 'Auto-Immune', key: 'Autoimmune', className: 'btn-autoimmune' },
                        { name: 'Western Lifestyle', key: 'Western Lifestyle', className: 'btn-depression' },
                        { name: 'Digestive Issues', key: 'Digestive Issues', className: 'btn-digestive' },
                        { name: 'Just browsing', key: 'Just Browsing', className: 'btn-browsing col-span-2' }
                      ].map((button, index) => (
                        <motion.button
                          key={button.name}
                          onClick={() => {
                            if (button.key === 'Just Browsing') {
                              onBrowsingClick?.();
                            } else {
                              onIllnessClick?.(button.key);
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
                </motion.div>
              </div>

              {/* Additional Action Buttons */}
              <motion.div 
                className="mt-6 flex justify-center lg:justify-start gap-3 items-center"
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 2.4, ease: "easeOut" }}
              >
                <motion.button
                  onClick={onLearnMoreClick}
                  className="inline-flex items-center justify-center gap-3 px-4 sm:px-5 py-3 rounded-[9px] border border-[#8dcdc6]/50 bg-gradient-to-r from-black via-black to-[#8dcdc6]/20 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:from-black/90 hover:via-black/90 hover:to-[#8dcdc6]/30 transition-all duration-300 text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  LEARN MORE
                </motion.button>
                <Link href="/eubiosis-s-bottle/size-s/quantity-1">
                  <motion.button 
                    className="btn p-3 sm:p-4 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="whitespace-nowrap text-sm sm:text-base">Shop Now!</span>
                    {/* Extra trailing span to avoid globals.css rule hiding last span */}
                    <span aria-hidden="true"></span>
                  </motion.button>
                </Link>
              </motion.div>

              {/* Detail Lines for Left Column */}
              <div className="absolute -left-6 sm:-left-8 top-1/2 transform -translate-y-1/2 w-3 sm:w-4 h-px bg-white/30 opacity-0 hidden lg:block" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '5.0s' }}></div>
            </div>

            {/* Right Column - Product Image */}
            <div className="hidden lg:flex justify-center items-center mt-[100px]">
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


      </div>
    </>
  );
};

export default EubiosisHero;
