import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Debug endpoint to test Zapier webhook behavior
 * GET /api/debug/zapier-test
 * SECURITY: Disabled in production, requires authentication in development
 */
export async function GET(request: Request) {
  // CRITICAL: Disable debug endpoints in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    )
  }
  try {
    // Require authentication - only show current user's data
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results: any = {
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_email: user.email,
      checks: {},
    }

    // 1. List ONLY current user's businesses
    const { data: allBusinesses, error: businessError } = await supabase
      .from('businesses')
      .select('id, business_name, user_id, created_at')
      .eq('user_id', user.id) // CRITICAL: Only current user's businesses
      .order('created_at', { ascending: false })

    results.checks.allBusinesses = {
      count: allBusinesses?.length || 0,
      businesses: allBusinesses?.map(b => ({
        id: b.id,
        business_name: b.business_name,
        user_id: b.user_id,
      })),
      error: businessError?.message,
    }

    // 2. List ONLY current user's campaigns
    const { data: allCampaigns, error: campaignError } = await supabase
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
      .eq('businesses.user_id', user.id) // CRITICAL: Only current user's campaigns
      .order('created_at', { ascending: false })

    results.checks.allCampaigns = {
      count: allCampaigns?.length || 0,
      campaigns: allCampaigns?.map(c => {
        const business = Array.isArray(c.businesses) ? c.businesses[0] : c.businesses
        return {
          id: c.id,
          campaign_id: c.campaign_id,
          name: c.name,
          business_id: c.business_id,
          business_name: business?.business_name,
          business_user_id: business?.user_id,
        }
      }),
      error: campaignError?.message,
    }

    // 3. Check for duplicate campaign_id values
    if (allCampaigns) {
      const campaignIdMap = new Map<string, typeof allCampaigns>()
      allCampaigns.forEach(c => {
        if (!campaignIdMap.has(c.campaign_id)) {
          campaignIdMap.set(c.campaign_id, [])
        }
        campaignIdMap.get(c.campaign_id)!.push(c)
      })

      const duplicates = Array.from(campaignIdMap.entries())
        .filter(([_, campaigns]) => campaigns.length > 1)
        .map(([campaignId, campaigns]) => ({
          campaign_id: campaignId,
          count: campaigns.length,
          campaigns: campaigns.map(c => {
            const business = Array.isArray(c.businesses) ? c.businesses[0] : c.businesses
            return {
              id: c.id,
              name: c.name,
              business_name: business?.business_name,
              business_user_id: business?.user_id,
            }
          }),
        }))

      results.checks.duplicateCampaignIds = {
        found: duplicates.length > 0,
        duplicates,
      }
    }

    // 4. Recent review requests (only current user's)
    const { data: recentRequests, error: requestsError } = await supabase
      .from('review_requests')
      .select(`
        id,
        customer_first_name,
        customer_phone,
        primary_sent,
        created_at,
        campaigns!inner (
          id,
          campaign_id,
          name,
          business_id,
          businesses!inner (
            id,
            business_name,
            user_id
          )
        )
      `)
      .eq('campaigns.businesses.user_id', user.id) // CRITICAL: Only current user's requests
      .order('created_at', { ascending: false })
      .limit(20)

    results.checks.recentRequests = {
      count: recentRequests?.length || 0,
      requests: recentRequests?.map(r => {
        const campaign = Array.isArray(r.campaigns) ? r.campaigns[0] : r.campaigns
        const business = Array.isArray(campaign?.businesses) ? campaign?.businesses[0] : campaign?.businesses
        return {
          id: r.id,
          customer_name: r.customer_first_name,
          customer_phone: r.customer_phone,
          primary_sent: r.primary_sent,
          created_at: r.created_at,
          campaign_id: campaign?.campaign_id,
          campaign_name: campaign?.name,
          business_name: business?.business_name,
          business_user_id: business?.user_id,
        }
      }),
      error: requestsError?.message,
    }

    // 5. Check for duplicate SMS to same phone number
    if (recentRequests) {
      const phoneMap = new Map<string, typeof recentRequests>()
      recentRequests.forEach(r => {
        if (r.customer_phone) {
          if (!phoneMap.has(r.customer_phone)) {
            phoneMap.set(r.customer_phone, [])
          }
          phoneMap.get(r.customer_phone)!.push(r)
        }
      })

      const duplicatePhones = Array.from(phoneMap.entries())
        .filter(([_, requests]) => requests.length > 1)
        .map(([phone, requests]) => ({
          phone,
          count: requests.length,
          requests: requests.map(r => {
            const campaign = Array.isArray(r.campaigns) ? r.campaigns[0] : r.campaigns
            const business = Array.isArray(campaign?.businesses) ? campaign?.businesses[0] : campaign?.businesses
            return {
              id: r.id,
              customer_name: r.customer_first_name,
              business_name: business?.business_name,
              created_at: r.created_at,
            }
          }),
        }))

      results.checks.duplicatePhones = {
        found: duplicatePhones.length > 0,
        duplicates: duplicatePhones,
      }
    }

    // 6. Test campaign lookup (simulate what happens in webhook)
    if (allCampaigns && allCampaigns.length > 0) {
      const testCampaignId = allCampaigns[0].campaign_id
      
      // Test WITHOUT business_id filter (for testing purposes - but still filtered by user)
      const { data: campaignsWithoutFilter } = await supabase
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
        .eq('campaign_id', testCampaignId)
        .eq('businesses.user_id', user.id) // CRITICAL: Still filter by current user

      // Test WITH business_id filter for each business
      const campaignsWithFilter: any[] = []
      if (allBusinesses) {
        for (const business of allBusinesses) {
          const { data: campaigns } = await supabase
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
            .eq('campaign_id', testCampaignId)
            .eq('business_id', business.id)

          if (campaigns && campaigns.length > 0) {
            campaignsWithFilter.push({
              business_name: business.business_name,
              business_id: business.id,
              campaigns: campaigns.map(c => {
                const b = Array.isArray(c.businesses) ? c.businesses[0] : c.businesses
                return {
                  id: c.id,
                  name: c.name,
                  business_name: b?.business_name,
                }
              }),
            })
          }
        }
      }

      results.checks.campaignLookupTest = {
        test_campaign_id: testCampaignId,
        without_business_filter: {
          count: campaignsWithoutFilter?.length || 0,
          campaigns: campaignsWithoutFilter?.map(c => {
            const business = Array.isArray(c.businesses) ? c.businesses[0] : c.businesses
            return {
              id: c.id,
              name: c.name,
              business_name: business?.business_name,
              business_user_id: business?.user_id,
            }
          }),
        },
        with_business_filter: campaignsWithFilter,
      }
    }

    return NextResponse.json(results, { status: 200 })
  } catch (error: any) {
    console.error('Debug test error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error', stack: error.stack },
      { status: 500 }
    )
  }
}
