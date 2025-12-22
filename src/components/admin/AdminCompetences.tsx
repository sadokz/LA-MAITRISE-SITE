import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, ArrowUp, ArrowDown, Upload, Link, Sparkles, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCompetences, Competence } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';

type ImageMode = 'auto' | 'url' | 'upload';

const AdminCompetences = () => {
  const { competences, fetchCompetences } = useCompetences();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompetence, setEditingCompetence] = useState<Competence | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    icon: '⚡',
    image_mode: 'auto' as ImageMode,
    image_url: '',
    image_file: '',
  });
  const { toast } = useToast();

  const resetForm = () => {
    setForm({ 
      title: '', 
      description: '', 
      icon: '⚡',
      image_mode: 'auto',
      image_url: '',
      image_file: '',
    });
    setEditingCompetence(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Type de fichier invalide',
        description: 'Veuillez téléverser un fichier PNG, JPEG ou WebP',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Fichier trop volumineux',
        description: 'La taille maximale est de 2MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `competence-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('competence-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('competence-images')
        .getPublicUrl(filePath);

      setForm({ 
        ...form, 
        image_mode: 'upload', 
        image_file: publicUrl,
        image_url: '',
      });

      toast({
        title: 'Succès',
        description: 'Image téléversée avec succès',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de téléverser l\'image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      icon: form.icon,
      image_mode: form.image_mode,
      image_url: form.image_mode === 'url' ? form.image_url : null,
      image_file: form.image_mode === 'upload' ? form.image_file : null,
    };

    if (editingCompetence) {
      // Update
      const { error } = await supabase
        .from('competences')
        .update(payload)
        .eq('id', editingCompetence.id);

      if (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de mettre à jour la compétence',
          variant: 'destructive',
        });
        return;
      }
    } else {
      // Create
      const maxPosition = Math.max(...competences.map(c => c.position), 0);
      const { error } = await supabase
        .from('competences')
        .insert({ ...payload, position: maxPosition + 1 });

      if (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de créer la compétence',
          variant: 'destructive',
        });
        return;
      }
    }

    toast({
      title: 'Succès',
      description: editingCompetence ? 'Compétence mise à jour' : 'Compétence créée',
    });

    setIsDialogOpen(false);
    resetForm();
    fetchCompetences();
  };

  const handleEdit = (competence: Competence) => {
    setEditingCompetence(competence);
    setForm({
      title: competence.title,
      description: competence.description,
      icon: competence.icon,
      image_mode: competence.image_mode || 'auto',
      image_url: competence.image_url || '',
      image_file: competence.image_file || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
      return;
    }

    const { error } = await supabase
      .from('competences')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la compétence',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Succès',
      description: 'Compétence supprimée',
    });

    fetchCompetences();
  };

  const handleMovePosition = async (competence: Competence, direction: 'up' | 'down') => {
    const sortedCompetences = [...competences].sort((a, b) => a.position - b.position);
    const currentIndex = sortedCompetences.findIndex(c => c.id === competence.id);
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedCompetences.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetCompetence = sortedCompetences[targetIndex];

    // Swap positions
    const { error } = await supabase
      .from('competences')
      .update({ position: targetCompetence.position })
      .eq('id', competence.id);

    if (!error) {
      await supabase
        .from('competences')
        .update({ position: competence.position })
        .eq('id', targetCompetence.id);
    }

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de réorganiser les compétences',
        variant: 'destructive',
      });
      return;
    }

    fetchCompetences();
  };

  const getDisplayImage = (c: Competence) => {
    if (c.image_mode === 'upload' && c.image_file) return c.image_file;
    if (c.image_mode === 'url' && c.image_url) return c.image_url;
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Liste des compétences</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une compétence
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCompetence ? 'Modifier la compétence' : 'Ajouter une compétence'}
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
                <Label htmlFor="icon">Icône (Emoji ou Lucide Icon Name)</Label>
                <Input
                  id="icon"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              {/* Image Mode Selector */}
              <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                <Label className="text-base font-semibold">Image de la compétence (visible sur la page dédiée)</Label>
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
                    <Label htmlFor="image_url">URL de l'image</Label>
                    <Input
                      id="image_url"
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
                    <Label htmlFor="image_file">Téléverser une image</Label>
                    <Input
                      ref={fileInputRef}
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
                    En mode automatique, une image par défaut sera utilisée si aucune image n'est spécifiée.
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={uploading}>
                {editingCompetence ? 'Mettre à jour' : 'Créer'}
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
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {competences
            .sort((a, b) => a.position - b.position)
            .map((competence) => {
              const displayImage = getDisplayImage(competence);
              return (
                <TableRow key={competence.id}>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMovePosition(competence, 'up')}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMovePosition(competence, 'down')}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-2xl">{competence.icon}</TableCell>
                  <TableCell className="font-medium">{competence.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{competence.description}</TableCell>
                  <TableCell>
                    {displayImage ? (
                      <img src={displayImage} alt={competence.title} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Auto</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(competence)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(competence.id)}
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

export default AdminCompetences;