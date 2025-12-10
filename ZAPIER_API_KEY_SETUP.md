# Zapier API Key Authentication Setup Guide

## Overview

FiveStars now supports API Key authentication for Zapier integrations, which is simpler and more secure than OAuth for this use case.

## Step 1: Run Database Migration

First, update your database schema to include the API keys table:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run the updated schema from `supabase/schema-new.sql`

The schema includes:
- `api_keys` table for storing API keys
- Proper indexes and RLS policies

## Step 2: Generate an API Key

1. Log into your FiveStars account
2. Go to **Settings** → **API Keys**
3. Click **Create** and give your key a name (e.g., "Zapier Integration")
4. **IMPORTANT**: Copy the API key immediately - you won't be able to see it again!
5. Store it securely

## Step 3: Configure Zapier Integration

### In Zapier Platform:

1. **Go to Authentication Settings**
   - Navigate to your FiveStars integration
   - Go to **Authentication** section

2. **Change Authentication Type to API Key**
   - If you already set up OAuth, you'll need to change it
   - Select **API Key** as the authentication type

3. **Configure API Key Fields**
   - **Field Label**: "API Key"
   - **Field Key**: `apiKey` (or `api_key`)
   - **Help Text**: "Your FiveStars API key from Settings → API Keys"

4. **Configure Test Endpoint**
   - **Method**: `GET`
   - **URL**: `https://your-domain.com/api/zapier/test`
   - **Headers**: 
     - `Authorization: Bearer {{bundle.authData.apiKey}}`
     - OR `X-API-Key: {{bundle.authData.apiKey}}`

5. **Test Authentication**
   - Click "Connect to FiveStars"
   - Paste your API key
   - Click "Test Authentication"
   - Should return your user info and business details

## Step 4: Configure Actions

When creating Actions (like "Send Review Request"):

1. **Use the API Key in Headers**
   - Add header: `Authorization: Bearer {{bundle.authData.apiKey}}`
   - OR: `X-API-Key: {{bundle.authData.apiKey}}`

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

## API Endpoints

### Test Endpoint (for Zapier authentication test)
- **URL**: `/api/zapier/test`
- **Method**: `GET`
- **Auth**: API Key in `Authorization: Bearer <key>` or `X-API-Key: <key>` header
- **Response**: User and business information

### Review Request Endpoint
- **URL**: `/api/zapier/review-request`
- **Method**: `POST`
- **Auth**: API Key in `Authorization: Bearer <key>` or `X-API-Key: <key>` header
- **Body**:
  ```json
  {
    "campaign_id": "string (required)",
    "first_name": "string (required)",
    "phone": "string (optional)",
    "email": "string (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "review_request_id": "uuid",
    "primary_sent": true
  }
  ```

## Security Notes

- API keys are hashed using SHA-256 before storage
- Keys are only shown once when created
- Each key tracks last usage time
- Users can delete keys at any time
- Keys are scoped to the user who created them

## Troubleshooting

### "Invalid API key" error
- Verify the key is correct (no extra spaces)
- Check that the key hasn't been deleted
- Ensure you're using the correct header format

### "API key required" error
- Make sure you're sending the key in the `Authorization: Bearer <key>` header
- Or use the `X-API-Key: <key>` header

### Test endpoint returns 401
- Verify the API key is valid
- Check that the key belongs to an active user account
- Ensure the database migration has been run

## Next Steps

1. Run the database migration
2. Generate an API key in Settings
3. Configure Zapier with API Key authentication
4. Test the connection
5. Create your first Action!

