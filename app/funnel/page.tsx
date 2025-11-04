'use client'

import { useState, useEffect } from 'react'
import { Check, Lock, Truck, Shield } from 'lucide-react'

export default function Funnel() {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'discount' | 'upsell'>('discount')
  const [discountApplied, setDiscountApplied] = useState(false)

  // Get original order details from URL or localStorage
  const getOriginalOrder = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const size = params.get('size') || '50ml'
      const quantity = parseInt(params.get('quantity') || '1')
      const bundle = params.get('bundle') === 'true'
      return { size, quantity, bundle }
    }
    return { size: '50ml', quantity: 1, bundle: false }
  }

  const originalOrder = getOriginalOrder()

  // Calculate pricing
  const calculatePricing = () => {
    const basePrice = originalOrder.size === '50ml' ? 325 : 650
    const launchPrice = originalOrder.size === '50ml' ? 265 : 530
    
    // Original order total
    const originalTotal = launchPrice * originalOrder.quantity
    
    // Create upsell: add 50% more bottles (minimum 3 bottles total)
    const upsellQuantity = Math.max(3, Math.ceil(originalOrder.quantity * 1.5))
    const upsellTotal = launchPrice * upsellQuantity
    
    // Limited deal discount: 20% off the upsell
    const limitedDealDiscount = 0.20
    const upsellDiscountedTotal = Math.round(upsellTotal * (1 - limitedDealDiscount))
    
    // Calculate savings
    const totalSavings = (basePrice * upsellQuantity) - upsellDiscountedTotal
    const percentageSaved = Math.round(((basePrice * upsellQuantity) - upsellDiscountedTotal) / (basePrice * upsellQuantity) * 100)
    
    return {
      originalTotal,
      upsellQuantity,
      upsellTotal,
      upsellDiscountedTotal,
      totalSavings,
      percentageSaved,
      basePrice,
      launchPrice
    }
  }

  const pricing = calculatePricing()

  useEffect(() => {
    /** 
        very simply js to capture mouse position 
        and set variables to the % location. Everything else is css/svg.
    **/
    function moveBg(e: PointerEvent) {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        (e.target as HTMLElement).style.setProperty('--x', ((e.clientX - rect.x) / rect.width * 100).toString());
        (e.target as HTMLElement).style.setProperty('--y', ((e.clientY - rect.y) / rect.height * 100).toString());
    }
    document.querySelectorAll('.gooey-btn').forEach(button => {
      button.addEventListener('pointermove', moveBg as EventListener)
    });

    /** just some JS for the intro animation, nothing here is needed
    for the gooey interaction. **/
    let x: NodeJS.Timeout;
    function intro() {
        let i = 4; 
        x = setInterval(() => {
            document.querySelectorAll('.gooey-btn').forEach(button => {
              (button as HTMLElement).style.setProperty('--x', (Math.random() * 100).toString());
              (button as HTMLElement).style.setProperty('--y', (Math.random() * 100).toString());
            });
            i--;
            if (i === 0) {
                clearInterval(x);
            }
        }, 100);
    }
    
    function introTwo() {
        let i = 4; 
        x = setInterval(() => {
            document.querySelectorAll('.gooey-btn').forEach(button => {
              (button as HTMLElement).style.setProperty('--x', (Math.random() * 100).toString());
              (button as HTMLElement).style.setProperty('--y', (Math.random() * 100).toString());
            });
            i--;
            if (i === 0) {
                clearInterval(x);
            }
        }, 100);
    }
    
    function introThree() {
        let i = 4; 
        x = setInterval(() => {
            document.querySelectorAll('.gooey-btn').forEach(button => {
              (button as HTMLElement).style.setProperty('--x', (Math.random() * 100).toString());
              (button as HTMLElement).style.setProperty('--y', (Math.random() * 100).toString());
            });
            i--;
            if (i === 0) {
                clearInterval(x);
            }
        }, 100);
    }
    intro();
    introTwo();
    introThree();
    document.querySelectorAll('.gooey-btn').forEach(button => {
      button.addEventListener('pointerover', (e) => {
        clearInterval(x);
        (e.target as HTMLElement).style.setProperty( "--a", '' );
      });
    });

    return () => {
      document.querySelectorAll('.gooey-btn').forEach(button => {
        button.removeEventListener('pointermove', moveBg as EventListener)
        button.removeEventListener('pointerover', () => {})
      })
      if (x) clearInterval(x)
    }
  }, [])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // In production, save to Supabase/Brevo
      console.log('Email saved:', email)
      setDiscountApplied(true)
      setTimeout(() => {
        setStep('upsell')
      }, 2000)
    }
  }

  const handleUpgrade = () => {
    // Redirect to checkout with upsell bundle
    const params = new URLSearchParams({
      bundle: 'true',
      email: discountApplied.toString(),
      size: originalOrder.size,
      quantity: pricing.upsellQuantity.toString(),
      upsellDiscount: '20' // 20% limited deal discount
    })
    window.location.href = `/checkout?${params.toString()}`
  }

  const handleContinue = () => {
    // Redirect to checkout with original selection
    const params = new URLSearchParams({
      bundle: 'false',
      email: discountApplied.toString(),
      size: originalOrder.size,
      quantity: originalOrder.quantity.toString()
    })
    window.location.href = `/checkout?${params.toString()}`
  }

  return (
    <main 
      className="min-h-screen bg-white relative"
      style={{
        backgroundImage: 'url(/images/hero%20bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10">
      
      {/* Step 1: Discount Offer */}
      {step === 'discount' && (
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center space-y-6">
              <div className="text-6xl mb-4">🎁</div>
              <h1 className="text-4xl font-medium text-text">
                Wait! Before you buy...
              </h1>
              <p className="text-2xl text-accent font-medium">
                Unlock 10% off your first order
              </p>
              <p className="text-lg text-text/80">
                Join our wellness community and receive exclusive discounts, health tips, and early access to new products.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4 pt-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-6 py-4 border border-border rounded-eubiosis text-lg focus:outline-none focus:border-accent bg-white/80 backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="btn w-full text-lg py-4"
                >
                  Get My Discount
                </button>
              </form>

              {discountApplied && (
                <div className="bg-accent/10 border border-accent rounded-eubiosis p-6 mt-6 animate-pulse backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-2 text-accent font-medium text-lg">
                    <Check className="w-6 h-6" />
                    <span>Your discount has been applied!</span>
                  </div>
                  <p className="text-text/70 mt-2">Redirecting you to our special offer...</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Step 2: Upsell */}
      {step === 'upsell' && (
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-8 space-y-8">
              {originalOrder.quantity >= 3 && originalOrder.bundle ? (
                // Bundle already selected through funnel upsell
                <div className="text-center space-y-6">
                  <div className="text-6xl mb-4">✅</div>
                  <h2 className="text-3xl font-medium text-text">
                    Bundle Already Selected!
                  </h2>
                  <p className="text-xl text-text/80">
                    Great choice! You've already selected our {originalOrder.quantity}-bottle bundle for maximum results.
                  </p>
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-accent mb-3">Your Bundle Benefits:</h3>
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-2 text-sm text-text/70">
                        <Check className="w-4 h-4 text-accent" />
                        <span>{originalOrder.quantity * (originalOrder.size === '50ml' ? 10 : 20)}-day complete transformation</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text/70">
                        <Check className="w-4 h-4 text-accent" />
                        <span>Best price per bottle</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text/70">
                        <Check className="w-4 h-4 text-accent" />
                        <span>Same-day delivery (Mokopane area) or free Courier Guy shipping in SA</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleContinue}
                    className="btn w-full text-lg py-4"
                  >
                    Continue to Checkout
                  </button>
                </div>
              ) : (
                // Regular upsell for single bottles
                <>
                  <div className="text-center space-y-4">
                    <div className="text-5xl mb-4">💪</div>
                    <h2 className="text-3xl font-medium text-text">
                      Most users feel full results after 30 days
                    </h2>
                    <p className="text-xl text-text/80">
                      Save {pricing.percentageSaved}% with our {pricing.upsellQuantity}-bottle bundle and ensure you have enough for a complete transformation.
                    </p>
                  </div>

              {/* Comparison */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Original Order */}
                <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-eubiosis p-6 space-y-4">
                  <h3 className="text-xl font-medium text-text">Your Current Order</h3>
                  <div className="space-y-2">
                    <p className="text-text/70">{originalOrder.quantity} × {originalOrder.size} Bottle{originalOrder.quantity > 1 ? 's' : ''} ({originalOrder.quantity * (originalOrder.size === '50ml' ? 10 : 20)}-day supply)</p>
                    <p className="text-2xl font-medium text-text">R{pricing.originalTotal}</p>
                    <p className="text-sm text-text/50">Launch price applied</p>
                  </div>
                </div>

                {/* Upgraded Order */}
                <div className="bg-white/70 backdrop-blur-sm border-2 border-accent rounded-eubiosis p-6 space-y-4 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium animate-pulse">
                    LIMITED DEAL
                  </div>
                  <h3 className="text-xl font-medium text-accent">Upgrade to {pricing.upsellQuantity}-Bottle Bundle</h3>
                  <div className="space-y-2">
                    <p className="text-text/70">{pricing.upsellQuantity} × {originalOrder.size} Bottles ({pricing.upsellQuantity * (originalOrder.size === '50ml' ? 10 : 20)}-day supply)</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-medium text-accent">R{pricing.upsellDiscountedTotal}</p>
                      <p className="text-lg text-text/50 line-through">R{pricing.upsellTotal}</p>
                    </div>
                    <p className="text-sm text-accent font-medium">Save {pricing.percentageSaved}% + Free Shipping</p>
                    <p className="text-xs text-red-600 font-medium">You save R{pricing.totalSavings} total!</p>
                  </div>
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-text/70">
                      <Check className="w-4 h-4 text-accent" />
                      <span>Complete {pricing.upsellQuantity * (originalOrder.size === '50ml' ? 10 : 20)}-day transformation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text/70">
                      <Check className="w-4 h-4 text-accent" />
                      <span>Best price per bottle (R{Math.round(pricing.upsellDiscountedTotal / pricing.upsellQuantity)} each)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text/70">
                      <Check className="w-4 h-4 text-accent" />
                      <span>Same-day delivery (Mokopane area) or free Courier Guy shipping in SA</span>
                    </div>
                  </div>
                </div>
              </div>

                  {/* Action Buttons */}
                  <div className="space-y-4 pt-4">
                    <button
                      onClick={handleUpgrade}
                      className="btn w-full text-lg py-4"
                    >
                      Yes, Upgrade My Order
                    </button>
                    <button
                      onClick={handleContinue}
                      className="btn-secondary w-full text-lg py-4"
                    >
                      No Thanks, Continue
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}


      {/* Trust Footer - Always Visible */}
      <section className="py-12 px-4 bg-white/70 backdrop-blur-sm border-t border-white/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-text">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-text">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-text">100% Natural Formula</span>
            </div>
          </div>
        </div>
      </section>

      {/* SVG Filter for Gooey Buttons - Exact CodePen */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="goo" x="-50%" y="-50%" width="200%" height="200%">
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 1"></feFuncA>
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="5"></feGaussianBlur>
          <feComponentTransfer>
            <feFuncA type="table" tableValues="-5 11"></feFuncA>
          </feComponentTransfer>
        </filter>
      </svg>
      </div>
    </main>
  )
}
