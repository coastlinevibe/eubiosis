'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check, Lock, CreditCard } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ProvinceSelector } from '@/components/ui/province-selector'

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
  irresistibleOfferAccepted?: boolean // Track if user accepted the irresistible offer
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
}

interface ThreeStepCheckoutProps {
  initialOrder: OrderData
  initialProvince?: string
  onComplete: (orderData: OrderData, customerData: CustomerData) => void
}

export default function ThreeStepCheckout({ initialOrder, initialProvince = '', onComplete }: ThreeStepCheckoutProps) {
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
    province: initialProvince
  })

  const [fullName, setFullName] = useState('')

  const [irresistibleOfferAccepted, setIrresistibleOfferAccepted] = useState(false)

  // Debug: Log province changes
  useEffect(() => {
    console.log('🔍 Province state updated:', customerData.province)
  }, [customerData.province])

  const steps: CheckoutStep[] = [
    { id: 1, title: 'Product', completed: true },
    { id: 2, title: 'Details', completed: false },
    { id: 3, title: 'Payment', completed: false }
  ]

  const pricing = {
    '50ml': { basePrice: 325, discountedPrice: 265, savings: 60 },
    '100ml': { basePrice: 650, discountedPrice: 530, savings: 120 }
  }

  const calculateTotal = () => {
    const basePrice = pricing[orderData.size].basePrice
    const discountedPrice = pricing[orderData.size].discountedPrice
    const baseSavings = pricing[orderData.size].savings
    
    // Base calculation with Healthy Gut Special discount
    const baseSubtotal = discountedPrice * orderData.quantity
    let totalSavings = baseSavings * orderData.quantity
    
    // Irresistible offer calculation
    let irresistibleOfferPrice = 0
    let irresistibleOfferSavings = 0
    if (irresistibleOfferAccepted) {
      irresistibleOfferPrice = 235 // Special price for extra 50ml bottle
      irresistibleOfferSavings = 90 // R325 - R235 = R90 savings on the extra bottle
      totalSavings += irresistibleOfferSavings
    }
    
    // Calculate order subtotal (before delivery)
    const orderSubtotal = baseSubtotal + irresistibleOfferPrice
    
    // Delivery fee calculation
    let deliveryFee = 0
    if (orderSubtotal >= 650) {
      deliveryFee = 29 // Reduced delivery fee for orders R650+
    } else {
      deliveryFee = 59 // Standard delivery fee for orders under R650
    }

    return {
      basePrice: basePrice * orderData.quantity + (irresistibleOfferAccepted ? 325 : 0), // Original prices
      discountedPrice: baseSubtotal,
      healthyGutDiscount: totalSavings,
      irresistibleOfferPrice,
      deliveryFee,
      total: orderSubtotal + deliveryFee,
      totalSavings
    }
  }

  const handleCustomerDataChange = (field: keyof CustomerData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }))
  }

  const isStepValid = (step: number) => {
    if (step === 2) {
      // Validate name, email, phone, and address
      return customerData.firstName.trim() !== '' && 
             customerData.email.trim() !== '' && 
             customerData.phone.trim() !== '' &&
             customerData.address.trim() !== '' &&
             customerData.city.trim() !== '' &&
             customerData.postalCode.trim() !== ''
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
    // Validate required fields
    if (!customerData.firstName || !customerData.email || !customerData.phone || !customerData.address || !customerData.city || !customerData.postalCode) {
      alert('Please provide all required information including your delivery address.')
      return
    }
    
    if (!customerData.province) {
      alert('Please select your province.')
      return
    }
    
    // Debug log to verify province is correct
    console.log('🔍 Province being sent to PayFast:', customerData.province)
    console.log('🔍 Full customer data:', customerData)
    
    // Redirect to PayFast with irresistible offer included
    onComplete({ ...orderData, irresistibleOfferAccepted }, customerData)
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
                    <label className="block text-sm font-medium text-text mb-2">Name and Surname</label>
                    <input
                      type="text"
                      placeholder="Enter your full name..."
                      value={fullName}
                      onChange={(e) => {
                        const inputValue = e.target.value
                        setFullName(inputValue)
                        
                        // Update firstName and lastName for database storage
                        const spaceIndex = inputValue.lastIndexOf(' ')
                        if (spaceIndex === -1) {
                          handleCustomerDataChange('firstName', inputValue)
                          handleCustomerDataChange('lastName', '')
                        } else {
                          const firstName = inputValue.substring(0, spaceIndex)
                          const lastName = inputValue.substring(spaceIndex + 1)
                          handleCustomerDataChange('firstName', firstName)
                          handleCustomerDataChange('lastName', lastName)
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="healthy@me.co.za"
                      value={customerData.email}
                      onChange={(e) => handleCustomerDataChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number..."
                      value={customerData.phone}
                      onChange={(e) => handleCustomerDataChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Street Address</label>
                    <input
                      type="text"
                      placeholder="123 Main Street, Apartment 4B"
                      value={customerData.address}
                      onChange={(e) => handleCustomerDataChange('address', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">City</label>
                      <input
                        type="text"
                        placeholder="Johannesburg"
                        value={customerData.city}
                        onChange={(e) => handleCustomerDataChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text mb-2">Postal Code</label>
                      <input
                        type="text"
                        placeholder="2000"
                        value={customerData.postalCode}
                        onChange={(e) => handleCustomerDataChange('postalCode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Province Selection Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-text mb-4">Select your Province</h4>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Please select your province for bank transfer details:
                    </p>
                    {/* Province selector component */}
                    <div className="w-full">
                      <ProvinceSelector
                        value={customerData.province}
                        onChange={(value) => handleCustomerDataChange('province', value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Information - Only show if province is selected */}
                {customerData.province && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-text mb-4">Ready to Pay</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Click the button below to proceed to PayFast's secure payment page where you can pay with your card or EFT.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Lock className="w-4 h-4" />
                      <span>Secure payment powered by PayFast</span>
                    </div>
                  </div>
                )}

                {/* Order Summary - Only show if province is selected */}
                {customerData.province && (
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
                )}

                {/* Irresistible Offer - Only show if user didn't take big offer and province is selected */}
                {customerData.province && !orderData.tookBigOffer && !irresistibleOfferAccepted && (
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
                      (normally R325 - save R90!). Perfect for sharing or extending your gut health journey.
                    </div>
                  </div>
                )}


              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-8">
              {/* Show order summary on step 2 or step 3 with province selected */}
              {(currentStep === 2 || (currentStep === 3 && customerData.province)) ? (
                <>
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
                      <div className="text-right mt-1 space-y-1">
                        <div className="text-sm text-red-500 line-through">R{totals.basePrice}</div>
                        <div className="text-sm text-gray-600">Special Price: R{totals.discountedPrice}</div>
                        {irresistibleOfferAccepted && (
                          <div className="text-sm text-green-600">+ Extra Bottle: R{totals.irresistibleOfferPrice}</div>
                        )}
                        {currentStep === 3 && (
                          <div className="text-sm text-gray-600">Delivery: R{totals.deliveryFee}</div>
                        )}
                        <div className="font-medium text-accent text-lg">Total: R{currentStep === 3 ? totals.total : totals.discountedPrice + (irresistibleOfferAccepted ? totals.irresistibleOfferPrice : 0)}</div>
                        <div className="text-xs text-green-600 font-medium">You Save: R{totals.totalSavings} ✓</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-text mb-4">Select Your Province</h3>
                  <p className="text-sm text-gray-600">
                    Please select your province above to see your order summary and continue with payment.
                  </p>
                </div>
              )}

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
                    disabled={!customerData.province}
                    className="w-full py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Pay with PayFast - R{totals.total}
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