-- Add user_id column to scans table
ALTER TABLE public.scans ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view scans" ON public.scans;
DROP POLICY IF EXISTS "Anyone can insert scans" ON public.scans;

-- Create authenticated RLS policies
CREATE POLICY "Users can view own scans" 
ON public.scans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans" 
ON public.scans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own scans
CREATE POLICY "Users can delete own scans" 
ON public.scans 
FOR DELETE 
USING (auth.uid() = user_id);