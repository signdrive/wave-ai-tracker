-- Phase 1: Critical Database Security Fixes

-- 1. Fix nullable user_id columns and add proper constraints
ALTER TABLE alert_preferences ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE api_keys ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE buddy_requests ALTER COLUMN requester_id SET NOT NULL;
ALTER TABLE buddy_requests ALTER COLUMN requested_id SET NOT NULL;
ALTER TABLE challenge_leaderboard ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE crowd_reports ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE data_requests ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE fcm_tokens ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE gdpr_consents ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE group_members ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE leaderboard_entries ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE lesson_bookings ALTER COLUMN student_id SET NOT NULL;
ALTER TABLE marketplace_listings ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE notification_preferences ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE session_comments ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE session_likes ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE session_posts ALTER COLUMN user_id SET NOT NULL;

-- 2. Secure existing database functions by adding search_path protection
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'mentor' THEN 2
      WHEN 'student' THEN 3
    END
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 3. Remove conflicting API keys policies and create secure ones
DROP POLICY IF EXISTS "Admins can manage API keys" ON api_keys;
DROP POLICY IF EXISTS "Only admins can manage API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can delete their own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can insert their own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can update their own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can view their own API keys" ON api_keys;

-- Create secure API keys policies
CREATE POLICY "api_keys_admin_all" ON api_keys
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "api_keys_user_own" ON api_keys
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Tighten overly permissive policies
DROP POLICY IF EXISTS "System can manage challenge leaderboard" ON challenge_leaderboard;
CREATE POLICY "challenge_leaderboard_admin_manage" ON challenge_leaderboard
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "System can manage leaderboard entries" ON leaderboard_entries;
CREATE POLICY "leaderboard_entries_admin_manage" ON leaderboard_entries
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Fix ai_predictions table policies
DROP POLICY IF EXISTS "Service role can manage all predictions" ON ai_predictions;
DROP POLICY IF EXISTS "Service role can manage predictions" ON ai_predictions;

CREATE POLICY "ai_predictions_service_role" ON ai_predictions
  FOR ALL USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- 6. Add security event logging function
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id text,
  p_event_type text,
  p_severity text,
  p_details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.security_events (user_id, event_type, severity, details)
  VALUES (p_user_id, p_event_type, p_severity, p_details);
END;
$$;

-- 7. Add audit trigger for role changes
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_security_event(
      NEW.user_id::text,
      'role_assigned',
      'medium',
      jsonb_build_object('role', NEW.role, 'assigned_at', now())
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_security_event(
      NEW.user_id::text,
      'role_changed',
      'high',
      jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role, 'changed_at', now())
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_security_event(
      OLD.user_id::text,
      'role_removed',
      'high',
      jsonb_build_object('role', OLD.role, 'removed_at', now())
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create audit trigger for user_roles table
DROP TRIGGER IF EXISTS audit_role_changes_trigger ON user_roles;
CREATE TRIGGER audit_role_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_role_changes();