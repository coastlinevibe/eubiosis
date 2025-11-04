'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Shop() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to new URL structure
    router.replace('/eubiosis-bottle/size-s/quantity-1')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-medium text-text mb-4">Redirecting...</h1>
        <p className="text-text/70">Taking you to the new product page...</p>
      </div>
    </div>
  )
}
