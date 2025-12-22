import { NextRequest, NextResponse } from 'next/server'

const BREVO_API_KEY = process.env.BREVO_API_KEY || ''
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'
const SENDER_EMAIL = 'info@wabi-sabi.click'
const ADMIN_EMAIL = 'nadine.marshall45@gmail.com'

interface EmailPayload {
  customerEmail: string
  customerName: string
  quantity: number
  size: '50ml' | '100ml'
  totalPrice: number
  irresistibleOfferAccepted: boolean
  irresistibleOfferPrice?: number
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  emailType?: 'pending' | 'purchased'
}

export async function POST(request: NextRequest) {
  try {
    console.log('📧 API Route: Received email request')
    const data: EmailPayload = await request.json()
    console.log('📧 API Route: Parsed data:', { customerName: data.customerName, customerEmail: data.customerEmail, emailType: data.emailType })

    if (!BREVO_API_KEY) {
      console.error('❌ BREVO_API_KEY not configured in environment')
      return NextResponse.json(
        { error: 'Email service not configured - missing API key' },
        { status: 500 }
      )
    }
    
    console.log('📧 API Route: BREVO_API_KEY is set, proceeding...')

    // Calculate totals
    const basePrice = data.size === '50ml' ? 265 : 530
    const subtotal = basePrice * data.quantity
    const irresistibleOfferPrice = data.irresistibleOfferAccepted ? (data.irresistibleOfferPrice || 235) : 0
    const orderSubtotal = subtotal + irresistibleOfferPrice
    const deliveryFee = orderSubtotal >= 650 ? 29 : 59
    const total = orderSubtotal + deliveryFee

    const emailType = data.emailType || 'pending'
    console.log('📧 API Route: Email type:', emailType, 'Total:', total)

    if (emailType === 'pending') {
      console.log('📧 API Route: Sending pending emails...')
      // Send "almost buying" email to admin
      console.log('📧 API Route: Sending admin almost-buying email to', ADMIN_EMAIL)
      await sendBrevoEmail({
        to: [{ email: ADMIN_EMAIL, name: 'Eubiosis Admin' }],
        subject: `🔔 Almost Buying! ${data.customerName} is at PayFast checkout - R${total.toFixed(2)}`,
        htmlContent: getAdminAlmostBuyingEmailHTML({
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          phone: data.phone || 'N/A',
          address: data.address || 'N/A',
          city: data.city || 'N/A',
          postalCode: data.postalCode || 'N/A',
          quantity: data.quantity,
          size: data.size,
          total,
          irresistibleOfferAccepted: data.irresistibleOfferAccepted,
          irresistibleOfferPrice
        })
      })
      console.log('📧 API Route: Admin email sent')

      // Send pending purchase email to customer
      console.log('📧 API Route: Sending customer pending email to', data.customerEmail)
      await sendBrevoEmail({
        to: [{ email: data.customerEmail, name: data.customerName }],
        subject: 'Order Confirmation - Payment Pending',
        htmlContent: getCustomerPendingEmailHTML({
          customerName: data.customerName,
          quantity: data.quantity,
          size: data.size,
          total,
          irresistibleOfferAccepted: data.irresistibleOfferAccepted,
          irresistibleOfferPrice
        })
      })
      console.log('📧 API Route: Customer pending email sent')
    } else if (emailType === 'purchased') {
      console.log('📧 API Route: Sending purchased emails...')
      // Send purchase confirmation to admin
      console.log('📧 API Route: Sending admin purchased email to', ADMIN_EMAIL)
      await sendBrevoEmail({
        to: [{ email: ADMIN_EMAIL, name: 'Eubiosis Admin' }],
        subject: `✅ Purchase Confirmed! ${data.customerName} bought ${data.quantity} bottle(s) - R${total.toFixed(2)}`,
        htmlContent: getAdminPurchasedEmailHTML({
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          phone: data.phone || 'N/A',
          address: data.address || 'N/A',
          city: data.city || 'N/A',
          postalCode: data.postalCode || 'N/A',
          quantity: data.quantity,
          size: data.size,
          total,
          irresistibleOfferAccepted: data.irresistibleOfferAccepted,
          irresistibleOfferPrice
        })
      })
      console.log('📧 API Route: Admin purchased email sent')

      // Send purchase confirmation to customer
      console.log('📧 API Route: Sending customer purchased email to', data.customerEmail)
      await sendBrevoEmail({
        to: [{ email: data.customerEmail, name: data.customerName }],
        subject: '✅ Purchase Confirmed - Your Eubiosis Order',
        htmlContent: getCustomerPurchasedEmailHTML({
          customerName: data.customerName,
          quantity: data.quantity,
          size: data.size,
          total,
          irresistibleOfferAccepted: data.irresistibleOfferAccepted,
          irresistibleOfferPrice
        })
      })
      console.log('📧 API Route: Customer purchased email sent')
    }

    console.log('✅ Emails sent successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Failed to send emails:', error)
    console.error('❌ Error details:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: 'Failed to send emails', details: error instanceof Error ? error.message : String(error) },
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

  console.log('📧 Sending to Brevo:', { to: options.to[0].email, subject: options.subject, sender: SENDER_EMAIL })

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  console.log('📧 Brevo response status:', response.status)

  if (!response.ok) {
    let error: any = {}
    try {
      error = await response.json()
    } catch (e) {
      error = { message: response.statusText }
    }
    console.error('❌ Brevo API error:', error)
    console.error('❌ Full response:', response)
    throw new Error(`Failed to send email: ${error.message || response.statusText}`)
  }

  const result = await response.json()
  console.log('✅ Email sent via Brevo:', result.messageId)
  return result
}

function getAdminAlmostBuyingEmailHTML(data: {
  customerName: string
  customerEmail: string
  phone: string
  address: string
  city: string
  postalCode: string
  quantity: number
  size: string
  total: number
  irresistibleOfferAccepted: boolean
  irresistibleOfferPrice: number
}): string {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🔔 Almost There!</h1>
        <p style="color: #e8f5e9; margin: 8px 0 0 0; font-size: 14px;">Customer at PayFast Checkout</p>
      </div>

      <!-- Main Content -->
      <div style="padding: 30px;">
        <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
          <strong>${data.customerName}</strong> is about to complete their purchase! 🎯
        </p>

        <!-- Customer Details -->
        <div style="background: #f9f9f9; border-left: 4px solid #2d5016; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <h3 style="color: #2d5016; margin: 0 0 15px 0; font-size: 16px;">📋 Customer Details</h3>
          <table style="width: 100%; font-size: 14px; color: #555;">
            <tr>
              <td style="padding: 8px 0;"><strong>Name:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${data.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; text-align: right;"><a href="mailto:${data.customerEmail}" style="color: #2d5016; text-decoration: none;">${data.customerEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${data.phone}</td>
            </tr>
            <tr style="border-top: 1px solid #e0e0e0;">
              <td style="padding: 8px 0;"><strong>Address:</strong></td>
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

        <!-- Order Summary -->
        <div style="background: #f0f7e8; border-left: 4px solid #7cb342; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <h3 style="color: #558b2f; margin: 0 0 15px 0; font-size: 16px;">🛍️ Order Summary</h3>
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
            <tr style="border-top: 2px solid #7cb342; font-weight: 600; font-size: 16px;">
              <td style="padding: 12px 0;"><strong>Total Amount:</strong></td>
              <td style="padding: 12px 0; text-align: right; color: #2d5016;">R${data.total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <p style="color: #666; font-size: 13px; margin: 20px 0 0 0; text-align: center;">
          ⏱️ <strong>Status:</strong> Awaiting PayFast payment confirmation
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          Eubiosis - Nature in a Bottle<br>
          <a href="https://www.eubiosis.pro" style="color: #2d5016; text-decoration: none;">www.eubiosis.pro</a>
        </p>
      </div>
    </div>
  `
}

function getAdminPurchasedEmailHTML(data: {
  customerName: string
  customerEmail: string
  phone: string
  address: string
  city: string
  postalCode: string
  quantity: number
  size: string
  total: number
  irresistibleOfferAccepted: boolean
  irresistibleOfferPrice: number
}): string {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1b5e20 0%, #2d5016 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">✅ Purchase Confirmed!</h1>
        <p style="color: #c8e6c9; margin: 8px 0 0 0; font-size: 14px;">Payment Successfully Received</p>
      </div>

      <!-- Main Content -->
      <div style="padding: 30px;">
        <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
          🎉 <strong>${data.customerName}</strong> has successfully purchased from Eubiosis!
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

        <!-- Order Summary -->
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
              <td style="padding: 12px 0;"><strong>Total Paid:</strong></td>
              <td style="padding: 12px 0; text-align: right; color: #1b5e20;">R${data.total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div style="background: #c8e6c9; border-left: 4px solid #4caf50; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #1b5e20; font-size: 14px;">
            <strong>✓ Payment Status:</strong> Confirmed via PayFast<br>
            <strong>✓ Next Step:</strong> Prepare order for dispatch
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          Eubiosis - Nature in a Bottle<br>
          <a href="https://www.eubiosis.pro" style="color: #1b5e20; text-decoration: none;">www.eubiosis.pro</a>
        </p>
      </div>
    </div>
  `
}

function getCustomerPendingEmailHTML(data: {
  customerName: string
  quantity: number
  size: string
  total: number
  irresistibleOfferAccepted: boolean
  irresistibleOfferPrice: number
}): string {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🌿 Order Confirmation</h1>
        <p style="color: #e8f5e9; margin: 8px 0 0 0; font-size: 14px;">Payment Pending - Complete Your Purchase</p>
      </div>

      <!-- Main Content -->
      <div style="padding: 30px;">
        <p style="color: #333; font-size: 16px; margin: 0 0 10px 0;">
          Hi <strong>${data.customerName}</strong>,
        </p>
        <p style="color: #666; font-size: 15px; margin: 0 0 20px 0;">
          Thank you for choosing Eubiosis! We've received your order and it's ready for payment processing.
        </p>

        <!-- Order Summary -->
        <div style="background: #f0f7e8; border-left: 4px solid #7cb342; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <h3 style="color: #558b2f; margin: 0 0 15px 0; font-size: 16px;">📦 Your Order</h3>
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
            <tr style="border-top: 2px solid #7cb342; font-weight: 600; font-size: 16px;">
              <td style="padding: 12px 0;"><strong>Total Amount:</strong></td>
              <td style="padding: 12px 0; text-align: right; color: #2d5016;">R${data.total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <!-- Next Steps -->
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            <strong>⏭️ Next Step:</strong> You'll be redirected to PayFast to securely complete your payment.
          </p>
        </div>

        <!-- Benefits -->
        <div style="background: #f9f9f9; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <h3 style="color: #2d5016; margin: 0 0 12px 0; font-size: 15px;">✓ Why Choose Eubiosis?</h3>
          <ul style="color: #666; font-size: 14px; margin: 0; padding-left: 20px;">
            <li style="margin: 6px 0;">100% Natural Ingredients</li>
            <li style="margin: 6px 0;">Scientifically Formulated for Gut Health</li>
            <li style="margin: 6px 0;">Fast & Secure Delivery</li>
            <li style="margin: 6px 0;">Satisfaction Guaranteed</li>
          </ul>
        </div>

        <p style="color: #999; font-size: 13px; margin: 20px 0 0 0; text-align: center;">
          Questions? We're here to help! Contact us at <a href="mailto:info@wabi-sabi.click" style="color: #2d5016; text-decoration: none;">info@wabi-sabi.click</a>
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          Eubiosis - Nature in a Bottle 🌿<br>
          <a href="https://www.eubiosis.pro" style="color: #2d5016; text-decoration: none;">www.eubiosis.pro</a>
        </p>
      </div>
    </div>
  `
}

function getCustomerPurchasedEmailHTML(data: {
  customerName: string
  quantity: number
  size: string
  total: number
  irresistibleOfferAccepted: boolean
  irresistibleOfferPrice: number
}): string {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1b5e20 0%, #2d5016 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">✅ Purchase Confirmed!</h1>
        <p style="color: #c8e6c9; margin: 8px 0 0 0; font-size: 14px;">Your Eubiosis Order is Confirmed</p>
      </div>

      <!-- Main Content -->
      <div style="padding: 30px;">
        <p style="color: #333; font-size: 16px; margin: 0 0 10px 0;">
          Hi <strong>${data.customerName}</strong>,
        </p>
        <p style="color: #666; font-size: 15px; margin: 0 0 20px 0;">
          🎉 Your payment has been successfully processed! Your Eubiosis order is confirmed and will be dispatched soon.
        </p>

        <!-- Order Summary -->
        <div style="background: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <h3 style="color: #2e7d32; margin: 0 0 15px 0; font-size: 16px;">📦 Order Summary</h3>
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
              <td style="padding: 12px 0;"><strong>Total Paid:</strong></td>
              <td style="padding: 12px 0; text-align: right; color: #1b5e20;">R${data.total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <!-- What's Next -->
        <div style="background: #c8e6c9; border-left: 4px solid #4caf50; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #1b5e20; font-size: 14px;">
            <strong>✓ Payment Confirmed</strong><br>
            <strong>✓ Order Processing</strong><br>
            <strong>✓ Dispatch Soon</strong><br>
            You'll receive tracking information via email shortly.
          </p>
        </div>

        <!-- Benefits -->
        <div style="background: #f9f9f9; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <h3 style="color: #1b5e20; margin: 0 0 12px 0; font-size: 15px;">🌿 Your Eubiosis Journey</h3>
          <p style="color: #666; font-size: 14px; margin: 0;">
            You're now part of the Eubiosis family! Our natural gut health formula is designed to support your wellness journey. Take it daily for best results and experience the difference nature can make.
          </p>
        </div>

        <p style="color: #999; font-size: 13px; margin: 20px 0 0 0; text-align: center;">
          Need help? Contact us at <a href="mailto:info@wabi-sabi.click" style="color: #1b5e20; text-decoration: none;">info@wabi-sabi.click</a>
        </p>
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
