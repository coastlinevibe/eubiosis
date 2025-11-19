"use client"

import * as React from "react"
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ButtonProps } from "@/components/ui/button";
import { MousePointerClick } from "lucide-react";

interface ParticleButtonProps extends ButtonProps {
  onSuccess?: () => void;
  successDuration?: number;
}

function SuccessParticles({
  buttonRef,
}: {
  buttonRef: React.RefObject<HTMLButtonElement>;
}) {
  const rect = buttonRef.current?.getBoundingClientRect();
  if (!rect) return null;

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return (
    <AnimatePresence>
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-2 h-2 bg-green-500 rounded-full shadow-lg"
          style={{ 
            left: centerX, 
            top: centerY,
            zIndex: 9999
          }}
          initial={{
            scale: 0,
            x: 0,
            y: 0,
            opacity: 1,
          }}
          animate={{
            scale: [0, 1.5, 0],
            x: [0, (i % 2 ? 1 : -1) * (Math.random() * 80 + 30)],
            y: [0, -Math.random() * 80 - 30],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.05,
            ease: "easeOut",
          }}
        />
      ))}
    </AnimatePresence>
  );
}

function ParticleButton({
  children,
  onClick,
  onSuccess,
  successDuration = 1000,
  className,
  ...props
}: ParticleButtonProps) {
  const [showParticles, setShowParticles] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowParticles(true);
    
    // Delay the onClick action to show particles first
    setTimeout(() => {
      if (onClick) onClick(e);
    }, 800);
    
    setTimeout(() => {
      setShowParticles(false);
    }, successDuration);
  };

  return (
    <>
      {showParticles && <SuccessParticles buttonRef={buttonRef} />}
      <Button
        ref={buttonRef}
        onClick={handleClick}
        className={cn(
          "relative",
          showParticles && "scale-95",
          "transition-transform duration-100",
          className
        )}
        {...props}
      >
        {children}
        <MousePointerClick className="h-4 w-4 ml-2" />
      </Button>
    </>
  );
}

export { ParticleButton }