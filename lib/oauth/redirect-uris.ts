/**
 * OAuth Redirect URI Allowlist
 * Only redirect URIs in this list are allowed for security
 */

/**
 * Allowed redirect URIs for OAuth flows
 * Add new URIs here as needed
 */
export const ALLOWED_REDIRECT_URIS = [
  // Zapier OAuth redirect URIs
  'https://zapier.com/dashboard/auth/oauth/return/App234136CLIAPI/',
  'https://zapier.com/dashboard/auth/oauth/return/',
  // Add pattern matching for Zapier (they may have dynamic paths)
  /^https:\/\/zapier\.com\/dashboard\/auth\/oauth\/return\/.*$/,
] as const

/**
 * Validate if a redirect URI is allowed
 * @param redirectUri - The redirect URI to validate
 * @returns true if allowed, false otherwise
 */
export function isRedirectUriAllowed(redirectUri: string): boolean {
  try {
    // Parse URL to ensure it's valid
    const url = new URL(redirectUri)

    // Check against exact matches
    if (ALLOWED_REDIRECT_URIS.some((uri) => uri === redirectUri)) {
      return true
    }

    // Check against regex patterns
    return ALLOWED_REDIRECT_URIS.some((uri) => {
      if (uri instanceof RegExp) {
        return uri.test(redirectUri)
      }
      return false
    })
  } catch (error) {
    // Invalid URL format
    return false
  }
}

/**
 * Get allowed redirect URIs for documentation
 */
export function getAllowedRedirectUris(): string[] {
  return ALLOWED_REDIRECT_URIS
    .filter((uri) => typeof uri === 'string')
    .map((uri) => uri as string)
}
