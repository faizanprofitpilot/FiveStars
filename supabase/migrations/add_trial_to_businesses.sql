-- Add 7-day trial tracking to businesses

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE;

-- Backfill for existing rows: trial ends 7 days after creation (only if null)
UPDATE businesses
SET trial_ends_at = created_at + INTERVAL '7 days'
WHERE trial_ends_at IS NULL;

