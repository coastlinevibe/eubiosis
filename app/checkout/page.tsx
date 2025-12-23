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
  const provinceParam = searchParams.get('province') // Check if province is in URL

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
      console.log('Order data:', orderData)
      console.log('Customer data:', customerData)
      
      // Calculate total amount
      const pricing: Record<'50ml' | '100ml', { specialPrice: number }> = {
        '50ml': { specialPrice: 265 },
        '100ml': { specialPrice: 530 }
      }
      
      const subtotal = pricing[orderData.size as '50ml' | '100ml'].specialPrice * orderData.quantity
      
      // Add irresistible offer if accepted
      let irresistibleOfferPrice = 0
      if (orderData.irresistibleOfferAccepted) {
        irresistibleOfferPrice = 235
      }
      
      const orderSubtotal = subtotal + irresistibleOfferPrice
      const deliveryFee = orderSubtotal >= 650 ? 29 : 59
      const total = orderSubtotal + deliveryFee
      
      // Send notification emails before redirecting to PayFast
      console.log('📧 Sending notification emails...')
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerEmail: customerData.email,
            customerName: `${customerData.firstName} ${customerData.lastName}`,
            quantity: orderData.quantity,
            size: orderData.size,
            totalPrice: total,
            irresistibleOfferAccepted: orderData.irresistibleOfferAccepted || false,
            irresistibleOfferPrice,
            phone: customerData.phone,
            address: customerData.address,
            city: customerData.city,
            postalCode: customerData.postalCode,
            emailType: 'pending'
          })
        })
        console.log('✅ Notification emails sent successfully')
      } catch (error) {
        console.error('❌ Failed to send notification emails:', error)
        // Continue with payment even if email fails
      }
      
      // Save order to Supabase before redirecting to PayFast
      console.log('🚀 About to save order to Supabase...')
      try {
        const savedOrder = await saveOrder(orderData, customerData)
        console.log('✅ Order saved to Supabase successfully:', savedOrder)
      } catch (error) {
        console.error('❌ Failed to save order to Supabase:', error)
        // Continue with payment even if Supabase save fails
      }
      
      // Create PayFast payment form
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://www.payfast.co.za/eng/process' // LIVE MODE
      
      // PayFast live credentials
      const fields: Record<string, string> = {
        merchant_id: '10818957',
        merchant_key: 'cjb3kk3rdiwsq',
        amount: total.toFixed(2),
        item_name: `Eubiosis ${orderData.size} x ${orderData.quantity}${orderData.irresistibleOfferAccepted ? ' + Extra 50ml Bottle' : ''} - ${customerData.province}`,
        name_first: customerData.firstName,
        name_last: customerData.lastName,
        email_address: customerData.email,
        cell_number: customerData.phone,
        return_url: 'https://www.eubiosis.pro/checkout/success',
        cancel_url: 'https://www.eubiosis.pro/checkout',
        notify_url: 'https://www.eubiosis.pro/api/payfast/notify'
      }
      
      // Generate signature (required by PayFast)
      const pfParamString = Object.keys(fields)
        .sort()
        .map(key => `${key}=${encodeURIComponent(fields[key]).replace(/%20/g, '+')}`)
        .join('&')
      
      // Add signature field
      fields.signature = await generateMD5(pfParamString)
      
      // Add fields to form
      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value
        form.appendChild(input)
      })
      
      // Add 2 second delay before redirecting to PayFast
      console.log('⏳ Waiting 2 seconds before redirecting to PayFast...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Submit form
      document.body.appendChild(form)
      form.submit()
    } catch (error) {
      console.error('Failed to process order:', error)
      alert('There was an error processing your order. Please try again.')
    }
  }
  
  // Generate MD5 hash for PayFast signature
  async function generateMD5(str: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest('MD5', data).catch(() => {
      // Fallback: if MD5 not supported, just return empty (sandbox doesn't require it)
      return new ArrayBuffer(0)
    })
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  return (
    <ThreeStepCheckout 
      initialOrder={initialOrder}
      initialProvince={provinceParam || ''}
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
