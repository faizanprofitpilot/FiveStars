import { NextResponse } from 'next/server'
import { authenticateApiKey, extractApiKey } from '@/lib/api-keys/auth'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Test endpoint for Zapier API key authentication
 * Returns user info if authenticated successfully
 */
export async function GET(request: Request) {
  try {
    const apiKey = extractApiKey(request)

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required. Use Authorization: Bearer <key> or X-API-Key header' },
        { status: 401 }
      )
    }

    const userId = await authenticateApiKey(apiKey)

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    // Get user info
    const supabase = createAdminClient()
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId)

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get business info
    const { data: business } = await supabase
      .from('businesses')
      .select('id, business_name')
      .eq('user_id', userId)
      .single()

    return NextResponse.json({
      id: user.user.id,
      email: user.user.email,
      business: business ? {
        id: business.id,
        name: business.business_name,
      } : null,
    })
  } catch (error: any) {
    console.error('Zapier test endpoint error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

