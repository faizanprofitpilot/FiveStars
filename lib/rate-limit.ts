/**
 * Simple in-memory rate limiter
 * For production, consider using Redis-based rate limiting (e.g., Upstash)
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

/**
 * Rate limit configuration per endpoint type
 */
export const RATE_LIMITS = {
  oauth: { requests: 10, windowMs: 60 * 1000 }, // 10 requests per minute
  reviewRequest: { requests: 100, windowMs: 60 * 60 * 1000 }, // 100 requests per hour
  aiGeneration: { requests: 20, windowMs: 60 * 60 * 1000 }, // 20 requests per hour
  general: { requests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  zapier: { requests: 1000, windowMs: 60 * 1000 }, // 1000 requests per minute (Zapier can be high volume)
} as const

export type RateLimitType = keyof typeof RATE_LIMITS

/**
 * Check if request should be rate limited
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param type - Type of rate limit to apply
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  type: RateLimitType = 'general'
): { allowed: boolean; remaining: number; resetTime: number } {
  const limit = RATE_LIMITS[type]
  const key = `${type}:${identifier}`
  const now = Date.now()

  // Clean up expired entries periodically (simple cleanup)
  if (Math.random() < 0.01) {
    // 1% chance to cleanup on each request
    Object.keys(store).forEach((k) => {
      if (store[k].resetTime < now) {
        delete store[k]
      }
    })
  }

  const entry = store[key]

  // No entry or expired - create new entry
  if (!entry || entry.resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + limit.windowMs,
    }
    return {
      allowed: true,
      remaining: limit.requests - 1,
      resetTime: now + limit.windowMs,
    }
  }

  // Entry exists and not expired
  if (entry.count >= limit.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  // Increment count
  entry.count++
  return {
    allowed: true,
    remaining: limit.requests - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Get client identifier from request
 * Uses IP address or user ID if available
 */
export function getRateLimitIdentifier(request: Request, userId?: string): string {
  // Prefer user ID if available (more accurate for authenticated requests)
  if (userId) {
    return `user:${userId}`
  }

  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'

  return `ip:${ip}`
}
