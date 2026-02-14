-- Add UNIQUE constraint to ensure one business per user
-- This prevents users from having multiple businesses, which could cause confusion
-- in the Zapier integration flow
-- 
-- This migration is idempotent - it checks if the constraint exists first

-- Check if constraint exists, if not, add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_user_business' 
    AND conrelid = 'businesses'::regclass
  ) THEN
    ALTER TABLE businesses 
    ADD CONSTRAINT unique_user_business UNIQUE (user_id);
    
    COMMENT ON CONSTRAINT unique_user_business ON businesses IS 
      'Ensures each user has exactly one business, preventing confusion in Zapier integrations';
  ELSE
    RAISE NOTICE 'Constraint unique_user_business already exists, skipping...';
  END IF;
END $$;
