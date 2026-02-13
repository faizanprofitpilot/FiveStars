import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendReviewRequestInternal } from '@/lib/zapier/send-review-request'
import { authenticateOAuthToken, extractOAuthToken } from '@/lib/oauth/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const zapierSchema = z.object({
  campaign_id: z.string(),
  first_name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
})

// This endpoint accepts requests from Zapier
export async function POST(request: Request) {
  try {
    // Authenticate using OAuth token
    const oauthToken = extractOAuthToken(request)

    if (!oauthToken) {
      return NextResponse.json(
        { error: 'OAuth token required. Use Authorization: Bearer <token>' },
        { status: 401 }
      )
    }

    const userId = await authenticateOAuthToken(oauthToken)

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid or expired OAuth token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = zapierSchema.parse(body)

    const supabase = createAdminClient()

    // CRITICAL: Get ONLY the authenticated user's business
    const { data: userBusiness, error: businessError } = await supabase
      .from('businesses')
      .select('id, business_name, user_id')
      .eq('user_id', userId)
      .single()

    if (businessError || !userBusiness) {
      return NextResponse.json(
        { error: 'Business profile not found for authenticated user' },
        { status: 404 }
      )
    }

    // Find campaign by campaign_id - MUST belong to this user's business ONLY
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select(`
        id,
        campaign_id,
        name,
        business_id,
        businesses!inner (
          id,
          business_name,
          user_id
        )
      `)
      .eq('campaign_id', validatedData.campaign_id)
      .eq('business_id', userBusiness.id) // CRITICAL: Only this user's business
      .single() // Use single() to ensure only ONE campaign is found

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: `Campaign not found with ID: ${validatedData.campaign_id} for your business` },
        { status: 404 }
      )
    }

    // Get business from campaign (should be single object due to inner join)
    const business = Array.isArray(campaign.businesses) ? campaign.businesses[0] : campaign.businesses

    if (!business || business.id !== userBusiness.id) {
      return NextResponse.json(
        { error: 'Campaign does not belong to your business' },
        { status: 403 }
      )
    }

    // Final verification: business must belong to authenticated user
    if (business.user_id !== userId || business.id !== userBusiness.id) {
      return NextResponse.json(
        { error: 'Unauthorized: Campaign does not belong to authenticated user' },
        { status: 403 }
      )
    }

    // Deduplication: Prevent sending to same phone number within 5 minutes for this business
    if (validatedData.phone) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      
      const { data: recentRequests } = await supabase
        .from('review_requests')
        .select('id, created_at, primary_sent')
        .eq('campaign_id', campaign.id)
        .eq('customer_phone', validatedData.phone)
        .gte('created_at', fiveMinutesAgo)
        .limit(1)

      if (recentRequests && recentRequests.length > 0) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Duplicate request: A review request was already sent to this phone number in the last 5 minutes',
            review_request_id: recentRequests[0].id,
            primary_sent: recentRequests[0].primary_sent,
          },
          { status: 409 }
        )
      }
    }

    // Send review request using internal function
    // This will ONLY send for the authenticated user's business
    const result = await sendReviewRequestInternal({
      campaignId: campaign.id, // Use UUID - this campaign belongs to userBusiness.id
      firstName: validatedData.first_name,
      phone: validatedData.phone,
      email: validatedData.email,
    })

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          error: result.error || 'Failed to send review request',
          primary_sent: result.primary_sent || false,
          review_request_id: result.review_request_id,
        },
        { status: 500 }
      )
    }

    // Even if result.success is true, check if primary_sent is false
    if (!result.primary_sent) {
      console.warn('Review request created but primary channel not sent:', {
        review_request_id: result.review_request_id,
        error: result.error,
      })
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Review request created but message not sent',
          primary_sent: false,
          review_request_id: result.review_request_id,
        },
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
