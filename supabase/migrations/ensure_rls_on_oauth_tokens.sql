-- Ensure RLS is enabled on oauth_tokens table
-- This is CRITICAL for data isolation between users

-- Enable RLS if not already enabled
ALTER TABLE oauth_tokens ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (to recreate with correct syntax)
DROP POLICY IF EXISTS "Users can manage their own OAuth tokens" ON oauth_tokens;

-- Create comprehensive RLS policy for oauth_tokens
-- This ensures users can ONLY see/manage their own OAuth tokens
CREATE POLICY "Users can manage their own OAuth tokens"
  ON oauth_tokens
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add comment
COMMENT ON POLICY "Users can manage their own OAuth tokens" ON oauth_tokens IS 
  'CRITICAL: Ensures users can only access their own OAuth tokens. Prevents cross-user data access.';
