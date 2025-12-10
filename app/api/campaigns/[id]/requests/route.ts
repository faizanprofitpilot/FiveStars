import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch campaign to verify ownership
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select(`
        id,
        business_id,
        businesses!inner (
          id,
          user_id
        )
      `)
      .eq('id', params.id)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Verify ownership - businesses is an array from the join, get first item
    const business = Array.isArray(campaign.businesses) ? campaign.businesses[0] : campaign.businesses
    if (!business || business.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Fetch review requests for this campaign
    const { data: requests, error: requestsError } = await supabase
      .from('review_requests')
      .select('*')
      .eq('campaign_id', params.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (requestsError) {
      console.error('Error fetching review requests:', requestsError)
      return NextResponse.json(
        { error: 'Failed to fetch review requests' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      requests: requests || [],
      count: requests?.length || 0,
    })
  } catch (error: any) {
    console.error('Get campaign requests error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

