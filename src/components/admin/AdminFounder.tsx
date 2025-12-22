import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Upload, User, ImageIcon, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useFounder, Founder } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';

const AdminFounder = () => {
  const { founder, fetchFounder, loading } = useFounder();
  const [formData, setFormData] = useState<Partial<Founder>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (founder && !isEditing) {
      setFormData(founder);
    }
  }, [founder, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'since_year' || name === 'founder_since' ? parseInt(value) || 0 : value
    }));
  };

  const handleSave = async () => {
    if (!formData) return;

    const { error } = await supabase
      .from('founder')
      .update(formData)
      .eq('id', 1);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour les informations du fondateur',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Succès',
      description: 'Informations du fondateur mises à jour avec succès',
    });

    setIsEditing(false);
    fetchFounder();
  };

  const handleCancel = () => {
    if (founder) {
      setFormData(founder);
    }
    setIsEditing(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation de l'image
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un fichier image valide',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      toast({
        title: 'Erreur',
        description: 'L\'image ne doit pas dépasser 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Générer un nom unique pour l'image
      const fileName = `founder-${Date.now()}.${file.name.split('.').pop()}`;
      
      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('founder-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('founder-images')
        .getPublicUrl(fileName);

      // Mettre à jour la base de données avec le nouveau chemin
      const { error: updateError } = await supabase
        .from('founder')
        .update({ photo_path: publicUrl })
        .eq('id', 1);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Succès',
        description: 'Image du fondateur mise à jour avec succès',
      });

      // Rafraîchir les données
      fetchFounder();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: `Erreur lors de l'upload: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Reset du champ file input
      event.target.value = '';
    }
  };

  const handleDeleteImage = async () => {
    if (!founder?.photo_path || founder.photo_path.includes('assets')) {
      toast({
        title: 'Info',
        description: 'Impossible de supprimer l\'image par défaut',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Extraire le nom du fichier de l'URL
      const fileName = founder.photo_path.split('/').pop();
      
      if (fileName) {
        // Supprimer de Supabase Storage
        const { error: deleteError } = await supabase.storage
          .from('founder-images')
          .remove([fileName]);

        if (deleteError) {
          console.warn('Erreur lors de la suppression du fichier:', deleteError);
        }
      }

      // Remettre l'image par défaut
      const { error: updateError } = await supabase
        .from('founder')
        .update({ photo_path: '/assets/ahmed-zgolli.jpg' })
        .eq('id', 1);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Succès',
        description: 'Image supprimée, retour à l\'image par défaut',
      });

      fetchFounder();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: `Erreur lors de la suppression: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Textes du fondateur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Informations du fondateur</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isEditing ? (
            <div className="space-y-4">
              <Button onClick={() => setIsEditing(true)} className="mb-4">
                Modifier les informations
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Nom</Label>
                  <p className="text-muted-foreground mt-1">{founder?.name}</p>
                </div>
                <div>
                  <Label className="font-medium">Titre</Label>
                  <p className="text-muted-foreground mt-1">{founder?.title}</p>
                </div>
                <div>
                  <Label className="font-medium">Diplômé depuis</Label>
                  <p className="text-muted-foreground mt-1">{founder?.since_year}</p>
                </div>
                <div>
                  <Label className="font-medium">Fondateur depuis</Label>
                  <p className="text-muted-foreground mt-1">{founder?.founder_since}</p>
                </div>
              </div>
              
              <div>
                <Label className="font-medium">Citation</Label>
                <p className="text-muted-foreground mt-1 italic">"{founder?.quote}"</p>
              </div>
              
              <div>
                <Label className="font-medium">Biographie</Label>
                <div className="text-muted-foreground mt-1 whitespace-pre-wrap" 
                     dangerouslySetInnerHTML={{ __html: founder?.bio_html || '' }} />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom du fondateur</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder="Ahmed Zgolli"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    placeholder="Ingénieur électricien principal"
                  />
                </div>
                <div>
                  <Label htmlFor="since_year">Diplômé depuis (année)</Label>
                  <Input
                    id="since_year"
                    name="since_year"
                    type="number"
                    value={formData.since_year || ''}
                    onChange={handleInputChange}
                    placeholder="1988"
                  />
                </div>
                <div>
                  <Label htmlFor="founder_since">Fondateur depuis (année)</Label>
                  <Input
                    id="founder_since"
                    name="founder_since"
                    type="number"
                    value={formData.founder_since || ''}
                    onChange={handleInputChange}
                    placeholder="1993"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="quote">Citation</Label>
                <Textarea
                  id="quote"
                  name="quote"
                  value={formData.quote || ''}
                  onChange={handleInputChange}
                  className="min-h-[80px]"
                  placeholder="Citation inspirante du fondateur..."
                />
              </div>
              
              <div>
                <Label htmlFor="bio_html">Biographie complète</Label>
                <Textarea
                  id="bio_html"
                  name="bio_html"
                  value={formData.bio_html || ''}
                  onChange={handleInputChange}
                  className="min-h-[150px]"
                  placeholder="Biographie détaillée... (HTML autorisé: <b>, <i>, <p>, etc.)"
                />
              </div>

              {/* Textes d'expérience */}
              <div>
                <Label className="text-lg font-semibold mb-4 block">Textes d'expérience</Label>
                <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                  <div>
                    <Label htmlFor="experience_text_1">Texte diplôme</Label>
                    <Input
                      id="experience_text_1"
                      name="experience_text_1"
                      value={formData.experience_text_1 || ''}
                      onChange={handleInputChange}
                      placeholder="Ingénieur électricien diplômé depuis"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience_text_2">Texte fondateur</Label>
                    <Input
                      id="experience_text_2"
                      name="experience_text_2"
                      value={formData.experience_text_2 || ''}
                      onChange={handleInputChange}
                      placeholder="Fondateur de LA MAITRISE ENGINEERING en"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience_text_3">Texte expérience (utilisez {'{years}'} pour l'année auto)</Label>
                    <Input
                      id="experience_text_3"
                      name="experience_text_3"
                      value={formData.experience_text_3 || ''}
                      onChange={handleInputChange}
                      placeholder="Plus de {years} ans d'expérience en ingénierie électrique"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience_text_4">Texte expertise</Label>
                    <Input
                      id="experience_text_4"
                      name="experience_text_4"
                      value={formData.experience_text_4 || ''}
                      onChange={handleInputChange}
                      placeholder="Expert reconnu en BIM et technologies innovantes"
                    />
                  </div>
                </div>
              </div>

              {/* Valeurs fondamentales */}
              <div>
                <Label className="text-lg font-semibold mb-4 block">Valeurs fondamentales</Label>
                <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                  <div>
                    <Label htmlFor="values_title">Titre de la section valeurs</Label>
                    <Input
                      id="values_title"
                      name="values_title"
                      value={formData.values_title || ''}
                      onChange={handleInputChange}
                      placeholder="Nos Valeurs Fondamentales"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="font-medium">Valeur 1</Label>
                      <Input
                        name="value_1_title"
                        value={formData.value_1_title || ''}
                        onChange={handleInputChange}
                        placeholder="Innovation"
                      />
                      <Textarea
                        name="value_1_description"
                        value={formData.value_1_description || ''}
                        onChange={handleInputChange}
                        className="min-h-[80px]"
                        placeholder="Description de l'innovation..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="font-medium">Valeur 2</Label>
                      <Input
                        name="value_2_title"
                        value={formData.value_2_title || ''}
                        onChange={handleInputChange}
                        placeholder="Rigueur"
                      />
                      <Textarea
                        name="value_2_description"
                        value={formData.value_2_description || ''}
                        onChange={handleInputChange}
                        className="min-h-[80px]"
                        placeholder="Description de la rigueur..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="font-medium">Valeur 3</Label>
                      <Input
                        name="value_3_title"
                        value={formData.value_3_title || ''}
                        onChange={handleInputChange}
                        placeholder="Satisfaction client"
                      />
                      <Textarea
                        name="value_3_description"
                        value={formData.value_3_description || ''}
                        onChange={handleInputChange}
                        className="min-h-[80px]"
                        placeholder="Description de la satisfaction client..."
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button onClick={handleSave} className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Sauvegarder</span>
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image du fondateur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5" />
            <span>Image du fondateur</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Aperçu de l'image actuelle */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {founder?.photo_path ? (
                  <img 
                    src={founder.photo_path} 
                    alt="Photo du fondateur"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/ahmed-zgolli.jpg';
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                    <p>Aucune image</p>
                  </div>
                )}
              </div>
              
              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <Button 
                    disabled={isUploading}
                    className="w-full sm:w-auto flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{isUploading ? 'Upload en cours...' : 'Téléverser une image'}</span>
                  </Button>
                </div>
                
                {founder?.photo_path && !founder.photo_path.includes('assets') && (
                  <Button 
                    variant="outline" 
                    onClick={handleDeleteImage}
                    className="w-full sm:w-auto flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Supprimer</span>
                  </Button>
                )}
              </div>
            </div>
            
            {/* Informations */}
            <div className="text-sm text-muted-foreground bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">Instructions :</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Formats acceptés : JPG, JPEG, PNG, WEBP</li>
                <li>Taille maximale : 5MB</li>
                <li>Dimensions recommandées : 400x600px minimum</li>
                <li>L'image sera automatiquement mise à jour sur le site</li>
              </ul>
              
              {founder?.photo_path && (
                <div className="mt-3 pt-3 border-t">
                  <p className="font-medium">Image actuelle :</p>
                  <p className="text-xs break-all">{founder.photo_path}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFounder;