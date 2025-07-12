-- Insert sample photo contests
INSERT INTO public.photo_contests (title, description, theme, start_date, end_date, voting_end_date, status, prize_description) VALUES
('Winter Waves 2024', 'Capture the raw power and beauty of winter surf sessions', 'Winter Surfing', 
 '2024-12-01 00:00:00+00', '2024-12-31 23:59:59+00', '2025-01-07 23:59:59+00', 
 'active', 'Premium surfboard + $500 gift card'),

('Golden Hour Sessions', 'Show us your best sunrise and sunset surf photography', 'Golden Hour', 
 '2024-11-01 00:00:00+00', '2024-11-30 23:59:59+00', '2024-12-07 23:59:59+00', 
 'voting', 'Photography equipment worth $300'),

('Action Shot Masters', 'Capture the most dynamic surf action shots', 'Action Photography', 
 '2025-01-01 00:00:00+00', '2025-01-31 23:59:59+00', '2025-02-07 23:59:59+00', 
 'upcoming', 'GoPro HERO12 Black + accessories');

-- Insert sample user achievements
INSERT INTO public.user_achievements_detailed (
    user_id, achievement_type, achievement_name, achievement_description, 
    category, icon, rarity, unlock_criteria, progress_current, progress_required, 
    is_unlocked, points_awarded
) 
SELECT 
    profiles.id,
    'first_session',
    'First Wave',
    'Log your very first surf session',
    'sessions',
    '🌊',
    'common',
    '{"sessions_logged": 1}',
    1,
    1,
    true,
    50
FROM profiles 
WHERE profiles.user_type = 'student' 
LIMIT 1;

-- Insert more sample achievements for all users
DO $$ 
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT id FROM profiles LOOP
        -- Dawn Patrol achievement
        INSERT INTO public.user_achievements_detailed (
            user_id, achievement_type, achievement_name, achievement_description,
            category, icon, rarity, unlock_criteria, progress_current, progress_required,
            is_unlocked, points_awarded
        ) VALUES (
            user_record.id, 'dawn_patrol', 'Early Bird', 'Complete a surf session before 7 AM',
            'sessions', '🌅', 'rare', '{"early_sessions": 1}', 0, 1, false, 100
        );

        -- Explorer achievement
        INSERT INTO public.user_achievements_detailed (
            user_id, achievement_type, achievement_name, achievement_description,
            category, icon, rarity, unlock_criteria, progress_current, progress_required,
            is_unlocked, points_awarded
        ) VALUES (
            user_record.id, 'explorer', 'Spot Explorer', 'Visit 5 different surf spots',
            'exploration', '🗺️', 'rare', '{"unique_spots": 5}', 2, 5, false, 200
        );

        -- Social achievement
        INSERT INTO public.user_achievements_detailed (
            user_id, achievement_type, achievement_name, achievement_description,
            category, icon, rarity, unlock_criteria, progress_current, progress_required,
            is_unlocked, points_awarded
        ) VALUES (
            user_record.id, 'social_butterfly', 'Community Member', 'Share 10 session posts',
            'social', '🦋', 'common', '{"session_posts": 10}', 0, 10, false, 75
        );
    END LOOP;
END $$;

-- Create a function to update leaderboard rankings automatically
CREATE OR REPLACE FUNCTION update_leaderboard_rankings()
RETURNS void AS $$
DECLARE
    lb_record RECORD;
BEGIN
    -- Update rankings for each leaderboard
    FOR lb_record IN SELECT id FROM leaderboards WHERE is_active = true LOOP
        -- Update ranks based on score
        WITH ranked_entries AS (
            SELECT 
                id,
                ROW_NUMBER() OVER (ORDER BY score DESC) as new_rank
            FROM leaderboard_entries 
            WHERE leaderboard_id = lb_record.id
        )
        UPDATE leaderboard_entries le
        SET rank = re.new_rank
        FROM ranked_entries re
        WHERE le.id = re.id
        AND le.leaderboard_id = lb_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Schedule leaderboard updates (would be called by a cron job in production)
SELECT update_leaderboard_rankings();