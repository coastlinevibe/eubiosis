"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ExitIntentPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExitIntentPopup({ isOpen, onClose }: ExitIntentPopupProps) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Add gooey button functionality when popup opens
      function moveBg(e: PointerEvent) {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        (e.target as HTMLElement).style.setProperty('--x', String((e.clientX - rect.x) / rect.width * 100));
        (e.target as HTMLElement).style.setProperty('--y', String((e.clientY - rect.y) / rect.height * 100));
      }

      const gooeyBtns = document.querySelectorAll('.popup-gooey-btn');
      gooeyBtns.forEach(button => {
        button.addEventListener('pointermove', moveBg as EventListener);
      });

      return () => {
        gooeyBtns.forEach(button => {
          button.removeEventListener('pointermove', moveBg as EventListener);
        });
      };
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission here
    console.log('Email submitted:', email);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* SVG Filter for Gooey Effect */}
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <filter id="popup-goo" x="-50%" y="-50%" width="200%" height="200%">
              <feComponentTransfer>
                <feFuncA type="discrete" tableValues="0 1"></feFuncA>
              </feComponentTransfer>
              <feGaussianBlur stdDeviation="5"></feGaussianBlur>
              <feComponentTransfer>
                <feFuncA type="table" tableValues="-5 11"></feFuncA>
              </feComponentTransfer>
            </filter>
          </svg>

          <motion.div 
            className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.5 
            }}
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6 text-gray-600" />
            </motion.button>

            <div className="flex flex-col lg:grid lg:grid-cols-2 min-h-[400px] lg:min-h-[500px]">
              {/* Left Side - Content */}
              <motion.div 
                className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* Headline */}
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.div 
                    className="inline-block bg-[#4AAE9B] text-white px-4 py-2 rounded-full text-sm font-medium mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                  >
                    Wait! Don't leave yet...
                  </motion.div>
                  <motion.h2 
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    Transform Your Gut Health with 
                    <span className="text-[#4AAE9B]"> 15% OFF</span>
                  </motion.h2>
                  <motion.p 
                    className="text-base sm:text-lg text-gray-600 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    Join thousands who've discovered the power of our honey-based probiotic formula. Get exclusive access to gut health tips and your discount code!
                  </motion.p>
                </motion.div>

                {/* Email Form */}
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AAE9B] focus:border-transparent outline-none transition-all"
                      required
                    />
                  </motion.div>
                  <motion.button
                    type="submit"
                    className="btn w-full text-white font-semibold py-3 px-6 rounded-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.3 }}
                  >
                    GET 15% OFF NOW
                  </motion.button>
                </motion.form>
              </motion.div>

              {/* Right Side - Product Image */}
              <motion.div 
                className="relative bg-gradient-to-br from-[#4AAE9B]/10 to-[#3d9585]/10 flex items-center justify-center p-6 sm:p-8 lg:p-8 min-h-[300px] lg:min-h-[400px]"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {/* Product bottles */}
                <motion.div 
                  className="relative z-10"
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: 0.6, 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Image
                    src="/images/bottles/bottle-combo.png"
                    alt="Eubiosis Probiotic Bottles"
                    width={200}
                    height={240}
                    className="sm:w-[280px] sm:h-[320px] drop-shadow-2xl"
                    priority
                  />
                  
                  {/* Glow effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-[#4AAE9B]/20 to-[#3d9585]/20 rounded-full blur-3xl scale-110 -z-10"
                    animate={{ 
                      scale: [1.1, 1.2, 1.1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function useExitIntent() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from the top of the page and popup hasn't been shown
      if (e.clientY <= 0 && !hasShown) {
        setShowPopup(true);
        setHasShown(true);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasShown) {
        setShowPopup(true);
        setHasShown(true);
        // Small delay to show popup before page unloads
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    // Add event listeners after a short delay to avoid immediate triggers
    timeoutId = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('beforeunload', handleBeforeUnload);
    }, 3000); // Wait 3 seconds before activating

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasShown]);

  const closePopup = () => {
    setShowPopup(false);
  };

  return {
    showPopup,
    closePopup,
    ExitIntentPopup: () => (
      <ExitIntentPopup isOpen={showPopup} onClose={closePopup} />
    )
  };
}
