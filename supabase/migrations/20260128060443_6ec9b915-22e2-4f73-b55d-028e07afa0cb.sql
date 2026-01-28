-- Add UPDATE policy for defense in depth
CREATE POLICY "Users can update own scans" 
ON public.scans 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);