
-- Function to update 'updated_at' timestamp on row updates
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a table to store user GDPR consents
CREATE TABLE public.gdpr_consents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL, -- e.g., 'marketing_emails', 'analytics_tracking'
  is_granted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, consent_type)
);
COMMENT ON TABLE public.gdpr_consents IS 'Stores user consent for various GDPR-related data processing activities.';

-- Add a trigger to update the 'updated_at' column on update
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.gdpr_consents
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();

-- Enable Row-Level Security for the consents table
ALTER TABLE public.gdpr_consents ENABLE ROW LEVEL SECURITY;

-- Policies for gdpr_consents
CREATE POLICY "Users can view their own consents"
  ON public.gdpr_consents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consents"
  ON public.gdpr_consents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consents"
  ON public.gdpr_consents FOR UPDATE
  USING (auth.uid() = user_id);

-- Create a table for data access/deletion requests
CREATE TABLE public.data_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('access', 'deletion')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'denied')),
  notes TEXT, -- For admin notes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);
COMMENT ON TABLE public.data_requests IS 'Logs and manages user requests for data access or deletion as per GDPR.';

-- Enable Row-Level Security for the data requests table
ALTER TABLE public.data_requests ENABLE ROW LEVEL SECURITY;

-- Policies for data_requests
CREATE POLICY "Users can view and create their own data requests"
  ON public.data_requests FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all data requests"
  ON public.data_requests FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Function to delete data for users inactive for over 2 years
CREATE OR REPLACE FUNCTION public.delete_inactive_user_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;
COMMENT ON FUNCTION public.delete_inactive_user_data() IS 'Deletes users and their associated data if they have been inactive for more than 2 years. To be run by a cron job.';
