'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
  id: string
  name: string
  size: '50ml' | '100ml'
  quantity: number
  basePrice: number
  discountedPrice: number
  image: string
  bundle?: boolean
  emailDiscount?: boolean
  upsellDiscount?: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getTotal: () => number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('eubiosis-cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('eubiosis-cart', JSON.stringify(cartItems))
  }, [cartItems])

  // Listen for global cart events
  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true)
    const handleAddToCart = (event: CustomEvent) => {
      addToCart(event.detail)
      setIsCartOpen(true) // Auto-open cart when item is added
    }

    window.addEventListener('openCart', handleOpenCart)
    window.addEventListener('addToCart', handleAddToCart as EventListener)

    return () => {
      window.removeEventListener('openCart', handleOpenCart)
      window.removeEventListener('addToCart', handleAddToCart as EventListener)
    }
  }, [])

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(cartItem =>
        cartItem.id === item.id && cartItem.size === item.size
      )

      if (existingIndex !== -1) {
        // Replace existing item with new quantity
        const newItems = [...prev]
        newItems[existingIndex] = item
        return newItems
      } else {
        // Add new item
        return [...prev, item]
      }
    })
  }

  const removeFromCart = (id: string, size: string) => {
    setCartItems(prev =>
      prev.filter(item => !(item.id === id && item.size === size))
    )
  }

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size)
      return
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      let itemPrice = item.discountedPrice * item.quantity
      
      // Apply additional discounts
      if (item.emailDiscount) {
        itemPrice *= 0.9 // 10% email discount
      }
      if (item.bundle) {
        const bundleDiscount = item.upsellDiscount ? item.upsellDiscount / 100 : 0.15
        itemPrice *= (1 - bundleDiscount)
      }
      
      return total + itemPrice
    }, 0)
  }

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount,
      getTotal,
      isCartOpen,
      openCart,
      closeCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
