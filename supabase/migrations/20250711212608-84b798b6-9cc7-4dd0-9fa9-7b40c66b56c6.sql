-- Create challenges table
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly', 'milestone')),
  criteria JSONB NOT NULL, -- Contains requirements like session_count, streak_days, etc.
  reward_points INTEGER DEFAULT 100,
  badge_name TEXT,
  badge_icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user challenge progress table
CREATE TABLE public.user_challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  progress_data JSONB NOT NULL DEFAULT '{}', -- Contains current progress
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  points_earned INTEGER DEFAULT 0,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Create user stats table for tracking overall progress
CREATE TABLE public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  total_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  achievements_count INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for challenges (public read)
CREATE POLICY "Anyone can view active challenges"
  ON public.challenges FOR SELECT
  USING (is_active = true);

-- RLS Policies for user challenge progress (user owns data)
CREATE POLICY "Users can view their own challenge progress"
  ON public.user_challenge_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenge progress"
  ON public.user_challenge_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenge progress"
  ON public.user_challenge_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user achievements (user owns data)
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user stats (user owns data)
CREATE POLICY "Users can view their own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Insert some default challenges
INSERT INTO public.challenges (name, description, type, criteria, reward_points, badge_name, badge_icon) VALUES
('Dawn Patrol Warrior', 'Complete 5 surf sessions before 7 AM', 'milestone', '{"session_count": 5, "time_before": "07:00"}', 200, 'Dawn Patrol', '🌅'),
('Wave Hunter', 'Log 10 surf sessions in a month', 'monthly', '{"session_count": 10}', 150, 'Wave Hunter', '🏄‍♂️'),
('Streak Master', 'Surf 7 days in a row', 'milestone', '{"consecutive_days": 7}', 300, 'Streak Master', '🔥'),
('New Explorer', 'Surf at 5 different spots', 'milestone', '{"unique_spots": 5}', 250, 'Explorer', '🗺️'),
('Daily Rider', 'Complete a surf session today', 'daily', '{"session_count": 1}', 50, 'Daily Rider', '⚡'),
('Weekend Warrior', 'Surf both Saturday and Sunday', 'weekly', '{"weekend_sessions": 2}', 100, 'Weekend Warrior', '🏖️'),
('Session Logger', 'Log your first surf session', 'milestone', '{"session_count": 1}', 100, 'First Session', '📝'),
('Veteran Surfer', 'Complete 50 total surf sessions', 'milestone', '{"total_sessions": 50}', 500, 'Veteran', '🏆');

-- Create function to update user stats when achievements are earned
CREATE OR REPLACE FUNCTION update_user_stats_on_achievement()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for updating user stats
CREATE TRIGGER trigger_update_user_stats
  AFTER INSERT ON public.user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_on_achievement();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_challenge_progress_updated_at
  BEFORE UPDATE ON public.user_challenge_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();