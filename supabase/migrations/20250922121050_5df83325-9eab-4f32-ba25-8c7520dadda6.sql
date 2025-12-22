-- Créer un bucket pour les images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('founder-images', 'founder-images', true);

-- Politiques pour l'upload d'images du fondateur
CREATE POLICY "Anyone can view founder images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'founder-images');

CREATE POLICY "Admin can upload founder images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'founder-images');

CREATE POLICY "Admin can update founder images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'founder-images');

CREATE POLICY "Admin can delete founder images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'founder-images');