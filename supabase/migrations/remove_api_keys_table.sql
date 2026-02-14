-- Remove api_keys table if it exists
-- This table is not part of the current schema and is not used anywhere in the codebase
-- It appears to be from an old feature that was removed

-- Drop the table if it exists
DROP TABLE IF EXISTS api_keys CASCADE;

-- Add comment for documentation
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'api_keys') THEN
    RAISE NOTICE 'api_keys table was found and has been dropped';
  ELSE
    RAISE NOTICE 'api_keys table does not exist, nothing to drop';
  END IF;
END $$;
