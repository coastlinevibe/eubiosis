"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion } from "framer-motion"

interface DockProps {
  className?: string
  items: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    onClick?: () => void
  }[]
  activeItem?: string
  showHomeText?: string
}

export default function Dock({ items, className, activeItem, showHomeText }: DockProps) {
  const [active, setActive] = React.useState<string | null>(activeItem || null)
  const [hovered, setHovered] = React.useState<number | null>(null)

  // Update active state when activeItem prop changes
  React.useEffect(() => {
    setActive(activeItem || null)
  }, [activeItem])

  return (
    <div className={cn("flex items-center justify-center w-full py-4", className)}>
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "flex items-end gap-4 px-4 py-3 rounded-3xl",
          "border border-border bg-white/70 backdrop-blur-2xl shadow-lg"
        )}
        style={{
          transform: "perspective(600px) rotateX(10deg)",
        }}
      >
        <TooltipProvider delayDuration={100}>
          {items.map((item, i) => {
            const isActive = active === item.label
            const isHovered = hovered === i

            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <motion.div
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    animate={{
                      scale: isHovered ? 1.2 : 1,
                      rotate: isHovered ? -5 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={cn(
                      "relative flex items-center",
                      (isActive && item.label === 'Home' && showHomeText) || (isActive && item.label !== 'Home') ? "flex-row gap-2" : "flex-col"
                    )}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "rounded-2xl relative",
                        "transition-all duration-200",
                        (isHovered || isActive) && "bg-accent shadow-lg shadow-accent/20",
                        isActive && "text-accent"
                      )}
                      onClick={() => {
                        setActive(item.label)
                        item.onClick?.()
                      }}
                    >
                      <item.icon
                        className={cn(
                          "h-6 w-6 transition-colors",
                          isHovered ? "text-[#8bccc2]" :
                          isActive ? "text-[#8bccc2]" : "text-text"
                        )}
                      />
                      
                      {isHovered && (
                        <motion.span
                          layoutId="glow"
                          className="absolute inset-0 rounded-2xl border border-accent/40"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </Button>

                    {isActive && item.label === 'Home' && showHomeText && (
                      <span className="text-sm text-text whitespace-nowrap">{showHomeText}</span>
                    )}

                    {isActive && item.label !== 'Home' && (
                      <span className="text-sm text-text whitespace-nowrap">{item.label}</span>
                    )}

                    {isActive && (
                      <motion.div
                        layoutId="dot"
                        className="w-1.5 h-1.5 rounded-full bg-accent mt-1"
                      />
                    )}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs bg-accent text-white">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </motion.div>
    </div>
  )
}
