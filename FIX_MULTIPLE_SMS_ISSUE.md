# Fix: Multiple SMS Messages from Different Businesses

## Problem
When a single Zapier trigger occurs, multiple SMS messages are being sent with different business names (e.g., "Pakistan Corp" and "Joe's Pizza"). This indicates a user isolation issue where one user's trigger is causing messages from other users' businesses.

## Root Cause Analysis

The issue was identified as a lack of proper user verification in the `sendReviewRequestInternal` function. While the webhook handler verified ownership, the internal function didn't double-check that the campaign belonged to the expected user.

## Solutions Implemented

### 1. Database Constraint: One Business Per User
**File:** `supabase/migrations/add_unique_user_business_constraint.sql`

Added a UNIQUE constraint on `user_id` in the `businesses` table to ensure each user can only have one business. This prevents confusion and ensures proper isolation.

**Action Required:** Run this migration in Supabase SQL Editor:
```sql
ALTER TABLE businesses 
ADD CONSTRAINT unique_user_business UNIQUE (user_id);
```

### 2. Enhanced Security Check in sendReviewRequestInternal
**File:** `lib/zapier/send-review-request.ts`

- Added `expectedUserId` parameter to the function
- Added security check to verify campaign belongs to expected user
- If mismatch is detected, function returns error and logs security violation
- This prevents cross-user message sending even if webhook handler has a bug

### 3. Enhanced Logging
**Files:** 
- `app/api/zapier/review-request/route.ts`
- `lib/zapier/send-review-request.ts`

Added comprehensive logging to track:
- Which user is authenticated (user_id)
- Which business is being used (business_id, business_name)
- Which campaign is being used (campaign_id, campaign_name)
- Security check results

This will help diagnose any future issues.

### 4. Updated Webhook Handler
**File:** `app/api/zapier/review-request/route.ts`

- Now passes `expectedUserId` to `sendReviewRequestInternal`
- Added final verification logging before sending message

## How It Works Now

1. **Zapier Webhook Called** → Extracts OAuth token
2. **OAuth Authentication** → Gets `user_id` from token (isolated per user)
3. **Get User's Business** → `.eq('user_id', userId).single()` (now guaranteed unique)
4. **Find Campaign** → Scoped to user's business only
5. **Verify Ownership** → Multiple checks ensure campaign belongs to user
6. **Call sendReviewRequestInternal** → Passes `expectedUserId`
7. **Internal Security Check** → Verifies campaign belongs to `expectedUserId`
8. **Send Message** → Uses correct business name and review link

## Testing

After deploying these changes:

1. **Run the migration** in Supabase to add the unique constraint
2. **Test with one user's Zapier integration** - should only send that user's business name
3. **Check logs** - should show clear user/business identification
4. **Verify** - Each webhook call should only result in ONE message with the correct business name

## Expected Behavior

- ✅ When Joe's Pizza's CRM gets a new contact → Only Joe's Pizza review request sent
- ✅ When Pakistan Corp's CRM gets a new contact → Only Pakistan Corp review request sent
- ✅ Each user's Zapier integration is completely isolated
- ✅ No cross-user message sending

## Files Changed

1. `supabase/migrations/add_unique_user_business_constraint.sql` (NEW)
2. `lib/zapier/send-review-request.ts` (MODIFIED)
3. `app/api/zapier/review-request/route.ts` (MODIFIED)

## Next Steps

1. Run the database migration in Supabase
2. Deploy the code changes
3. Test with actual Zapier triggers
4. Monitor logs to verify proper isolation
