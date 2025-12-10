import { NextResponse } from 'next/server'
import { authenticateOAuthToken, extractOAuthToken } from '@/lib/oauth/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * Test endpoint for Zapier OAuth authentication
 * Returns user info if authenticated successfully
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

