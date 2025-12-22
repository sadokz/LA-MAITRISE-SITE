-- Create table for multiple contact coordinates
CREATE TABLE public.contact_coordinates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR NOT NULL CHECK (type IN ('phone', 'fax', 'email')),
  value TEXT NOT NULL,
  label VARCHAR,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_coordinates ENABLE ROW LEVEL SECURITY;

-- Public can view coordinates
CREATE POLICY "Public can view contact_coordinates"
ON public.contact_coordinates
FOR SELECT
USING (true);

-- Admin can manage coordinates
CREATE POLICY "Admin can insert contact_coordinates"
ON public.contact_coordinates
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admin can update contact_coordinates"
ON public.contact_coordinates
FOR UPDATE
USING (true);

CREATE POLICY "Admin can delete contact_coordinates"
ON public.contact_coordinates
FOR DELETE
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_contact_coordinates_updated_at
BEFORE UPDATE ON public.contact_coordinates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing data from contact_texts
INSERT INTO public.contact_coordinates (type, value, label, position)
SELECT 
  'phone',
  content,
  'Principal',
  0
FROM public.contact_texts
WHERE key = 'phone_value';

INSERT INTO public.contact_coordinates (type, value, label, position)
SELECT 
  'fax',
  content,
  'Principal',
  0
FROM public.contact_texts
WHERE key = 'fax_value';

INSERT INTO public.contact_coordinates (type, value, label, position)
SELECT 
  'email',
  content,
  'Principal',
  0
FROM public.contact_texts
WHERE key = 'email_value';