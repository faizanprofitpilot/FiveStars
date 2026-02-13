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

    // CRITICAL: First get the user's business to ensure we only find campaigns for this user
    const { data: userBusiness, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (businessError || !userBusiness) {
      console.error('User business not found:', businessError)
      return NextResponse.json(
        { error: 'Business profile not found for authenticated user' },
        { status: 404 }
      )
    }

    // Find campaign by campaign_id AND ensure it belongs to the authenticated user's business
    // This prevents cross-user campaign access
    const { data: campaigns, error: campaignError } = await supabase
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
      .eq('business_id', userBusiness.id) // CRITICAL: Only find campaigns for this user's business

    if (campaignError) {
      console.error('Campaign query error:', campaignError)
      return NextResponse.json(
        { error: `Error finding campaign: ${campaignError.message}` },
        { status: 500 }
      )
    }

    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json(
        { error: `Campaign not found with ID: ${validatedData.campaign_id}` },
        { status: 404 }
      )
    }

    // Check for duplicate campaigns (shouldn't happen but safety check)
    if (campaigns.length > 1) {
      console.error('Multiple campaigns found with same campaign_id:', {
        campaign_id: validatedData.campaign_id,
        count: campaigns.length,
        campaigns: campaigns.map(c => {
          const business = Array.isArray(c.businesses) ? c.businesses[0] : c.businesses
          return { id: c.id, name: c.name, business: business?.business_name }
        })
      })
      return NextResponse.json(
        { error: `Multiple campaigns found with ID: ${validatedData.campaign_id}. Please contact support.` },
        { status: 500 }
      )
    }

    const campaign = campaigns[0]
    // Handle businesses as array or single object
    const business = Array.isArray(campaign.businesses) ? campaign.businesses[0] : campaign.businesses

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found for campaign' },
        { status: 404 }
      )
    }

    // Log which campaign and business we're using
    console.log('Processing review request:', {
      campaign_id: campaign.campaign_id,
      campaign_name: campaign.name,
      campaign_uuid: campaign.id,
      business_name: business.business_name,
      business_id: business.id,
      user_id: business.user_id,
      authenticated_user_id: userId,
      phone: validatedData.phone,
      first_name: validatedData.first_name,
    })

    // Double-check: Verify the campaign belongs to the authenticated user
    // This should never fail if the query above is correct, but it's a safety check
    if (business.user_id !== userId) {
      console.error('SECURITY ERROR: Campaign ownership mismatch despite business_id filter:', {
        campaign_business_user_id: business.user_id,
        authenticated_user_id: userId,
        campaign_id: campaign.campaign_id,
        campaign_business_id: campaign.business_id,
        user_business_id: userBusiness.id,
      })
      return NextResponse.json(
        { error: 'Campaign does not belong to authenticated user' },
        { status: 403 }
      )
    }

    // Deduplication: Check if we recently sent to this phone number for this campaign
    // This prevents duplicate sends within 5 minutes for the same phone number
    if (validatedData.phone) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      
      const { data: recentRequests, error: recentError } = await supabase
        .from('review_requests')
        .select('id, created_at, primary_sent, campaign_id')
        .eq('campaign_id', campaign.id) // Scoped to this specific campaign
        .eq('customer_phone', validatedData.phone)
        .gte('created_at', fiveMinutesAgo)
        .order('created_at', { ascending: false })
        .limit(1)

      if (recentError) {
        console.error('Error checking for duplicates:', recentError)
      } else if (recentRequests && recentRequests.length > 0) {
        const recent = recentRequests[0]
        console.warn('Duplicate request detected:', {
          recent_request_id: recent.id,
          recent_created_at: recent.created_at,
          phone: validatedData.phone,
          campaign_id: campaign.campaign_id,
        })
        return NextResponse.json(
          { 
            success: false,
            error: 'Duplicate request: A review request was already sent to this phone number in the last 5 minutes',
            review_request_id: recent.id,
            primary_sent: recent.primary_sent,
          },
          { status: 409 } // Conflict status
        )
      }
    }

    // Send review request using internal function
    const result = await sendReviewRequestInternal({
      campaignId: campaign.id, // Use UUID
      firstName: validatedData.first_name,
      phone: validatedData.phone,
      email: validatedData.email,
    })

    // Log detailed result for debugging
    console.log('Zapier review request result:', {
      success: result.success,
      primary_sent: result.primary_sent,
      error: result.error,
      review_request_id: result.review_request_id,
      phone_provided: !!validatedData.phone,
      email_provided: !!validatedData.email,
      campaign_id: campaign.campaign_id,
      business_name: business.business_name,
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
