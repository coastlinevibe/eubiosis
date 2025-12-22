import { NextRequest, NextResponse } from 'next/server'

const BREVO_API_KEY = process.env.BREVO_API_KEY || ''
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'
const SENDER_EMAIL = 'info@wabi-sabi.click'
const ADMIN_EMAIL = 'nadine.marshall45@gmail.com'

interface EFTProofPayload {
  customerName: string
  customerEmail: string
  phone: string
  address: string
  city: string
  postalCode: string
  quantity: number
  size: '50ml' | '100ml'
  total: number
  irresistibleOfferAccepted: boolean
  irresistibleOfferPrice: number
  proofImageUrl: string
}

export async function POST(request: NextRequest) {
  try {
    console.log('📧 EFT Proof Email: Received request')
    const data: EFTProofPayload = await request.json()
    console.log('📧 EFT Proof Email: Customer:', data.customerName)

    if (!BREVO_API_KEY) {
      console.error('❌ BREVO_API_KEY not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Send email to admin with proof of payment
    await sendBrevoEmail({
      to: [{ email: ADMIN_EMAIL, name: 'Eubiosis Admin' }],
      subject: `💳 EFT Proof Received - ${data.customerName} - R${data.total.toFixed(2)}`,
      htmlContent: getAdminEFTProofEmailHTML(data)
    })

    console.log('✅ EFT proof email sent successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Failed to send EFT proof email:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

async function sendBrevoEmail(options: {
  to: Array<{ email: string; name: string }>
  subject: string
  htmlContent: string
}) {
  const payload = {
    sender: {
      name: 'Eubiosis',
      email: SENDER_EMAIL
    },
    to: options.to,
    subject: options.subject,
    htmlContent: options.htmlContent
  }

  console.log('📧 Sending EFT proof email to Brevo...')

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('❌ Brevo API error:', error)
    throw new Error(`Failed to send email: ${error.message || response.statusText}`)
  }

  const result = await response.json()
  console.log('✅ EFT proof email sent via Brevo:', result.messageId)
  return result
}

function getAdminEFTProofEmailHTML(data: EFTProofPayload): string {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1b5e20 0%, #2d5016 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">💳 EFT Proof Received</h1>
        <p style="color: #c8e6c9; margin: 8px 0 0 0; font-size: 14px;">Bank Transfer Payment Confirmation</p>
      </div>

      <!-- Main Content -->
      <div style="padding: 30px;">
        <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
          🎯 <strong>${data.customerName}</strong> has submitted EFT proof of payment!
        </p>

        <!-- Customer Details -->
        <div style="background: #f9f9f9; border-left: 4px solid #1b5e20; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <h3 style="color: #1b5e20; margin: 0 0 15px 0; font-size: 16px;">📋 Customer Details</h3>
          <table style="width: 100%; font-size: 14px; color: #555;">
            <tr>
              <td style="padding: 8px 0;"><strong>Name:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${data.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; text-align: right;"><a href="mailto:${data.customerEmail}" style="color: #1b5e20; text-decoration: none;">${data.customerEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${data.phone}</td>
            </tr>
            <tr style="border-top: 1px solid #e0e0e0;">
              <td style="padding: 8px 0;"><strong>Delivery Address:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${data.address}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>City:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${data.city}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Postal Code:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${data.postalCode}</td>
            </tr>
          </table>
        </div>

        <!-- Order Details -->
        <div style="background: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <h3 style="color: #2e7d32; margin: 0 0 15px 0; font-size: 16px;">🛍️ Order Details</h3>
          <table style="width: 100%; font-size: 14px; color: #555;">
            <tr>
              <td style="padding: 8px 0;"><strong>Product:</strong></td>
              <td style="padding: 8px 0; text-align: right;">Eubiosis ${data.size}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Quantity:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${data.quantity} bottle${data.quantity > 1 ? 's' : ''}</td>
            </tr>
            ${data.irresistibleOfferAccepted ? `
            <tr style="background: #fff9c4; border-radius: 4px;">
              <td style="padding: 8px 0;"><strong>✨ Irresistible Offer:</strong></td>
              <td style="padding: 8px 0; text-align: right;">Extra 50ml (R${data.irresistibleOfferPrice})</td>
            </tr>
            ` : ''}
            <tr style="border-top: 2px solid #4caf50; font-weight: 600; font-size: 16px;">
              <td style="padding: 12px 0;"><strong>Total Amount:</strong></td>
              <td style="padding: 12px 0; text-align: right; color: #1b5e20;">R${data.total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <!-- Proof of Payment -->
        <div style="background: #c8e6c9; border-left: 4px solid #4caf50; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <h3 style="color: #1b5e20; margin: 0 0 15px 0; font-size: 16px;">📸 Proof of Payment</h3>
          <p style="margin: 0 0 15px 0; color: #1b5e20; font-size: 14px;">
            Click the link below to view the uploaded proof of payment image:
          </p>
          <a href="${data.proofImageUrl}" style="display: inline-block; padding: 12px 24px; background: #1b5e20; color: white; text-decoration: none; border-radius: 4px; font-weight: 600;">
            View Proof of Payment
          </a>
        </div>

        <!-- Action Items -->
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            <strong>⏭️ Next Steps:</strong><br>
            1. Verify the proof of payment<br>
            2. Confirm the amount matches (R${data.total.toFixed(2)})<br>
            3. Process the order for dispatch
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          Eubiosis - Nature in a Bottle 🌿<br>
          <a href="https://www.eubiosis.pro" style="color: #1b5e20; text-decoration: none;">www.eubiosis.pro</a>
        </p>
      </div>
    </div>
  `
}
