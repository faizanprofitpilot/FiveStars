# Twilio SMS Debugging Guide

## Quick Test

Use the test endpoint to verify Twilio is working:

```bash
curl -X POST https://your-domain.com/api/twilio/test \
  -H "Content-Type: application/json" \
  -d '{"to": "+1234567890", "body": "Test message"}'
```

## Common Issues

### 1. Messages Not Sending

**Check these in order:**

1. **Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Verify these are set:
     - `TWILIO_ACCOUNT_SID`
     - `TWILIO_AUTH_TOKEN`
     - `TWILIO_PHONE_NUMBER` (must be in E.164 format: +1234567890)

2. **Check Server Logs:**
   - Go to Vercel Dashboard → Your Project → Logs
   - Look for "Attempting to send SMS" logs
   - Check for errors like:
     - "Twilio credentials not configured"
     - "Twilio phone number not configured"
     - Any Twilio API errors

3. **Phone Number Format:**
   - Twilio requires E.164 format: `+[country code][number]`
   - Example: `+14155551234` (US)
   - The code now auto-formats numbers, but ensure Zapier sends them correctly

4. **Twilio Account Status:**
   - Check Twilio Console → Monitor → Logs
   - Verify your account has credits
   - Check if your phone number is verified/active

### 2. Check Activity Log

In the FiveStars dashboard:
1. Go to Campaigns → Select a campaign → Activity Log
2. Look at the error messages
3. If you see "Twilio status: [status]", check what the status means:
   - `queued` - Message is queued (normal, will send soon)
   - `sent` - Sent to carrier (may still be in transit)
   - `delivered` - Actually delivered to phone
   - `undelivered` - Carrier rejected it
   - `failed` - Failed to send

### 3. Verify Twilio Setup

1. **Get your Twilio credentials:**
   - Go to Twilio Console → Account → API Keys & Tokens
   - Copy Account SID and Auth Token

2. **Get your phone number:**
   - Go to Twilio Console → Phone Numbers → Manage → Active Numbers
   - Copy the number in E.164 format (e.g., +14155551234)

3. **Add to Vercel:**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Add all three variables
   - **Important:** Redeploy after adding variables

### 4. Test Phone Number

Make sure the phone number you're sending to:
- Is in a valid format
- Is not blocked by your carrier
- Can receive SMS messages
- For testing, use your own verified phone number

## Debugging Steps

1. **Check if Twilio is configured:**
   ```bash
   # Use the test endpoint
   POST /api/twilio/test
   {
     "to": "+1234567890",
     "body": "Test"
   }
   ```

2. **Check server logs for:**
   - "Attempting to send SMS" - shows phone number and config
   - "SMS send result" - shows if it succeeded
   - Any error messages

3. **Check Twilio Console:**
   - Monitor → Logs → Messaging
   - Look for your message attempts
   - Check error codes if any

4. **Common Error Codes:**
   - `21211` - Invalid 'To' phone number
   - `21608` - The 'To' number is not a valid mobile number
   - `21610` - Unsubscribed recipient
   - `30008` - Unknown destination handset

## Next Steps

If messages still aren't sending:
1. Check Vercel logs for the exact error
2. Check Twilio Console for message attempts
3. Verify all environment variables are set correctly
4. Test with the `/api/twilio/test` endpoint
5. Check that your Twilio account has credits

