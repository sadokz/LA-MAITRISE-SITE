import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, ArrowUp, ArrowDown, Upload, Link, Box } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useDomaines, Domaine } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';

type IconType = 'builtin' | 'url' | 'upload';

const AdminDomaines = () => {
  const { domaines, fetchDomaines } = useDomaines();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDomaine, setEditingDomaine] = useState<Domaine | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: '',
    description: '', // Short description
    long_description: '', // Long description
    image_url: '',
    icon_type: 'builtin' as IconType,
    icon_url: '',
    icon_file: '',
    icon_border_color: '#3B82F6',
  });
  const { toast } = useToast();

  const resetForm = () => {
    setForm({ 
      title: '', 
      description: '', 
      long_description: '',
      image_url: '',
      icon_type: 'builtin',
      icon_url: '',
      icon_file: '',
      icon_border_color: '#3B82F6',
    });
    setEditingDomaine(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Type de fichier invalide',
        description: 'Veuillez téléverser un fichier SVG, PNG, JPEG ou WebP',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 500KB)
    if (file.size > 500 * 1024) {
      toast({
        title: 'Fichier trop volumineux',
        description: 'La taille maximale est de 500KB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `icons/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('domain-icons')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('domain-icons')
        .getPublicUrl(filePath);

      setForm({ 
        ...form, 
        icon_type: 'upload', 
        icon_file: publicUrl,
        icon_url: '',
      });

      toast({
        title: 'Succès',
        description: 'Icône téléversée avec succès',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de téléverser l\'icône',
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
      long_description: form.long_description || null, // Save long description
      image_url: form.image_url || null,
      icon_type: form.icon_type,
      icon_url: form.icon_type === 'url' ? form.icon_url : null,
      icon_file: form.icon_type === 'upload' ? form.icon_file : null,
      icon_border_color: (form.icon_type === 'upload' || form.icon_type === 'url') ? form.icon_border_color : null,
    };

    if (editingDomaine) {
      const { error } = await supabase
        .from('domaines')
        .update(payload)
        .eq('id', editingDomaine.id);

      if (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de mettre à jour le domaine',
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
        toast({
          title: 'Erreur',
          description: 'Impossible de créer le domaine',
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
      long_description: domaine.long_description || '', // Load long description
      image_url: domaine.image_url || '',
      icon_type: domaine.icon_type || 'builtin',
      icon_url: domaine.icon_url || '',
      icon_file: domaine.icon_file || '',
      icon_border_color: domaine.icon_border_color || '#3B82F6',
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
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le domaine',
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
      toast({
        title: 'Erreur',
        description: 'Impossible de réorganiser les domaines',
        variant: 'destructive',
      });
      return;
    }

    fetchDomaines();
  };

  const getIconPreview = () => {
    if (form.icon_type === 'upload' && form.icon_file) {
      return form.icon_file;
    }
    if (form.icon_type === 'url' && form.icon_url) {
      return form.icon_url;
    }
    return null;
  };

  const getDomaineIconPreview = (domaine: Domaine) => {
    if (domaine.icon_type === 'upload' && domaine.icon_file) {
      return domaine.icon_file;
    }
    if (domaine.icon_type === 'url' && domaine.icon_url) {
      return domaine.icon_url;
    }
    return null;
  };

  const iconPreview = getIconPreview();

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

              {/* Icon Section */}
              <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                <Label className="text-base font-semibold">Icône du domaine</Label>
                
                {/* Icon Type Selection */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={form.icon_type === 'builtin' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setForm({ ...form, icon_type: 'builtin', icon_url: '', icon_file: '' })}
                    className="flex-1"
                  >
                    <Box className="h-4 w-4 mr-1" />
                    Par défaut
                  </Button>
                  <Button
                    type="button"
                    variant={form.icon_type === 'upload' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setForm({ ...form, icon_type: 'upload' })}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Téléverser
                  </Button>
                  <Button
                    type="button"
                    variant={form.icon_type === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setForm({ ...form, icon_type: 'url' })}
                    className="flex-1"
                  >
                    <Link className="h-4 w-4 mr-1" />
                    URL
                  </Button>
                </div>

                {/* Upload Input */}
                {form.icon_type === 'upload' && (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".svg,.png,.jpg,.jpeg,.webp"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="icon-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full"
                    >
                      {uploading ? 'Téléversement...' : 'Choisir un fichier (SVG, PNG, max 500KB)'}
                    </Button>
                  </div>
                )}

                {/* URL Input */}
                {form.icon_type === 'url' && (
                  <div>
                    <Input
                      placeholder="https://exemple.com/icone.svg"
                      value={form.icon_url}
                      onChange={(e) => setForm({ ...form, icon_url: e.target.value })}
                    />
                  </div>
                )}

                {/* Border Color - Only for custom icons */}
                {(form.icon_type === 'upload' || form.icon_type === 'url') && (
                  <div className="space-y-2">
                    <Label htmlFor="icon_border_color">Couleur du cadre de l'icône</Label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        id="icon_border_color"
                        value={form.icon_border_color}
                        onChange={(e) => setForm({ ...form, icon_border_color: e.target.value })}
                        className="w-12 h-10 rounded cursor-pointer border border-input"
                      />
                      <Input
                        value={form.icon_border_color}
                        onChange={(e) => setForm({ ...form, icon_border_color: e.target.value })}
                        placeholder="#3B82F6"
                        className="flex-1"
                        maxLength={7}
                      />
                    </div>
                  </div>
                )}

                {/* Preview */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Aperçu :</span>
                  {iconPreview ? (
                    <div 
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2"
                      style={{ 
                        border: `3px solid ${form.icon_border_color}`,
                        boxShadow: `0 0 0 1px ${form.icon_border_color}20`
                      }}
                    >
                      <img 
                        src={iconPreview} 
                        alt="Aperçu icône" 
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <Box className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">URL de l'image de fond (optionnel)</Label>
                <Input
                  id="image_url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <Button type="submit" className="w-full">
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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domaines
            .sort((a, b) => a.position - b.position)
            .map((domaine) => {
              const iconSrc = getDomaineIconPreview(domaine);
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
                  <TableCell>
                    {iconSrc ? (
                      <div 
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1.5"
                        style={{ 
                          border: `2px solid ${domaine.icon_border_color || '#3B82F6'}` 
                        }}
                      >
                        <img 
                          src={iconSrc} 
                          alt={domaine.title} 
                          className="w-5 h-5 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                        <Box className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{domaine.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{domaine.description}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {domaine.long_description || <span className="text-muted-foreground italic">Non définie</span>}
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