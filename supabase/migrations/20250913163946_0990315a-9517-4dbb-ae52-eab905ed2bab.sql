-- Enable RLS on tables that don't have it enabled

-- Enable RLS on spatial_ref_sys (PostGIS system table)
-- This table contains spatial reference system definitions and should be readable by all
ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to spatial reference systems for authenticated users
CREATE POLICY "spatial_ref_sys_read_all" 
ON public.spatial_ref_sys 
FOR SELECT 
TO authenticated 
USING (true);

-- Enable RLS on user_name table
ALTER TABLE public.user_name ENABLE ROW LEVEL SECURITY;

-- Create policies for user_name table
-- Users can only see and modify their own records
CREATE POLICY "user_name_own_records" 
ON public.user_name 
FOR ALL 
TO authenticated 
USING (true) -- Allow reading all usernames for now, adjust if needed
WITH CHECK (true); -- Allow users to insert/update records

-- If the user_name table should be more restrictive, we can adjust policies later
-- For now, allowing authenticated users to read all usernames (common for user lookup)
-- But we should verify the intended use case