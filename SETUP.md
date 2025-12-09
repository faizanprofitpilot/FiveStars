# FiveStars Setup Guide

## Overview

FiveStars is a complete SaaS application for automating review requests and generating AI-powered review replies. This guide will help you set up the application.

## Prerequisites

- Node.js 18+ installed
- Supabase account
- OpenAI API key
- Twilio account (for SMS)
- Resend account (for emails)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Enable Google OAuth in Supabase Authentication settings
4. Get your Supabase URL and anon key from Settings > API

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for server-side operations)
- `OPENAI_API_KEY` - Your OpenAI API key
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number
- `RESEND_API_KEY` - Resend API key
- `RESEND_FROM_EMAIL` - Email address to send from
- `NEXT_PUBLIC_APP_URL` - Your app URL (e.g., http://localhost:3000 for dev)

Optional:
- `ZAPIER_WEBHOOK_SECRET` - Secret for Zapier webhook authentication

### 4. Set Up Playwright (for Google Profile Scraping)

```bash
npx playwright install chromium
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Database Schema

The database schema includes:

- `businesses` - Business profiles
- `campaigns` - Review request campaigns
- `review_requests` - Sent review requests
- `review_replies` - Generated AI replies

All tables have Row Level Security (RLS) enabled for data protection.

## Key Features Implemented

✅ Authentication (Email/Password + Google OAuth)
✅ Business onboarding with Google profile scraping
✅ Campaign creation and management
✅ SMS sending via Twilio
✅ Email sending via Resend
✅ AI review reply generation with OpenAI
✅ Zapier webhook integration
✅ Analytics dashboard
✅ Landing page

## API Endpoints

- `POST /api/business/onboarding` - Create business profile
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/[id]` - Update campaign
- `GET /api/campaigns/[id]` - Get campaign
- `DELETE /api/campaigns/[id]` - Delete campaign
- `POST /api/review-requests/send` - Send review request
- `POST /api/reviews/generate-reply` - Generate AI reply
- `POST /api/zapier/review-request` - Zapier webhook endpoint

## Zapier Integration

To use Zapier integration:

1. Create a webhook in Zapier pointing to `/api/zapier/review-request`
2. Use the campaign_id from your campaign (found in the Integrations page)
3. Send JSON payload with: `campaign_id`, `first_name`, `phone` (optional), `email` (optional)

## Next Steps

1. Configure your review links in campaign templates
2. Set up your Twilio phone number for SMS
3. Configure email branding in Resend
4. Deploy to Vercel or your preferred hosting platform

## Troubleshooting

- If Google OAuth doesn't work, check Supabase redirect URLs
- If scraping fails, Playwright may need browser dependencies
- Check API keys are correctly set in environment variables
- Verify RLS policies are correctly configured in Supabase

