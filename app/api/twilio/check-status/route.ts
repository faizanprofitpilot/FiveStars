import { NextResponse } from 'next/server'
import { checkMessageStatus } from '@/lib/twilio/check-message-status'

export const dynamic = 'force-dynamic'

/**
 * Check the status of a Twilio message
 * GET /api/twilio/check-status?messageSid=SM...
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const messageSid = searchParams.get('messageSid')

    if (!messageSid) {
      return NextResponse.json(
        { error: 'Missing messageSid parameter' },
        { status: 400 }
      )
    }

    const status = await checkMessageStatus(messageSid)

    return NextResponse.json({
      messageSid,
      ...status,
    })
  } catch (error: any) {
    console.error('Check status error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    )
  }
}

