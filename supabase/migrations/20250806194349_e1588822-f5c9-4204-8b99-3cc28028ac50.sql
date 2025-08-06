-- Fix remaining critical security issues

-- 1. Enable RLS on tables that don't have it (from linter errors)
ALTER TABLE geography_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE geometry_columns ENABLE ROW LEVEL SECURITY;

-- Add basic policies for these system tables
CREATE POLICY "geography_columns_read_only" ON geography_columns
  FOR SELECT USING (true);

CREATE POLICY "geometry_columns_read_only" ON geometry_columns
  FOR SELECT USING (true);

-- 2. Fix remaining functions with missing search_path
CREATE OR REPLACE FUNCTION public.update_app_settings_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_session_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_stats_on_achievement()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
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
$$;

CREATE OR REPLACE FUNCTION public.update_user_reputation(user_id uuid, reputation_change integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.profiles 
    SET 
        reputation_score = GREATEST(0, LEAST(1000, reputation_score + reputation_change)),
        updated_at = NOW()
    WHERE id = user_id;
    
    INSERT INTO public.user_activities (user_id, activity_type, activity_data)
    VALUES (
        user_id,
        'reputation_change',
        jsonb_build_object('change', reputation_change, 'timestamp', NOW())
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.update_session_post_like_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.get_user_stats(user_id uuid)
RETURNS TABLE(total_reports integer, successful_reports integer, reputation_score integer, avg_spot_rating numeric, total_reviews integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.create_ai_prediction(pred_lat numeric, pred_lng numeric, pred_type text, pred_data jsonb, confidence numeric, valid_hours integer DEFAULT 24)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    prediction_id UUID;
BEGIN
    INSERT INTO public.ai_predictions (
        latitude,
        longitude,
        prediction_type,
        prediction_data,
        confidence_score,
        valid_until
    ) VALUES (
        pred_lat,
        pred_lng,
        pred_type,
        pred_data,
        confidence,
        NOW() + (valid_hours || ' hours')::INTERVAL
    ) RETURNING id INTO prediction_id;
    
    RETURN prediction_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_session_post_comment_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.update_spot_confidence()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    spot_confidence INTEGER;
    report_count INTEGER;
    positive_reports INTEGER;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(CASE WHEN report_type IN ('available', 'taken') THEN 1 END)
    INTO report_count, positive_reports
    FROM public.spot_reports
    WHERE spot_id = NEW.spot_id;
    
    IF report_count > 0 THEN
        spot_confidence := LEAST(100, GREATEST(0, 
            50 + (positive_reports * 50 / report_count) - 
            ((report_count - positive_reports) * 25)
        ));
    ELSE
        spot_confidence := 100;
    END IF;
    
    UPDATE public.parking_spots
    SET 
        confidence_score = spot_confidence,
        updated_at = NOW()
    WHERE id = NEW.spot_id;
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_inactive_user_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    user_record RECORD;
BEGIN
  FOR user_record IN
    SELECT id FROM auth.users
    WHERE last_sign_in_at IS NOT NULL AND last_sign_in_at < (now() - interval '2 years')
  LOOP
    DELETE FROM auth.users WHERE id = user_record.id;
    RAISE LOG 'Deleted inactive user %', user_record.id;
  END LOOP;
END;
$$;