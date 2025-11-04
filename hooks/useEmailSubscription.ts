import { useState } from 'react'
import { emailService } from '@/lib/supabase'

interface UseEmailSubscriptionReturn {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
  subscribeEmail: (email: string, source?: string, metadata?: Record<string, any>) => Promise<void>
  reset: () => void
}

export function useEmailSubscription(): UseEmailSubscriptionReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subscribeEmail = async (email: string, source: string = 'unknown', metadata?: Record<string, any>) => {
    // Reset previous state
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      // Check if email already exists
      const emailExists = await emailService.checkEmailExists(email)
      if (emailExists) {
        setError('This email is already subscribed!')
        setIsLoading(false)
        return
      }

      // Subscribe the email
      const result = await emailService.subscribeEmail(email, source, metadata)
      
      if (result.success) {
        setIsSuccess(true)
        // Auto-reset success state after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000)
      } else {
        setError('Failed to subscribe. Please try again.')
      }
    } catch (err) {
      console.error('Subscription error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setIsLoading(false)
    setIsSuccess(false)
    setError(null)
  }

  return {
    isLoading,
    isSuccess,
    error,
    subscribeEmail,
    reset
  }
}
