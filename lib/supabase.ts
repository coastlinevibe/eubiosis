import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Order {
  id?: string
  created_at?: string
  
  // Customer Information
  first_name: string
  last_name: string
  email: string
  email_confirmation?: string
  phone: string
  address: string
  city: string
  postal_code: string
  province: string
  country: string
  
  // Order Details
  product_size: '50ml' | '100ml'
  quantity: number
  is_bundle: boolean
  email_discount: boolean
  upsell_discount: number
  took_big_offer: boolean
  oto_offer?: string
  oto_price?: number
  
  // Pricing
  subtotal: number
  discount_amount: number
  total_amount: number
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
}

// Function to save order to database
export async function saveOrder(orderData: any, customerData: any) {
  try {
    const order: Omit<Order, 'id' | 'created_at'> = {
      // Customer info
      first_name: customerData.firstName || '',
      last_name: customerData.lastName || '',
      email: customerData.email || '',
      email_confirmation: customerData.emailConfirmation || '',
      phone: customerData.phone || '',
      address: customerData.address || 'To be confirmed',
      city: customerData.city || 'To be confirmed',
      postal_code: customerData.postalCode || 'To be confirmed',
      province: customerData.province || '',
      country: customerData.country || 'South Africa',
      
      // Order details
      product_size: orderData.size,
      quantity: orderData.quantity,
      is_bundle: orderData.bundle || false,
      email_discount: orderData.emailDiscount || false,
      upsell_discount: orderData.upsellDiscount || 0,
      took_big_offer: orderData.tookBigOffer || false,
      oto_offer: orderData.oto || undefined,
      oto_price: orderData.otoPrice || 0,
      
      // Calculate totals (you'll need to pass these or calculate them)
      subtotal: calculateSubtotal(orderData),
      discount_amount: calculateDiscounts(orderData),
      total_amount: calculateTotal(orderData),
      
      status: 'pending'
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()

    if (error) {
      console.error('Error saving order:', error)
      throw error
    }

    console.log('Order saved successfully:', data)
    return data[0]
  } catch (error) {
    console.error('Failed to save order:', error)
    throw error
  }
}

// Helper functions for calculations
function calculateSubtotal(orderData: any): number {
  const basePrice = orderData.size === '50ml' ? 265 : 530
  return basePrice * orderData.quantity + (orderData.otoPrice || 0)
}

function calculateDiscounts(orderData: any): number {
  let discount = 0
  if (orderData.emailDiscount) discount += 30
  if (orderData.bundle) discount += 50
  discount += orderData.upsellDiscount || 0
  return discount
}

function calculateTotal(orderData: any): number {
  return calculateSubtotal(orderData) - calculateDiscounts(orderData)
}