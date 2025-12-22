-- Add icon_border_color column for custom border color
ALTER TABLE public.domaines
ADD COLUMN icon_border_color VARCHAR(7) DEFAULT NULL;

-- Comment for clarity
COMMENT ON COLUMN public.domaines.icon_border_color IS 'Hex color for the icon border (e.g. #3B82F6)';