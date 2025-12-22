-- Add image management columns to realisations table
ALTER TABLE public.realisations
ADD COLUMN image_mode VARCHAR(10) NOT NULL DEFAULT 'auto',
ADD COLUMN image_file TEXT;

-- Create storage bucket for realisation images
INSERT INTO storage.buckets (id, name, public)
VALUES ('realisation-images', 'realisation-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for realisation images
CREATE POLICY "Anyone can view realisation images"
ON storage.objects FOR SELECT
USING (bucket_id = 'realisation-images');

CREATE POLICY "Admin can upload realisation images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'realisation-images');

CREATE POLICY "Admin can update realisation images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'realisation-images');

CREATE POLICY "Admin can delete realisation images"
ON storage.objects FOR DELETE
USING (bucket_id = 'realisation-images');