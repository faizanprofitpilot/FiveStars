# Troubleshooting Guide

## Common Issues

### 1. Onboarding API Returns 500 Error

**Symptoms:**
- `api/business/onboarding` returns 500 (Internal Server Error)
- Cannot complete business profile setup

**Possible Causes & Solutions:**

#### A. Database Table Not Found
**Error:** "Database table not found. Please run the database schema migration."

**Solution:**
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run the SQL schema from `supabase/schema.sql`
4. Verify tables are created: `businesses`, `campaigns`, `review_requests`, `review_replies`

#### B. Database Connection Issues
**Solution:**
1. Verify your `.env.local` has correct Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Test connection in Supabase Dashboard

#### C. User Already Has Business
**Solution:**
The API now handles this automatically by updating existing business instead of creating duplicate.

#### D. Playwright/Scraping Issues
**Solution:**
- Scraping is optional and non-blocking
- If scraping fails, the business will still be created with generic context
- For serverless environments, scraping may not work - this is expected

### 2. Authentication Issues

**Symptoms:**
- Can't log in or sign up
- OAuth redirect not working

**Solutions:**
1. Check Supabase redirect URLs in Authentication settings:
   - Add `http://localhost:3000/auth/callback` for development
   - Add your production URL for production
2. Verify Google OAuth is enabled in Supabase Dashboard
3. Check environment variables are set correctly

### 3. Email Not Sending (Twilio/Resend)

**Symptoms:**
- Review requests not being sent
- No SMS/email delivered

**Solutions:**
1. **Twilio (SMS):**
   - Verify `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` in `.env.local`
   - Check Twilio console for errors
   - Verify phone number is verified in Twilio

2. **Resend (Email):**
   - Verify `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in `.env.local`
   - Ensure `RESEND_FROM_EMAIL` is verified in Resend dashboard
   - Check Resend dashboard for delivery logs

### 4. OpenAI API Errors

**Symptoms:**
- Review reply generation fails
- AI features not working

**Solutions:**
1. Verify `OPENAI_API_KEY` in `.env.local`
2. Check OpenAI account has credits
3. Verify API key permissions

### 5. Zapier Integration Not Working

**Symptoms:**
- Webhook returns errors
- Campaign not found

**Solutions:**
1. Verify webhook URL is correct: `/api/zapier/review-request`
2. Use correct `campaign_id` (not UUID) from Integrations page
3. Check webhook payload format matches expected schema
4. Verify `ZAPIER_WEBHOOK_SECRET` if authentication is enabled

## Debugging Steps

1. **Check Server Logs:**
   - Look at terminal output when running `npm run dev`
   - Check for specific error messages

2. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Look at Network tab for failed requests
   - Check Console for JavaScript errors

3. **Verify Environment Variables:**
   ```bash
   # Make sure .env.local exists and has all required variables
   cat .env.local
   ```

4. **Test Database Connection:**
   - Go to Supabase Dashboard
   - Check if tables exist
   - Try a simple query in SQL Editor

5. **Check API Responses:**
   - Use browser DevTools Network tab
   - Click on failed request
   - Check Response tab for error details

## Getting Help

If issues persist:
1. Check error messages in browser console
2. Check server logs in terminal
3. Verify all environment variables are set
4. Ensure database schema is applied
5. Check that all dependencies are installed: `npm install`

