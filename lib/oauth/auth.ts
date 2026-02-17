import { createAdminClient } from '@/lib/supabase/admin'
import { generateAccessToken, generateRefreshToken, getTokenExpiration, isTokenExpired } from './tokens'

/**
 * Authenticate a request using an OAuth access token
 * Returns the user_id if valid, null otherwise
 */
export async function authenticateOAuthToken(accessToken: string): Promise<string | null> {
  try {
    const supabase = createAdminClient()

    // Find the token
    const { data: tokenRecord, error } = await supabase
      .from('oauth_tokens')
      .select('user_id, expires_at')
      .eq('access_token', accessToken)
      .single()

    if (error || !tokenRecord) {
      return null
    }

    // Check if token is expired
    if (isTokenExpired(tokenRecord.expires_at)) {
      return null
    }

    return tokenRecord.user_id
  } catch (error) {
    console.error('OAuth token authentication error:', error)
    return null
  }
}

/**
 * Extract OAuth access token from request headers
 * Supports Authorization: Bearer <token>
 */
export function extractOAuthToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

/**
 * Create OAuth tokens for a user
 * CRITICAL: Each user gets their own isolated tokens - tokens are scoped to user_id
 */
export async function createOAuthTokens(
  userId: string,
  clientId: string = 'zapier',
  scope: string = 'read write',
  expiresInSeconds: number = 3600
): Promise<{ accessToken: string; refreshToken: string; expiresAt: Date }> {
  const accessToken = generateAccessToken()
  const refreshToken = generateRefreshToken()
  const expiresAt = getTokenExpiration(expiresInSeconds)

  const supabase = createAdminClient()

  // CRITICAL: Delete any existing tokens for this user+client combination
  // This ensures only one active connection per user per client
  await supabase
    .from('oauth_tokens')
    .delete()
    .eq('user_id', userId)
    .eq('client_id', clientId)

  // Store new tokens - scoped to this specific user
  const { error } = await supabase
    .from('oauth_tokens')
    .insert({
      user_id: userId, // CRITICAL: Each token is tied to a specific user
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_at: expiresAt.toISOString(),
      scope,
      client_id: clientId,
    })

  if (error) {
    throw new Error(`Failed to create OAuth tokens: ${error.message}`)
  }

  return { accessToken, refreshToken, expiresAt }
}

/**
 * Refresh an access token using a refresh token
 * Returns new access_token + same refresh_token (for Zapier/OAuth client compatibility)
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string; expiresAt: Date } | null> {
  try {
    const supabase = createAdminClient()

    // Find the refresh token
    const { data: tokenRecord, error } = await supabase
      .from('oauth_tokens')
      .select('user_id, client_id, scope')
      .eq('refresh_token', refreshToken)
      .single()

    if (error || !tokenRecord) {
      return null
    }

    // Generate new access token
    const accessToken = generateAccessToken()
    const expiresAt = getTokenExpiration(3600) // 1 hour

    // Update the token record (refresh_token stays the same - no rotation)
    const { error: updateError } = await supabase
      .from('oauth_tokens')
      .update({
        access_token: accessToken,
        expires_at: expiresAt.toISOString(),
      })
      .eq('refresh_token', refreshToken)

    if (updateError) {
      throw new Error(`Failed to refresh token: ${updateError.message}`)
    }

    return { accessToken, refreshToken, expiresAt }
  } catch (error) {
    console.error('Token refresh error:', error)
    return null
  }
}

