-- Fix Critical Security Issues

-- Fix overly permissive profiles policies
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Mentors can be viewed by authenticated users" ON public.profiles;

-- Create secure policies for profiles table
-- Users can only view their own full profile
CREATE POLICY "Users view complete own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Public view for mentor profiles (still exposes all fields - see note below)
CREATE POLICY "Public mentor profiles visible"
ON public.profiles
FOR SELECT
USING (
  user_type = 'mentor' AND 
  auth.role() = 'authenticated' AND
  auth.uid() != id
);

-- Enable RLS on surf_sessions table (currently missing RLS)
ALTER TABLE public.surf_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own surf sessions"
ON public.surf_sessions
FOR ALL
USING (auth.uid() = user_id);

-- Fix SECURITY DEFINER functions missing search_path
ALTER FUNCTION public.has_role(_user_id uuid, _role app_role) SET search_path = public;
ALTER FUNCTION public.update_app_settings_timestamp() SET search_path = public;
ALTER FUNCTION public.update_session_timestamp() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

-- Create a secure public view for mentor profiles with limited fields
-- This view should be used instead of querying profiles directly
CREATE OR REPLACE VIEW public.public_mentor_profiles AS
SELECT 
  id,
  username,
  avatar_url,
  bio,
  certification_level,
  years_experience,
  hourly_rate,
  reputation_score,
  user_type
FROM public.profiles
WHERE user_type = 'mentor';

-- Grant SELECT permission on the view to authenticated users
GRANT SELECT ON public.public_mentor_profiles TO authenticated;

-- Add comment about security improvements needed
COMMENT ON TABLE public.profiles IS 'SECURITY NOTE: Email field should be removed from this table as it duplicates auth.users. For production, use public_mentor_profiles view for public mentor data instead of direct profile access.';