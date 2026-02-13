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

    // Get campaigns
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id')
      .eq('business_id', business.id)

    const campaignCount = campaigns?.length || 0

    // Build date filter
    let dateFrom: string | undefined
    let dateTo: string | undefined

    if (fromDate) {
      dateFrom = fromDate
    }
    if (toDate) {
      // Add one day to include the entire end date
      const endDate = new Date(toDate)
      endDate.setDate(endDate.getDate() + 1)
      dateTo = endDate.toISOString()
    }

    // Default to last 30 days if no date range provided
    if (!fromDate && !toDate) {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      dateFrom = thirtyDaysAgo.toISOString()
    }

    let totalRequests = 0
    let smsCount = 0
    let emailCount = 0

    if (campaigns && campaigns.length > 0) {
      const campaignIds = campaigns.map(c => c.id)

      // Build query with date filter
      let query = supabase
        .from('review_requests')
        .select('*', { count: 'exact', head: true })
        .in('campaign_id', campaignIds)

      if (dateFrom) {
        query = query.gte('created_at', dateFrom)
      }
      if (dateTo) {
        query = query.lt('created_at', dateTo)
      }

      const { count } = await query
      totalRequests = count || 0

      // Get SMS count
      let smsQuery = supabase
        .from('review_requests')
        .select('*', { count: 'exact', head: true })
        .in('campaign_id', campaignIds)
        .eq('primary_channel', 'sms')
        .eq('primary_sent', true)

      if (dateFrom) {
        smsQuery = smsQuery.gte('created_at', dateFrom)
      }
      if (dateTo) {
        smsQuery = smsQuery.lt('created_at', dateTo)
      }

      const { count: sms } = await smsQuery
      smsCount = sms || 0

      // Get email count
      let emailQuery = supabase
        .from('review_requests')
        .select('*', { count: 'exact', head: true })
        .in('campaign_id', campaignIds)
        .eq('primary_channel', 'email')
        .eq('primary_sent', true)

      if (dateFrom) {
        emailQuery = emailQuery.gte('created_at', dateFrom)
      }
      if (dateTo) {
        emailQuery = emailQuery.lt('created_at', dateTo)
      }

      const { count: email } = await emailQuery
      emailCount = email || 0
    }

    return NextResponse.json({
      totalRequests,
      smsCount,
      emailCount,
      campaignCount,
    })
  } catch (error: any) {
    console.error('Get dashboard stats error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
