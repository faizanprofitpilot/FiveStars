import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

/**
 * Check the actual delivery status of a Twilio message
 * Status can be: queued, sending, sent, delivered, undelivered, failed
 */
export async function checkMessageStatus(messageSid: string): Promise<{
  status: string
  errorCode?: string
  errorMessage?: string
}> {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error('Twilio credentials not configured')
    }

    const message = await client.messages(messageSid).fetch()

    return {
      status: message.status,
      errorCode: message.errorCode?.toString(),
      errorMessage: message.errorMessage || undefined,
    }
  } catch (error: any) {
    console.error('Error checking Twilio message status:', error)
    return {
      status: 'unknown',
      errorMessage: error.message || 'Failed to check message status',
    }
  }
}

