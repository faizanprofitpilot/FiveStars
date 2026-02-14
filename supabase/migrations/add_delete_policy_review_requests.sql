-- Add DELETE policy for review_requests table
-- This allows users to delete review requests for their own campaigns

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
