import { NextResponse } from 'next/server'
import { sendSMS } from '@/lib/twilio/send-sms'

export const dynamic = 'force-dynamic'

/**
 * Test endpoint to verify Twilio is working
 * POST /api/twilio/test
 * Body: { to: "+1234567890", body: "Test message" }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, body: messageBody } = body

    if (!to || !messageBody) {
      return NextResponse.json(
        { error: 'Missing required fields: to, body' },
        { status: 400 }
      )
    }

    // Check if Twilio is configured
    const hasCredentials = !!(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    )

    if (!hasCredentials) {
      return NextResponse.json(
        {
          error: 'Twilio not configured',
          details: {
            hasAccountSid: !!process.env.TWILIO_ACCOUNT_SID,
            hasAuthToken: !!process.env.TWILIO_AUTH_TOKEN,
            hasPhoneNumber: !!process.env.TWILIO_PHONE_NUMBER,
            phoneNumber: process.env.TWILIO_PHONE_NUMBER || 'NOT SET',
          },
        },
        { status: 500 }
      )
    }

    // Try to send
    const result = await sendSMS({
      to,
      body: messageBody,
    })

    return NextResponse.json({
      success: result.success,
      messageSid: result.messageSid,
      status: result.status,
      error: result.error,
      config: {
        from: process.env.TWILIO_PHONE_NUMBER,
        hasCredentials: true,
      },
    })
  } catch (error: any) {
    console.error('Twilio test error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

