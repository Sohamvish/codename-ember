-- Add moderation and ban tracking columns to profiles table

-- Add warning count column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS warning_count INTEGER DEFAULT 0;

-- Add ban status column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;

-- Add ban reason column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS ban_reason TEXT;

-- Add banned timestamp column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS banned_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster ban checks
CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON profiles(is_banned);

-- Add comment
COMMENT ON COLUMN profiles.warning_count IS 'Number of moderation warnings received';
COMMENT ON COLUMN profiles.is_banned IS 'Whether the user account is permanently banned';
COMMENT ON COLUMN profiles.ban_reason IS 'Reason for account ban';
COMMENT ON COLUMN profiles.banned_at IS 'Timestamp when account was banned';
