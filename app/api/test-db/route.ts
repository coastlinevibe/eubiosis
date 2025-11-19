import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test connection by checking if orders table exists
    const { data, error } = await supabase
      .from('orders')
      .select('count', { count: 'exact', head: true })

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        message: 'Database connection failed or orders table does not exist'
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      ordersCount: data?.length || 0
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export async function POST() {
  try {
    // Test inserting a sample order
    const testOrder = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '+27123456789',
      address: '123 Test Street',
      city: 'Cape Town',
      postal_code: '8001',
      province: 'Western Cape',
      country: 'South Africa',
      product_size: '50ml' as const,
      quantity: 1,
      is_bundle: false,
      email_discount: false,
      upsell_discount: 0,
      took_big_offer: false,
      oto_offer: null,
      oto_price: 0,
      subtotal: 265, // R265 (not in cents)
      discount_amount: 0,
      total_amount: 265,
      status: 'pending' as const
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([testOrder])
      .select()

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Test order created successfully',
      order: data[0]
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}