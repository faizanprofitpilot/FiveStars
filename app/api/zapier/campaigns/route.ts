import { NextResponse } from 'next/server'
import { authenticateOAuthToken, extractOAuthToken } from '@/lib/oauth/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * Dynamic dropdown endpoint for Zapier
 * Returns user's campaigns in Zapier's expected format
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

    // Get user's campaigns
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('id, name, campaign_id')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })

    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError)
      return NextResponse.json(
        { error: 'Failed to fetch campaigns' },
        { status: 500 }
      )
    }

    // Format for Zapier dynamic dropdown
    // Zapier expects: [{ value: "id", label: "Display Name" }]
    const formattedCampaigns = (campaigns || []).map((campaign) => ({
      value: campaign.campaign_id,
      label: campaign.name,
    }))

    return NextResponse.json(formattedCampaigns)
  } catch (error: any) {
    console.error('Zapier campaigns endpoint error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

