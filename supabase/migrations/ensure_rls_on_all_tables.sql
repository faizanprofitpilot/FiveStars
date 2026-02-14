-- CRITICAL: Ensure RLS is enabled on ALL tables that contain user data
-- This prevents users from seeing each other's data

-- Enable RLS on all user data tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_authorization_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE zapier_contacts ENABLE ROW LEVEL SECURITY;

-- Verify RLS policies exist for review_requests
-- If they don't exist, create them

-- Review requests SELECT policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'review_requests' 
    AND policyname = 'Users can view review requests for their campaigns'
  ) THEN
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
  END IF;
END $$;

-- Review requests INSERT policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'review_requests' 
    AND policyname = 'Users can insert review requests for their campaigns'
  ) THEN
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
  END IF;
END $$;

-- Review requests DELETE policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'review_requests' 
    AND policyname = 'Users can delete review requests for their campaigns'
  ) THEN
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
  END IF;
END $$;

-- Add comments for documentation
COMMENT ON TABLE review_requests IS 'RLS enabled - users can only see their own review requests through their campaigns';
COMMENT ON TABLE oauth_tokens IS 'RLS enabled - users can only see their own OAuth tokens';
