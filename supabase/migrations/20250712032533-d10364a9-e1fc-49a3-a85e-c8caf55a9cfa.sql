-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  wave_alerts BOOLEAN DEFAULT true,
  crowd_alerts BOOLEAN DEFAULT false,
  challenge_alerts BOOLEAN DEFAULT true,
  daily_forecast BOOLEAN DEFAULT false,
  session_reminders BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notification preferences"
  ON public.notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences"
  ON public.notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences"
  ON public.notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();