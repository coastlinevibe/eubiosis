import { createClient } from '@supabase/supabase-js'

let supabase: any = null

function getSupabaseClient() {
  if (supabase) {
    return supabase
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey)
  return supabase
}

export function getSupabase() {
  return getSupabaseClient()
}

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
  
  // Email tracking
  mail_sent: boolean
}

// Function to save order to database
export async function saveOrder(orderData: any, customerData: any) {
  console.log('=== saveOrder called ===')
  console.log('orderData:', JSON.stringify(orderData, null, 2))
  console.log('customerData:', JSON.stringify(customerData, null, 2))
  
  try {
    const supabaseClient = getSupabase()
    console.log('Supabase client initialized')
    
    // Calculate pricing
    const pricing: Record<'50ml' | '100ml', { basePrice: number; specialPrice: number; savings: number }> = {
      '50ml': { basePrice: 325, specialPrice: 265, savings: 60 },
      '100ml': { basePrice: 650, specialPrice: 530, savings: 120 }
    }
    
    const priceInfo = pricing[orderData.size as '50ml' | '100ml']
    const baseSubtotal = priceInfo.specialPrice * orderData.quantity
    let totalSavings = priceInfo.savings * orderData.quantity
    
    // Add irresistible offer if accepted
    let irresistibleOfferPrice = 0
    if (orderData.irresistibleOfferAccepted) {
      irresistibleOfferPrice = 235
      totalSavings += 90 // R325 - R235 = R90 savings
    }
    
    const orderSubtotal = baseSubtotal + irresistibleOfferPrice
    const deliveryFee = orderSubtotal >= 650 ? 29 : 59
    const totalAmount = orderSubtotal + deliveryFee
    
    console.log('Calculated totals:', { orderSubtotal, deliveryFee, totalAmount, totalSavings })
    
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
      quantity: orderData.irresistibleOfferAccepted ? orderData.quantity + 1 : orderData.quantity, // Add extra bottle if accepted
      is_bundle: orderData.bundle || false,
      email_discount: orderData.emailDiscount || false,
      upsell_discount: orderData.upsellDiscount || 0,
      took_big_offer: orderData.tookBigOffer || false,
      oto_offer: orderData.oto || undefined,
      oto_price: orderData.otoPrice || 0,
      
      // Pricing (stored in cents as per schema)
      subtotal: Math.round(orderSubtotal * 100),
      discount_amount: Math.round(totalSavings * 100),
      total_amount: Math.round(totalAmount * 100),
      
      status: 'pending',
      
      // Email tracking
      mail_sent: false
    }

    console.log('Order object to insert:', JSON.stringify(order, null, 2))
    
    const { data, error } = await supabaseClient
      .from('orders')
      .insert([order])
      .select()

    if (error) {
      console.error('❌ Supabase error saving order:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      throw error
    }

    console.log('✅ Order saved successfully to Supabase:', data)
    return data[0]
  } catch (error) {
    console.error('❌ Failed to save order - caught exception:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    throw error
  }
}