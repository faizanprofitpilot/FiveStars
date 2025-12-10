import * as crypto from 'crypto'

/**
 * Generate a new API key
 * Returns both the plain key (to show user once) and the hash (to store)
 */
export function generateApiKey(): { key: string; hash: string } {
  // Generate a secure random key
  const key = `fivestars_${crypto.randomBytes(32).toString('hex')}`
  
  // Hash it for storage
  const hash = crypto.createHash('sha256').update(key).digest('hex')
  
  return { key, hash }
}

/**
 * Hash an API key for comparison
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

/**
 * Verify an API key against a hash
 */
export function verifyApiKey(key: string, hash: string): boolean {
  const keyHash = hashApiKey(key)
  return crypto.timingSafeEqual(
    Buffer.from(keyHash),
    Buffer.from(hash)
  )
}

