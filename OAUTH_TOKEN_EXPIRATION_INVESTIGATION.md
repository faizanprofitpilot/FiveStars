# FiveStars OAuth Token Expiration – Investigation Report

## Summary

Investigation into "This account connection has expired" in Zapier (FiveStars #5) even after reconnecting. **Root cause identified: Refresh token response omits `refresh_token`**, which many OAuth clients (including Zapier) expect. When missing, some clients treat credentials as incomplete and continue showing "expired."

---

## 1. Token Lifecycle Verification

### Access Token
- **Issuance**: `getTokenExpiration(3600)` uses server time (`new Date()` + 3600 seconds)
- **Storage**: `expires_at` stored in `oauth_tokens` as ISO string
- **Validation**: `isTokenExpired(expires_at)` compares against `new Date()` (server-side only)
- **TTL**: 1 hour (3600 seconds) – standard
- **Conclusion**: Access token lifecycle is correct; no client-side clock skew.

### Refresh Token
- **Issuance**: Generated via `generateRefreshToken()` and stored in DB
- **Storage**: `oauth_tokens.refresh_token`
- **Expiration**: No expiration in DB – refresh tokens are long-lived until invalidated
- **Invalidation**: Only when `createOAuthTokens` deletes rows (on reconnect) or user is deleted
- **Conclusion**: Refresh tokens are persisted correctly and not auto-expired.

### TTL Comparison
- Access token: 1 hour
- Refresh token: indefinite
- **Conclusion**: Refresh token TTL > access token TTL ✓

---

## 2. Token Refresh Endpoint Analysis

### Current Behavior (`/api/oauth/token` with `grant_type=refresh_token`)

**Request**: Validates `refresh_token`, looks up in DB, generates new access token, updates row.

**Response**:
```json
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read write"
}
```

**Critical issue**: Response does **not** include `refresh_token`.

Many OAuth clients (including Zapier) expect the refresh response to include `refresh_token`, either:
- The same token (when not rotating), or
- A new token (when rotating).

When `refresh_token` is missing, some clients:
1. Assume credentials are incomplete
2. Mark the connection as "expired" or "needs re-auth"
3. Show "Reconnect" even though a valid `access_token` was returned

RFC 6749 allows omitting `refresh_token` when not rotating, but practical compatibility requires including it.

### Refresh Token Rotation
- **Current**: No rotation – same `refresh_token` is reused
- **Conclusion**: Rotation is not required; including the same `refresh_token` in the response is sufficient and compatible with Zapier.

### Error Handling
- Invalid/missing refresh token → `invalid_grant` (400)
- Rate limit → `rate_limit_exceeded` (429)
- Logging: Errors logged via `console.error` in `refreshAccessToken`

---

## 3. Zapier Integration Config

### Auth Response (Authorization Code Grant)
- `access_token` ✓
- `refresh_token` ✓
- `expires_in`: 3600 ✓
- `token_type`: Bearer ✓
- `scope`: read write ✓

### Refresh Response (Refresh Token Grant)
- `access_token` ✓
- `refresh_token` **✗ MISSING**
- `expires_in`: 3600 ✓
- `scope`: read write ✓

### Redirect URIs
- Allowlist: `https://zapier.com/dashboard/auth/oauth/return/.*`
- Validated via `isRedirectUriAllowed()` before token exchange

### Scopes
- Fixed: `read write`
- No scope changes that would invalidate tokens

---

## 4. Database/Storage

### Schema (`oauth_tokens`)
- `access_token`, `refresh_token` stored
- `expires_at` for access token only
- No cleanup job that expires refresh tokens
- RLS enabled; admin client bypasses for server-side OAuth logic

### Token Invalidation on Reconnect
- `createOAuthTokens` deletes existing tokens for `user_id` + `client_id` before insert
- On reconnect, old `refresh_token` is invalidated; Zapier receives new tokens from auth code exchange
- **Conclusion**: Intended behavior; no premature invalidation from background jobs.

---

## 5. Rate Limiting

- OAuth endpoints: 20 requests/minute per IP
- Identifier: `getRateLimitIdentifier(request)` → IP from `x-forwarded-for` or `x-real-ip`
- If Zapier retries refresh aggressively, rate limiting could cause 429s and be interpreted as "expired"
- **Recommendation**: Monitor; increase limit if needed for high-volume Zaps

---

## Root Cause

**Primary**: Refresh token response omits `refresh_token`. Zapier (and similar clients) may treat this as incomplete credentials and show "connection expired" even when a valid `access_token` is returned.

**Secondary**: Rate limiting could contribute if Zapier retries frequently, but is less likely for a single user/Zap.

---

## Recommended Fix

Include `refresh_token` in the refresh token response (same token, no rotation):

```json
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "<same refresh_token from request>",
  "scope": "read write"
}
```

This aligns with common OAuth client expectations and should resolve the "expired after reconnect" behavior.

---

## Logs to Check

For connection ID 62047178 or similar:

1. **Vercel/Runtime logs**: Search for "Token refresh error" or "invalid_grant"
2. **OAuth token endpoint**: Failed refresh attempts (400 or 500)
3. **Rate limit hits**: 429 responses for `/api/oauth/token`
4. **Auth code exchange**: Successful token creation on reconnect
