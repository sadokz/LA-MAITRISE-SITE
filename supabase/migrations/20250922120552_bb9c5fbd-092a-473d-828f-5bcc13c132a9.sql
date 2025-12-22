-- Ajouter les champs manquants à la table founder
ALTER TABLE public.founder 
ADD COLUMN experience_text_1 TEXT DEFAULT 'Ingénieur électricien diplômé depuis',
ADD COLUMN experience_text_2 TEXT DEFAULT 'Fondateur de LA MAITRISE ENGINEERING en',
ADD COLUMN experience_text_3 TEXT DEFAULT 'Plus de {years} ans d''expérience en ingénierie électrique',
ADD COLUMN experience_text_4 TEXT DEFAULT 'Expert reconnu en BIM et technologies innovantes',
ADD COLUMN values_title TEXT DEFAULT 'Nos Valeurs Fondamentales',
ADD COLUMN value_1_title TEXT DEFAULT 'Innovation',
ADD COLUMN value_1_description TEXT DEFAULT 'Intégration des dernières technologies et solutions avant-gardistes',
ADD COLUMN value_2_title TEXT DEFAULT 'Rigueur',
ADD COLUMN value_2_description TEXT DEFAULT 'Excellence technique et respect des normes les plus strictes',
ADD COLUMN value_3_title TEXT DEFAULT 'Satisfaction client',
ADD COLUMN value_3_description TEXT DEFAULT 'Écoute attentive et solutions personnalisées pour chaque projet';