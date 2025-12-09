import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  primary_channel: z.enum(['sms', 'email', 'none']),
  secondary_channel: z.enum(['sms', 'email', 'none']).nullable(),
  primary_template: z.string().min(1, 'Primary template is required'),
  followup_enabled: z.boolean(),
  followup_delay: z.number().min(1).max(30).nullable(),
  followup_template: z.string().nullable(),
})

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

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        businesses!inner (
          id,
          user_id
        )
      `)
      .eq('id', params.id)
      .single()

    if (error || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (campaign.businesses.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ campaign })
  } catch (error: any) {
    console.error('Get campaign error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    // Verify campaign ownership
    const { data: existingCampaign } = await supabase
      .from('campaigns')
      .select(`
        *,
        businesses!inner (
          id,
          user_id
        )
      `)
      .eq('id', params.id)
      .single()

    if (!existingCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    if (existingCampaign.businesses.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = campaignSchema.parse(body)

    // Update campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .update({
        name: validatedData.name,
        primary_channel: validatedData.primary_channel,
        secondary_channel: validatedData.secondary_channel,
        primary_template: validatedData.primary_template,
        followup_enabled: validatedData.followup_enabled,
        followup_delay: validatedData.followup_enabled ? validatedData.followup_delay : null,
        followup_template: validatedData.followup_enabled ? validatedData.followup_template : null,
      })
      .eq('id', params.id)
      .select()
      .single()

    if (campaignError) {
      console.error('Campaign update error:', campaignError)
      return NextResponse.json(
        { error: 'Failed to update campaign' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, campaign })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update campaign error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Verify campaign ownership
    const { data: existingCampaign } = await supabase
      .from('campaigns')
      .select(`
        *,
        businesses!inner (
          id,
          user_id
        )
      `)
      .eq('id', params.id)
      .single()

    if (!existingCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    if (existingCampaign.businesses.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete campaign
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Campaign deletion error:', error)
      return NextResponse.json(
        { error: 'Failed to delete campaign' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete campaign error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

