# Zapier Test Account Setup

## Requirements

Zapier requires a test account with the following specifications:

- **Email**: `integration-testing@zapier.com`
- **Password**: Must be changeable by Zapier support staff
- **Account Type**: Non-expiring
- **Features**: All necessary features enabled for testing Zap steps
- **Password Reset**: Must be functional

## Setup Instructions

### Create via Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add user"** → **"Create new user"**
4. Fill in the details:
   - **Email**: `integration-testing@zapier.com`
   - **Password**: Generate a secure password (save it for Zapier)
   - **Auto Confirm User**: ✅ **MUST CHECK THIS** (so no email confirmation is sent)
5. Click **"Create user"**
6. The account is now created and ready to use

**⚠️ Important**: Make sure "Auto Confirm User" is checked, otherwise Supabase will send a confirmation email to `integration-testing@zapier.com` which you don't have access to.

## Post-Creation Steps

### 1. Complete Business Onboarding

The test account needs a business profile:

1. Log in as `integration-testing@zapier.com`
2. Complete the onboarding flow (if not already done)
3. Create a business profile (can use test data)

### 2. Create Test Campaigns

Create at least one campaign for testing:

1. Go to Dashboard → Campaigns
2. Click "Create New Campaign"
3. Fill in:
   - **Campaign Name**: "Zapier Test Campaign"
   - **Primary Channel**: SMS or Email
   - **Template**: Any test template
4. Save the campaign
5. Copy the **Campaign ID** (32-character string) - Zapier will need this

### 3. Verify Password Reset Works

1. Go to `https://www.getfivestars.xyz/forgot-password`
2. Enter `integration-testing@zapier.com`
3. Check email for reset link
4. Verify the reset link works and allows password change

### 4. Provide Credentials to Zapier

Send the following information to Zapier support:

- **Email**: `integration-testing@zapier.com`
- **Password**: [The password you set]
- **Note**: "Password can be reset via the forgot password link at https://www.getfivestars.xyz/forgot-password"

## Important Notes

- ✅ The account should **not expire**
- ✅ Password reset functionality is available at `/forgot-password`
- ✅ All features are enabled (no trial limitations)
- ✅ The account should have at least one campaign for testing
- ✅ Make sure the account can access all Zapier integration features

## Testing the Account

Before providing to Zapier, test:

1. ✅ Login works
2. ✅ Password reset works
3. ✅ Can access dashboard
4. ✅ Can view campaigns
5. ✅ Can see campaign IDs
6. ✅ OAuth flow works (connect via Zapier)

## Troubleshooting

### Account Not Found
- Verify the email is exactly `integration-testing@zapier.com`
- Check Supabase Dashboard → Authentication → Users

### Password Reset Not Working
- Verify email settings in Supabase
- Check that redirect URL is set correctly: `https://www.getfivestars.xyz/reset-password`
- Test the reset flow manually

### OAuth Not Working
- Ensure the account has completed onboarding
- Verify business profile exists
- Check that OAuth endpoints are accessible

