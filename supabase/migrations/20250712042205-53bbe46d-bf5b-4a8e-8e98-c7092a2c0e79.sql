-- Create photo contest system
CREATE TABLE public.photo_contests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    theme text,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    voting_end_date timestamp with time zone NOT NULL,
    status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'voting', 'completed')),
    max_entries_per_user integer DEFAULT 3,
    prize_description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create photo contest entries
CREATE TABLE public.photo_contest_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    contest_id uuid REFERENCES public.photo_contests(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    photo_url text NOT NULL,
    title text NOT NULL,
    description text,
    location text,
    taken_at timestamp with time zone,
    vote_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(contest_id, user_id, photo_url)
);

-- Create photo contest votes
CREATE TABLE public.photo_contest_votes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id uuid REFERENCES public.photo_contest_entries(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(entry_id, user_id)
);

-- Create leaderboards table
CREATE TABLE public.leaderboards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    category text NOT NULL, -- 'global', 'local', 'spot_specific'
    location text, -- for local/spot leaderboards
    spot_id text, -- for spot-specific leaderboards
    metric text NOT NULL, -- 'total_points', 'sessions_count', 'streak_days', 'wave_count'
    time_period text DEFAULT 'all_time' CHECK (time_period IN ('all_time', 'yearly', 'monthly', 'weekly')),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create leaderboard entries
CREATE TABLE public.leaderboard_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    leaderboard_id uuid REFERENCES public.leaderboards(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    score numeric NOT NULL,
    rank integer,
    period_start timestamp with time zone,
    period_end timestamp with time zone,
    last_updated timestamp with time zone DEFAULT now(),
    UNIQUE(leaderboard_id, user_id, period_start)
);

-- Create achievement types
CREATE TYPE achievement_category AS ENUM ('sessions', 'streaks', 'exploration', 'social', 'challenges', 'special');

-- Expand user achievements with more details
CREATE TABLE public.user_achievements_detailed (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    achievement_type text NOT NULL,
    achievement_name text NOT NULL,
    achievement_description text,
    category achievement_category NOT NULL,
    icon text,
    badge_color text DEFAULT '#FFD700',
    unlock_criteria jsonb,
    progress_current integer DEFAULT 0,
    progress_required integer,
    is_unlocked boolean DEFAULT false,
    unlocked_at timestamp with time zone,
    rarity text DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    points_awarded integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enhance challenges with more gamification features
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard', 'extreme'));
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS category text DEFAULT 'general';
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS start_date timestamp with time zone;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS end_date timestamp with time zone;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS max_participants integer;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS current_participants integer DEFAULT 0;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- Create challenge leaderboard for competitive challenges
CREATE TABLE public.challenge_leaderboard (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id uuid REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    score numeric NOT NULL,
    rank integer,
    progress_data jsonb,
    last_updated timestamp with time zone DEFAULT now(),
    UNIQUE(challenge_id, user_id)
);

-- Enable RLS on new tables
ALTER TABLE public.photo_contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_contest_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_contest_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements_detailed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_leaderboard ENABLE ROW LEVEL SECURITY;

-- RLS Policies for photo contests
CREATE POLICY "Photo contests are viewable by everyone" ON public.photo_contests
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage photo contests" ON public.photo_contests
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for photo contest entries
CREATE POLICY "Contest entries are viewable by everyone" ON public.photo_contest_entries
    FOR SELECT USING (true);

CREATE POLICY "Users can submit their own entries" ON public.photo_contest_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" ON public.photo_contest_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" ON public.photo_contest_entries
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for photo contest votes
CREATE POLICY "Contest votes are viewable by everyone" ON public.photo_contest_votes
    FOR SELECT USING (true);

CREATE POLICY "Users can vote on contest entries" ON public.photo_contest_votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own votes" ON public.photo_contest_votes
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for leaderboards
CREATE POLICY "Leaderboards are viewable by everyone" ON public.leaderboards
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage leaderboards" ON public.leaderboards
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for leaderboard entries
CREATE POLICY "Leaderboard entries are viewable by everyone" ON public.leaderboard_entries
    FOR SELECT USING (true);

CREATE POLICY "System can manage leaderboard entries" ON public.leaderboard_entries
    FOR ALL USING (true);

-- RLS Policies for user achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements_detailed
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage user achievements" ON public.user_achievements_detailed
    FOR ALL USING (true);

-- RLS Policies for challenge leaderboard
CREATE POLICY "Challenge leaderboard is viewable by everyone" ON public.challenge_leaderboard
    FOR SELECT USING (true);

CREATE POLICY "System can manage challenge leaderboard" ON public.challenge_leaderboard
    FOR ALL USING (true);

-- Create triggers for vote counting
CREATE OR REPLACE FUNCTION update_photo_contest_vote_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.photo_contest_entries 
        SET vote_count = vote_count + 1 
        WHERE id = NEW.entry_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.photo_contest_entries 
        SET vote_count = vote_count - 1 
        WHERE id = OLD.entry_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_photo_vote_count_trigger
    AFTER INSERT OR DELETE ON public.photo_contest_votes
    FOR EACH ROW EXECUTE FUNCTION update_photo_contest_vote_count();

-- Create trigger for challenge participant counting
CREATE OR REPLACE FUNCTION update_challenge_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.challenges 
        SET current_participants = current_participants + 1 
        WHERE id = NEW.challenge_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.challenges 
        SET current_participants = current_participants - 1 
        WHERE id = OLD.challenge_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_challenge_participant_count_trigger
    AFTER INSERT OR DELETE ON public.user_challenge_progress
    FOR EACH ROW EXECUTE FUNCTION update_challenge_participant_count();

-- Create function to calculate user level from points
CREATE OR REPLACE FUNCTION calculate_user_level(points integer)
RETURNS integer AS $$
BEGIN
    -- Level progression: 0-99: Level 1, 100-299: Level 2, 300-599: Level 3, etc.
    -- Formula: Level = floor(sqrt(points/50)) + 1
    RETURN GREATEST(1, FLOOR(SQRT(points::float / 50.0)) + 1);
END;
$$ LANGUAGE plpgsql;

-- Create update triggers for timestamps
CREATE TRIGGER update_photo_contests_updated_at
    BEFORE UPDATE ON public.photo_contests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leaderboards_updated_at
    BEFORE UPDATE ON public.leaderboards
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_achievements_detailed_updated_at
    BEFORE UPDATE ON public.user_achievements_detailed
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample challenges
INSERT INTO public.challenges (name, description, type, criteria, reward_points, badge_name, badge_icon, difficulty, category, featured) VALUES
('Dawn Patrol Warrior', 'Complete 5 surf sessions before 7 AM in a week', 'weekly', '{"sessions_before_7am": 5, "time_period": "week"}', 200, 'Early Bird', '🌅', 'medium', 'sessions', true),
('New Spot Explorer', 'Surf at 3 different spots in a month', 'monthly', '{"unique_spots": 3, "time_period": "month"}', 300, 'Explorer', '🗺️', 'easy', 'exploration', true),
('Streak Master', 'Maintain a 7-day surf streak', 'milestone', '{"consecutive_days": 7}', 500, 'Streak Master', '🔥', 'hard', 'streaks', false),
('Century Club', 'Log 100 surf sessions', 'milestone', '{"total_sessions": 100}', 1000, 'Century', '💯', 'extreme', 'sessions', false),
('Social Butterfly', 'Share 10 session posts', 'monthly', '{"session_posts": 10, "time_period": "month"}', 150, 'Social', '🦋', 'easy', 'social', false);

-- Insert sample leaderboards
INSERT INTO public.leaderboards (name, description, category, metric, time_period) VALUES
('Global Points Leaders', 'Top surfers worldwide by total points', 'global', 'total_points', 'all_time'),
('Monthly Session Kings', 'Most sessions logged this month', 'global', 'sessions_count', 'monthly'),
('Weekly Streak Champions', 'Longest streaks this week', 'global', 'streak_days', 'weekly'),
('Malibu Legends', 'Top surfers at Malibu', 'spot_specific', 'total_points', 'all_time');

UPDATE public.leaderboards SET spot_id = 'malibu-ca' WHERE name = 'Malibu Legends';