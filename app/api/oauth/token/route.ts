import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createOAuthTokens, refreshAccessToken } from '@/lib/oauth/auth'
import { isTokenExpired } from '@/lib/oauth/tokens'
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/rate-limit'
import { isRedirectUriAllowed } from '@/lib/oauth/redirect-uris'

export const dynamic = 'force-dynamic'

/**
 * OAuth 2.0 Token Endpoint
 * POST /api/oauth/token
 * 
 * Handles:
 * - Authorization code grant (code -> access_token)
 * - Refresh token grant (refresh_token -> new access_token)
 */
export async function POST(request: Request) {
  try {
    const body = await request.formData() // OAuth uses form-encoded
    const grantType = body.get('grant_type')
    const clientId = (body.get('client_id') as string) || 'zapier'
    const clientSecret = body.get('client_secret') as string | null // Optional for now

    // Handle authorization code grant
    if (grantType === 'authorization_code') {
      const code = body.get('code') as string
      const redirectUri = body.get('redirect_uri') as string

      if (!code || !redirectUri) {
        return NextResponse.json(
          {
            error: 'invalid_request',
            error_description: 'Missing required parameters: code, redirect_uri',
          },
          { status: 400 }
        )
      }

      // CRITICAL: Validate redirect URI against allowlist
      if (!isRedirectUriAllowed(redirectUri)) {
        return NextResponse.json(
          {
            error: 'invalid_request',
            error_description: 'Invalid redirect_uri. Redirect URI is not allowed.',
          },
          { status: 400 }
        )
      }

      // Rate limiting for OAuth endpoints
      const identifier = getRateLimitIdentifier(request)
      const rateLimit = checkRateLimit(identifier, 'oauth')
      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            error: 'rate_limit_exceeded',
            error_description: `Rate limit exceeded. Please try again after ${new Date(rateLimit.resetTime).toISOString()}`,
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': '20',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimit.resetTime.toString(),
              'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            },
          }
        )
      }

      const supabase = createAdminClient()

      // Find and validate authorization code
      const { data: authCode, error: codeError } = await supabase
        .from('oauth_authorization_codes')
        .select('*')
        .eq('code', code)
        .eq('redirect_uri', redirectUri)
        .eq('client_id', clientId)
        .single()

      if (codeError || !authCode) {
        return NextResponse.json(
          {
            error: 'invalid_grant',
            error_description: 'Invalid or expired authorization code',
          },
          { status: 400 }
        )
      }

      // Check if code is expired
      if (isTokenExpired(authCode.expires_at)) {
        // Delete expired code
        await supabase
          .from('oauth_authorization_codes')
          .delete()
          .eq('code', code)

        return NextResponse.json(
          {
            error: 'invalid_grant',
            error_description: 'Authorization code has expired',
          },
          { status: 400 }
        )
      }

      // Create access and refresh tokens
      const { accessToken, refreshToken, expiresAt } = await createOAuthTokens(
        authCode.user_id,
        clientId,
        authCode.scope || 'read write',
        3600 // 1 hour
      )

      // Delete the authorization code (single use)
      await supabase
        .from('oauth_authorization_codes')
        .delete()
        .eq('code', code)

      // Return tokens
      return NextResponse.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: refreshToken,
        scope: authCode.scope || 'read write',
      })
    }

    // Handle refresh token grant
    if (grantType === 'refresh_token') {
      const refreshToken = body.get('refresh_token') as string

      if (!refreshToken) {
        return NextResponse.json(
          {
            error: 'invalid_request',
            error_description: 'Missing required parameter: refresh_token',
          },
          { status: 400 }
        )
      }

      // Rate limiting for OAuth endpoints
      const identifier = getRateLimitIdentifier(request)
      const rateLimit = checkRateLimit(identifier, 'oauth')
      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            error: 'rate_limit_exceeded',
            error_description: `Rate limit exceeded. Please try again after ${new Date(rateLimit.resetTime).toISOString()}`,
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': '20',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimit.resetTime.toString(),
              'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            },
          }
        )
      }

      const result = await refreshAccessToken(refreshToken as string)

      if (!result) {
        return NextResponse.json(
          {
            error: 'invalid_grant',
            error_description: 'Invalid or expired refresh token',
          },
          { status: 400 }
        )
      }

      // Include refresh_token for Zapier/OAuth client compatibility (same token, no rotation)
      return NextResponse.json({
        access_token: result.accessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: result.refreshToken,
        scope: 'read write',
      })
    }

    // Unsupported grant type
    return NextResponse.json(
      {
        error: 'unsupported_grant_type',
        error_description: `Grant type "${grantType}" is not supported`,
      },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('OAuth token endpoint error:', error)
    return NextResponse.json(
      {
        error: 'server_error',
        error_description: error.message || 'Internal server error',
      },
      { status: 500 }
    )
  }
}

