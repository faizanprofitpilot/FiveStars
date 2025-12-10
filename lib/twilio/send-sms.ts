import twilio from 'twilio'

// Initialize Twilio client lazily to avoid errors if env vars aren't set
function getTwilioClient() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error('Twilio credentials not configured')
  }
  return twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )
}

export interface SendSMSOptions {
  to: string
  body: string
}

export async function sendSMS({ to, body }: SendSMSOptions): Promise<{
  success: boolean
  messageSid?: string
  status?: string
  error?: string
}> {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      const error = 'Twilio credentials not configured'
      console.error(error, {
        hasAccountSid: !!process.env.TWILIO_ACCOUNT_SID,
        hasAuthToken: !!process.env.TWILIO_AUTH_TOKEN,
      })
      throw new Error(error)
    }

    if (!process.env.TWILIO_PHONE_NUMBER) {
      const error = 'Twilio phone number not configured'
      console.error(error)
      throw new Error(error)
    }

    const client = getTwilioClient()

    // Validate and format phone number
    // Twilio requires E.164 format: +[country code][number]
    let formattedTo = to.trim()
    
    // If doesn't start with +, try to add it
    if (!formattedTo.startsWith('+')) {
      // Remove all non-digits
      const cleaned = formattedTo.replace(/\D/g, '')
      
      // If it's 10 digits (US number), add +1
      if (cleaned.length === 10) {
        formattedTo = `+1${cleaned}`
      } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
        // Already has country code
        formattedTo = `+${cleaned}`
      } else {
        formattedTo = `+${cleaned}`
      }
    }

    // Final validation
    const cleanedPhone = formattedTo.replace(/\D/g, '')
    if (cleanedPhone.length < 10) {
      throw new Error(`Invalid phone number format: ${to} (formatted: ${formattedTo})`)
    }

    console.log('Sending SMS via Twilio:', {
      original: to,
      formatted: formattedTo,
      from: process.env.TWILIO_PHONE_NUMBER,
      bodyLength: body.length,
    })

    const message = await client.messages.create({
      body,
      to: formattedTo,
      from: process.env.TWILIO_PHONE_NUMBER,
    })

    console.log('Twilio message created successfully:', {
      sid: message.sid,
      status: message.status,
      to: message.to,
      from: message.from,
    })

    // Note: Twilio status can be: queued, sending, sent, delivered, undelivered, failed
    // "sent" means accepted by carrier, not necessarily delivered
    // We need to check status later or use webhooks for actual delivery confirmation

    return {
      success: true,
      messageSid: message.sid,
      status: message.status, // Include status in response
    }
  } catch (error: any) {
    console.error('Twilio SMS error:', {
      message: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    })
    return {
      success: false,
      error: error.message || 'Failed to send SMS',
    }
  }
}

export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 15
}

