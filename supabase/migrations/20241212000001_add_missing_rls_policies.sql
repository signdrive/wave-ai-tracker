
-- Add missing RLS policies for critical tables

-- Enable RLS on tables that don't have it
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fcm_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- AI Predictions policies
CREATE POLICY "Users can view their own predictions" ON ai_predictions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all predictions" ON ai_predictions
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- FCM Tokens policies
CREATE POLICY "Users can manage their own FCM tokens" ON fcm_tokens
  FOR ALL USING (user_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- User Activities policies
CREATE POLICY "Users can view their own activities" ON user_activities
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own activities" ON user_activities
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all activities" ON user_activities
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Fix conflicting RLS policies by removing duplicates
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;

-- Keep only the most restrictive profile policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Add security constraints
ALTER TABLE ai_predictions ADD CONSTRAINT check_confidence_range 
  CHECK (confidence_score >= 0 AND confidence_score <= 1);

ALTER TABLE profiles ADD CONSTRAINT check_reputation_range 
  CHECK (reputation_score >= 0 AND reputation_score <= 1000);
