
-- Comprehensive Security Fixes Migration
-- This migration addresses all critical security vulnerabilities identified in the security review

-- 1. Drop all conflicting and duplicate RLS policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;
DROP POLICY IF EXISTS "Users can view their own predictions" ON ai_predictions;
DROP POLICY IF EXISTS "Admins can manage all predictions" ON ai_predictions;
DROP POLICY IF EXISTS "Users can manage their own FCM tokens" ON fcm_tokens;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view their own activities" ON user_activities;
DROP POLICY IF EXISTS "Users can create their own activities" ON user_activities;
DROP POLICY IF EXISTS "Admins can view all activities" ON user_activities;

-- 2. Enable RLS on all critical tables
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fcm_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create comprehensive RLS policies for profiles
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4. API Keys policies (admin only for management, users for their own keys)
CREATE POLICY "api_keys_select_own_or_admin" ON api_keys
  FOR SELECT USING (
    user_id = auth.uid() OR 
    has_role(auth.uid(), 'admin')
  );

CREATE POLICY "api_keys_insert_own_or_admin" ON api_keys
  FOR INSERT WITH CHECK (
    user_id = auth.uid() OR 
    has_role(auth.uid(), 'admin')
  );

CREATE POLICY "api_keys_update_admin_only" ON api_keys
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "api_keys_delete_admin_only" ON api_keys
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- 5. AI Predictions policies
CREATE POLICY "ai_predictions_select_authenticated" ON ai_predictions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "ai_predictions_insert_admin" ON ai_predictions
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "ai_predictions_update_admin" ON ai_predictions
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- 6. FCM Tokens policies
CREATE POLICY "fcm_tokens_manage_own" ON fcm_tokens
  FOR ALL USING (user_id = auth.uid());

-- 7. Notifications policies
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "notifications_insert_system" ON notifications
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 8. User Activities policies
CREATE POLICY "user_activities_select_own_or_admin" ON user_activities
  FOR SELECT USING (
    user_id = auth.uid() OR 
    has_role(auth.uid(), 'admin')
  );

CREATE POLICY "user_activities_insert_own" ON user_activities
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- 9. Mentorship Sessions policies
CREATE POLICY "mentorship_sessions_select_participant" ON mentorship_sessions
  FOR SELECT USING (
    student_id = auth.uid() OR 
    mentor_id = auth.uid() OR 
    has_role(auth.uid(), 'admin')
  );

CREATE POLICY "mentorship_sessions_insert_participant" ON mentorship_sessions
  FOR INSERT WITH CHECK (
    student_id = auth.uid() OR 
    mentor_id = auth.uid() OR 
    has_role(auth.uid(), 'admin')
  );

CREATE POLICY "mentorship_sessions_update_participant" ON mentorship_sessions
  FOR UPDATE USING (
    student_id = auth.uid() OR 
    mentor_id = auth.uid() OR 
    has_role(auth.uid(), 'admin')
  );

-- 10. Add security constraints
ALTER TABLE ai_predictions ADD CONSTRAINT check_confidence_range 
  CHECK (confidence_score >= 0 AND confidence_score <= 1);

ALTER TABLE profiles ADD CONSTRAINT check_reputation_range 
  CHECK (reputation_score >= 0 AND reputation_score <= 1000);

-- 11. Add missing columns to user_activities if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_activities' AND column_name = 'user_id') THEN
    ALTER TABLE user_activities ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_activities' AND column_name = 'activity_type') THEN
    ALTER TABLE user_activities ADD COLUMN activity_type TEXT NOT NULL DEFAULT 'general';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_activities' AND column_name = 'activity_data') THEN
    ALTER TABLE user_activities ADD COLUMN activity_data JSONB DEFAULT '{}';
  END IF;
END
$$;

-- 12. Create security events log table
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on security_events
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Only admins can access security events
CREATE POLICY "security_events_admin_only" ON security_events
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- 13. Create rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  action TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier, action, window_start)
);

-- Enable RLS on rate_limits
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Only system can manage rate limits
CREATE POLICY "rate_limits_system_only" ON rate_limits
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- 14. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action ON rate_limits(identifier, action);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON rate_limits(window_start);

-- 15. Create function to clean up old rate limit entries
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM rate_limits 
  WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$;
