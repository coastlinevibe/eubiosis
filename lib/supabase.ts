import { createClient } from '@supabase/supabase-js'

// These will be your Supabase project credentials
// You'll need to add these to your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface EmailSubscription {
  id?: number
  email: string
  source: string // e.g., 'homepage', 'exit-intent', 'shop'
  created_at?: string
  metadata?: Record<string, any> // Additional data like name, phone, etc.
}

// Utility functions for email collection
export const emailService = {
  // Subscribe an email to your mailing list
  async subscribeEmail(email: string, source: string = 'unknown', metadata?: Record<string, any>) {
    try {
      const { data, error } = await supabase
        .from('email_subscriptions')
        .insert([
          {
            email: email.toLowerCase().trim(),
            source,
            metadata,
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Email subscription error:', error)
      return { success: false, error }
    }
  },

  // Check if email already exists
  async checkEmailExists(email: string) {
    try {
      const { data, error } = await supabase
        .from('email_subscriptions')
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      return !!data
    } catch (error) {
      console.error('Email check error:', error)
      return false
    }
  },

  // Get all subscriptions (for admin use)
  async getAllSubscriptions() {
    try {
      const { data, error } = await supabase
        .from('email_subscriptions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Get subscriptions error:', error)
      return { success: false, error }
    }
  }
}
