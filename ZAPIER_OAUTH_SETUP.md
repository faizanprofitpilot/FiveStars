# Zapier OAuth 2.0 Setup Guide

## Overview

FiveStars now supports OAuth 2.0 authentication for Zapier integrations. This provides a seamless one-click connect experience for your users.

## How It Works

1. User clicks "Connect" in Zapier
2. User is redirected to FiveStars to sign in
3. User sees a consent screen and approves access
4. FiveStars issues an access token to Zapier
5. Zapier uses the token for all API calls

## Step 1: Run Database Migration

Update your database schema to include OAuth tables:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run the updated schema from `supabase/schema-new.sql`

The schema includes:
- `oauth_tokens` table for storing access/refresh tokens
- `oauth_authorization_codes` table for temporary authorization codes
- Proper indexes and RLS policies

## Step 2: Configure Zapier Integration

### In Zapier Platform:

1. **Go to Authentication Settings**
   - Navigate to your FiveStars integration
   - Go to **Authentication** section
   - Select **OAuth 2.0** as the authentication type

2. **Configure OAuth 2.0 Settings**

   **Authorization URL:**
   ```
   https://your-domain.com/api/oauth/authorize
   ```
   - Method: `GET`
   - Parameters:
     - `response_type`: `code`
     - `client_id`: `zapier` (or your client ID)
     - `redirect_uri`: Zapier will provide this
     - `scope`: `read write` (optional)
     - `state`: Zapier will generate this

   **Access Token Request:**
   ```
   https://your-domain.com/api/oauth/token
   ```
   - Method: `POST`
   - Body Type: `form-urlencoded`
   - Parameters:
     - `grant_type`: `authorization_code`
     - `code`: `{{bundle.inputData.code}}`
     - `redirect_uri`: `{{bundle.inputData.redirect_uri}}`
     - `client_id`: `zapier`

   **Refresh Token Request (Optional):**
   ```
   https://your-domain.com/api/oauth/token
   ```
   - Method: `POST`
   - Body Type: `form-urlencoded`
   - Parameters:
     - `grant_type`: `refresh_token`
     - `refresh_token`: `{{bundle.authData.refresh_token}}`
     - `client_id`: `zapier`

3. **Configure Test Endpoint**
   - **Method**: `GET`
   - **URL**: `https://your-domain.com/api/zapier/test`
   - **Headers**: 
     - `Authorization: Bearer {{bundle.authData.access_token}}`

4. **Add Redirect URI to Allowed List**
   - Zapier will provide a redirect URI (e.g., `https://zapier.com/dashboard/auth/oauth/return/App234136CLIAPI/`)
   - Add this to your allowed redirect URIs (currently handled automatically in the code)

5. **Test Authentication**
   - Click "Connect to FiveStars"
   - You'll be redirected to FiveStars to sign in
   - Approve the authorization
   - You'll be redirected back to Zapier
   - Click "Test Authentication"
   - Should return your user info and business details

## Step 3: Configure Actions

When creating Actions (like "Send Review Request"):

1. **Use the OAuth Token in Headers**
   - Add header: `Authorization: Bearer {{bundle.authData.access_token}}`

2. **Endpoint URL**
   - For sending review requests: `https://your-domain.com/api/zapier/review-request`
   - Method: `POST`

3. **Request Body**
   ```json
   {
     "campaign_id": "your-campaign-id",
     "first_name": "John",
     "phone": "+1234567890",
     "email": "john@example.com"
   }
   ```

## OAuth Endpoints

### Authorization Endpoint
- **URL**: `/api/oauth/authorize`
- **Method**: `GET`
- **Parameters**:
  - `response_type`: `code` (required)
  - `client_id`: Client identifier (required)
  - `redirect_uri`: Where to redirect after authorization (required)
  - `scope`: Permissions requested (optional, default: `read write`)
  - `state`: CSRF protection (optional)
- **Response**: Redirects to login → consent page → back to client with code

### Token Endpoint
- **URL**: `/api/oauth/token`
- **Method**: `POST`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Grant Types Supported**:
  - `authorization_code`: Exchange code for tokens
  - `refresh_token`: Get new access token
- **Response**: JSON with `access_token`, `refresh_token`, `expires_in`, etc.

### Test Endpoint
- **URL**: `/api/zapier/test`
- **Method**: `GET`
- **Auth**: OAuth Bearer token
- **Response**: User and business information

## OAuth Flow Diagram

```
User → Zapier "Connect" 
  → FiveStars /api/oauth/authorize
    → Login (if not authenticated)
      → Consent Page (/oauth/consent)
        → User Approves
          → POST /api/oauth/authorize (approved=true)
            → Generate authorization code
              → Redirect to Zapier with code
                → Zapier exchanges code for token
                  → POST /api/oauth/token
                    → Return access_token + refresh_token
                      → Zapier stores tokens
                        → Use access_token for API calls
```

## Security Features

- Authorization codes expire in 10 minutes
- Access tokens expire in 1 hour
- Refresh tokens can be used to get new access tokens
- Tokens are scoped to the user who authorized
- RLS policies ensure users can only see their own tokens
- State parameter for CSRF protection (optional but recommended)

## Troubleshooting

### "invalid_request" error
- Check that all required parameters are present
- Verify `response_type` is `code`
- Ensure `client_id` and `redirect_uri` are provided

### "invalid_grant" error
- Authorization code may have expired (10 minutes)
- Code may have already been used (single-use)
- Redirect URI doesn't match

### "access_denied" error
- User denied the authorization request
- User can try again and approve

### Test endpoint returns 401
- Verify the access token is valid
- Check that the token hasn't expired
- Ensure you're using `Authorization: Bearer <token>` header

### Token expired
- Use the refresh token to get a new access token
- Or re-authenticate through the OAuth flow

## Next Steps

1. Run the database migration
2. Configure Zapier with OAuth 2.0 settings
3. Test the connection flow
4. Create your first Action!

