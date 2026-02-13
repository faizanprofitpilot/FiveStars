import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get date range from query params
    const { searchParams } = new URL(request.url)
    const fromDate = searchParams.get('from')
    const toDate = searchParams.get('to')

    // Get user's business
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Get all campaigns for this business
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id, name')
      .eq('business_id', business.id)

    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({
        requests: [],
        count: 0,
      })
    }

    const campaignIds = campaigns.map(c => c.id)
    const campaignMap = new Map(campaigns.map(c => [c.id, c.name]))

    // Build query with date filter
    let query = supabase
      .from('review_requests')
      .select('*')
      .in('campaign_id', campaignIds)

    if (fromDate) {
      query = query.gte('created_at', fromDate)
    }
    if (toDate) {
      // Add one day to include the entire end date
      const endDate = new Date(toDate)
      endDate.setDate(endDate.getDate() + 1)
      query = query.lt('created_at', endDate.toISOString())
    }

    // Default to last 30 days if no date range provided
    if (!fromDate && !toDate) {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      query = query.gte('created_at', thirtyDaysAgo.toISOString())
    }

    // Fetch review requests (limit 50 for date-filtered results)
    const { data: requests, error: requestsError } = await query
      .order('created_at', { ascending: false })
      .limit(50)

    if (requestsError) {
      console.error('Error fetching review requests:', requestsError)
      return NextResponse.json(
        { error: 'Failed to fetch review requests' },
        { status: 500 }
      )
    }

    // Add campaign names to requests
    const requestsWithCampaigns = (requests || []).map(request => ({
      ...request,
      campaign_name: campaignMap.get(request.campaign_id),
    }))

    return NextResponse.json({
      requests: requestsWithCampaigns || [],
      count: requestsWithCampaigns?.length || 0,
    })
  } catch (error: any) {
    console.error('Get dashboard activity error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
