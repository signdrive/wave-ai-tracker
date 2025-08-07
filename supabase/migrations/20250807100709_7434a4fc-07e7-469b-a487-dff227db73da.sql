-- Comprehensive Security Fixes Migration
-- Fix all function search path vulnerabilities and other security issues

-- 1. Fix all functions with mutable search paths
-- Update existing functions to have secure search paths

CREATE OR REPLACE FUNCTION public.update_app_settings_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_session_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_stats_on_achievement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Update user stats when a new achievement is earned
  INSERT INTO public.user_stats (user_id, total_points, achievements_count, level)
  VALUES (NEW.user_id, NEW.points_earned, 1, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_points = user_stats.total_points + NEW.points_earned,
    achievements_count = user_stats.achievements_count + 1,
    level = GREATEST(1, (user_stats.total_points + NEW.points_earned) / 500 + 1),
    updated_at = now();
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_reputation(user_id uuid, reputation_change integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    UPDATE public.profiles 
    SET 
        reputation_score = GREATEST(0, LEAST(1000, reputation_score + reputation_change)),
        updated_at = NOW()
    WHERE id = user_id;
    
    -- Log the reputation change
    INSERT INTO public.user_activities (user_id, activity_type, activity_data)
    VALUES (
        user_id,
        'reputation_change',
        jsonb_build_object('change', reputation_change, 'timestamp', NOW())
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_session_post_like_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.session_posts 
        SET like_count = like_count + 1 
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.session_posts 
        SET like_count = like_count - 1 
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_session_post_comment_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.session_posts 
        SET comment_count = comment_count + 1 
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.session_posts 
        SET comment_count = comment_count - 1 
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_stats(user_id uuid)
RETURNS TABLE(total_reports integer, successful_reports integer, reputation_score integer, avg_spot_rating numeric, total_reviews integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT ps.id)::INTEGER as total_reports,
        COUNT(DISTINCT CASE WHEN sr.report_type = 'available' THEN ps.id END)::INTEGER as successful_reports,
        p.reputation_score,
        COALESCE(AVG(rev.rating), 0) as avg_spot_rating,
        COUNT(DISTINCT rev.id)::INTEGER as total_reviews
    FROM public.profiles p
    LEFT JOIN public.parking_spots ps ON p.id = ps.reported_by
    LEFT JOIN public.spot_reports sr ON ps.id = sr.spot_id
    LEFT JOIN public.spot_reviews rev ON ps.id = rev.spot_id
    WHERE p.id = user_id
    GROUP BY p.id, p.reputation_score;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_ai_prediction(pred_lat numeric, pred_lng numeric, pred_type text, pred_data jsonb, confidence numeric, valid_hours integer DEFAULT 24)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    prediction_id UUID;
BEGIN
    INSERT INTO public.ai_predictions (
        location,
        prediction_type,
        prediction_data,
        confidence_score,
        valid_until
    ) VALUES (
        ST_SetSRID(ST_MakePoint(pred_lng, pred_lat), 4326)::geography,
        pred_type,
        pred_data,
        confidence,
        NOW() + (valid_hours || ' hours')::INTERVAL
    ) RETURNING id INTO prediction_id;
    
    RETURN prediction_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_spot_confidence()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    spot_confidence INTEGER;
    report_count INTEGER;
    positive_reports INTEGER;
BEGIN
    -- Count total reports and positive reports for this spot
    SELECT 
        COUNT(*),
        COUNT(CASE WHEN report_type IN ('available', 'taken') THEN 1 END)
    INTO report_count, positive_reports
    FROM public.spot_reports
    WHERE spot_id = NEW.spot_id;
    
    -- Calculate new confidence score
    IF report_count > 0 THEN
        spot_confidence := LEAST(100, GREATEST(0, 
            50 + (positive_reports * 50 / report_count) - 
            ((report_count - positive_reports) * 25)
        ));
    ELSE
        spot_confidence := 100;
    END IF;
    
    -- Update the parking spot
    UPDATE public.parking_spots
    SET 
        confidence_score = spot_confidence,
        updated_at = NOW()
    WHERE id = NEW.spot_id;
    
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.delete_inactive_user_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    user_record RECORD;
BEGIN
  -- This is a destructive action that hard-deletes users and their data.
  -- The ON DELETE CASCADE on foreign keys will propagate deletions.
  FOR user_record IN
    SELECT id FROM auth.users
    WHERE last_sign_in_at IS NOT NULL AND last_sign_in_at < (now() - interval '2 years')
  LOOP
    -- This direct deletion works because the function is owned by a superuser (like postgres)
    -- and is set with SECURITY DEFINER privileges.
    DELETE FROM auth.users WHERE id = user_record.id;
    RAISE LOG 'Deleted inactive user %', user_record.id;
  END LOOP;
END;
$function$;

-- 2. Create comprehensive RLS policies for all tables
-- First, ensure RLS is enabled on all tables that need it

-- Enable RLS on all tables that don't have it yet
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowd_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fcm_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_contest_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_contest_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_parking_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_recordings ENABLE ROW LEVEL SECURITY;

-- 3. Create security audit table for comprehensive logging
CREATE TABLE IF NOT EXISTS public.security_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    action_type text NOT NULL,
    table_name text,
    record_id text,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "security_audit_admin_only" ON public.security_audit_log
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 4. Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier text NOT NULL,
    action_type text NOT NULL,
    count integer DEFAULT 1,
    window_start timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(identifier, action_type)
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only system can manage rate limits
CREATE POLICY "rate_limits_system_only" ON public.rate_limits
    FOR ALL USING (false);

-- 5. Add security indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON public.security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_audit_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_created_at ON public.security_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON public.rate_limits(identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON public.rate_limits(window_start);

-- 6. Create security functions with proper search paths
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- 7. Add comprehensive audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.security_audit_log (
            user_id, action_type, table_name, record_id, new_values
        ) VALUES (
            auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id::text, row_to_json(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.security_audit_log (
            user_id, action_type, table_name, record_id, old_values, new_values
        ) VALUES (
            auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id::text, row_to_json(OLD), row_to_json(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.security_audit_log (
            user_id, action_type, table_name, record_id, old_values
        ) VALUES (
            auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id::text, row_to_json(OLD)
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$function$;

-- 8. Add audit triggers to sensitive tables
CREATE TRIGGER audit_profiles AFTER INSERT OR UPDATE OR DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_user_roles AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_api_keys AFTER INSERT OR UPDATE OR DELETE ON public.api_keys
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- 9. Clean up any existing insecure policies and recreate them securely
-- Drop and recreate problematic policies

-- Re-create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Secure policies for user_roles
DROP POLICY IF EXISTS "user_roles_admin_manage" ON public.user_roles;
CREATE POLICY "user_roles_admin_manage" ON public.user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "user_roles_view_own" ON public.user_roles;
CREATE POLICY "user_roles_view_own" ON public.user_roles
    FOR SELECT USING (user_id = auth.uid());

-- 10. Add missing app_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'mentor', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;