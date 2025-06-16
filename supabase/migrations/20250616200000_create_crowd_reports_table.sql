-- 1. Create the crowd_reports table
CREATE TABLE IF NOT EXISTS public.crowd_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    spot_id TEXT NOT NULL, -- Assuming spot_id is a string identifier used in frontend
    reported_level TEXT NOT NULL CHECK (reported_level IN ('Low', 'Medium', 'High')),
    user_id UUID REFERENCES auth.users(id), -- Can be NULL if anonymous reporting is allowed for MVP (but policy restricts insert to user_id = auth.uid())
    source TEXT DEFAULT 'user_report' NOT NULL -- e.g., 'user_report', 'heuristic_prediction', 'ai_prediction'
);

-- Add comments for clarity
COMMENT ON TABLE public.crowd_reports IS 'Stores user-submitted and system-generated crowd level reports for surf spots.';
COMMENT ON COLUMN public.crowd_reports.spot_id IS 'Identifier for the surf spot, linking to frontend definitions.';
COMMENT ON COLUMN public.crowd_reports.reported_level IS 'Crowd level: Low, Medium, or High.';
COMMENT ON COLUMN public.crowd_reports.user_id IS 'If user-reported, the ID of the authenticated user.';
COMMENT ON COLUMN public.crowd_reports.source IS 'Indicates the origin of the report (user, heuristic, AI).';

-- 2. Add an index for efficient querying of recent reports per spot
CREATE INDEX IF NOT EXISTS idx_crowd_reports_spot_id_created_at
ON public.crowd_reports (spot_id, created_at DESC);

-- 3. Enable RLS (Row Level Security)
ALTER TABLE public.crowd_reports ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Policy: Authenticated users can insert their own reports
CREATE POLICY "Authenticated users can insert crowd reports"
ON public.crowd_reports
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Authenticated users can select crowd reports
-- (Changed from public to authenticated as per internal discussion for MVP)
CREATE POLICY "Authenticated users can select crowd reports"
ON public.crowd_reports
FOR SELECT TO authenticated
USING (true);

-- Grant usage on the public schema and select on the new table to the authenticated role.
-- Supabase typically handles default grants, but explicitly stating them can be good.
-- Make sure anon role does not have unnecessary permissions.
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON TABLE public.crowd_reports TO authenticated;

-- For RLS to work, the user must have select permission on the table,
-- and then the policies further restrict what rows can be accessed.
-- The anon role should not be able to insert. If anon can read, the select policy would be `TO anon, authenticated`.
-- For now, keeping SELECT to `authenticated` only.

-- Note: uuid_generate_v4() requires the pgcrypto extension.
-- Supabase projects usually have this enabled by default.
-- If not, `CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;` might be needed,
-- but it's better to ensure it's enabled in the Supabase dashboard under Database > Extensions.
-- For this script, assume pgcrypto is available.

-- Also, ensure the `auth.users` table is accessible for the foreign key reference.
-- This is standard in Supabase.
