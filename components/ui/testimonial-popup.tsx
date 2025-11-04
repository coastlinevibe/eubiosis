"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface TestimonialPopupProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial: {
    name: string;
    username: string;
    body: string;
    fullText: string;
    img: string;
    country: string;
  };
}

export function TestimonialPopup({ isOpen, onClose, testimonial }: TestimonialPopupProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleAudioToggle = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(testimonial.fullText);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      }
    };
  }, [isOpen, onClose, isPlaying]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop with animation */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
        onClick={onClose}
      />
      
      {/* Square popup container */}
      <div className="relative max-w-2xl w-full">
        {/* Square box popup with enhanced animation */}
        <div 
          className={cn(
            "relative bg-white rounded-2xl p-8 shadow-2xl border border-gray-200",
            "animate-in fade-in-0 zoom-in-90 slide-in-from-bottom-4 duration-500 ease-out"
          )}
        >
          {/* Bottle combo image - positioned to be half inside, half outside */}
          <div className="absolute -top-16 -right-16 z-10 animate-in slide-in-from-top-8 slide-in-from-right-8 duration-700 delay-200">
            <Image
              src="/images/bottles/bottle-combo.png"
              alt="Eubiosis Bottles"
              width={120}
              height={160}
              className="drop-shadow-xl"
            />
          </div>

          {/* Content with staggered animation */}
          <div className="space-y-6 pr-8">
            {/* Header with avatar */}
            <div className="flex items-center gap-4 animate-in slide-in-from-left-4 duration-500 delay-300">
              <Avatar className="w-16 h-16">
                <AvatarImage src={testimonial.img} alt={testimonial.name} />
                <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  {testimonial.name} 
                  <span className="text-lg">{testimonial.country}</span>
                </h3>
                <p className="text-gray-600">{testimonial.username}</p>
              </div>
            </div>

            {/* Full testimonial text */}
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 delay-500">
              <blockquote className="text-lg text-gray-800 leading-relaxed italic">
                "{testimonial.fullText}"
              </blockquote>
            </div>

            {/* Audio controls */}
            <div className="flex items-center justify-between pt-4 border-t animate-in slide-in-from-bottom-4 duration-500 delay-700">
              <button
                onClick={handleAudioToggle}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                  isPlaying 
                    ? "bg-red-100 text-red-700 hover:bg-red-200" 
                    : "bg-[#8bccc2]/10 text-[#8bccc2] hover:bg-[#8bccc2]/20"
                )}
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    Stop Audio
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    Play Audio
                  </>
                )}
              </button>
              
              <div className="text-sm text-gray-500">
                Press ESC or click outside to close
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
