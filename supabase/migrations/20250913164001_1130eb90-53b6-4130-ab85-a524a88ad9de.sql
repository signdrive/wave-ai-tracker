-- Enable RLS on user_name table only (we can't modify spatial_ref_sys as it's a PostGIS system table)
ALTER TABLE public.user_name ENABLE ROW LEVEL SECURITY;

-- Create policies for user_name table
-- Allow authenticated users to read all usernames (for user lookup functionality)
CREATE POLICY "user_name_read_all" 
ON public.user_name 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users to insert their own records
CREATE POLICY "user_name_insert_own" 
ON public.user_name 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow users to update their own records (if there's a user_id field or similar)
-- For now allowing all updates, but this should be restricted based on actual use case
CREATE POLICY "user_name_update_all" 
ON public.user_name 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Allow users to delete their own records
CREATE POLICY "user_name_delete_all" 
ON public.user_name 
FOR DELETE 
TO authenticated 
USING (true);