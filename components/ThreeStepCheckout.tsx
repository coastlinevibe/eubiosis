'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check, Lock, CreditCard, X } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ProvinceSelector } from '@/components/ui/province-selector'
import { uploadEFTProofImage } from '@/lib/supabase'

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
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'payfast' | 'eft' | null>(null)
  const [eftContactedSeller, setEftContactedSeller] = useState(false)
  const [eftProofUploaded, setEftProofUploaded] = useState(false)
  const [eftProofFile, setEftProofFile] = useState<File | null>(null)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)
  const [isUploadingProof, setIsUploadingProof] = useState(false)

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
      // Show payment method modal when moving from step 2 to 3
      if (currentStep === 2) {
        setShowPaymentModal(true)
      } else {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const handlePaymentMethodSelect = (method: 'payfast' | 'eft') => {
    setShowPaymentModal(false)
    setSelectedPaymentMethod(method)
    
    if (method === 'payfast') {
      // Go straight to PayFast payment
      setTimeout(() => completeCheckout(), 0)
    } else {
      // Go to step 3 to show bank details
      setCurrentStep(3)
    }
  }

  const handleEFTWhatsApp = () => {
    // Build dynamic WhatsApp message for payment confirmation
    let message = `Hi, I paid for ${orderData.quantity} bottle${orderData.quantity > 1 ? 's' : ''} of Eubiosis ${orderData.size}`
    
    if (irresistibleOfferAccepted) {
      message += ` + Extra 50ml Bottle`
    }
    
    message += `\n\nAmount: R${totals.total}`
    
    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/27818909814?text=${encodedMessage}`
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank')
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
    
    // Debug log to verify data is correct
    console.log('🔍 Customer data:', customerData)
    
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
                {selectedPaymentMethod === 'eft' ? (
                  <>
                    {/* WhatsApp Contact Button - Primary CTA */}
                    <button
                      onClick={() => {
                        const whatsappUrl = `https://wa.me/27818909814?text=Hi, I want to buy ${orderData.quantity} bottle${orderData.quantity > 1 ? 's' : ''} of Eubiosis ${orderData.size}${irresistibleOfferAccepted ? ' + Extra 50ml Bottle' : ''}. Total: R${totals.total}`
                        window.open(whatsappUrl, '_blank')
                        setEftContactedSeller(true)
                      }}
                      className={`w-full py-4 text-white rounded-xl transition-colors font-bold text-lg flex items-center justify-center gap-2 mb-4 ${
                        eftContactedSeller ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.347l-.355.192-.368-.06a9.879 9.879 0 00-3.464.608l.564 2.173 1.888-.959a9.877 9.877 0 018.368 1.215l.341-.11a9.876 9.876 0 015.52 5.588l.325-.107a9.87 9.87 0 00-6.868-8.737z"/>
                      </svg>
                      {eftContactedSeller ? '✓ Contacted Seller' : 'Contact Seller Directly Before Buying'}
                    </button>

                    {/* Bank Details - Compact */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-semibold text-text mb-3">Bank Transfer Details</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bank:</span>
                          <span className="font-medium">Standard Bank</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Branch:</span>
                          <span className="font-medium">ONLINE BANKING (7654)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Holder:</span>
                          <span className="font-medium">MS NADINE N MARSHALL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Number:</span>
                          <span className="font-medium">10 22 861 125 1</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">SAVINGS</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                          <span className="text-gray-700">Amount:</span>
                          <span className="text-accent">R{totals.total}</span>
                        </div>
                      </div>
                    </div>

                    {/* Proof of Payment Upload */}
                    <div className={`border rounded-lg p-4 ${eftProofUploaded ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                      <h4 className="text-sm font-semibold text-text mb-3">Upload Proof of Payment</h4>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setEftProofFile(file)
                            setEftProofUploaded(true)
                          }
                        }}
                        className="w-full text-sm border border-gray-300 rounded p-2 cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-2">Upload a screenshot of your bank transfer proof</p>
                      {eftProofUploaded && <p className="text-xs text-green-600 font-semibold mt-2">✓ {eftProofFile?.name}</p>}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Province Selection Card for PayFast */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-text mb-4">Select your Province</h4>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                          Please select your province:
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
                          Click the button below to proceed to PayFast's secure payment page where you can pay with your card.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Lock className="w-4 h-4" />
                          <span>Secure payment powered by PayFast</span>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Order Summary - Show for both EFT and PayFast */}
                {(selectedPaymentMethod === 'eft' || (selectedPaymentMethod === 'payfast' && customerData.province)) && (
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
              {/* Show order summary on step 2 or step 3 */}
              {(currentStep === 2 || (currentStep === 3 && (selectedPaymentMethod === 'eft' || customerData.province))) ? (
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
                  <>
                    {selectedPaymentMethod === 'payfast' ? (
                      <button
                        onClick={() => {
                          if (!customerData.province) {
                            alert('Please select your province first.')
                            return
                          }
                          completeCheckout()
                        }}
                        className="w-full py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        Pay with PayFast - R{totals.total}
                      </button>
                    ) : selectedPaymentMethod === 'eft' ? (
                      <button
                        disabled={!eftProofUploaded || isUploadingProof}
                        onClick={async () => {
                          if (!eftProofFile) return
                          
                          setIsUploadingProof(true)
                          try {
                            const uploadResult = await uploadEFTProofImage(eftProofFile, customerData.email)
                            
                            // Send EFT proof email to admin with actual uploaded URL
                            console.log('📧 Sending EFT proof email to admin...')
                            await fetch('/api/send-eft-proof', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                customerName: `${customerData.firstName} ${customerData.lastName}`,
                                customerEmail: customerData.email,
                                phone: customerData.phone,
                                address: customerData.address,
                                city: customerData.city,
                                postalCode: customerData.postalCode,
                                quantity: orderData.quantity,
                                size: orderData.size,
                                total: totals.total,
                                irresistibleOfferAccepted: irresistibleOfferAccepted,
                                irresistibleOfferPrice: totals.irresistibleOfferPrice,
                                proofImageUrl: uploadResult.publicUrl
                              })
                            })
                            console.log('✅ EFT proof email sent')
                            
                            setShowConfirmationPopup(true)
                          } catch (error) {
                            console.error('Upload failed:', error)
                            alert('Failed to upload proof. Please try again.')
                          } finally {
                            setIsUploadingProof(false)
                          }
                        }}
                        className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
                          eftProofUploaded && !isUploadingProof
                            ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {isUploadingProof && 'Uploading...'}
                        {!eftProofUploaded && 'Upload Proof of Payment to Continue'}
                        {eftProofUploaded && !isUploadingProof && '✓ Ready to Process'}
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors flex items-center justify-center gap-2"
                      >
                        Select Payment Method
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-text">Select Payment Method</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* PayFast Option */}
                <button
                  onClick={() => handlePaymentMethodSelect('payfast')}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 mt-1"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-text mb-1">PayFast</h4>
                      <p className="text-sm text-gray-600">
                        Pay securely with your credit card or debit card. Instant payment processing.
                      </p>
                    </div>
                  </div>
                </button>

                {/* EFT Option */}
                <button
                  onClick={() => handlePaymentMethodSelect('eft')}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 mt-1"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-text mb-1">EFT (Bank Transfer)</h4>
                      <p className="text-sm text-gray-600">
                        Send payment proof to WhatsApp: <span className="font-semibold">081 890 9814</span>
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-6 text-center">
                Both methods are secure and will complete your order.
              </p>
            </div>
          </div>
        )}

        {/* EFT Confirmation Popup */}
        {showConfirmationPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-text mb-2">Payment Received!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for your payment proof. The seller will get back to you in a few minutes.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                We'll send you a confirmation email at <span className="font-semibold">{customerData.email}</span>
              </p>
              <button
                onClick={() => {
                  setShowConfirmationPopup(false)
                  // Optionally redirect or reset
                }}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Got It!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}