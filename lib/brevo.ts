const BREVO_API_KEY = process.env.BREVO_API_KEY || ''
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'
const SENDER_EMAIL = 'info@wabi-sabi.click'
const ADMIN_EMAIL = 'theodt.bmm@gmail.com'

if (!BREVO_API_KEY) {
  console.warn('⚠️ BREVO_API_KEY is not set in environment variables')
}

interface EmailData {
  customerEmail: string
  customerName: string
  quantity: number
  size: '50ml' | '100ml'
  totalPrice: number
  irresistibleOfferAccepted: boolean
  irresistibleOfferPrice?: number
}

export async function sendPayFastNotificationEmails(data: EmailData) {
  try {
    console.log('📧 Sending PayFast notification emails...')

    // Calculate display values
    const basePrice = data.size === '50ml' ? 265 : 530
    const subtotal = basePrice * data.quantity
    const irresistiblePrice = data.irresistibleOfferAccepted ? (data.irresistibleOfferPrice || 235) : 0
    const orderSubtotal = subtotal + irresistiblePrice
    const deliveryFee = orderSubtotal >= 650 ? 29 : 59
    const total = orderSubtotal + deliveryFee

    // Email to admin
    await sendAdminEmail({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      quantity: data.quantity,
      size: data.size,
      total: total,
      irresistibleOfferAccepted: data.irresistibleOfferAccepted,
      irresistibleOfferPrice: irresistiblePrice
    })

    // Email to customer
    await sendCustomerEmail({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      quantity: data.quantity,
      size: data.size,
      total: total,
      irresistibleOfferAccepted: data.irresistibleOfferAccepted,
      irresistibleOfferPrice: irresistiblePrice
    })

    console.log('✅ PayFast notification emails sent successfully')
  } catch (error) {
    console.error('❌ Failed to send PayFast notification emails:', error)
    throw error
  }
}

async function sendAdminEmail(data: {
  customerName: string
  customerEmail: string
  quantity: number
  size: string
  total: number
  irresistibleOfferAccepted: boolean
  irresistibleOfferPrice: number
}) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Order - PayFast Payment Initiated</h2>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #666; margin-top: 0;">Customer Information</h3>
        <p><strong>Name:</strong> ${data.customerName}</p>
        <p><strong>Email:</strong> ${data.customerEmail}</p>
      </div>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #666; margin-top: 0;">Order Details</h3>
        <p><strong>Product:</strong> Eubiosis ${data.size}</p>
        <p><strong>Quantity:</strong> ${data.quantity} bottle${data.quantity > 1 ? 's' : ''}</p>
        ${data.irresistibleOfferAccepted ? `<p><strong>Irresistible Offer:</strong> Extra 50ml bottle added (R${data.irresistibleOfferPrice})</p>` : ''}
        <p style="font-size: 18px; color: #2ecc71; margin-top: 15px;"><strong>Total Amount: R${data.total.toFixed(2)}</strong></p>
        <p style="color: #999; font-size: 12px; margin-top: 10px;">No discount applied</p>
      </div>

      <p style="color: #999; font-size: 12px;">Payment is pending PayFast confirmation.</p>
    </div>
  `

  await sendBrevoEmail({
    to: [{ email: ADMIN_EMAIL, name: 'Eubiosis Admin' }],
    subject: `New Order: ${data.customerName} - R${data.total.toFixed(2)}`,
    htmlContent
  })
}

async function sendCustomerEmail(data: {
  customerName: string
  customerEmail: string
  quantity: number
  size: string
  total: number
  irresistibleOfferAccepted: boolean
  irresistibleOfferPrice: number
}) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2ecc71;">Order Confirmation - Payment Pending</h2>
      
      <p>Hi ${data.customerName},</p>
      
      <p>Thank you for your order! We've received your payment request and it's being processed through PayFast.</p>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #666; margin-top: 0;">Your Order</h3>
        <p><strong>Product:</strong> Eubiosis ${data.size}</p>
        <p><strong>Quantity:</strong> ${data.quantity} bottle${data.quantity > 1 ? 's' : ''}</p>
        ${data.irresistibleOfferAccepted ? `<p><strong>Irresistible Offer:</strong> Extra 50ml bottle (R${data.irresistibleOfferPrice})</p>` : ''}
        <p style="font-size: 18px; color: #2ecc71; margin-top: 15px;"><strong>Total: R${data.total.toFixed(2)}</strong></p>
      </div>

      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <p style="margin: 0; color: #856404;"><strong>Next Step:</strong> You'll be redirected to PayFast to complete your payment securely.</p>
      </div>

      <p style="color: #666; font-size: 14px;">Once your payment is confirmed, you'll receive a confirmation email with your order details and tracking information.</p>

      <p style="color: #999; font-size: 12px; margin-top: 30px;">Questions? Contact us at info@wabi-sabi.click</p>
    </div>
  `

  await sendBrevoEmail({
    to: [{ email: data.customerEmail, name: data.customerName }],
    subject: 'Order Confirmation - Payment Pending',
    htmlContent
  })
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

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Brevo API error:', error)
    throw new Error(`Failed to send email: ${error.message || response.statusText}`)
  }

  const result = await response.json()
  console.log('✅ Email sent via Brevo:', result)
  return result
}
