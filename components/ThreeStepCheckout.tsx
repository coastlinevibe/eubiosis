'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check, Lock, CreditCard } from 'lucide-react'
import Image from 'next/image'

interface CheckoutStep {
  id: number
  title: string
  completed: boolean
}

interface OrderData {
  size: '50ml' | '100ml'
  quantity: number
  bundle: boolean
  emailDiscount: boolean
  upsellDiscount: number
  tookBigOffer: boolean // Track if user took the big upsell offer
  oto?: string // OTO offer selected (offer1, offer2, or undefined)
  otoPrice?: number // OTO price to add to total
}

interface CustomerData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  province: string
  country: string
}

interface ThreeStepCheckoutProps {
  initialOrder: OrderData
  onComplete: (orderData: OrderData, customerData: CustomerData) => void
}

export default function ThreeStepCheckout({ initialOrder, onComplete }: ThreeStepCheckoutProps) {
  const [currentStep, setCurrentStep] = useState(2) // Start at step 2 (customer info)
  const [orderData, setOrderData] = useState<OrderData>(initialOrder)
  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    province: '',
    country: 'South Africa'
  })

  const [paymentData, setPaymentData] = useState({
    email: '',
    cardNumber: '',
    cvc: '',
    expiryMonth: '',
    expiryYear: '',
    paymentMethod: 'card' as 'card' | 'eft'
  })

  const [irresistibleOfferAccepted, setIrresistibleOfferAccepted] = useState(false)

  const steps: CheckoutStep[] = [
    { id: 1, title: 'Product', completed: true },
    { id: 2, title: 'Details', completed: false },
    { id: 3, title: 'Payment', completed: false }
  ]

  const pricing = {
    '50ml': { basePrice: 325, discountedPrice: 265 },
    '100ml': { basePrice: 650, discountedPrice: 530 }
  }

  const calculateTotal = () => {
    const basePrice = pricing[orderData.size].basePrice
    const discountedPrice = pricing[orderData.size].discountedPrice
    const subtotal = basePrice * orderData.quantity
    const healthyGutDiscount = (basePrice - discountedPrice) * orderData.quantity
    
    let additionalDiscounts = 0
    if (orderData.emailDiscount && !orderData.bundle) {
      additionalDiscounts += Math.round((subtotal - healthyGutDiscount) * 0.1)
    }
    if (orderData.bundle) {
      const bundlePercent = orderData.upsellDiscount > 0 ? orderData.upsellDiscount / 100 : 0.15
      additionalDiscounts += Math.round((subtotal - healthyGutDiscount) * bundlePercent)
    }

    const baseTotal = subtotal - healthyGutDiscount - additionalDiscounts
    const otoPrice = orderData.oto && orderData.otoPrice ? orderData.otoPrice : 0
    const irresistibleOfferPrice = irresistibleOfferAccepted ? 235 : 0 // R265 - R30 discount

    return {
      subtotal,
      healthyGutDiscount,
      additionalDiscounts,
      otoPrice,
      irresistibleOfferPrice,
      total: baseTotal + otoPrice + irresistibleOfferPrice
    }
  }

  const handleCustomerDataChange = (field: keyof CustomerData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }))
  }

  const isStepValid = (step: number) => {
    if (step === 2) {
      return Object.values(customerData).every(value => value.trim() !== '')
    }
    return true
  }

  const nextStep = () => {
    if (currentStep < 3 && isStepValid(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const completeCheckout = () => {
    onComplete(orderData, customerData)
  }

  const totals = calculateTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep === step.id 
                    ? 'bg-accent text-white' 
                    : step.completed || currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {step.completed || currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === step.id ? 'text-accent' : 'text-gray-600'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-medium text-text mb-6">Customer Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Name and Surname"
                      value={customerData.firstName + (customerData.lastName ? ' ' + customerData.lastName : '')}
                      onChange={(e) => {
                        const names = e.target.value.split(' ')
                        handleCustomerDataChange('firstName', names[0] || '')
                        handleCustomerDataChange('lastName', names.slice(1).join(' ') || '')
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="healthy@me.co.za"
                      value={customerData.email}
                      onChange={(e) => handleCustomerDataChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number..."
                      value={customerData.phone}
                      onChange={(e) => handleCustomerDataChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-600 mb-4">SHIPPING</h3>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Exact Address..."
                      value={customerData.address}
                      onChange={(e) => handleCustomerDataChange('address', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="City/Town Name..."
                      value={customerData.city}
                      onChange={(e) => handleCustomerDataChange('city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">State / Province</label>
                      <input
                        type="text"
                        placeholder="State / Province..."
                        value={customerData.province}
                        onChange={(e) => handleCustomerDataChange('province', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">Postal Code</label>
                      <input
                        type="text"
                        placeholder="Postal Code..."
                        value={customerData.postalCode}
                        onChange={(e) => handleCustomerDataChange('postalCode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Country</label>
                    <select
                      value={customerData.country}
                      onChange={(e) => handleCustomerDataChange('country', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    >
                      <option value="South Africa">South Africa</option>
                      <option value="Botswana">Botswana</option>
                      <option value="Namibia">Namibia</option>
                      <option value="Zimbabwe">Zimbabwe</option>
                      <option value="Zambia">Zambia</option>
                      <option value="Mozambique">Mozambique</option>
                      <option value="Swaziland">Swaziland</option>
                      <option value="Lesotho">Lesotho</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Email Confirmation */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-medium text-text mb-4">Your Email Address:</h3>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Please confirm your Email..."
                      value={paymentData.email}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-medium text-text mb-4">Payment Method</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'card' }))}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        paymentData.paymentMethod === 'card' 
                          ? 'border-accent bg-accent/5 text-accent' 
                          : 'border-gray-300 hover:border-accent/50'
                      }`}
                    >
                      <CreditCard className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Bank Card</span>
                    </button>
                    <button
                      onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'eft' }))}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        paymentData.paymentMethod === 'eft' 
                          ? 'border-accent bg-accent/5 text-accent' 
                          : 'border-gray-300 hover:border-accent/50'
                      }`}
                    >
                      <div className="w-6 h-6 mx-auto mb-2 bg-accent rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">EFT</span>
                      </div>
                      <span className="text-sm font-medium">Bank Transfer</span>
                    </button>
                  </div>

                  {paymentData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-text mb-2">Bank Card Number:</label>
                          <input
                            type="text"
                            placeholder="Card number"
                            value={paymentData.cardNumber}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text mb-2">CVC Code:</label>
                          <input
                            type="text"
                            placeholder="CVC"
                            value={paymentData.cvc}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, cvc: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text mb-2">Expiry Month:</label>
                          <select
                            value={paymentData.expiryMonth}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, expiryMonth: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                          >
                            <option value="">01</option>
                            {Array.from({ length: 12 }, (_, i) => (
                              <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                {String(i + 1).padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text mb-2">Expiry Year:</label>
                          <select
                            value={paymentData.expiryYear}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, expiryYear: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                          >
                            <option value="">2016</option>
                            {Array.from({ length: 15 }, (_, i) => (
                              <option key={2024 + i} value={2024 + i}>
                                {2024 + i}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-text">Item</span>
                      <span className="text-text font-medium">Price</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent rounded-full"></span>
                        <span className="text-text">
                          {orderData.bundle ? `${orderData.quantity}-Bottle Bundle` : `Eubiosis ${orderData.size}`}
                          {orderData.oto && ` + OTO ${orderData.oto}`}
                          {irresistibleOfferAccepted && ' + Extra 50ml Bottle'}
                        </span>
                      </div>
                      <span className="text-text font-medium">
                        R{totals.total}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Irresistible Offer - Only show if user didn't take big offer */}
                {!orderData.tookBigOffer && !irresistibleOfferAccepted && (
                  <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-red-500 text-xl">➤</span>
                      <input
                        type="checkbox"
                        id="irresistible-offer"
                        onChange={(e) => setIrresistibleOfferAccepted(e.target.checked)}
                        className="w-4 h-4 text-accent"
                      />
                      <label htmlFor="irresistible-offer" className="text-lg font-bold text-green-600">
                        Yes, I will Take It!
                      </label>
                    </div>
                    <div className="text-sm text-text/80">
                      <span className="font-bold text-red-500">IRRESISTIBLE OFFER:</span> Add one more 50ml bottle for only R235 
                      (normally R265 - save R30!). Perfect for sharing or extending your gut health journey.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-8">
              <h3 className="text-lg font-medium text-text mb-4">Order Summary</h3>
              
              <div className="flex gap-3 mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src="/images/Website Product Image.png"
                    alt="Eubiosis"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-text">
                    {orderData.bundle ? `${orderData.quantity}-Bottle Bundle` : 'Eubiosis — Nature in a Bottle'}
                    {orderData.oto && <span className="text-accent"> + OTO Deal</span>}
                  </h4>
                  <p className="text-sm text-text/70">
                    {orderData.size} × {orderData.quantity}
                    {orderData.oto && <span className="text-accent"> + {orderData.oto}</span>}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-red-500 line-through">R{totals.subtotal + (orderData.otoPrice || 0)}</span>
                    <div className="text-right">
                      <div className="font-medium text-accent">R{totals.total}</div>
                      <div className="text-xs text-green-600">save R{totals.healthyGutDiscount + totals.additionalDiscounts} ✓</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="space-y-3 pt-4 border-t">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="w-full py-3 border border-gray-300 text-text rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="w-full py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={completeCheckout}
                    className="w-full py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Complete Order - R{totals.total}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}