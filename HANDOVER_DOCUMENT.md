# FiveStars SaaS - Complete Handover Document

## 📋 Overview

This document contains all information needed to take over and operate the FiveStars SaaS application. FiveStars is an AI-powered review request automation platform that integrates with Zapier to send SMS/Email review requests and generate AI-powered review replies.

---

## 🚀 Quick Start Checklist

- [ ] Transfer Twilio account ownership
- [ ] Transfer Supabase project (or create new)
- [ ] Transfer Vercel deployment (or redeploy)
- [ ] Update all environment variables
- [ ] Transfer domain (if applicable)
- [ ] Test all integrations
- [ ] Update billing information
- [ ] Verify A2P 10DLC registration status

---

## 1. Twilio Account Transfer

### Current Status
- **A2P 10DLC Registration**: Submitted and pending approval (2-3 weeks)
- **Campaign Status**: "In progress" - Under review by Twilio
- **Phone Number**: `+19344511039`

### Important Twilio IDs
- **Account SID**: (Find in Twilio Console → Account → Account Info)
- **Auth Token**: (Find in Twilio Console → Account → API Keys & Tokens)
- **Phone Number**: `+19344511039`
- **A2P Campaign SID**: `CM919d75bbe8214c9735658aa9c9313896`
- **A2P Brand SID**: `BNe89c087a14bb612539cd962d318dfd29`
- **Customer Profile SID**: `BUb6809773009b564f29c909f656b88866`
- **Messaging Service SID**: `MGa74570f25cf750df4b9b2bd3d51e47db`

### Transfer Process
1. **Contact Twilio Support**:
   - Go to: Twilio Console → Help → Contact Support
   - Request: "Account Ownership Transfer"
   - Provide:
     - Account SID
     - New owner's email address
     - Reason: "Transferring account ownership to new owner"

2. **What Transfers**:
   - ✅ A2P 10DLC registration (Brand, Campaign, Customer Profile)
   - ✅ Phone numbers
   - ✅ Messaging Service
   - ✅ All credentials
   - ✅ Account history

3. **After Transfer**:
   - New owner accepts transfer invitation
   - Update billing information
   - Verify A2P Campaign status (should show "In progress" or "Approved")
   - Test SMS sending once A2P is approved

### A2P 10DLC Status
- **Current**: Under review (2-3 weeks expected)
- **Check Status**: Twilio Console → Messaging → Regulatory Compliance → A2P Campaigns
- **Once Approved**: SMS to US numbers will work automatically
- **No Action Needed**: Registration transfers with account ownership

---

## 2. Supabase Project

### Current Setup
- **Project Type**: Supabase (PostgreSQL database + Auth)
- **Authentication**: Email/Password + Google OAuth
- **Database**: PostgreSQL with Row Level Security (RLS)

### Transfer Options

#### Option A: Transfer Existing Project
1. Go to Supabase Dashboard
2. Project Settings → General
3. Transfer project ownership (if available)
4. Or add new owner as team member with Admin access

#### Option B: Create New Project (Recommended for Clean Start)
1. Create new Supabase project
2. Run database schema (see Database Schema section)
3. Update environment variables
4. Re-run onboarding for existing users (if any)

### Required Supabase Credentials
- **Project URL**: `NEXT_PUBLIC_SUPABASE_URL` (from Supabase Dashboard → Settings → API)
- **Anon Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from Supabase Dashboard → Settings → API)
- **Service Role Key**: `SUPABASE_SERVICE_ROLE_KEY` (from Supabase Dashboard → Settings → API)

### Database Schema
- **Location**: `supabase/schema-new.sql`
- **Run**: In Supabase Dashboard → SQL Editor
- **Note**: Schema is idempotent (can be run multiple times safely)

### Authentication Setup
1. **Enable Google OAuth**:
   - Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Add OAuth credentials from Google Cloud Console

2. **Redirect URLs** (Add these):
   - `http://localhost:3000/auth/callback` (development)
   - `https://www.getfivestars.xyz/auth/callback` (production)
   - `https://www.getfivestars.xyz/oauth/consent` (OAuth consent page)

---

## 3. Vercel Deployment

### Current Deployment
- **Production URL**: `https://www.getfivestars.xyz`
- **GitHub Repository**: `https://github.com/faizanprofitpilot/FiveStars.git`

### Transfer Options

#### Option A: Transfer Vercel Project
1. Go to Vercel Dashboard
2. Project Settings → General
3. Transfer project to new team/account
4. Update environment variables

#### Option B: Create New Deployment
1. Fork/clone GitHub repository
2. Create new Vercel project
3. Connect GitHub repository
4. Set all environment variables (see Environment Variables section)
5. Deploy

### Environment Variables (Vercel)
All environment variables must be set in Vercel Dashboard → Project → Settings → Environment Variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+19344511039

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Resend (Email)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@getfivestars.xyz

# App URL
NEXT_PUBLIC_APP_URL=https://www.getfivestars.xyz
```

### Domain Setup
- **Current Domain**: `www.getfivestars.xyz`
- **DNS**: Configured in Vercel
- **SSL**: Automatic via Vercel

---

## 4. OpenAI API

### Setup
1. Create OpenAI account (if needed)
2. Generate API key: https://platform.openai.com/api-keys
3. Add to Vercel environment variables as `OPENAI_API_KEY`
4. **Model Used**: `gpt-4o-mini` (configured in code)

### Usage
- Used for: AI-powered review reply generation
- Location: `lib/openai/generate-reply.ts`
- Cost: Pay-per-use (check OpenAI pricing)

---

## 5. Resend (Email Service)

### Setup
1. Create Resend account: https://resend.com
2. Verify domain: `getfivestars.xyz` (or use Resend's domain)
3. Generate API key
4. Add to Vercel:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL` (e.g., `noreply@getfivestars.xyz`)

### Usage
- Used for: Sending review request emails
- Location: `lib/resend/send-email.ts`

---

## 6. Zapier Integration

### Current Setup
- **Integration Type**: OAuth 2.0 (Custom FiveStars OAuth)
- **Status**: Published/Private (check Zapier Platform)
- **OAuth Flow**: Custom implementation

### OAuth Endpoints
- **Authorization URL**: `https://www.getfivestars.xyz/api/oauth/authorize`
- **Token URL**: `https://www.getfivestars.xyz/api/oauth/token`
- **Client ID**: `zapier` (hardcoded in code)
- **Client Secret**: Not required (optional in current implementation)

### Zapier Action
- **Action Name**: "Send Review Request"
- **Endpoint**: `https://www.getfivestars.xyz/api/zapier/review-request`
- **Method**: POST
- **Authentication**: OAuth 2.0 Bearer Token
- **Input Fields**:
  - `campaign_id` (text) - Campaign ID from FiveStars
  - `first_name` (text) - Customer first name
  - `phone` (text, optional) - Customer phone number
  - `email` (text, optional) - Customer email

### Campaign ID Endpoint
- **URL**: `https://www.getfivestars.xyz/api/zapier/campaigns`
- **Method**: GET
- **Returns**: List of campaigns for dropdown (if configured)

### Testing
1. Connect Zapier account via OAuth
2. Test "Send Review Request" action
3. Verify message appears in FiveStars Activity Log

### Important Notes
- OAuth tokens stored in `oauth_tokens` table
- Campaign IDs are 32-character alphanumeric strings
- Users can copy Campaign ID from dashboard

---

## 7. Database Schema

### Tables
1. **businesses** - Business profiles
2. **campaigns** - Review request campaigns
3. **review_requests** - Sent review requests
4. **review_replies** - Generated AI replies
5. **oauth_tokens** - OAuth tokens for Zapier
6. **oauth_authorization_codes** - Temporary OAuth codes

### Schema File
- **Location**: `supabase/schema-new.sql`
- **Run**: In Supabase SQL Editor
- **Idempotent**: Safe to run multiple times

### Key Features
- Row Level Security (RLS) enabled on all tables
- Automatic timestamps (`created_at`, `updated_at`)
- Foreign key constraints
- Indexes for performance

---

## 8. Application Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **SMS**: Twilio
- **Email**: Resend
- **AI**: OpenAI (GPT-4o-mini)
- **Deployment**: Vercel

### Key Directories
```
app/
  ├── (auth)/          # Login/Signup pages
  ├── (dashboard)/     # Protected dashboard routes
  ├── api/             # API routes
  └── oauth/           # OAuth consent page

components/
  ├── campaigns/       # Campaign management
  ├── dashboard/       # Dashboard components
  └── ui/              # shadcn/ui components

lib/
  ├── supabase/        # Supabase clients
  ├── twilio/          # SMS sending
  ├── resend/          # Email sending
  ├── openai/          # AI reply generation
  └── oauth/           # OAuth implementation
```

### Important Files
- `middleware.ts` - Auth middleware
- `app/api/zapier/review-request/route.ts` - Zapier webhook
- `lib/zapier/send-review-request.ts` - Internal send function
- `app/api/oauth/authorize/route.ts` - OAuth authorization
- `app/api/oauth/token/route.ts` - OAuth token exchange

---

## 9. Testing Procedures

### 1. Test SMS Sending
```bash
# Use test endpoint
curl -X POST https://www.getfivestars.xyz/api/twilio/test \
  -H "Content-Type: application/json" \
  -d '{"to": "+1234567890", "body": "Test message"}'
```

### 2. Test Zapier Integration
1. Go to Zapier → Your Zaps
2. Create test Zap with FiveStars action
3. Send test review request
4. Check FiveStars dashboard → Campaigns → Activity Log

### 3. Test Email Sending
1. Create campaign with email as primary channel
2. Send test review request
3. Check email inbox

### 4. Test AI Reply Generation
1. Go to Dashboard → Reply to Reviews
2. Paste sample review
3. Select tone
4. Generate reply
5. Verify reply is generated and editable

### 5. Test Authentication
1. Sign up new user
2. Complete onboarding
3. Create campaign
4. Test OAuth flow

---

## 10. Common Issues & Troubleshooting

### SMS Not Sending
- **Check**: A2P 10DLC approval status
- **Check**: Twilio Console → Monitor → Logs
- **Check**: Phone number format (must be E.164: +1234567890)
- **Check**: Twilio account credits

### Zapier OAuth Not Working
- **Check**: OAuth endpoints are accessible
- **Check**: Redirect URLs in Supabase
- **Check**: OAuth tokens in database
- **Check**: Zapier Platform configuration

### Database Errors
- **Check**: Supabase connection
- **Check**: RLS policies are correct
- **Check**: Schema is up to date
- **Run**: `supabase/schema-new.sql` if needed

### Build Errors
- **Check**: All environment variables are set
- **Check**: TypeScript errors
- **Check**: Vercel build logs

---

## 11. Billing & Costs

### Twilio
- **A2P Registration**: $4.50 one-time (Brand) + $15 one-time (Campaign) + $2/month (Campaign)
- **SMS**: ~$0.0075 per message (US)
- **Phone Number**: ~$1/month

### Supabase
- **Free Tier**: 500MB database, 50K monthly active users
- **Paid**: Check Supabase pricing if scaling

### OpenAI
- **Model**: gpt-4o-mini
- **Cost**: ~$0.15 per 1M input tokens, $0.60 per 1M output tokens
- **Usage**: Per review reply generation

### Resend
- **Free Tier**: 3,000 emails/month
- **Paid**: Check Resend pricing

### Vercel
- **Free Tier**: Hobby plan
- **Paid**: Pro plan if needed

---

## 12. Security Considerations

### Environment Variables
- **Never commit** `.env.local` to Git
- **Rotate** API keys after transfer
- **Use** Vercel environment variables (not hardcoded)

### Database
- **RLS Enabled**: All tables have Row Level Security
- **Service Role Key**: Only use server-side, never expose to client

### OAuth
- **Tokens**: Stored securely in database
- **Expiration**: Tokens expire after 1 hour (refresh tokens available)

### API Routes
- **Authentication**: All routes check for valid user/OAuth token
- **Validation**: Input validation using Zod schemas

---

## 13. Support & Documentation

### Code Documentation
- `README.md` - Project overview
- `SETUP.md` - Setup instructions
- `TROUBLESHOOTING.md` - Common issues
- `TWILIO_DEBUG.md` - Twilio debugging guide
- `ZAPIER_OAUTH_SETUP.md` - Zapier OAuth setup

### External Documentation
- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Twilio**: https://www.twilio.com/docs
- **Zapier Platform**: https://platform.zapier.com/docs

### Support Contacts
- **Twilio Support**: Twilio Console → Help → Contact Support
- **Supabase Support**: Supabase Dashboard → Support
- **Vercel Support**: Vercel Dashboard → Support

---

## 14. Post-Transfer Checklist

### Immediate Actions
- [ ] Transfer Twilio account ownership
- [ ] Transfer/Setup Supabase project
- [ ] Transfer/Setup Vercel deployment
- [ ] Update all environment variables
- [ ] Test authentication (sign up/login)
- [ ] Test campaign creation
- [ ] Test SMS sending (once A2P approved)
- [ ] Test email sending
- [ ] Test Zapier integration
- [ ] Test AI reply generation

### Within First Week
- [ ] Monitor error logs
- [ ] Check Twilio usage/billing
- [ ] Verify A2P 10DLC approval status
- [ ] Test all user flows
- [ ] Update any hardcoded references
- [ ] Set up monitoring/alerts

### Ongoing
- [ ] Monitor Twilio account credits
- [ ] Check Supabase database size
- [ ] Review OpenAI usage
- [ ] Monitor Vercel usage
- [ ] Keep dependencies updated

---

## 15. Important URLs & Endpoints

### Application URLs
- **Production**: https://www.getfivestars.xyz
- **Landing Page**: https://www.getfivestars.xyz
- **Dashboard**: https://www.getfivestars.xyz/dashboard
- **Login**: https://www.getfivestars.xyz/login
- **Signup**: https://www.getfivestars.xyz/signup

### API Endpoints
- **Zapier Review Request**: `POST /api/zapier/review-request`
- **Zapier Campaigns**: `GET /api/zapier/campaigns`
- **OAuth Authorize**: `GET /api/oauth/authorize`
- **OAuth Token**: `POST /api/oauth/token`
- **Twilio Test**: `POST /api/twilio/test`
- **Twilio Status Check**: `GET /api/twilio/check-status`

### External Services
- **Twilio Console**: https://console.twilio.com
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Zapier Platform**: https://platform.zapier.com

---

## 16. Code Repository

### GitHub
- **Repository**: `https://github.com/faizanprofitpilot/FiveStars.git`
- **Branch**: `main` (production)
- **Access**: Transfer repository ownership or fork

### Key Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

---

## 17. Additional Notes

### A2P 10DLC Approval
- **Status**: Currently "In progress"
- **Timeline**: 2-3 weeks for approval
- **Action**: No action needed, will transfer with account
- **Once Approved**: SMS to US numbers will work automatically

### Phone Number Formatting
- Code automatically formats phone numbers to E.164 format
- US numbers: Adds +1 if missing
- International numbers: Must include country code

### Campaign IDs
- Format: 32-character alphanumeric string
- Generated automatically when campaign is created
- Used in Zapier integration
- Can be copied from dashboard

### Review Link
- Currently hardcoded: `https://g.page/r/YOUR_REVIEW_LINK`
- TODO: Make configurable per business
- Location: `lib/zapier/send-review-request.ts` line 75

---

## 18. Contact & Handover

### Previous Owner
- **Email**: (Your email)
- **GitHub**: faizanprofitpilot

### Questions?
If you have any questions during the handover process:
1. Check this document first
2. Review code comments
3. Check troubleshooting guides
4. Contact service providers (Twilio, Supabase, Vercel)

---

## ✅ Final Checklist

Before considering handover complete:

- [ ] All accounts transferred/access granted
- [ ] All environment variables updated
- [ ] All tests passing
- [ ] Documentation reviewed
- [ ] Billing information updated
- [ ] Monitoring set up
- [ ] Support contacts documented
- [ ] New owner can successfully:
  - [ ] Sign up new users
  - [ ] Create campaigns
  - [ ] Send test messages
  - [ ] Use Zapier integration
  - [ ] Generate AI replies

---

**Last Updated**: [Date]
**Version**: 1.0
**Status**: Ready for Handover

