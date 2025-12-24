import React, { useState, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, ArrowUp, ArrowDown, Upload, Link, Sparkles, Eye, EyeOff, Star, Calendar, MapPin, Hash, Image as ImageIcon, LayoutGrid, List } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useReferences, useDomaines, Reference, ReferenceImage } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getRelevantFallbackImage } from '@/lib/fallbackImages';
import { cn } from '@/lib/utils';

type ImageMode = 'auto' | 'url' | 'upload';
type LayoutMode = 'list' | 'grid';

const AdminReferences = () => {
  const { references, fetchReferences, loading: referencesLoading } = useReferences();
  const { domaines, loading: domainesLoading } = useDomaines();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReference, setEditingReference] = useState<Reference | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    long_description: '',
    category: '',
    image_url: '',
    image_mode: 'auto' as ImageMode,
    image_file: '',
    is_visible: true,
    is_featured: false,
    date_text: '',
    emplacement: '',
    reference: '',
  });
  const [additionalImages, setAdditionalImages] = useState<ReferenceImage[]>([]);
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingAdditionalImage, setUploadingAdditionalImage] = useState(false);
  const mainImageFileInputRef = useRef<HTMLInputElement>(null);
  const additionalImageFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('list');

  // Add loading check here
  if (referencesLoading || domainesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      long_description: '',
      category: '',
      image_url: '',
      image_mode: 'auto',
      image_file: '',
      is_visible: true,
      is_featured: false,
      date_text: '',
      emplacement: '',
      reference: '',
    });
    setAdditionalImages([]);
    setEditingReference(null);
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: 'Erreur', description: 'Type de fichier non supporté. Utilisez PNG, JPG ou WebP.', variant: 'destructive' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Erreur', description: 'Le fichier est trop volumineux (max 2 Mo).', variant: 'destructive' });
      return;
    }

    setUploadingMainImage(true);
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const { error: uploadError } = await supabase.storage.from('reference-images').upload(fileName, file);
    if (uploadError) {
      toast({ title: 'Erreur', description: 'Impossible de téléverser l\'image principale.', variant: 'destructive' });
      setUploadingMainImage(false);
      return;
    }

    const { data: publicData } = supabase.storage.from('reference-images').getPublicUrl(fileName);
    setForm({ ...form, image_file: publicData.publicUrl, image_mode: 'upload' });
    setUploadingMainImage(false);
    toast({ title: 'Succès', description: 'Image principale téléversée avec succès.', });
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: 'Erreur', description: 'Type de fichier non supporté. Utilisez PNG, JPG ou WebP.', variant: 'destructive' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Erreur', description: 'Le fichier est trop volumineux (max 2 Mo).', variant: 'destructive' });
      return;
    }

    setUploadingAdditionalImage(true);
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const { error: uploadError } = await supabase.storage.from('reference-additional-images').upload(fileName, file);
    if (uploadError) {
      toast({ title: 'Erreur', description: 'Impossible de téléverser l\'image supplémentaire.', variant: 'destructive' });
      setUploadingAdditionalImage(false);
      return;
    }

    const { data: publicData } = supabase.storage.from('reference-additional-images').getPublicUrl(fileName);

    const newImage: ReferenceImage = {
      id: `new-${Date.now()}`,
      reference_id: editingReference?.id || '',
      image_url: null,
      image_file: publicData.publicUrl,
      image_mode: 'upload',
      position: additionalImages.length > 0 ? Math.max(...additionalImages.map(img => img.position)) + 1 : 0,
    };
    setAdditionalImages(prev => [...prev, newImage]);
    setUploadingAdditionalImage(false);
    if (additionalImageFileInputRef.current) additionalImageFileInputRef.current.value = '';
    toast({ title: 'Succès', description: 'Image supplémentaire téléversée avec succès.', });
  };

  const handleAddAdditionalImageFromUrl = (url: string) => {
    if (!url.trim()) return;
    const newImage: ReferenceImage = {
      id: `new-${Date.now()}`,
      reference_id: editingReference?.id || '',
      image_url: url.trim(),
      image_file: null,
      image_mode: 'url',
      position: additionalImages.length > 0 ? Math.max(...additionalImages.map(img => img.position)) + 1 : 0,
    };
    setAdditionalImages(prev => [...prev, newImage]);
    toast({ title: 'Succès', description: 'Image supplémentaire ajoutée via URL.', });
  };

  const handleRemoveAdditionalImage = (id: string) => {
    setAdditionalImages(prev => prev.filter(img => img.id !== id));
    toast({ title: 'Supprimé', description: 'Image supplémentaire retirée.', });
  };

  const handleMoveAdditionalImage = (id: string, direction: 'up' | 'down') => {
    setAdditionalImages(prevImages => {
      const newImages = [...prevImages].sort((a, b) => a.position - b.position);
      const currentIndex = newImages.findIndex(img => img.id === id);
      if (currentIndex === -1) return prevImages;

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= newImages.length) return prevImages;

      // Swap positions
      const currentImage = newImages[currentIndex];
      const targetImage = newImages[targetIndex];

      newImages[currentIndex] = { ...targetImage, position: currentImage.position };
      newImages[targetIndex] = { ...currentImage, position: targetImage.position };

      return newImages.sort((a, b) => a.position - b.position);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      long_description: form.long_description || null,
      category: form.category,
      image_url: form.image_mode === 'url' ? form.image_url : null,
      image_mode: form.image_mode,
      image_file: form.image_mode === 'upload' ? form.image_file : null,
      is_visible: form.is_visible,
      is_featured: form.is_featured,
      date_text: form.date_text || null,
      emplacement: form.emplacement || null,
      reference: form.reference || null,
    };

    let referenceId = editingReference?.id;
    if (editingReference) {
      const { error } = await supabase.from('references').update(payload).eq('id', referenceId);
      if (error) { toast({ title: 'Erreur', description: 'Impossible de mettre à jour la référence', variant: 'destructive' }); return; }
    } else {
      const maxPosition = Math.max(...references.map(r => r.position), 0);
      const { data, error } = await supabase.from('references').insert({ ...payload, position: maxPosition + 1 }).select('id').single();
      if (error) { toast({ title: 'Erreur', description: 'Impossible de créer la référence', variant: 'destructive' }); return; }
      referenceId = data.id;
    }

    // Handle additional images
    if (referenceId) {
      // Delete existing additional images not in the current list
      const existingImageIds = additionalImages.filter(img => !img.id.startsWith('new-')).map(img => img.id);
      const { error: deleteError } = await supabase
        .from('reference_images')
        .delete()
        .eq('reference_id', referenceId)
        .not('id', 'in', `(${existingImageIds.map(id => `'${id}'`).join(',') || 'NULL'})`);

      if (deleteError) { console.error('Error deleting old images:', deleteError); }

      // Insert/Update additional images
      for (const img of additionalImages) {
        const imgPayload = {
          reference_id: referenceId,
          image_url: img.image_mode === 'url' ? img.image_url : null,
          image_file: img.image_mode === 'upload' ? img.image_file : null,
          image_mode: img.image_mode,
          position: img.position,
        };

        if (img.id.startsWith('new-')) {
          // Insert new image
          await supabase.from('reference_images').insert(imgPayload);
        } else {
          // Update existing image
          await supabase.from('reference_images').update(imgPayload).eq('id', img.id);
        }
      }
    }

    toast({ title: 'Succès', description: editingReference ? 'Référence mise à jour' : 'Référence créée', });
    setIsDialogOpen(false);
    resetForm();
    fetchReferences();
  };

  const handleEdit = (reference: Reference) => {
    setEditingReference(reference);
    setForm({
      title: reference.title,
      description: reference.description,
      long_description: reference.long_description || '',
      category: reference.category,
      image_url: reference.image_url || '',
      image_mode: reference.image_mode || 'auto',
      image_file: reference.image_file || '',
      is_visible: reference.is_visible,
      is_featured: reference.is_featured,
      date_text: reference.date_text || '',
      emplacement: reference.emplacement || '',
      reference: reference.reference || '',
    });
    setAdditionalImages(reference.images || []);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette référence ?')) { return; }

    const { error } = await supabase.from('references').delete().eq('id', id);
    if (error) { toast({ title: 'Erreur', description: 'Impossible de supprimer la référence', variant: 'destructive' }); return; }

    toast({ title: 'Succès', description: 'Référence supprimée', });
    fetchReferences();
  };

  const handleMovePosition = async (reference: Reference, direction: 'up' | 'down') => {
    const sortedReferences = [...references].sort((a, b) => a.position - b.position);
    const currentIndex = sortedReferences.findIndex(r => r.id === reference.id);

    if ((direction === 'up' && currentIndex === 0) || (direction === 'down' && currentIndex === sortedReferences.length - 1)) { return; }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetReference = sortedReferences[targetIndex];

    const { error } = await supabase.from('references').update({ position: targetReference.position }).eq('id', reference.id);
    if (!error) {
      await supabase.from('references').update({ position: reference.position }).eq('id', targetReference.id);
    }

    if (error) { toast({ title: 'Erreur', description: 'Impossible de réorganiser les références', variant: 'destructive' }); return; }
    fetchReferences();
  };

  const getDisplayImage = (r: Reference | ReferenceImage) => {
    if (r.image_mode === 'upload' && r.image_file) return r.image_file;
    if (r.image_mode === 'url' && r.image_url) return r.image_url;

    const searchString = `${(r as Reference).title || ''} ${(r as Reference).description || ''} ${(r as Reference).category || ''} ${(r as Reference).emplacement || ''}`;
    return getRelevantFallbackImage(searchString, (r as Reference).category?.toLowerCase() || 'default');
  };

  const filteredReferences = useMemo(() => {
    if (selectedDomainFilter === 'all') {
      return references;
    }
    return references.filter(r => r.category === selectedDomainFilter);
  }, [references, selectedDomainFilter]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Liste des références</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une référence
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingReference ? 'Modifier la référence' : 'Ajouter une référence'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="category">Domaine / Catégorie</Label>
                <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un domaine" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {domaines.map((domaine) => (
                      <SelectItem key={domaine.id} value={domaine.title}>
                        {domaine.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date_text">Date (ex: 2023, Q4 2023)</Label>
                <Input id="date_text" value={form.date_text} onChange={(e) => setForm({ ...form, date_text: e.target.value })} placeholder="Ex: 2023, Q4 2023" />
              </div>
              <div>
                <Label htmlFor="emplacement">Emplacement</Label>
                <Input id="emplacement" value={form.emplacement} onChange={(e) => setForm({ ...form, emplacement: e.target.value })} placeholder="Ex: Nabeul, Tunisie" />
              </div>
              <div>
                <Label htmlFor="reference">Référence (Réf)</Label>
                <Input id="reference" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="Ex: Réf-001, Projet-X" />
              </div>
              <div>
                <Label htmlFor="description">Description courte (pour la page d'accueil et la page Références)</Label>
                <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="long_description">Description longue (uniquement pour la page Références)</Label>
                <Textarea id="long_description" value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} placeholder="Description détaillée de la référence..." />
              </div>

              {/* Main Image Section */}
              <Card className="p-4">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" /> Image principale (Page d'accueil & première image de la galerie)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div>
                    <Label>Mode d'image</Label>
                    <div className="flex gap-2 mt-2">
                      <Button type="button" size="sm" variant={form.image_mode === 'auto' ? 'default' : 'outline'} onClick={() => setForm({ ...form, image_mode: 'auto', image_url: '', image_file: '' })}>
                        <Sparkles className="h-4 w-4 mr-1" /> Auto
                      </Button>
                      <Button type="button" size="sm" variant={form.image_mode === 'url' ? 'default' : 'outline'} onClick={() => setForm({ ...form, image_mode: 'url', image_file: '' })}>
                        <Link className="h-4 w-4 mr-1" /> URL
                      </Button>
                      <Button type="button" size="sm" variant={form.image_mode === 'upload' ? 'default' : 'outline'} onClick={() => setForm({ ...form, image_mode: 'upload', image_url: '' })}>
                        <Upload className="h-4 w-4 mr-1" /> Téléverser
                      </Button>
                    </div>
                  </div>

                  {form.image_mode === 'url' && (
                    <div>
                      <Label htmlFor="main_image_url">URL de l'image principale</Label>
                      <Input id="main_image_url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                      {form.image_url && <img src={form.image_url} alt="Aperçu" className="mt-2 w-full h-32 object-cover rounded border" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                    </div>
                  )}

                  {form.image_mode === 'upload' && (
                    <div>
                      <Label htmlFor="main_image_file">Téléverser une image principale</Label>
                      <Input ref={mainImageFileInputRef} id="main_image_file" type="file" accept=".png,.jpg,.jpeg,.webp" onChange={handleMainImageUpload} disabled={uploadingMainImage} />
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP (max 2 Mo)</p>
                      {form.image_file && <img src={form.image_file} alt="Aperçu" className="mt-2 w-full h-32 object-cover rounded border" />}
                    </div>
                  )}

                  {form.image_mode === 'auto' && (
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      En mode automatique, une image sera générée selon la catégorie de la référence.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Additional Images Section */}
              <Card className="p-4">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" /> Images supplémentaires (Galerie de la page Références)
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Ces images s'afficheront dans une galerie sur la page de détails de la référence.
                  </p>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  {additionalImages.sort((a, b) => a.position - b.position).map((img) => (
                    <div key={img.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg border">
                      <div className="flex flex-col gap-1">
                        <Button size="icon" variant="ghost" onClick={() => handleMoveAdditionalImage(img.id, 'up')} disabled={img.position === 0}>
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleMoveAdditionalImage(img.id, 'down')} disabled={img.position === additionalImages.length - 1}>
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                      {getDisplayImage(img) ? (
                        <img src={getDisplayImage(img)!} alt="Miniature" className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          No Img
                        </div>
                      )}
                      <span className="flex-1 text-sm truncate">
                        {img.image_mode === 'url' ? img.image_url : img.image_file?.split('/').pop()}
                      </span>
                      <Button size="icon" variant="destructive" onClick={() => handleRemoveAdditionalImage(img.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="space-y-2">
                    <Label>Ajouter une nouvelle image</Label>
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp"
                        onChange={handleAdditionalImageUpload}
                        disabled={uploadingAdditionalImage}
                        ref={additionalImageFileInputRef}
                        className="flex-1"
                      />
                      {uploadingAdditionalImage && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="url"
                        placeholder="Ou entrez une URL d'image"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddAdditionalImageFromUrl(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                        className="flex-1"
                      />
                      <Button type="button" onClick={() => {
                        const input = document.querySelector<HTMLInputElement>('input[type="url"][placeholder="Ou entrez une URL d\'image"]');
                        if (input) {
                          handleAddAdditionalImageFromUrl(input.value);
                          input.value = '';
                        }
                      }}>
                        Ajouter URL
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP (max 2 Mo)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <Label htmlFor="is_visible" className="font-medium">
                  Visible sur le site public
                </Label>
                <Switch id="is_visible" checked={form.is_visible} onCheckedChange={(checked) => setForm({ ...form, is_visible: checked })} />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <Label htmlFor="is_featured" className="font-medium">
                  Mettre en avant (Page d'accueil)
                </Label>
                <Switch id="is_featured" checked={form.is_featured} onCheckedChange={(checked) => setForm({ ...form, is_featured: checked })} />
              </div>

              <Button type="submit" className="w-full" disabled={uploadingMainImage || uploadingAdditionalImage}>
                {editingReference ? 'Mettre à jour' : 'Créer'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and Layout Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        {/* Filter for projects */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Label htmlFor="domain-filter" className="sr-only">Filtrer par domaine</Label>
          <Select value={selectedDomainFilter} onValueChange={setSelectedDomainFilter}>
            <SelectTrigger id="domain-filter" className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrer par domaine" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              <SelectItem value="all">Tous les domaines</SelectItem>
              {domaines.map((domaine) => (
                <SelectItem key={domaine.id} value={domaine.title}>
                  {domaine.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Layout Selector */}
        <div className="flex items-center gap-2">
          <Button
            variant={layoutMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setLayoutMode('list')}
            aria-label="Afficher en liste"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={layoutMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setLayoutMode('grid')}
            aria-label="Afficher en grille"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {layoutMode === 'list' ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Domaine</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Emplacement</TableHead>
              <TableHead>Réf</TableHead>
              <TableHead>Description courte</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead>En avant</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReferences
              .sort((a, b) => a.position - b.position)
              .map((reference) => {
                const mainDisplayImage = getDisplayImage(reference);
                const allImages = [
                  ...(mainDisplayImage ? [{ id: 'main', image_file: mainDisplayImage, image_mode: 'upload', position: -1 }] : []),
                  ...(reference.images || []),
                ].sort((a, b) => a.position - b.position);

                return (
                  <TableRow key={reference.id}>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMovePosition(reference, 'up')}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMovePosition(reference, 'down')}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{reference.title}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                        {reference.category}
                      </span>
                    </TableCell>
                    <TableCell>{reference.date_text || <span className="text-muted-foreground italic">N/A</span>}</TableCell>
                    <TableCell>{reference.emplacement || <span className="text-muted-foreground italic">N/A</span>}</TableCell>
                    <TableCell>{reference.reference || <span className="text-muted-foreground italic">N/A</span>}</TableCell>
                    <TableCell className="max-w-xs truncate">{reference.description}</TableCell>
                    <TableCell>
                      <div className="flex -space-x-2 overflow-hidden">
                        {allImages.slice(0, 3).map((img, idx) => (
                          <img key={idx} src={getDisplayImage(img)!} alt="img" className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover" />
                        ))}
                        {allImages.length > 3 && (
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium ring-2 ring-background">
                            +{allImages.length - 3}
                          </span>
                        )}
                        {allImages.length === 0 && <span className="text-xs text-muted-foreground">Aucune</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {reference.is_visible ? (
                        <Eye className="h-5 w-5 text-green-500" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      {reference.is_featured ? (
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <Star className="h-5 w-5 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(reference)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(reference.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReferences
            .sort((a, b) => a.position - b.position)
            .map((reference) => {
              const mainDisplayImage = getDisplayImage(reference);
              return (
                <Card key={reference.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="relative h-48 w-full">
                    <img
                      src={mainDisplayImage || getRelevantFallbackImage('default')}
                      alt={reference.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getRelevantFallbackImage('default');
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {reference.is_visible ? (
                        <span className="bg-green-500 text-white p-1 rounded-full text-xs" title="Visible"><Eye className="h-3 w-3" /></span>
                      ) : (
                        <span className="bg-red-500 text-white p-1 rounded-full text-xs" title="Masquée"><EyeOff className="h-3 w-3" /></span>
                      )}
                      {reference.is_featured && (
                        <span className="bg-yellow-500 text-white p-1 rounded-full text-xs" title="Mise en avant"><Star className="h-3 w-3 fill-white" /></span>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <h4 className="font-semibold text-lg mb-1">{reference.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs">
                        {reference.category}
                      </span>
                    </p>
                    <p className="text-sm text-gray-medium line-clamp-2 mb-3">{reference.description}</p>
                    <div className="flex items-center text-xs text-gray-muted mb-3 gap-x-2">
                      {reference.date_text && (
                        <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {reference.date_text}</span>
                      )}
                      {reference.emplacement && (
                        <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {reference.emplacement}</span>
                      )}
                    </div>
                    <div className="flex mt-auto space-x-2 pt-4 border-t border-border">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(reference)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(reference.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleMovePosition(reference, 'up')}>
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleMovePosition(reference, 'down')}>
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default AdminReferences;