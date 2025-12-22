import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, ArrowUp, ArrowDown, Upload, Link, Sparkles, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useDomaines, Domaine } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';

type ImageMode = 'auto' | 'url' | 'upload';

// Fallback images for auto mode
const fallbackImages: Record<string, string> = {
  'default': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
  'Bâtiments Résidentiels': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
  'Bâtiments Tertiaires': 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop',
  'Industrie': 'https://images.unsplash.com/photo-1545558014_8692077e9b5c?w=600&h=400&fit=crop',
  'Infrastructures': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
  'Énergie': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop',
  'Santé': 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop',
};

const AdminDomaines = () => {
  const { domaines, fetchDomaines } = useDomaines();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDomaine, setEditingDomaine] = useState<Domaine | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    description: '', // Short description
    long_description: '', // Long description
    image_url: '', // Image URL for the domain page
    image_mode: 'auto' as ImageMode, // Image mode for the domain page
    image_file: '', // Uploaded image file URL for the domain page
    icon: '⚡', // Now directly stores the text/emoji
  });
  const { toast } = useToast();

  const resetForm = () => {
    setForm({ 
      title: '', 
      description: '', 
      long_description: '',
      image_url: '',
      image_mode: 'auto',
      image_file: '',
      icon: '⚡',
    });
    setEditingDomaine(null);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Type de fichier invalide',
        description: 'Veuillez téléverser un fichier PNG, JPEG ou WebP',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // Max 2MB for images
      toast({
        title: 'Fichier trop volumineux',
        description: 'La taille maximale pour les images est de 2MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('domain-images') // Use the new bucket
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('domain-images')
        .getPublicUrl(filePath);

      setForm(prev => ({ 
        ...prev, 
        image_mode: 'upload', 
        image_file: publicUrl,
        image_url: '',
      }));

      toast({
        title: 'Succès',
        description: 'Image téléversée avec succès',
      });
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de téléverser l\'image',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      long_description: form.long_description.trim() || null,
      image_url: form.image_mode === 'url' ? (form.image_url.trim() || null) : null,
      image_mode: form.image_mode,
      image_file: form.image_mode === 'upload' ? (form.image_file.trim() || null) : null,
      icon: form.icon.trim(),
    };

    // Client-side validation
    if (!payload.title) {
      toast({ title: 'Erreur', description: 'Le titre est requis.', variant: 'destructive' });
      return;
    }
    if (!payload.description) {
      toast({ title: 'Erreur', description: 'La description courte est requise.', variant: 'destructive' });
      return;
    }
    if (!payload.icon) {
      toast({ title: 'Erreur', description: 'L\'icône est requise.', variant: 'destructive' });
      return;
    }

    if (editingDomaine) {
      const { error } = await supabase
        .from('domaines')
        .update(payload)
        .eq('id', editingDomaine.id);

      if (error) {
        console.error('Supabase update error:', error); // Log the actual error
        toast({
          title: 'Erreur',
          description: `Impossible de mettre à jour le domaine: ${error.message}`,
          variant: 'destructive',
        });
        return;
      }
    } else {
      const maxPosition = Math.max(...domaines.map(d => d.position), 0);
      const { error } = await supabase
        .from('domaines')
        .insert({ ...payload, position: maxPosition + 1 });

      if (error) {
        console.error('Supabase insert error:', error); // Log the actual error
        toast({
          title: 'Erreur',
          description: `Impossible de créer le domaine: ${error.message}`,
          variant: 'destructive',
        });
        return;
      }
    }

    toast({
      title: 'Succès',
      description: editingDomaine ? 'Domaine mis à jour' : 'Domaine créé',
    });

    setIsDialogOpen(false);
    resetForm();
    fetchDomaines();
  };

  const handleEdit = (domaine: Domaine) => {
    setEditingDomaine(domaine);
    setForm({
      title: domaine.title,
      description: domaine.description,
      long_description: domaine.long_description || '',
      image_url: domaine.image_url || '',
      image_mode: domaine.image_mode || 'auto',
      image_file: domaine.image_file || '',
      icon: domaine.icon || '⚡', // Load existing icon text/emoji
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce domaine ?')) {
      return;
    }

    const { error } = await supabase
      .from('domaines')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error); // Log the actual error
      toast({
        title: 'Erreur',
        description: `Impossible de supprimer le domaine: ${error.message}`,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Succès',
      description: 'Domaine supprimé',
    });

    fetchDomaines();
  };

  const handleMovePosition = async (domaine: Domaine, direction: 'up' | 'down') => {
    const sortedDomaines = [...domaines].sort((a, b) => a.position - b.position);
    const currentIndex = sortedDomaines.findIndex(d => d.id === domaine.id);
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedDomaines.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetDomaine = sortedDomaines[targetIndex];

    const { error } = await supabase
      .from('domaines')
      .update({ position: targetDomaine.position })
      .eq('id', domaine.id);

    if (!error) {
      await supabase
        .from('domaines')
        .update({ position: domaine.position })
        .eq('id', targetDomaine.id);
    }

    if (error) {
      console.error('Supabase reorder error:', error); // Log the actual error
      toast({
        title: 'Erreur',
        description: `Impossible de réorganiser les domaines: ${error.message}`,
        variant: 'destructive',
      });
      return;
    }

    fetchDomaines();
  };

  const getImagePreview = () => {
    if (form.image_mode === 'upload' && form.image_file) {
      return form.image_file;
    }
    if (form.image_mode === 'url' && form.image_url) {
      return form.image_url;
    }
    return null;
  };

  const getDomaineDisplayImage = (domaine: Domaine) => {
    if (domaine.image_mode === 'upload' && domaine.image_file) return domaine.image_file;
    if (domaine.image_mode === 'url' && domaine.image_url) return domaine.image_url;
    return fallbackImages[domaine.title] || fallbackImages['default'];
  };

  const imagePreview = getImagePreview();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Liste des domaines</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un domaine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDomaine ? 'Modifier le domaine' : 'Ajouter un domaine'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="icon">Icône (Emoji ou texte court)</Label>
                <Input
                  id="icon"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="Ex: ⚡, 🏠, 🏭"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description courte (visible sur toutes les pages)</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="long_description">Description longue (visible uniquement sur la page Domaines)</Label>
                <Textarea
                  id="long_description"
                  value={form.long_description}
                  onChange={(e) => setForm({ ...form, long_description: e.target.value })}
                  placeholder="Description détaillée du domaine..."
                />
              </div>

              {/* Image Section for Domains Page */}
              <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                <Label className="text-base font-semibold">Image du domaine (visible sur la page dédiée)</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={form.image_mode === 'auto' ? 'default' : 'outline'}
                    onClick={() => setForm({ ...form, image_mode: 'auto', image_url: '', image_file: '' })}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Auto
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={form.image_mode === 'url' ? 'default' : 'outline'}
                    onClick={() => setForm({ ...form, image_mode: 'url', image_file: '' })}
                  >
                    <Link className="h-4 w-4 mr-1" />
                    URL
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={form.image_mode === 'upload' ? 'default' : 'outline'}
                    onClick={() => setForm({ ...form, image_mode: 'upload', image_url: '' })}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Téléverser
                  </Button>
                </div>

                {/* URL input */}
                {form.image_mode === 'url' && (
                  <div className="mt-4">
                    <Label htmlFor="domain_image_url">URL de l'image</Label>
                    <Input
                      id="domain_image_url"
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      placeholder="https://exemple.com/image.jpg"
                    />
                    {form.image_url && (
                      <div className="mt-2">
                        <img 
                          src={form.image_url} 
                          alt="Aperçu" 
                          className="w-full h-32 object-cover rounded border"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Upload input */}
                {form.image_mode === 'upload' && (
                  <div className="mt-4">
                    <Label htmlFor="domain_image_file">Téléverser une image</Label>
                    <Input
                      ref={imageFileInputRef}
                      id="domain_image_file"
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp"
                      onChange={handleImageFileUpload}
                      disabled={uploadingImage}
                    />
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP (max 2 Mo)</p>
                    {form.image_file && (
                      <div className="mt-2">
                        <img 
                          src={form.image_file} 
                          alt="Aperçu" 
                          className="w-full h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Auto mode info */}
                {form.image_mode === 'auto' && (
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    En mode automatique, une image par défaut sera utilisée si aucune image n'est spécifiée.
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={uploadingImage}>
                {editingDomaine ? 'Mettre à jour' : 'Créer'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Icône</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Description courte</TableHead>
            <TableHead>Description longue</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domaines
            .sort((a, b) => a.position - b.position)
            .map((domaine) => {
              const displayImage = getDomaineDisplayImage(domaine);
              return (
                <TableRow key={domaine.id}>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMovePosition(domaine, 'up')}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMovePosition(domaine, 'down')}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-2xl">{domaine.icon}</TableCell>
                  <TableCell className="font-medium">{domaine.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{domaine.description}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {domaine.long_description || <span className="text-muted-foreground italic">Non définie</span>}
                  </TableCell>
                  <TableCell>
                    {displayImage && displayImage !== fallbackImages['default'] ? (
                      <img src={displayImage} alt={domaine.title} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Auto</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(domaine)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(domaine.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminDomaines;