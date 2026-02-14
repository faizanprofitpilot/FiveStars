-- Add UNIQUE constraint to ensure one business per user
-- This prevents users from having multiple businesses, which could cause confusion
-- in the Zapier integration flow

-- First, check if there are any users with multiple businesses
-- If so, we'll need to handle that before adding the constraint

-- Add unique constraint on user_id
-- This ensures each user can only have one business
ALTER TABLE businesses 
ADD CONSTRAINT unique_user_business UNIQUE (user_id);

-- Add comment
COMMENT ON CONSTRAINT unique_user_business ON businesses IS 'Ensures each user has exactly one business, preventing confusion in Zapier integrations';
