-- Create contact_messages table for storing contact form submissions
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all messages
CREATE POLICY "Admin can view all contact_messages" 
ON public.contact_messages 
FOR SELECT 
USING (true);

-- Create policy for admins to delete messages
CREATE POLICY "Admin can delete contact_messages" 
ON public.contact_messages 
FOR DELETE 
USING (true);

-- Create policy to allow anyone to insert messages (for the contact form)
CREATE POLICY "Anyone can insert contact_messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_contact_messages_updated_at
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();