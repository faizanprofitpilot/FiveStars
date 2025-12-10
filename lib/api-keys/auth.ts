import { createAdminClient } from '@/lib/supabase/admin'
import { hashApiKey } from '@/lib/api-keys'

/**
 * Authenticate a request using an API key
 * Returns the user_id if valid, null otherwise
 */
export async function authenticateApiKey(apiKey: string): Promise<string | null> {
  try {
    const keyHash = hashApiKey(apiKey)
    const supabase = createAdminClient()

    // Find the API key
    const { data: apiKeyRecord, error } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('key_hash', keyHash)
      .single()

    if (error || !apiKeyRecord) {
      return null
    }

    // Update last_used_at
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('key_hash', keyHash)

    return apiKeyRecord.user_id
  } catch (error) {
    console.error('API key authentication error:', error)
    return null
  }
}

/**
 * Extract API key from request headers
 * Supports both Authorization: Bearer <key> and X-API-Key header
 */
export function extractApiKey(request: Request): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Try X-API-Key header
  const apiKeyHeader = request.headers.get('x-api-key')
  if (apiKeyHeader) {
    return apiKeyHeader
  }

  return null
}

