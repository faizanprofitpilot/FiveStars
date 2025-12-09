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

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = campaignSchema.parse(body)

    // Get user's business
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!business) {
      return NextResponse.json(
        { error: 'Business profile not found. Please complete onboarding.' },
        { status: 404 }
      )
    }

    // Generate unique campaign_id
    const campaignId = Buffer.from(crypto.randomUUID().replace(/-/g, '')).toString('base64').slice(0, 32)

    // Create campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .insert({
        business_id: business.id,
        name: validatedData.name,
        primary_channel: validatedData.primary_channel,
        secondary_channel: validatedData.secondary_channel,
        primary_template: validatedData.primary_template,
        followup_enabled: validatedData.followup_enabled,
        followup_delay: validatedData.followup_enabled ? validatedData.followup_delay : null,
        followup_template: validatedData.followup_enabled ? validatedData.followup_template : null,
        campaign_id: campaignId,
      })
      .select()
      .single()

    if (campaignError) {
      console.error('Campaign creation error:', campaignError)
      return NextResponse.json(
        { error: 'Failed to create campaign' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, campaign }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create campaign error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

