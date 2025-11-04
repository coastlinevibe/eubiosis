'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Minus, ShoppingBag, Truck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

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

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotal
  } = useCart()

  const calculateTotal = () => {
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

  const proceedToCheckout = () => {
    if (cartItems.length === 0) return

    // Take the first item's properties and go through funnel
    const firstItem = cartItems[0]
    const params = new URLSearchParams({
      size: firstItem.size,
      quantity: firstItem.quantity.toString()
    })

    window.location.href = `/funnel?${params.toString()}`
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-medium text-text">
                Cart ({getItemCount()})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Link
                  href="/eubiosis-bottle/size-s/quantity-1"
                  onClick={onClose}
                  className="inline-block px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-text text-sm">{item.name}</h3>
                      <p className="text-xs text-text/70">{item.size}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-accent font-medium text-sm">
                          R{Math.round(item.discountedPrice)}
                        </span>
                        {item.basePrice !== item.discountedPrice && (
                          <span className="text-xs text-text/50 line-through">
                            R{item.basePrice}
                          </span>
                        )}
                      </div>
                      {item.bundle && (
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full mt-1 inline-block">
                          Bundle
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              {/* Shipping Info */}
              <div className="flex items-center gap-2 text-sm text-accent">
                <Truck className="w-4 h-4" />
                <span>Free shipping on orders over R500</span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-medium">
                <span className="text-text">Total</span>
                <span className="text-accent">R{Math.round(getTotal())}</span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={proceedToCheckout}
                  className="w-full py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
                >
                  Checkout
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // Save current cart state and refresh page
                      const firstItem = cartItems[0]
                      if (firstItem) {
                        const sizeCode = firstItem.size === '50ml' ? 's' : 'j'
                        const newUrl = `/eubiosis-bottle/size-${sizeCode}/quantity-${firstItem.quantity}`
                        window.location.href = newUrl // Full refresh
                      }
                    }}
                    className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={clearCart}
                    className="flex-1 py-2 text-red-500 hover:text-red-700 transition-colors border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
