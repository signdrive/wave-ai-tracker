-- Enable RLS on spatial_ref_sys PostGIS system table
ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

-- Create read-only policy for authenticated users to access spatial reference data
-- This data is needed for geographic coordinate system transformations
CREATE POLICY "spatial_ref_sys_read_authenticated" 
ON public.spatial_ref_sys 
FOR SELECT 
TO authenticated 
USING (true);

-- Note: We only allow SELECT operations as spatial_ref_sys is a reference table
-- that should not be modified by application users