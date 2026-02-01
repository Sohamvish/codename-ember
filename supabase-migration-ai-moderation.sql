-- User Moderation Tracking Table
CREATE TABLE IF NOT EXISTS user_moderation (
    user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
    strike_count INTEGER DEFAULT 0,
    is_banned BOOLEAN DEFAULT false,
    ban_reason TEXT,
    banned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Moderation Logs Table
CREATE TABLE IF NOT EXISTS moderation_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('comment', 'post', 'message')),
    content_id UUID,
    flagged_content TEXT NOT NULL,
    ai_reason TEXT,
    action_taken TEXT NOT NULL CHECK (action_taken IN ('warning', 'ban')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_moderation
DROP POLICY IF EXISTS "Users can view their own moderation status" ON user_moderation;
CREATE POLICY "Users can view their own moderation status"
ON user_moderation FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage moderation" ON user_moderation;
CREATE POLICY "Service role can manage moderation"
ON user_moderation FOR ALL
USING (auth.role() = 'service_role');

-- RLS Policies for moderation_logs
DROP POLICY IF EXISTS "Users can view their own logs" ON moderation_logs;
CREATE POLICY "Users can view their own logs"
ON moderation_logs FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage logs" ON moderation_logs;
CREATE POLICY "Service role can manage logs"
ON moderation_logs FOR ALL
USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_moderation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_moderation
DROP TRIGGER IF EXISTS update_user_moderation_timestamp ON user_moderation;
CREATE TRIGGER update_user_moderation_timestamp
    BEFORE UPDATE ON user_moderation
    FOR EACH ROW
    EXECUTE FUNCTION update_moderation_timestamp();
