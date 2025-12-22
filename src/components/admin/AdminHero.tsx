import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Link, Image, Video, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HeroSettings {
  id: number;
  hero_media_type: 'image' | 'video';
  hero_source_type: 'upload' | 'url';
  hero_media_url: string | null;
  hero_media_file: string | null;
}

const AdminHero = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [form, setForm] = useState({
    hero_media_type: 'image' as 'image' | 'video',
    hero_source_type: 'upload' as 'upload' | 'url',
    hero_media_url: '',
    hero_media_file: ''
  });

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const typedData = data as HeroSettings;
        setSettings(typedData);
        setForm({
          hero_media_type: typedData.hero_media_type,
          hero_source_type: typedData.hero_source_type,
          hero_media_url: typedData.hero_media_url || '',
          hero_media_file: typedData.hero_media_file || ''
        });
      }
    } catch (error) {
      console.error('Error fetching hero settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres du Hero",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = form.hero_media_type === 'image';
    const validTypes = isImage 
      ? ['image/png', 'image/jpeg', 'image/webp']
      : ['video/mp4'];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Type de fichier invalide",
        description: isImage 
          ? "Formats acceptés: PNG, JPG, WebP" 
          : "Format accepté: MP4",
        variant: "destructive"
      });
      return;
    }

    // Max size: 50MB for videos, 10MB for images
    const maxSize = isImage ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: isImage 
          ? "Taille maximale: 10 Mo" 
          : "Taille maximale: 50 Mo",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;

      // Delete old file if exists
      if (form.hero_media_file) {
        const oldFileName = form.hero_media_file.split('/').pop();
        if (oldFileName) {
          await supabase.storage.from('hero-media').remove([oldFileName]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('hero-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('hero-media')
        .getPublicUrl(fileName);

      setForm({ ...form, hero_media_file: publicUrl });
      
      toast({
        title: "Fichier téléversé",
        description: "Le fichier a été téléversé avec succès"
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erreur",
        description: "Impossible de téléverser le fichier",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('hero_settings')
        .update({
          hero_media_type: form.hero_media_type,
          hero_source_type: form.hero_source_type,
          hero_media_url: form.hero_source_type === 'url' ? form.hero_media_url : null,
          hero_media_file: form.hero_source_type === 'upload' ? form.hero_media_file : null
        })
        .eq('id', 1);

      if (error) throw error;

      toast({
        title: "Enregistré",
        description: "Les paramètres du Hero ont été mis à jour"
      });
      
      fetchSettings();
    } catch (error) {
      console.error('Error saving hero settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    try {
      // Delete uploaded file if exists
      if (form.hero_media_file) {
        const fileName = form.hero_media_file.split('/').pop();
        if (fileName) {
          await supabase.storage.from('hero-media').remove([fileName]);
        }
      }

      const { error } = await supabase
        .from('hero_settings')
        .update({
          hero_media_type: 'image',
          hero_source_type: 'upload',
          hero_media_url: null,
          hero_media_file: null
        })
        .eq('id', 1);

      if (error) throw error;

      setForm({
        hero_media_type: 'image',
        hero_source_type: 'upload',
        hero_media_url: '',
        hero_media_file: ''
      });

      toast({
        title: "Réinitialisé",
        description: "Le fond par défaut sera utilisé"
      });
      
      fetchSettings();
    } catch (error) {
      console.error('Error resetting hero settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getPreviewUrl = () => {
    if (form.hero_source_type === 'upload' && form.hero_media_file) {
      return form.hero_media_file;
    }
    if (form.hero_source_type === 'url' && form.hero_media_url) {
      return form.hero_media_url;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const previewUrl = getPreviewUrl();

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Image className="h-5 w-5" />
          Média de fond (Accueil / Hero)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Media Type */}
          <div>
            <Label>Type de média</Label>
            <Select 
              value={form.hero_media_type} 
              onValueChange={(value: 'image' | 'video') => setForm({ ...form, hero_media_type: value, hero_media_file: '', hero_media_url: '' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="image">
                  <span className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Image
                  </span>
                </SelectItem>
                <SelectItem value="video">
                  <span className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Vidéo
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Source Type */}
          <div>
            <Label>Source</Label>
            <Select 
              value={form.hero_source_type} 
              onValueChange={(value: 'upload' | 'url') => setForm({ ...form, hero_source_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="upload">
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Téléverser
                  </span>
                </SelectItem>
                <SelectItem value="url">
                  <span className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    URL
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Upload or URL input */}
        {form.hero_source_type === 'upload' ? (
          <div className="mb-4">
            <Label>Fichier</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="file"
                accept={form.hero_media_type === 'image' ? 'image/png,image/jpeg,image/webp' : 'video/mp4'}
                onChange={handleFileUpload}
                disabled={uploading}
                className="flex-1"
              />
              {uploading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {form.hero_media_type === 'image' 
                ? 'Formats: PNG, JPG, WebP (max 10 Mo)' 
                : 'Format: MP4 (max 50 Mo)'}
            </p>
          </div>
        ) : (
          <div className="mb-4">
            <Label>URL du média</Label>
            <Input
              type="url"
              value={form.hero_media_url}
              onChange={(e) => setForm({ ...form, hero_media_url: e.target.value })}
              placeholder={form.hero_media_type === 'image' ? 'https://exemple.com/image.jpg' : 'https://exemple.com/video.mp4'}
            />
          </div>
        )}

        {/* Preview */}
        {previewUrl && (
          <div className="mb-4">
            <Label>Aperçu</Label>
            <div className="mt-1 relative aspect-video bg-black rounded-lg overflow-hidden max-w-md">
              {form.hero_media_type === 'image' ? (
                <img 
                  src={previewUrl} 
                  alt="Aperçu du fond" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <video 
                  src={previewUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
              {/* Overlay preview */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 flex items-center justify-center">
                <p className="text-white text-sm font-medium">Aperçu avec overlay</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={saving}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser (fond par défaut)
          </Button>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h4 className="font-medium mb-2">État actuel</h4>
        {settings?.hero_media_file || settings?.hero_media_url ? (
          <p className="text-sm text-muted-foreground">
            {settings.hero_media_type === 'image' ? '🖼️ Image' : '🎬 Vidéo'} personnalisée définie 
            ({settings.hero_source_type === 'upload' ? 'téléversée' : 'via URL'})
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            📷 Fond par défaut (image statique)
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminHero;
