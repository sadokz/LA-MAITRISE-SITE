-- Create hero_settings table
CREATE TABLE public.hero_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero_media_type VARCHAR(10) NOT NULL DEFAULT 'image' CHECK (hero_media_type IN ('image', 'video')),
  hero_source_type VARCHAR(10) NOT NULL DEFAULT 'upload' CHECK (hero_source_type IN ('upload', 'url')),
  hero_media_url TEXT,
  hero_media_file TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default row
INSERT INTO public.hero_settings (id) VALUES (1);

-- Enable RLS
ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view hero_settings" ON public.hero_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin can update hero_settings" ON public.hero_settings
  FOR UPDATE USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_hero_settings_updated_at
  BEFORE UPDATE ON public.hero_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for hero media
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-media', 'hero-media', true);

-- Storage policies
CREATE POLICY "Anyone can view hero media" ON storage.objects
  FOR SELECT USING (bucket_id = 'hero-media');

CREATE POLICY "Authenticated users can upload hero media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'hero-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update hero media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'hero-media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete hero media" ON storage.objects
  FOR DELETE USING (bucket_id = 'hero-media' AND auth.role() = 'authenticated');