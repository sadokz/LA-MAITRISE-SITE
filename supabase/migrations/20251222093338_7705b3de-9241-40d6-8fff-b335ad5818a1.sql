-- Create table for section visibility settings
CREATE TABLE public.section_visibility (
  id INTEGER PRIMARY KEY DEFAULT 1,
  home BOOLEAN NOT NULL DEFAULT true,
  about BOOLEAN NOT NULL DEFAULT true,
  skills BOOLEAN NOT NULL DEFAULT true,
  domains BOOLEAN NOT NULL DEFAULT true,
  projects BOOLEAN NOT NULL DEFAULT true,
  founder BOOLEAN NOT NULL DEFAULT true,
  contact BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default row with all sections visible
INSERT INTO public.section_visibility (id) VALUES (1);

-- Enable RLS
ALTER TABLE public.section_visibility ENABLE ROW LEVEL SECURITY;

-- Public can view section visibility
CREATE POLICY "Public can view section_visibility"
ON public.section_visibility
FOR SELECT
USING (true);

-- Admin can update section visibility
CREATE POLICY "Admin can update section_visibility"
ON public.section_visibility
FOR UPDATE
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_section_visibility_updated_at
BEFORE UPDATE ON public.section_visibility
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();