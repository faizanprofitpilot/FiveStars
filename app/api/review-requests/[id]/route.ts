import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the review request to verify ownership
    const { data: reviewRequest, error: requestError } = await supabase
      .from('review_requests')
      .select(`
        id,
        campaign_id,
        campaigns!inner (
          id,
          business_id,
          businesses!inner (
            id,
            user_id
          )
        )
      `)
      .eq('id', id)
      .single()

    if (requestError || !reviewRequest) {
      return NextResponse.json(
        { error: 'Review request not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    const campaign = Array.isArray(reviewRequest.campaigns) 
      ? reviewRequest.campaigns[0] 
      : reviewRequest.campaigns
    const business = Array.isArray(campaign.businesses)
      ? campaign.businesses[0]
      : campaign.businesses

    if (!business || business.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete the review request
    const { error: deleteError } = await supabase
      .from('review_requests')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting review request:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete review request' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Review request deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete review request error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
