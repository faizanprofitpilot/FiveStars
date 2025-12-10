import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { generateAuthorizationCode, getTokenExpiration } from '@/lib/oauth/tokens'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * OAuth 2.0 Authorization Endpoint
 * GET /api/oauth/authorize
 * 
 * Parameters:
 * - response_type: must be "code"
 * - client_id: client identifier (e.g., "zapier")
 * - redirect_uri: where to redirect after authorization
 * - scope: requested permissions (optional)
 * - state: CSRF protection (optional)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Validate required parameters
    const responseType = searchParams.get('response_type')
    const clientId = searchParams.get('client_id')
    const redirectUri = searchParams.get('redirect_uri')
    const scope = searchParams.get('scope') || 'read write'
    const state = searchParams.get('state')

    // Validate response_type
    if (responseType !== 'code') {
      return NextResponse.json(
        { error: 'unsupported_response_type', error_description: 'Only "code" response type is supported' },
        { status: 400 }
      )
    }

    // Validate required parameters
    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'Missing required parameters: client_id, redirect_uri' },
        { status: 400 }
      )
    }

    // Check if user is authenticated
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.url)
      return redirect(loginUrl.toString())
    }

    // Check if user has a business (required for using the app)
    const { data: business } = await supabase
      .from('businesses')
      .select('id, business_name')
      .eq('user_id', user.id)
      .single()

    if (!business) {
      // Redirect to onboarding
      const onboardingUrl = new URL('/onboarding', request.url)
      onboardingUrl.searchParams.set('redirect', request.url)
      return redirect(onboardingUrl.toString())
    }

    // If user is authenticated and has business, show consent page
    // Store authorization request in session/cookie for consent page
    const consentUrl = new URL('/oauth/consent', request.url)
    consentUrl.searchParams.set('client_id', clientId)
    consentUrl.searchParams.set('redirect_uri', redirectUri)
    consentUrl.searchParams.set('scope', scope)
    if (state) {
      consentUrl.searchParams.set('state', state)
    }

    return redirect(consentUrl.toString())
  } catch (error: any) {
    console.error('OAuth authorize error:', error)
    return NextResponse.json(
      { error: 'server_error', error_description: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST handler for authorization (when user approves/denies)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { approved, client_id, redirect_uri, scope, state } = body

    if (!approved) {
      // User denied authorization
      const redirectUrl = new URL(redirect_uri)
      redirectUrl.searchParams.set('error', 'access_denied')
      redirectUrl.searchParams.set('error_description', 'User denied the request')
      if (state) {
        redirectUrl.searchParams.set('state', state)
      }
      return NextResponse.redirect(redirectUrl.toString())
    }

    // User approved - get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Generate authorization code
    const code = generateAuthorizationCode()
    const expiresAt = getTokenExpiration(600) // 10 minutes

    // Store authorization code
    const adminSupabase = createAdminClient()
    const { error: codeError } = await adminSupabase
      .from('oauth_authorization_codes')
      .insert({
        code,
        user_id: user.id,
        client_id,
        redirect_uri,
        scope: scope || 'read write',
        expires_at: expiresAt.toISOString(),
      })

    if (codeError) {
      console.error('Error storing authorization code:', codeError)
      return NextResponse.json(
        { error: 'server_error', error_description: 'Failed to generate authorization code' },
        { status: 500 }
      )
    }

    // Redirect back to client with authorization code
    const redirectUrl = new URL(redirect_uri)
    redirectUrl.searchParams.set('code', code)
    if (state) {
      redirectUrl.searchParams.set('state', state)
    }

    return NextResponse.redirect(redirectUrl.toString())
  } catch (error: any) {
    console.error('OAuth authorize POST error:', error)
    return NextResponse.json(
      { error: 'server_error', error_description: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

