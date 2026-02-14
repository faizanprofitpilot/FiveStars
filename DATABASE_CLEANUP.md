# Database Cleanup - Extra Tables

## Issue Found

The database contains an **extra table** that is not part of the current schema:

- ❌ **`api_keys`** - Not defined in schema, not used in codebase

## Expected Tables (from schema)

✅ `businesses` - Business profiles  
✅ `campaigns` - Review request campaigns  
✅ `review_requests` - Sent review requests  
✅ `review_replies` - Generated AI replies  
✅ `oauth_tokens` - OAuth tokens for Zapier  
✅ `oauth_authorization_codes` - Temporary OAuth codes  
✅ `zapier_contacts` - Zapier contact tracking  

## Solution

A migration has been created to remove the unused `api_keys` table:

**File:** `supabase/migrations/remove_api_keys_table.sql`

This migration:
- Safely drops the `api_keys` table if it exists
- Uses `DROP TABLE IF EXISTS` to avoid errors if already removed
- Includes CASCADE to remove any dependent objects

## Action Required

Run this migration in Supabase SQL Editor:
```sql
-- Remove api_keys table if it exists
DROP TABLE IF EXISTS api_keys CASCADE;
```

Or run the full migration file: `supabase/migrations/remove_api_keys_table.sql`

## Verification

After running the migration, your database should only contain the 7 expected tables listed above.
