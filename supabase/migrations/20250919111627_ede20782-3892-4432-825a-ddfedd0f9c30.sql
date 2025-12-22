-- Create site_texts table for managing all site content
CREATE TABLE public.site_texts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page VARCHAR(50) NOT NULL,
  section VARCHAR(50) NOT NULL,
  key VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(page, section, key)
);

-- Create competences table
CREATE TABLE public.competences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL DEFAULT '⚡',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create domaines table
CREATE TABLE public.domaines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create realisations table
CREATE TABLE public.realisations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domaines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realisations ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin access)
CREATE POLICY "Admin can view all site_texts" ON public.site_texts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can insert site_texts" ON public.site_texts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update site_texts" ON public.site_texts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin can delete site_texts" ON public.site_texts FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin can view all competences" ON public.competences FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can insert competences" ON public.competences FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update competences" ON public.competences FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin can delete competences" ON public.competences FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin can view all domaines" ON public.domaines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can insert domaines" ON public.domaines FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update domaines" ON public.domaines FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin can delete domaines" ON public.domaines FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin can view all realisations" ON public.realisations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can insert realisations" ON public.realisations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update realisations" ON public.realisations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin can delete realisations" ON public.realisations FOR DELETE TO authenticated USING (true);

-- Create policies for anonymous users (public read access)
CREATE POLICY "Public can view site_texts" ON public.site_texts FOR SELECT TO anon USING (true);
CREATE POLICY "Public can view competences" ON public.competences FOR SELECT TO anon USING (true);
CREATE POLICY "Public can view domaines" ON public.domaines FOR SELECT TO anon USING (true);
CREATE POLICY "Public can view realisations" ON public.realisations FOR SELECT TO anon USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_site_texts_updated_at BEFORE UPDATE ON public.site_texts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_competences_updated_at BEFORE UPDATE ON public.competences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_domaines_updated_at BEFORE UPDATE ON public.domaines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_realisations_updated_at BEFORE UPDATE ON public.realisations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial site texts
INSERT INTO public.site_texts (page, section, key, content) VALUES
('home', 'hero', 'title', 'Votre partenaire en ingénierie électrique et BIM depuis 1993'),
('home', 'hero', 'subtitle', 'De la conception à la réalisation, nous mettons notre expertise et notre innovation au service de vos projets.'),
('home', 'about', 'title', 'À propos de nous'),
('home', 'about', 'description', 'LA MAITRISE ENGINEERING est un bureau d''études techniques spécialisé en électricité et BIM. Depuis plus de 30 ans, nous accompagnons nos clients en Tunisie, en Afrique et à l''international avec une exigence : leur satisfaction.'),
('services', 'title', 'main', 'Nos Compétences en ingénierie électrique'),
('services', 'description', 'main', 'Notre équipe intervient sur toutes les phases d''un projet (APD, DCE, EXE, DOE) avec des solutions techniques et innovantes, adaptées aux besoins de nos clients.'),
('domains', 'title', 'main', 'Nos Domaines d''Intervention'),
('domains', 'description', 'main', 'Nous adaptons nos solutions aux spécificités de chaque secteur pour offrir des infrastructures fiables, durables et adaptées aux besoins de nos clients.'),
('references', 'title', 'main', 'Nos Réalisations'),
('references', 'description', 'main', 'Découvrez nos projets illustrant notre savoir-faire et notre capacité d''innovation.'),
('founder', 'title', 'main', 'Le Fondateur'),
('founder', 'description', 'main', 'Ahmed Zgolli, ingénieur électricien principal depuis 1988, est le fondateur et ingénieur conseil de LA MAITRISE ENGINEERING. Depuis la création de l''entreprise en 1993, il met son expertise et sa passion au service des projets en Tunisie et à l''international, avec une vision claire : offrir des solutions électriques innovantes et fiables.'),
('contact', 'title', 'main', 'Contact'),
('contact', 'description', 'main', 'Contactez-nous pour discuter de vos projets');

-- Insert initial competences
INSERT INTO public.competences (title, description, icon, position) VALUES
('Courant Fort (CFO)', 'Étude réseau MT/BT, dimensionnement postes de transformation, groupes électrogènes, installations photovoltaïques, mise en conformité.', '⚡', 1),
('Courant Faible (CFA)', 'Vidéo surveillance, contrôle d''accès, systèmes d''alarme et anti-intrusion, réseaux téléphoniques et informatiques.', '📡', 2),
('Sécurité Incendie (SSI)', 'Détection incendie, systèmes d''extinction, éclairage de sécurité.', '🔥', 3),
('Éclairage Public', 'Éclairage conventionnel et solaire, électrification urbaine et rurale.', '💡', 4),
('Ascenseurs', 'Études et dimensionnement pour bâtiments résidentiels, commerciaux et publics.', '🏢', 5);

-- Insert initial domaines
INSERT INTO public.domaines (title, description, position) VALUES
('Résidentiel', 'Complexes et logements collectifs.', 1),
('Commercial', 'Bureaux, hôtels, centres commerciaux.', 2),
('Industriel', 'Usines, zones industrielles, sites de production.', 3),
('Hospitalier', 'Cliniques, hôpitaux et infrastructures médicales.', 4),
('Photovoltaïque', 'Projets d''énergies renouvelables.', 5),
('Éclairage public', 'Conception et optimisation des réseaux urbains et ruraux.', 6),
('Projet du Patrimoine et Musées', 'Préservation et mise en valeur des sites historiques et musées.', 7);

-- Insert initial realisations
INSERT INTO public.realisations (title, description, category, position) VALUES
('Agroparc Kara – Togo', 'Études MT/BT, éclairage public, dimensionnement transformateurs et groupes électrogènes.', 'CFO', 1),
('École Supérieure de l''Audiovisuel et du Cinéma – Gammarth', 'Études d''éclairement, plans CFO et CFA, maquette 3D.', 'CFA', 2),
('Voie de contournement de Yaoundé – Cameroun (93 km)', 'Études réseaux, classement routes, zones de conflits, éclairage public.', 'Éclairage Public', 3);