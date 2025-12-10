import { NextResponse } from 'next/server'
import { authenticateOAuthToken, extractOAuthToken } from '@/lib/oauth/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * Debug endpoint to check recent review requests and their status
 */
export async function GET(request: Request) {
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

    const supabase = createAdminClient()

    // Get user's business
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!business) {
      return NextResponse.json(
        { error: 'Business profile not found' },
        { status: 404 }
      )
    }

    // Get recent review requests (last 10)
    const { data: reviewRequests, error } = await supabase
      .from('review_requests')
      .select(`
        id,
        customer_first_name,
        customer_phone,
        customer_email,
        primary_channel,
        primary_sent,
        secondary_sent,
        error_message,
        sent_at,
        created_at,
        campaigns (
          id,
          name,
          campaign_id,
          primary_channel
        )
      `)
      .in('campaign_id', 
        supabase
          .from('campaigns')
          .select('id')
          .eq('business_id', business.id)
      )
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching review requests:', error)
      return NextResponse.json(
        { error: 'Failed to fetch review requests' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      review_requests: reviewRequests || [],
      count: reviewRequests?.length || 0,
    })
  } catch (error: any) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

