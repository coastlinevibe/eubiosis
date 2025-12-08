'use client'

import { useRouter, usePathname } from 'next/navigation'
import Dock from '@/components/ui/dock'
import MobileNav from '@/components/ui/mobile-nav'
import { Home, ShoppingCart, ShoppingBag, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'

interface BottomNavProps {
  viewMode?: 'hero-only' | 'illness-selected' | 'browsing'
  onResetToHero?: () => void
  illness?: string | null
  onLearnMore?: () => void
}

export default function BottomNav({ viewMode, onResetToHero, illness, onLearnMore }: BottomNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const { getItemCount, openCart } = useCart()

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Determine active item based on pathname and scroll position
  const getActiveItem = (): string | undefined => {
    if (pathname === '/' && viewMode === 'browsing') {
      return 'Read More'
    }
    // Only mark home as active when on home page AND in hero-only mode AND at the top
    if (pathname === '/' && viewMode === 'hero-only') {
      // Only active when at the very top (within 100px of hero section)
      if (scrollY < 100) {
        return 'Home'
      }
    }
    if (pathname.startsWith('/shop') || pathname.startsWith('/eubiosis-bottle') || pathname.startsWith('/eubiosis-s-bottle')) return 'Shop'
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
    // Hide nav on checkout, funnel, and OTO pages
    if (pathname.startsWith('/checkout') || pathname.startsWith('/funnel') || pathname.startsWith('/oto')) {
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
    } else if (pathname === '/shop' || pathname.startsWith('/eubiosis-bottle') || pathname.startsWith('/eubiosis-s-bottle')) {
      setIsVisible(true)
      
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
          // Show nav even at top on shop pages
          setIsVisible(true)
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
      icon: ArrowRight,
      label: 'Read More',
      onClick: () => {
        if (pathname === '/') {
          // Already on home page, scroll to top and call the function
          window.scrollTo({ top: 0, behavior: 'smooth' })
          setTimeout(() => {
            onLearnMore?.()
          }, 100)
        } else {
          // Navigate to home first, then call the function
          router.push('/')
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            onLearnMore?.()
          }, 300)
        }
      },
    },
  ]

  const mobileNavItems = [
    {
      id: 'home',
      label: 'Home',
      onClick: scrollToHero,
    },
    {
      id: 'shop',
      label: 'Shop',
      onClick: () => router.push('/eubiosis-bottle/size-s/quantity-1'),
    },
    {
      id: 'read-more',
      label: 'Read More',
      onClick: () => {
        if (pathname === '/') {
          // Already on home page, scroll to top and call the function
          window.scrollTo({ top: 0, behavior: 'smooth' })
          setTimeout(() => {
            onLearnMore?.()
          }, 100)
        } else {
          // Navigate to home first, then call the function
          router.push('/')
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            onLearnMore?.()
          }, 300)
        }
      },
    },
  ]

  const getMobileActiveItem = (): string => {
    if (pathname === '/' && viewMode === 'browsing') {
      return 'read-more'
    }
    if (pathname === '/' && viewMode === 'hero-only' && scrollY < 100) {
      return 'home'
    }
    if (pathname.startsWith('/shop') || pathname.startsWith('/eubiosis-bottle') || pathname.startsWith('/eubiosis-s-bottle')) return 'shop'
    return 'home'
  }

  if (!isVisible) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-0 md:pb-4">
      {/* Desktop: Dock */}
      <div className="hidden md:block">
        <Dock items={dockItems} activeItem={getActiveItem()} showHomeText="Home Page" />
      </div>
      {/* Mobile: MobileNav - Full width, no padding */}
      <div className="block md:hidden w-full pb-0">
        <MobileNav items={mobileNavItems} activeItem={getMobileActiveItem()} />
      </div>
    </nav>
  )
}
