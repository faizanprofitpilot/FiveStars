import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export interface SendSMSOptions {
  to: string
  body: string
}

export async function sendSMS({ to, body }: SendSMSOptions): Promise<{
  success: boolean
  messageSid?: string
  error?: string
}> {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error('Twilio credentials not configured')
    }

    if (!process.env.TWILIO_PHONE_NUMBER) {
      throw new Error('Twilio phone number not configured')
    }

    // Validate phone number format (basic validation)
    const cleanedPhone = to.replace(/\D/g, '')
    if (cleanedPhone.length < 10) {
      throw new Error('Invalid phone number format')
    }

    const message = await client.messages.create({
      body,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    })

    return {
      success: true,
      messageSid: message.sid,
    }
  } catch (error: any) {
    console.error('Twilio SMS error:', error)
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

