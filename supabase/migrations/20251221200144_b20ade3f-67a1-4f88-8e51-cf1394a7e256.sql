-- Add icon fields to domaines table
ALTER TABLE public.domaines 
ADD COLUMN icon_type character varying NOT NULL DEFAULT 'builtin',
ADD COLUMN icon_url text,
ADD COLUMN icon_file text;

-- Add check constraint for icon_type values
ALTER TABLE public.domaines 
ADD CONSTRAINT domaines_icon_type_check 
CHECK (icon_type IN ('builtin', 'url', 'upload'));

-- Create storage bucket for domain icons
INSERT INTO storage.buckets (id, name, public)
VALUES ('domain-icons', 'domain-icons', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for domain icons
CREATE POLICY "Anyone can view domain icons"
ON storage.objects FOR SELECT
USING (bucket_id = 'domain-icons');

CREATE POLICY "Authenticated users can upload domain icons"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'domain-icons' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update domain icons"
ON storage.objects FOR UPDATE
USING (bucket_id = 'domain-icons' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete domain icons"
ON storage.objects FOR DELETE
USING (bucket_id = 'domain-icons' AND auth.role() = 'authenticated');