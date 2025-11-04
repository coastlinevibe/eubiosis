'use client'

import { useCart } from '@/context/CartContext'
import CartSidebar from '@/components/CartSidebar'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isCartOpen, closeCart } = useCart()

  return (
    <>
      {children}
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
    </>
  )
}
