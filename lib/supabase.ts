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
  upsell_discount: number
  took_big_offer: boolean
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
      phone: customerData.phone || '',
      address: customerData.address || 'To be confirmed',
      city: customerData.city || 'To be confirmed',
      postal_code: customerData.postalCode || 'To be confirmed',
      province: customerData.province || '',
      country: customerData.country || 'South Africa',
      
      // Order details
      product_size: orderData.size,
      quantity: orderData.irresistibleOfferAccepted ? orderData.quantity + 1 : orderData.quantity,
      is_bundle: orderData.bundle || false,
      upsell_discount: orderData.upsellDiscount || 0,
      took_big_offer: orderData.tookBigOffer || false,
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


// Function to compress image
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Scale down if too large
        const maxWidth = 800
        const maxHeight = 800
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob((blob) => {
          resolve(new File([blob!], file.name, { type: 'image/jpeg' }))
        }, 'image/jpeg', 0.7)
      }
    }
  })
}

// Function to upload EFT proof of payment image
export async function uploadEFTProofImage(file: File, customerEmail: string) {
  try {
    const supabaseClient = getSupabase()
    
    // Compress image first
    console.log('Compressing image...')
    const compressedFile = await compressImage(file)
    console.log(`Original size: ${(file.size / 1024).toFixed(2)}KB, Compressed size: ${(compressedFile.size / 1024).toFixed(2)}KB`)
    
    // Create a unique filename
    const timestamp = Date.now()
    const filename = `${customerEmail}-${timestamp}-${file.name}`
    
    console.log('Uploading EFT proof to bucket:', filename)
    
    const { data, error } = await supabaseClient.storage
      .from('eft imgs')
      .upload(filename, compressedFile)
    
    if (error) {
      console.error('❌ Error uploading EFT proof:', error)
      throw error
    }
    
    console.log('✅ EFT proof uploaded successfully:', data)
    
    // Construct the public URL
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/eft%20imgs/${filename}`
    console.log('✅ Public URL:', publicUrl)
    
    return { path: data.path, fullPath: data.fullPath, publicUrl }
  } catch (error) {
    console.error('❌ Failed to upload EFT proof:', error)
    throw error
  }
}
