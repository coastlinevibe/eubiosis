'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { HandWrittenTitle } from "@/components/ui/hand-writing-text"
import { ParticleButton } from "@/components/ui/particle-button"
import { useRouter } from 'next/navigation'

function OTOContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get original order parameters
  const originalSize = searchParams.get('size') || '50ml'
  const originalQuantity = searchParams.get('quantity') || '1'
  const bundle = searchParams.get('bundle') || 'false'
  const email = searchParams.get('email') || 'false'

  const selectOffer = (offerNumber: number, price: number) => {
    const checkoutUrl = `/checkout?bundle=${bundle}&email=${email}&size=${originalSize}&quantity=${originalQuantity}&tookBigOffer=false&oto=offer${offerNumber}&otoPrice=${price}`
    router.push(checkoutUrl)
  }



  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/images/oto.jpg')",
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10" />
      
      {/* Content Container - Large screens only */}
      <div className="hidden xl:block relative z-10 min-h-screen">
        
        {/* Left Offer Price */}
        <div className="absolute left-[30%] top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <HandWrittenTitle 
            normalPrice="R325"
            otoPrice="R245"
            savings="Save R80!"
            color="#14b8a6"
          />
        </div>

        {/* Right Offer Price */}
        <div className="absolute right-[30%] top-1/2 transform translate-x-1/2 -translate-y-1/2">
          <HandWrittenTitle 
            normalPrice="R1300"
            otoPrice="R940"
            savings="Save R360!"
            color="#22c55e"
          />
        </div>

        {/* Left Side Buttons */}
        <div className="absolute bottom-[13.3%] left-1/2 transform -translate-x-1/2" style={{ marginLeft: '-8vw' }}>
          <div className="flex gap-2">
            <ParticleButton 
              onClick={() => selectOffer(1, 245)}
              className="bg-white hover:bg-teal-50 text-teal-700 border-2 border-teal-500 hover:border-teal-600 px-2 py-2 text-sm font-semibold shadow-md rounded-lg scale-90"
              successDuration={1500}
            >
              50ml
            </ParticleButton>
            <ParticleButton 
              onClick={() => selectOffer(2, 940)}
              className="bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-500 hover:border-emerald-600 px-2 py-2 text-sm font-semibold shadow-md rounded-lg scale-90"
              successDuration={1500}
            >
              100ml
            </ParticleButton>
          </div>
        </div>

        {/* Right Side Buttons */}
        <div className="absolute bottom-[13.3%] left-1/2 transform -translate-x-1/2" style={{ marginLeft: '8vw' }}>
          <div className="flex gap-2">
            <ParticleButton 
              onClick={() => selectOffer(1, 245)}
              className="bg-white hover:bg-teal-50 text-teal-700 border-2 border-teal-500 hover:border-teal-600 px-2 py-2 text-sm font-semibold shadow-md rounded-lg scale-90"
              successDuration={1500}
            >
              50ml
            </ParticleButton>
            <ParticleButton 
              onClick={() => selectOffer(2, 940)}
              className="bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-500 hover:border-emerald-600 px-2 py-2 text-sm font-semibold shadow-md rounded-lg scale-90"
              successDuration={1500}
            >
              100ml
            </ParticleButton>
          </div>
        </div>

      </div>

      {/* Mobile/Tablet Layout */}
      <div className="xl:hidden relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        <div className="space-y-8">
          <div 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => selectOffer(1, 245)}
          >
            <HandWrittenTitle 
              normalPrice="R325"
              otoPrice="R245"
              savings="Save R80!"
              color="#14b8a6"
            />
          </div>
          
          <div 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => selectOffer(2, 940)}
          >
            <HandWrittenTitle 
              normalPrice="R1300"
              otoPrice="R940"
              savings="Save R360!"
              color="#22c55e"
            />
          </div>
        </div>
      </div>
      
      {/* Spacer for red "NO thanks" bar */}
      <div className="h-5" />
    </div>
  )
}

export default function OTOPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>}>
      <OTOContent />
    </Suspense>
  )
}