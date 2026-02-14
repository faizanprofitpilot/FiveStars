-- FiveStars Database Schema (Idempotent Version)
-- This schema can be run multiple times safely

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing policies first (if any)
DROP POLICY IF EXISTS "Users can view their own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can insert their own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can update their own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can view campaigns for their businesses" ON campaigns;
DROP POLICY IF EXISTS "Users can insert campaigns for their businesses" ON campaigns;
DROP POLICY IF EXISTS "Users can update campaigns for their businesses" ON campaigns;
DROP POLICY IF EXISTS "Users can delete campaigns for their businesses" ON campaigns;
DROP POLICY IF EXISTS "Users can view review requests for their campaigns" ON review_requests;
DROP POLICY IF EXISTS "Users can insert review requests for their campaigns" ON review_requests;
DROP POLICY IF EXISTS "Users can view review replies for their businesses" ON review_replies;
DROP POLICY IF EXISTS "Users can insert review replies for their businesses" ON review_replies;

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;

-- Drop existing function (will recreate)
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  google_profile_url TEXT,
  context_document TEXT,
  review_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  primary_channel TEXT NOT NULL CHECK (primary_channel IN ('sms', 'email', 'none')),
  secondary_channel TEXT CHECK (secondary_channel IN ('sms', 'email', 'none')),
  primary_template TEXT NOT NULL,
  followup_template TEXT,
  followup_enabled BOOLEAN DEFAULT false,
  followup_delay INTEGER CHECK (followup_delay >= 1 AND followup_delay <= 30),
  campaign_id TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Review requests table
CREATE TABLE IF NOT EXISTS review_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  customer_first_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  primary_sent BOOLEAN DEFAULT false,
  secondary_sent BOOLEAN DEFAULT false,
  followup_sent BOOLEAN DEFAULT false,
  primary_channel TEXT,
  secondary_channel TEXT,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Review replies table
CREATE TABLE IF NOT EXISTS review_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  review_text TEXT NOT NULL,
  generated_reply TEXT NOT NULL,
  tone TEXT NOT NULL CHECK (tone IN ('professional', 'friendly', 'apology', 'short')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- OAuth tokens table for Zapier and other OAuth integrations
CREATE TABLE IF NOT EXISTS oauth_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL UNIQUE,
  refresh_token TEXT UNIQUE,
  token_type TEXT DEFAULT 'Bearer',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  scope TEXT,
  client_id TEXT, -- For tracking which app (e.g., 'zapier')
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- OAuth authorization codes (temporary, deleted after use)
CREATE TABLE IF NOT EXISTS oauth_authorization_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  redirect_uri TEXT NOT NULL,
  scope TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Drop existing indexes if they exist (will recreate)
DROP INDEX IF EXISTS idx_businesses_user_id;
DROP INDEX IF EXISTS idx_campaigns_business_id;
DROP INDEX IF EXISTS idx_campaigns_campaign_id;
DROP INDEX IF EXISTS idx_review_requests_campaign_id;
DROP INDEX IF EXISTS idx_review_requests_sent_at;
DROP INDEX IF EXISTS idx_review_replies_business_id;
DROP INDEX IF EXISTS idx_review_replies_created_at;
DROP INDEX IF EXISTS idx_oauth_tokens_user_id;
DROP INDEX IF EXISTS idx_oauth_tokens_access_token;
DROP INDEX IF EXISTS idx_oauth_tokens_refresh_token;
DROP INDEX IF EXISTS idx_oauth_authorization_codes_code;
DROP INDEX IF EXISTS idx_oauth_authorization_codes_user_id;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_business_id ON campaigns(business_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_campaign_id ON campaigns(campaign_id);
CREATE INDEX IF NOT EXISTS idx_review_requests_campaign_id ON review_requests(campaign_id);
CREATE INDEX IF NOT EXISTS idx_review_requests_sent_at ON review_requests(sent_at);
CREATE INDEX IF NOT EXISTS idx_review_replies_business_id ON review_replies(business_id);
CREATE INDEX IF NOT EXISTS idx_review_replies_created_at ON review_replies(created_at);
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_user_id ON oauth_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_access_token ON oauth_tokens(access_token);
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_refresh_token ON oauth_tokens(refresh_token);
CREATE INDEX IF NOT EXISTS idx_oauth_authorization_codes_code ON oauth_authorization_codes(code);
CREATE INDEX IF NOT EXISTS idx_oauth_authorization_codes_user_id ON oauth_authorization_codes(user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_authorization_codes ENABLE ROW LEVEL SECURITY;

-- Businesses policies
CREATE POLICY "Users can view their own businesses"
  ON businesses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own businesses"
  ON businesses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own businesses"
  ON businesses FOR UPDATE
  USING (auth.uid() = user_id);

-- Campaigns policies
CREATE POLICY "Users can view campaigns for their businesses"
  ON campaigns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = campaigns.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert campaigns for their businesses"
  ON campaigns FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = campaigns.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update campaigns for their businesses"
  ON campaigns FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = campaigns.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete campaigns for their businesses"
  ON campaigns FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = campaigns.business_id
      AND businesses.user_id = auth.uid()
    )
  );

-- Review requests policies
CREATE POLICY "Users can view review requests for their campaigns"
  ON review_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      JOIN businesses ON businesses.id = campaigns.business_id
      WHERE campaigns.id = review_requests.campaign_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert review requests for their campaigns"
  ON review_requests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      JOIN businesses ON businesses.id = campaigns.business_id
      WHERE campaigns.id = review_requests.campaign_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete review requests for their campaigns"
  ON review_requests FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      JOIN businesses ON businesses.id = campaigns.business_id
      WHERE campaigns.id = review_requests.campaign_id
      AND businesses.user_id = auth.uid()
    )
  );

-- Review replies policies
CREATE POLICY "Users can view review replies for their businesses"
  ON review_replies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = review_replies.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert review replies for their businesses"
  ON review_replies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = review_replies.business_id
      AND businesses.user_id = auth.uid()
    )
  );

-- OAuth tokens policies
DROP POLICY IF EXISTS "Users can manage their own OAuth tokens" ON oauth_tokens;
CREATE POLICY "Users can manage their own OAuth tokens"
  ON oauth_tokens
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- OAuth authorization codes policies
DROP POLICY IF EXISTS "Users can manage their own authorization codes" ON oauth_authorization_codes;
CREATE POLICY "Users can manage their own authorization codes"
  ON oauth_authorization_codes
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
