import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendReviewRequestInternal } from '@/lib/zapier/send-review-request'
import { z } from 'zod'

const zapierSchema = z.object({
  campaign_id: z.string(),
  first_name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
})

// This endpoint accepts requests from Zapier
export async function POST(request: Request) {
  try {
    // Verify webhook secret (optional but recommended)
    const authHeader = request.headers.get('authorization')
    const expectedSecret = process.env.ZAPIER_WEBHOOK_SECRET

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = zapierSchema.parse(body)

    const supabase = createAdminClient()

    // Find campaign by campaign_id (the unique string identifier for Zapier)
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id')
      .eq('campaign_id', validatedData.campaign_id)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: `Campaign not found with ID: ${validatedData.campaign_id}` },
        { status: 404 }
      )
    }

    // Send review request using internal function
    const result = await sendReviewRequestInternal({
      campaignId: campaign.id, // Use UUID
      firstName: validatedData.first_name,
      phone: validatedData.phone,
      email: validatedData.email,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send review request' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      review_request_id: result.review_request_id,
      primary_sent: result.primary_sent,
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Zapier webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}