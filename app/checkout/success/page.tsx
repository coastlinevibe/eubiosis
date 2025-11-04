'use client'

import { useEffect, useState } from 'react'
import { Check, Truck, Shield, Home } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccess() {
  const [orderNumber] = useState(() => 
    'EB' + Math.random().toString(36).substr(2, 9).toUpperCase()
  )

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0)
  }, [])

  return (
    <main 
      className="min-h-screen bg-white relative flex items-center justify-center"
      style={{
        backgroundImage: 'url(/images/hero%20bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-white" />
          </div>

          {/* Success Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-medium text-text">
              Thank you for your order!
            </h1>
            <p className="text-lg text-text/80">
              You're one step closer to restoring your gut balance and renewing your vitality.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-center gap-2 text-accent font-medium text-lg">
              <span>Order #{orderNumber}</span>
            </div>
            <p className="text-text/70 text-sm">
              Order confirmation has been sent to: theodt.bmm@gmail.com
            </p>
          </div>

          {/* What's Next */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-medium text-text">What happens next?</h3>
            <div className="grid gap-4 text-left">
              <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-text">Order Processing</h4>
                  <p className="text-sm text-text/70">We'll prepare your order within 1-2 business days</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-text">Shipping</h4>
                  <p className="text-sm text-text/70">Same-day delivery in Mokopane, Limpopo area. Other South African areas: 3-5 business days via Courier Guy. You'll be notified once your order arrives.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-text">Start Your Journey</h4>
                  <p className="text-sm text-text/70">Begin taking Eubiosis daily and track your progress</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-6">
            <Link 
              href="/"
              className="btn w-full text-lg py-4 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Return to Home
            </Link>
            
            <p className="text-sm text-text/50">
              Need help? Contact us at support@eubiosis.co.za
            </p>
          </div>
        </div>
      </div>

      {/* Trust Footer */}
      <div className="absolute bottom-0 left-0 right-0 py-6 px-4 bg-white/80 backdrop-blur-sm border-t border-white/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-text">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-text">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-text">100% Natural Formula</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
