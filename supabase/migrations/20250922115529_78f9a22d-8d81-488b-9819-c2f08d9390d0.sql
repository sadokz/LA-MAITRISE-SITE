-- Table pour les informations du fondateur
CREATE TABLE public.founder (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK(id=1),
  name TEXT NOT NULL DEFAULT 'Ahmed Zgolli',
  title TEXT NOT NULL DEFAULT 'Ingénieur électricien principal',
  since_year INTEGER NOT NULL DEFAULT 1988,
  founder_since INTEGER NOT NULL DEFAULT 1993,
  since_line TEXT NOT NULL DEFAULT 'Ingénieur électricien diplômé depuis',
  founder_since_line TEXT NOT NULL DEFAULT 'Fondateur de LA MAITRISE ENGINEERING en',
  bio_html TEXT NOT NULL DEFAULT 'Ahmed Zgolli, ingénieur électricien principal depuis 1988, est le fondateur et ingénieur conseil de LA MAITRISE ENGINEERING.',
  photo_path TEXT DEFAULT '/assets/ahmed-zgolli.jpg',
  quote TEXT DEFAULT 'L''ingénierie électrique n''est pas seulement une technique, c''est un art qui consiste à donner vie aux projets les plus ambitieux.',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insérer les données par défaut
INSERT INTO public.founder (id) VALUES (1);

-- Activer RLS
ALTER TABLE public.founder ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour founder
CREATE POLICY "Public can view founder" ON public.founder FOR SELECT USING (true);
CREATE POLICY "Admin can view founder" ON public.founder FOR SELECT USING (true);
CREATE POLICY "Admin can update founder" ON public.founder FOR UPDATE USING (true);

-- Table pour les textes de contact
CREATE TABLE public.contact_texts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR NOT NULL UNIQUE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.contact_texts ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour contact_texts
CREATE POLICY "Public can view contact_texts" ON public.contact_texts FOR SELECT USING (true);
CREATE POLICY "Admin can view contact_texts" ON public.contact_texts FOR SELECT USING (true);
CREATE POLICY "Admin can insert contact_texts" ON public.contact_texts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update contact_texts" ON public.contact_texts FOR UPDATE USING (true);
CREATE POLICY "Admin can delete contact_texts" ON public.contact_texts FOR DELETE USING (true);

-- Insérer les données par défaut pour contact
INSERT INTO public.contact_texts (key, content) VALUES
('header_title', 'Contactez notre équipe'),
('header_subtitle', 'Prêt à démarrer votre projet ? Contactez-nous pour discuter de vos besoins et découvrir nos solutions d''ingénierie électrique.'),
('phone_value', '+216 52 949 411'),
('fax_value', '+216 72 230 111'),
('email_value', 'lamaitrise.engineering@gmail.com'),
('address_value', '45 Avenue Habib Bourguiba, 8000 Nabeul, Tunisie'),
('form_name_label', 'Nom complet'),
('form_email_label', 'Email'),
('form_phone_label', 'Téléphone'),
('form_message_label', 'Message'),
('form_submit_label', 'Envoyer le message'),
('success_message', 'Message envoyé ! Nous vous répondrons dans les plus brefs délais.'),
('error_message', 'Erreur lors de l''envoi du message. Veuillez réessayer.'),
('form_header', 'Demander un devis'),
('hours_title', 'Horaires d''ouverture'),
('whatsapp_title', 'Contact rapide'),
('whatsapp_subtitle', 'Besoin d''une réponse immédiate ? Contactez-nous sur WhatsApp'),
('whatsapp_button', 'Écrire sur WhatsApp');

-- Trigger pour updated_at sur founder
CREATE TRIGGER update_founder_updated_at
  BEFORE UPDATE ON public.founder
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour updated_at sur contact_texts
CREATE TRIGGER update_contact_texts_updated_at
  BEFORE UPDATE ON public.contact_texts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();