-- Add review_link field to businesses table
-- This allows users to configure their Google review link in settings

ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS review_link TEXT;

-- Add comment for documentation
COMMENT ON COLUMN businesses.review_link IS 'Google review link (e.g., https://g.page/r/YOUR_REVIEW_LINK) used in campaign templates';
