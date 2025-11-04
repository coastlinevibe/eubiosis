'use client'

import { useRouter, usePathname } from 'next/navigation'
import Dock from '@/components/ui/dock'
import { Home, ShoppingCart, ShoppingBag } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'

interface BottomNavProps {
  viewMode?: 'hero-only' | 'illness-selected' | 'browsing'
  onResetToHero?: () => void
  illness?: string | null
}

export default function BottomNav({ viewMode, onResetToHero, illness }: BottomNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const { getItemCount, openCart } = useCart()

  // Determine active item based on pathname and scroll position
  const getActiveItem = (): string | undefined => {
    // Only mark home as active when on home page AND in hero-only mode AND at the top
    if (pathname === '/' && viewMode === 'hero-only') {
      // Only active when at the very top (within 100px of hero section)
      if (scrollY < 100) {
        return 'Home'
      }
    }
    if (pathname.startsWith('/shop') || pathname.startsWith('/eubiosis-bottle')) return 'Shop'
    return undefined
  }

  // Function to scroll to hero section
  const scrollToHero = () => {
    if (pathname === '/') {
      // If already on home page, scroll to top and reset view mode via callback
      window.scrollTo({ top: 0, behavior: 'smooth' })
      // Use callback to reset view mode instead of page reload
      if (onResetToHero) {
        setTimeout(() => {
          onResetToHero()
        }, 300)
      }
    } else {
      // If on another page, navigate to home
      router.push('/')
    }
  }

  useEffect(() => {
    // Hide nav on checkout and funnel pages
    if (pathname.startsWith('/checkout') || pathname.startsWith('/funnel')) {
      setIsVisible(false)
      return
    }
    
    // Show/hide nav based on view mode and page
    if (pathname === '/') {
      // Hide nav in hero-only mode, when illness is selected, or when viewMode is undefined (initial state)
      if (viewMode === 'hero-only' || viewMode === 'illness-selected' || illness || !viewMode) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      // Track scroll position for active state
      const handleScroll = () => {
        setScrollY(window.scrollY)
      }
      
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    } else if (pathname === '/shop' || pathname.startsWith('/eubiosis-bottle')) {
      setIsVisible(false)
      
      const handleScroll = () => {
        const scrollTop = window.scrollY
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        
        // Check if user is at the bottom of the page (within 50px)
        const isAtBottom = scrollTop + windowHeight >= documentHeight - 50
        
        if (isAtBottom) {
          // Hide nav when at bottom
          setIsVisible(false)
        } else if (scrollTop > 100) {
          // Show nav when scrolled down 100px or more (but not at bottom)
          setIsVisible(true)
        } else {
          // Hide nav when at top
          setIsVisible(false)
        }
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    } else {
      // Show nav immediately on other pages (like funnel)
      setIsVisible(true)
    }
  }, [pathname, viewMode, illness])

  const dockItems = [
    {
      icon: Home,
      label: 'Home',
      onClick: scrollToHero,
    },
    {
      icon: ShoppingCart,
      label: 'Shop',
      onClick: () => router.push('/eubiosis-bottle/size-s/quantity-1'),
    },
    {
      icon: ShoppingBag,
      label: 'Cart',
      badge: getItemCount() > 0 ? getItemCount().toString() : undefined,
      onClick: openCart,
    },
  ]

  if (!isVisible) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4">
      <Dock items={dockItems} activeItem={getActiveItem()} />
    </nav>
  )
}
