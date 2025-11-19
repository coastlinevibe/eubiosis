'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import ThreeStepCheckout from '@/components/ThreeStepCheckout'
import { saveOrder } from '@/lib/supabase'

function CheckoutContent() {
  const searchParams = useSearchParams()
  
  // Get funnel parameters
  const bundle = searchParams.get('bundle') === 'true'
  const emailDiscount = searchParams.get('email') === 'true'
  const size = (searchParams.get('size') || '50ml') as '50ml' | '100ml'
  const quantity = parseInt(searchParams.get('quantity') || '1')
  const upsellDiscount = parseInt(searchParams.get('upsellDiscount') || '0')
  const tookBigOffer = searchParams.get('tookBigOffer') === 'true' // Track if user took big offer

  const initialOrder = {
    size,
    quantity,
    bundle,
    emailDiscount,
    upsellDiscount,
    tookBigOffer
  }

  const handleCheckoutComplete = async (orderData: any, customerData: any) => {
    try {
      // Save order to Supabase database
      console.log('Saving order to database...')
      const savedOrder = await saveOrder(orderData, customerData)
      console.log('Order saved successfully:', savedOrder)
      
      // Redirect to success page with order ID
      window.location.href = `/checkout/success?orderId=${savedOrder.id}`
    } catch (error) {
      console.error('Failed to save order:', error)
      alert('There was an error processing your order. Please try again.')
    }
  }

  return (
    <ThreeStepCheckout 
      initialOrder={initialOrder}
      onComplete={handleCheckoutComplete}
    />
  )
}

export default function Checkout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
