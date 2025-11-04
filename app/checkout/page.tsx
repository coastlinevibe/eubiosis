'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Check, CreditCard, Truck, Shield, Lock, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'

interface OrderItem {
  id: string
  name: string
  size: string
  quantity: number
  basePrice: number
  discountedPrice: number
  image: string
}

interface OrderSummary {
  items: OrderItem[]
  emailDiscount: number
  bundleDiscount: number
  promoDiscount: number
  launchDiscount: number
  subtotal: number
  totalDiscount: number
  shipping: number
  total: number
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  
  // Get funnel parameters
  const bundle = searchParams.get('bundle') === 'true'
  const emailDiscount = searchParams.get('email') === 'true'
  const size = (searchParams.get('size') || '50ml') as '50ml' | '100ml'
  const quantity = parseInt(searchParams.get('quantity') || '1')
  const upsellDiscount = parseInt(searchParams.get('upsellDiscount') || '0')

  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    province: ''
  })

  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [showUpsell, setShowUpsell] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<'fastpay' | 'eft'>('fastpay')

  // Shipping cost calculation based on location
  const calculateShippingCost = () => {
    const province = customerInfo.province
    const city = customerInfo.city.toLowerCase()
    
    // Same-day delivery for Mokopane, Limpopo
    if (province === 'Limpopo' && city.includes('mokopane')) {
      return 0 // Free same-day delivery
    }
    
    // Free shipping for orders over R500 or bundles
    const orderValue = (size === '50ml' ? 265 : 530) * quantity
    if (orderValue >= 500 || bundle) {
      return 0
    }
    
    // Provincial shipping rates
    const shippingRates: { [key: string]: number } = {
      'Gauteng': 50,
      'Western Cape': 75,
      'KwaZulu-Natal': 60,
      'Eastern Cape': 80,
      'Free State': 65,
      'Mpumalanga': 55,
      'North West': 60,
      'Northern Cape': 85,
      'Limpopo': 45
    }
    
    return shippingRates[province] || 100 // Default for unknown provinces or international
  }

  // Calculate order summary
  const calculateOrder = (): OrderSummary => {
    const basePrice = size === '50ml' ? 325 : 650
    const discountedPrice = size === '50ml' ? 265 : 530
    
    let items: OrderItem[] = []
    
    if (bundle) {
      // Dynamic bundle based on quantity from funnel
      const bundleDiscountPercent = upsellDiscount > 0 ? (upsellDiscount / 100) : 0.15 // Use upsell discount or default 15%
      items = [{
        id: `eubiosis-bundle-${quantity}`,
        name: `Eubiosis ${quantity}-Bottle Bundle`,
        size: size,
        quantity: quantity,
        basePrice: basePrice,
        discountedPrice: Math.round(discountedPrice * (1 - bundleDiscountPercent)),
        image: '/images/bottles/bottle-combo.png'
      }]
    } else {
      // Single bottle order
      items = [{
        id: 'eubiosis-single',
        name: 'Eubiosis — Nature in a Bottle',
        size: size,
        quantity: quantity,
        basePrice: basePrice,
        discountedPrice: basePrice, // Use base price for subtotal calculation
        image: '/images/Website Product Image.png'
      }]
    }

    // Calculate subtotal at original prices
    const subtotal = items.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0)
    
    // Calculate launch discount (18% off original price)
    const launchDiscountAmount = Math.round(subtotal * 0.18)
    
    // Apply additional discounts
    let emailDiscountAmount = 0
    let bundleDiscountAmount = 0
    let promoDiscountAmount = 0

    // Calculate discounts on the already discounted price
    const afterLaunchPrice = subtotal - launchDiscountAmount

    if (emailDiscount && !bundle) {
      emailDiscountAmount = Math.round(afterLaunchPrice * 0.1) // 10% email discount
    }

    if (bundle) {
      const bundleDiscountPercent = upsellDiscount > 0 ? (upsellDiscount / 100) : 0.15
      bundleDiscountAmount = Math.round(afterLaunchPrice * bundleDiscountPercent)
    }

    if (promoApplied) {
      promoDiscountAmount = Math.round(afterLaunchPrice * 0.05) // 5% promo code discount
    }

    const totalDiscount = launchDiscountAmount + emailDiscountAmount + bundleDiscountAmount + promoDiscountAmount
    const afterDiscounts = subtotal - totalDiscount
    // Dynamic shipping based on location
    const shipping = calculateShippingCost()
    const total = afterDiscounts + shipping

    return {
      items: items.map(item => ({
        ...item,
        discountedPrice: size === '50ml' ? 265 : 530 // Show final discounted price in display
      })),
      emailDiscount: emailDiscountAmount,
      bundleDiscount: bundleDiscountAmount,
      promoDiscount: promoDiscountAmount,
      launchDiscount: launchDiscountAmount,
      subtotal,
      totalDiscount,
      shipping,
      total
    }
  }

  const [orderSummary, setOrderSummary] = useState<OrderSummary>(calculateOrder())

  useEffect(() => {
    setOrderSummary(calculateOrder())
  }, [bundle, emailDiscount, size, quantity, promoApplied, customerInfo.province, customerInfo.city])

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === 'welcome5' || promoCode.toLowerCase() === 'health5') {
      setPromoApplied(true)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Process order - redirect to success page
    console.log('Order submitted:', { customerInfo, orderSummary })
    window.location.href = '/checkout/success'
  }

  const addUpsell = () => {
    // Add a small upsell item (e.g., consultation or additional bottle)
    setShowUpsell(false)
    // In a real implementation, you'd update the order
    console.log('Upsell added')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href={`/eubiosis-bottle/size-${size === '50ml' ? 's' : 'j'}/quantity-${quantity}?checkout=true&bundle=${bundle}&email=${emailDiscount}`} 
            className="flex items-center gap-2 text-text hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Order</span>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-medium text-text">Secure Checkout</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Customer Information */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-medium text-text mb-6">Customer Information</h2>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">First Name</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Last Name</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Street Address</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Province</label>
                  <select
                    required
                    value={customerInfo.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                  >
                    <option value="">Select Province</option>
                    <option value="WC">Western Cape</option>
                    <option value="GP">Gauteng</option>
                    <option value="KZN">KwaZulu-Natal</option>
                    <option value="EC">Eastern Cape</option>
                    <option value="FS">Free State</option>
                    <option value="LP">Limpopo</option>
                    <option value="MP">Mpumalanga</option>
                    <option value="NW">North West</option>
                    <option value="NC">Northern Cape</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-text mb-4">Promo Code</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={handlePromoCode}
                  disabled={promoApplied}
                  className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {promoApplied && (
                <div className="mt-3 flex items-center gap-2 text-accent text-sm">
                  <Check className="w-4 h-4" />
                  <span>Promo code applied! You saved R{orderSummary.promoDiscount}</span>
                </div>
              )}
            </div>

          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-text">Order Summary</h2>
                {bundle && (
                  <button
                    onClick={() => {
                      // Redirect back to shop page without bundle parameters
                      const newUrl = `/eubiosis-bottle/size-${size === '50ml' ? 's' : 'j'}/quantity-1`
                      window.location.href = newUrl
                    }}
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete Bundle
                  </button>
                )}
              </div>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {orderSummary.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-text">{item.name}</h4>
                      <p className="text-sm text-text/70">{item.size} × {item.quantity}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-medium text-accent">R{item.discountedPrice * item.quantity}</span>
                        <span className="text-sm text-text/50 line-through">R{item.basePrice * item.quantity}</span>
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">Launch Price</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 py-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-text/70">Subtotal</span>
                  <span className="text-text">R{orderSummary.subtotal}</span>
                </div>
                
                {orderSummary.launchDiscount > 0 && (
                  <div className="flex justify-between text-accent">
                    <span>Launch Special (18%)</span>
                    <span>-R{orderSummary.launchDiscount}</span>
                  </div>
                )}
                
                {orderSummary.emailDiscount > 0 && (
                  <div className="flex justify-between text-accent">
                    <span>Email Discount (10%)</span>
                    <span>-R{orderSummary.emailDiscount}</span>
                  </div>
                )}
                
                {orderSummary.bundleDiscount > 0 && (
                  <div className="flex justify-between text-accent">
                    <span>Bundle Discount ({upsellDiscount > 0 ? upsellDiscount : 15}%)</span>
                    <span>-R{orderSummary.bundleDiscount}</span>
                  </div>
                )}
                
                {orderSummary.promoDiscount > 0 && (
                  <div className="flex justify-between text-accent">
                    <span>Promo Code Discount</span>
                    <span>-R{orderSummary.promoDiscount}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-text/70">
                    Shipping
                    {customerInfo.province && customerInfo.city && (
                      <span className="text-xs block text-text/50">
                        {customerInfo.province === 'Limpopo' && customerInfo.city.toLowerCase().includes('mokopane') 
                          ? 'Same-day delivery' 
                          : `to ${customerInfo.province}`
                        }
                      </span>
                    )}
                  </span>
                  <span className="text-text">{orderSummary.shipping === 0 ? 'Free' : `R${orderSummary.shipping}`}</span>
                </div>
                
                <div className="flex justify-between text-lg font-medium pt-3 border-t border-gray-200">
                  <span className="text-text">Total</span>
                  <span className="text-accent">R{orderSummary.total}</span>
                </div>
              </div>

              {/* Small Upsell */}
              {showUpsell && (
                <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-text text-sm">Add Health Consultation</h4>
                      <p className="text-xs text-text/70 mt-1">30-minute personalized gut health consultation with our expert</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-accent font-medium text-sm">R150</span>
                        <span className="text-xs text-text/50 line-through">R250</span>
                      </div>
                    </div>
                    <button
                      onClick={addUpsell}
                      className="px-3 py-1 bg-accent text-white text-xs rounded-lg hover:bg-accent/90 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-text mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-accent transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="fastpay"
                      checked={paymentMethod === 'fastpay'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'fastpay')}
                      className="text-accent"
                    />
                    <CreditCard className="w-4 h-4 text-accent" />
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">Fastpay</span>
                      <span className="text-xs text-text/60">Secure instant payment</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-accent transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="eft"
                      checked={paymentMethod === 'eft'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'eft')}
                      className="text-accent"
                    />
                    <div className="w-4 h-4 bg-accent rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">EFT</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">EFT/Bank Transfer</span>
                      <span className="text-xs text-text/60">Direct bank transfer</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                type="submit"
                form="checkout-form"
                onClick={handleSubmit}
                className="w-full mt-6 py-4 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Complete Order - R{orderSummary.total}
              </button>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function Checkout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
