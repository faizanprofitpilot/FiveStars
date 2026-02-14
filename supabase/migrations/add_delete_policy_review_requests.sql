-- Add DELETE policy for review_requests table
-- This allows users to delete review requests for their own campaigns
-- This migration is idempotent - it checks if the policy exists first

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
  ELSE
    RAISE NOTICE 'Policy "Users can delete review requests for their campaigns" already exists, skipping...';
  END IF;
END $$;
