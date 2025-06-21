-- 1. Create the surf_sessions table
CREATE TABLE IF NOT EXISTS public.surf_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    session_date TIMESTAMPTZ NOT NULL,
    spot_id TEXT NOT NULL, -- Identifier for the surf spot (e.g., 'spot-pipeline')
    spot_name TEXT,        -- User-friendly name, for convenience (e.g., 'Pipeline, Hawaii')
    rating SMALLINT CHECK (rating >= 1 AND rating <= 5), -- User's rating of the session
    duration_minutes INTEGER CHECK (duration_minutes > 0),
    wave_count INTEGER CHECK (wave_count >= 0),
    notes TEXT,
    conditions_snapshot JSONB -- To store conditions from NOAA API or other sources
);

-- Add comments for clarity
COMMENT ON TABLE public.surf_sessions IS 'Stores user-submitted surf session logs, including a snapshot of conditions.';
COMMENT ON COLUMN public.surf_sessions.user_id IS 'The user who logged this session.';
COMMENT ON COLUMN public.surf_sessions.session_date IS 'Date and time of the surf session.';
COMMENT ON COLUMN public.surf_sessions.spot_id IS 'Identifier for the surf spot, linking to a potential spots definition table.';
COMMENT ON COLUMN public.surf_sessions.spot_name IS 'User-friendly name of the surf spot at the time of logging.';
COMMENT ON COLUMN public.surf_sessions.rating IS 'User rating for the session (1-5 stars).';
COMMENT ON COLUMN public.surf_sessions.duration_minutes IS 'Duration of the session in minutes.';
COMMENT ON COLUMN public.surf_sessions.wave_count IS 'Approximate number of waves caught.';
COMMENT ON COLUMN public.surf_sessions.notes IS 'User personal notes about the session.';
COMMENT ON COLUMN public.surf_sessions.conditions_snapshot IS 'JSONB blob storing weather/ocean conditions at the time of session (e.g., from NOAA).';

-- 2. Indexes
-- Index for efficient querying of a user's sessions, ordered by date
CREATE INDEX IF NOT EXISTS idx_surf_sessions_user_id_session_date
ON public.surf_sessions (user_id, session_date DESC);

-- Index for analyzing user's ratings for specific spots
CREATE INDEX IF NOT EXISTS idx_surf_sessions_user_id_spot_id_rating
ON public.surf_sessions (user_id, spot_id, rating);

-- Optional: GIN index for querying inside JSONB conditions_snapshot
-- This can be added later if performance on JSONB queries becomes an issue.
-- CREATE INDEX IF NOT EXISTS idx_surf_sessions_conditions_snapshot_gin
-- ON public.surf_sessions USING GIN (conditions_snapshot);

-- 3. RLS Policies
ALTER TABLE public.surf_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own surf sessions"
ON public.surf_sessions
FOR ALL -- Applies to SELECT, INSERT, UPDATE, DELETE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure appropriate grants for the authenticated role.
-- Supabase typically handles this, but explicit grants are good practice.
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.surf_sessions TO authenticated;

-- Note: uuid_generate_v4() requires the pgcrypto extension.
-- Assumed to be enabled in Supabase.
-- Foreign key to auth.users(id) is standard in Supabase.
-- The ON DELETE CASCADE ensures that if a user is deleted, their surf sessions are also deleted.
