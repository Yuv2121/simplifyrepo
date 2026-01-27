-- Create table for storing repository scans
CREATE TABLE public.scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  repo_name TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Allow public read access for recent scans
CREATE POLICY "Anyone can view scans" 
ON public.scans 
FOR SELECT 
USING (true);

-- Allow public insert for new scans
CREATE POLICY "Anyone can insert scans" 
ON public.scans 
FOR INSERT 
WITH CHECK (true);