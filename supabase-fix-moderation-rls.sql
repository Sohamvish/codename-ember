-- Fix RLS policies for moderation tables

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own moderation status" ON user_moderation;
DROP POLICY IF EXISTS "Service role can manage moderation" ON user_moderation;
DROP POLICY IF EXISTS "Users can view their own logs" ON moderation_logs;
DROP POLICY IF EXISTS "Service role can manage logs" ON moderation_logs;

-- User Moderation Table Policies
CREATE POLICY "Users can view their own moderation status"
ON user_moderation FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own moderation record"
ON user_moderation FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own moderation record"
ON user_moderation FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Moderation Logs Policies
CREATE POLICY "Users can view their own logs"
ON moderation_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
ON moderation_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Service role can do everything (for admin purposes)
CREATE POLICY "Service role can manage moderation"
ON user_moderation FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage logs"
ON moderation_logs FOR ALL
USING (auth.role() = 'service_role');
