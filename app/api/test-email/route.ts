import { NextRequest, NextResponse } from 'next/server'

const BREVO_API_KEY = process.env.BREVO_API_KEY || ''
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Test Email: Starting test...')
    console.log('🧪 BREVO_API_KEY exists:', !!BREVO_API_KEY)
    console.log('🧪 BREVO_API_KEY length:', BREVO_API_KEY.length)

    if (!BREVO_API_KEY) {
      return NextResponse.json(
        { error: 'BREVO_API_KEY not configured', success: false },
        { status: 500 }
      )
    }

    const payload = {
      sender: {
        name: 'Eubiosis Test',
        email: 'info@wabi-sabi.click'
      },
      to: [{ email: 'nadine.marshall45@gmail.com', name: 'Test Admin' }],
      subject: '🧪 Test Email from Eubiosis',
      htmlContent: '<h1>Test Email</h1><p>If you see this, Brevo is working!</p>'
    }

    console.log('🧪 Sending test email to Brevo...')
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    console.log('🧪 Brevo response status:', response.status)

    if (!response.ok) {
      const error = await response.json()
      console.error('🧪 Brevo error:', error)
      return NextResponse.json(
        { error: error.message, success: false, status: response.status },
        { status: response.status }
      )
    }

    const result = await response.json()
    console.log('🧪 Success! Message ID:', result.messageId)
    return NextResponse.json({ success: true, messageId: result.messageId })
  } catch (error) {
    console.error('🧪 Test failed:', error)
    return NextResponse.json(
      { error: String(error), success: false },
      { status: 500 }
    )
  }
}
