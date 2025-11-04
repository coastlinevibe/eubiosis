'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useEmailSubscription } from '@/hooks/useEmailSubscription'

interface EmailSubscriptionFormProps {
  source: string
  placeholder?: string
  buttonText?: string
  successMessage?: string
  className?: string
  metadata?: Record<string, any>
}

export function EmailSubscriptionForm({
  source,
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  successMessage = "Thanks for subscribing!",
  className = "",
  metadata
}: EmailSubscriptionFormProps) {
  const [email, setEmail] = useState('')
  const { isLoading, isSuccess, error, subscribeEmail, reset } = useEmailSubscription()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    
    await subscribeEmail(email, source, metadata)
    if (!error) {
      setEmail('') // Clear form on success
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error || isSuccess) {
      reset() // Clear previous state when user starts typing
    }
  }

  return (
    <div className={`w-full max-w-md ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            value={email}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4AAE9B] focus:border-transparent outline-none transition-all"
            disabled={isLoading}
            required
          />
        </div>
        
        <motion.button
          type="submit"
          disabled={isLoading || !email.trim()}
          className="btn w-full py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            buttonText
          )}
        </motion.button>
      </form>

      {/* Success Message */}
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700"
        >
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">{successMessage}</span>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
        >
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}
    </div>
  )
}
