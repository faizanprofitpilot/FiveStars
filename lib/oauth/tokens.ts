import * as crypto from 'crypto'

/**
 * Generate a secure random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Generate an authorization code (short-lived, single-use)
 */
export function generateAuthorizationCode(): string {
  return `auth_${generateToken(24)}`
}

/**
 * Generate an access token
 */
export function generateAccessToken(): string {
  return `fivestars_${generateToken(32)}`
}

/**
 * Generate a refresh token
 */
export function generateRefreshToken(): string {
  return `refresh_${generateToken(32)}`
}

/**
 * Calculate token expiration time
 */
export function getTokenExpiration(expiresInSeconds: number = 3600): Date {
  const expiresAt = new Date()
  expiresAt.setSeconds(expiresAt.getSeconds() + expiresInSeconds)
  return expiresAt
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(expiresAt: Date | string): boolean {
  const expiry = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt
  return expiry < new Date()
}

