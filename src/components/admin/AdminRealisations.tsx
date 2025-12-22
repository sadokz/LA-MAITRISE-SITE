import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, ArrowUp, ArrowDown, Upload, Link, Sparkles, Eye, EyeOff, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useRealisations, useDomaines, Realisation } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch'; // Import Switch

const AdminRealisations = () => {
  const { realisations, fetchRealisations } = useRealisations();
  const { domaines } = useDomaines();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRealisation, setEditingRealisation] = useState<Realisation | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '', // Short description
    long_description: '', // Long description
    category: '',
    image_url: '',
    image_mode: 'auto' as 'auto' | 'url' | 'upload',
    image_file: '',
    is_visible: true,
    is_featured: false,
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

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
      is_featured: false 
    });
    setEditingRealisation(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Erreur',
        description: 'Type de fichier non supporté. Utilisez PNG, JPG ou WebP.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Erreur',
        description: 'Le fichier est trop volumineux (max 2 Mo).',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const { error: uploadError } = await supabase.storage
      .from('realisation-images')
      .upload(fileName, file);

    if (uploadError) {
      toast({
        title: 'Erreur',
        description: 'Impossible de téléverser l\'image.',
        variant: 'destructive',
      });
      setUploading(false);
      return;
    }

    const { data: publicData } = supabase.storage
      .from('realisation-images')
      .getPublicUrl(fileName);

    setForm({ ...form, image_file: publicData.publicUrl, image_mode: 'upload' });
    setUploading(false);

    toast({
      title: 'Succès',
      description: 'Image téléversée avec succès.',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      long_description: form.long_description || null, // Include long_description
      category: form.category,
      image_url: form.image_mode === 'url' ? form.image_url : null,
      image_mode: form.image_mode,
      image_file: form.image_mode === 'upload' ? form.image_file : null,
      is_visible: form.is_visible,
      is_featured: form.is_featured,
    };

    if (editingRealisation) {
      const { error } = await supabase
        .from('realisations')
        .update(payload)
        .eq('id', editingRealisation.id);

      if (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de mettre à jour la réalisation',
          variant: 'destructive',
        });
        return;
      }
    } else {
      const maxPosition = Math.max(...realisations.map(r => r.position), 0);
      const { error } = await supabase
        .from('realisations')
        .insert({ ...payload, position: maxPosition + 1 });

      if (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de créer la réalisation',
          variant: 'destructive',
        });
        return;
      }
    }

    toast({
      title: 'Succès',
      description: editingRealisation ? 'Réalisation mise à jour' : 'Réalisation créée',
    });

    setIsDialogOpen(false);
    resetForm();
    fetchRealisations();
  };

  const handleEdit = (realisation: Realisation) => {
    setEditingRealisation(realisation);
    setForm({
      title: realisation.title,
      description: realisation.description,
      long_description: realisation.long_description || '', // Load long_description
      category: realisation.category,
      image_url: realisation.image_url || '',
      image_mode: realisation.image_mode || 'auto',
      image_file: realisation.image_file || '',
      is_visible: realisation.is_visible,
      is_featured: realisation.is_featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réalisation ?')) {
      return;
    }

    const { error } = await supabase
      .from('realisations')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la réalisation',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Succès',
      description: 'Réalisation supprimée',
    });

    fetchRealisations();
  };

  const handleMovePosition = async (realisation: Realisation, direction: 'up' | 'down') => {
    const sortedRealisations = [...realisations].sort((a, b) => a.position - b.position);
    const currentIndex = sortedRealisations.findIndex(r => r.id === realisation.id);
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedRealisations.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetRealisation = sortedRealisations[targetIndex];

    const { error } = await supabase
      .from('realisations')
      .update({ position: targetRealisation.position })
      .eq('id', realisation.id);

    if (!error) {
      await supabase
        .from('realisations')
        .update({ position: realisation.position })
        .eq('id', targetRealisation.id);
    }

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de réorganiser les réalisations',
        variant: 'destructive',
      });
      return;
    }

    fetchRealisations();
  };

  const getDisplayImage = (r: Realisation) => {
    if (r.image_mode === 'upload' && r.image_file) return r.image_file;
    if (r.image_mode === 'url' && r.image_url) return r.image_url;
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Liste des réalisations</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une réalisation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRealisation ? 'Modifier la réalisation' : 'Ajouter une réalisation'}
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
                <Label htmlFor="description">Description courte (pour la page d'accueil et la page Réalisations)</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="long_description">Description longue (uniquement pour la page Réalisations)</Label>
                <Textarea
                  id="long_description"
                  value={form.long_description}
                  onChange={(e) => setForm({ ...form, long_description: e.target.value })}
                  placeholder="Description détaillée de la réalisation..."
                />
              </div>

              {/* Image Mode Selector */}
              <div>
                <Label>Mode d'image</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={form.image_mode === 'auto' ? 'default' : 'outline'}
                    onClick={() => setForm({ ...form, image_mode: 'auto' })}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Auto
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={form.image_mode === 'url' ? 'default' : 'outline'}
                    onClick={() => setForm({ ...form, image_mode: 'url' })}
                  >
                    <Link className="h-4 w-4 mr-1" />
                    URL
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={form.image_mode === 'upload' ? 'default' : 'outline'}
                    onClick={() => setForm({ ...form, image_mode: 'upload' })}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Téléverser
                  </Button>
                </div>
              </div>

              {/* URL input */}
              {form.image_mode === 'url' && (
                <div>
                  <Label htmlFor="image_url">URL de l'image</Label>
                  <Input
                    id="image_url"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://..."
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
                <div>
                  <Label htmlFor="image_file">Téléverser une image</Label>
                  <Input
                    id="image_file"
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    onChange={handleFileUpload}
                    disabled={uploading}
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
                  En mode automatique, une image sera générée selon la catégorie de la réalisation.
                </p>
              )}

              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <Label htmlFor="is_visible" className="font-medium">
                  Visible sur le site public
                </Label>
                <Switch
                  id="is_visible"
                  checked={form.is_visible}
                  onCheckedChange={(checked) => setForm({ ...form, is_visible: checked })}
                />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <Label htmlFor="is_featured" className="font-medium">
                  Mettre en avant (Page d'accueil)
                </Label>
                <Switch
                  id="is_featured"
                  checked={form.is_featured}
                  onCheckedChange={(checked) => setForm({ ...form, is_featured: checked })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={uploading}>
                {editingRealisation ? 'Mettre à jour' : 'Créer'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Domaine</TableHead>
            <TableHead>Description courte</TableHead> {/* Updated header */}
            <TableHead>Description longue</TableHead> {/* New header */}
            <TableHead>Image</TableHead>
            <TableHead>Visible</TableHead>
            <TableHead>En avant</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {realisations
            .sort((a, b) => a.position - b.position)
            .map((realisation) => {
              const displayImage = getDisplayImage(realisation);
              return (
                <TableRow key={realisation.id}>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMovePosition(realisation, 'up')}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMovePosition(realisation, 'down')}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{realisation.title}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                      {realisation.category}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{realisation.description}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {realisation.long_description || <span className="text-muted-foreground italic">Non définie</span>}
                  </TableCell>
                  <TableCell>
                    {displayImage ? (
                      <img src={displayImage} alt={realisation.title} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Auto</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {realisation.is_visible ? (
                      <Eye className="h-5 w-5 text-green-500" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    {realisation.is_featured ? (
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <Star className="h-5 w-5 text-gray-400" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(realisation)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(realisation.id)}
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

export default AdminRealisations;