import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Debug endpoint to check what businesses and campaigns exist
 * Access at: /api/debug/business-info
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all businesses for this user
    const { data: businesses, error: businessesError } = await supabase
      .from('businesses')
      .select('id, business_name, user_id, created_at')
      .eq('user_id', user.id)

    if (businessesError) {
      return NextResponse.json(
        { error: 'Failed to fetch businesses', details: businessesError },
        { status: 500 }
      )
    }

    // Get all campaigns for each business
    const businessesWithCampaigns = await Promise.all(
      (businesses || []).map(async (business) => {
        const { data: campaigns } = await supabase
          .from('campaigns')
          .select('id, name, campaign_id, primary_channel, created_at')
          .eq('business_id', business.id)
          .order('created_at', { ascending: false })

        return {
          ...business,
          campaigns: campaigns || [],
        }
      })
    )

    return NextResponse.json({
      user_id: user.id,
      user_email: user.email,
      businesses: businessesWithCampaigns,
      total_businesses: businessesWithCampaigns.length,
      total_campaigns: businessesWithCampaigns.reduce(
        (sum, b) => sum + (b.campaigns?.length || 0),
        0
      ),
    })
  } catch (error: any) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
