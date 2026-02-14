-- Create zapier_contacts table to store contacts fetched from Zapier
-- This ensures each contact is associated with the user/business that fetched it

CREATE TABLE IF NOT EXISTS zapier_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  source_data JSONB, -- Store any additional data from Zapier
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_zapier_contacts_user_id ON zapier_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_zapier_contacts_business_id ON zapier_contacts(business_id);
CREATE INDEX IF NOT EXISTS idx_zapier_contacts_phone ON zapier_contacts(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zapier_contacts_email ON zapier_contacts(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_zapier_contacts_created_at ON zapier_contacts(created_at);

-- Partial unique indexes to ensure one contact per phone/email per business
-- Only applies when phone/email is NOT NULL
CREATE UNIQUE INDEX IF NOT EXISTS idx_zapier_contacts_unique_phone 
  ON zapier_contacts(business_id, phone) 
  WHERE phone IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_zapier_contacts_unique_email 
  ON zapier_contacts(business_id, email) 
  WHERE email IS NOT NULL;

-- Add comment
COMMENT ON TABLE zapier_contacts IS 'Stores contacts fetched from Zapier, associated with the user/business that fetched them';

-- Enable Row Level Security
ALTER TABLE zapier_contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own contacts
-- All policies are idempotent - they check if they exist first

-- SELECT policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'zapier_contacts' 
    AND policyname = 'Users can view their own zapier contacts'
  ) THEN
    CREATE POLICY "Users can view their own zapier contacts"
      ON zapier_contacts FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- INSERT policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'zapier_contacts' 
    AND policyname = 'Users can insert their own zapier contacts'
  ) THEN
    CREATE POLICY "Users can insert their own zapier contacts"
      ON zapier_contacts FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- UPDATE policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'zapier_contacts' 
    AND policyname = 'Users can update their own zapier contacts'
  ) THEN
    CREATE POLICY "Users can update their own zapier contacts"
      ON zapier_contacts FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- DELETE policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'zapier_contacts' 
    AND policyname = 'Users can delete their own zapier contacts'
  ) THEN
    CREATE POLICY "Users can delete their own zapier contacts"
      ON zapier_contacts FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;
