'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import ThreeStepCheckout from '@/components/ThreeStepCheckout'

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

  const handleCheckoutComplete = (orderData: any, customerData: any) => {
    // Process order - redirect to success page
    console.log('Order completed:', { orderData, customerData })
    window.location.href = '/checkout/success'
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
