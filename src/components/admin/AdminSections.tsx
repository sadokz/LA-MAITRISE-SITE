import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSectionVisibility } from '@/hooks/useSupabaseData';
import { useAppColors } from '@/hooks/useAppColors';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Home, Users, Zap, Grid3X3, FolderOpen, User, Mail, LayoutGrid, Image, MessageCircle, Palette, RefreshCw, FileText } from 'lucide-react';
import AdminCompetencesPageHero from './AdminCompetencesPageHero';
import AdminDomainsPageHero from './AdminDomainsPageHero';
import AdminReferencesPageHero from './AdminReferencesPageHero';

interface ConfigItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

const sections: ConfigItem[] = [
  { key: 'home', label: 'Accueil (Hero)', icon: <Home className="h-5 w-5" /> },
  { key: 'about', label: 'À propos (Intro)', icon: <Users className="h-5 w-5" /> },
  { key: 'skills', label: 'Compétences', icon: <Zap className="h-5 w-5" /> },
  { key: 'domains', label: 'Domaines d\'intervention', icon: <Grid3X3 className="h-5 w-5" /> },
  { key: 'projects', label: 'Références', icon: <FolderOpen className="h-5 w-5" /> },
  { key: 'founder', label: 'À Propos', icon: <User className="h-5 w-5" /> },
  { key: 'contact', label: 'Contact', icon: <Mail className="h-5 w-5" /> },
  { key: 'chatbot_visible', label: 'Chatbot', icon: <MessageCircle className="h-5 w-5" /> },
];

const pages: ConfigItem[] = [
  { key: 'page_competences', label: 'Page Compétences', icon: <FileText className="h-5 w-5" /> },
  { key: 'page_domaines', label: 'Page Domaines', icon: <FileText className="h-5 w-5" /> },
  { key: 'page_references', label: 'Page Références', icon: <FileText className="h-5 w-5" /> },
];

const AdminSections = () => {
  const { data: visibility, isLoading, refetch } = useSectionVisibility();
  const { appColors, loading: colorsLoading, updateAppColors, isUpdating } = useAppColors();
  const [primaryColor, setPrimaryColor] = useState<string>('#FF7F00');
  const [secondaryColor, setSecondaryColor] = useState<string>('#F0F0F0');

  useEffect(() => {
    if (appColors) {
      setPrimaryColor(appColors.primary_color_hex);
      setSecondaryColor(appColors.secondary_color_hex);
    }
  }, [appColors]);

  const handleToggle = async (key: string, newValue: boolean, type: 'section' | 'page') => {
    try {
      const { error } = await supabase
        .from('section_visibility')
        .update({ [key]: newValue })
        .eq('id', 1);

      if (error) throw error;

      const label = type === 'section' 
        ? sections.find(s => s.key === key)?.label 
        : pages.find(p => p.key === key)?.label;

      toast.success(`${label} ${newValue ? 'activée' : 'désactivée'}`);
      refetch();
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleSaveColors = () => {
    updateAppColors({
      primary_color_hex: primaryColor,
      secondary_color_hex: secondaryColor,
    });
  };

  const handleResetColors = () => {
    updateAppColors({
      primary_color_hex: '#FF7F00',
      secondary_color_hex: '#F0F0F0',
    });
  };

  if (isLoading || colorsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement des paramètres...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Color Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Paramètres des couleurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="primary-color" className="block text-sm font-medium text-gray-dark mb-2">
                Couleur Primaire
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-12 p-0 border-none cursor-pointer"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="secondary-color" className="block text-sm font-medium text-gray-dark mb-2">
                Couleur Secondaire
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-12 h-12 p-0 border-none cursor-pointer"
                />
                <Input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button onClick={handleSaveColors} disabled={isUpdating}>
              {isUpdating ? 'Sauvegarde...' : 'Sauvegarder les couleurs'}
            </Button>
            <Button variant="outline" onClick={handleResetColors} disabled={isUpdating}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5" />
            Visibilité des sections (Page d'accueil)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sections.map((section) => {
              const isVisible = visibility?.[section.key as keyof typeof visibility] ?? true;
              return (
                <div key={section.key} className={`flex items-center justify-between p-4 rounded-lg border ${isVisible ? 'bg-green-50 border-green-200' : 'bg-muted/50 border-border'}`}>
                  <div className="flex items-center gap-3">
                    <div className={isVisible ? 'text-green-600' : 'text-muted-foreground'}>{section.icon}</div>
                    <Label htmlFor={`toggle-${section.key}`} className="font-medium cursor-pointer">{section.label}</Label>
                  </div>
                  <Switch id={`toggle-${section.key}`} checked={isVisible} onCheckedChange={(checked) => handleToggle(section.key, checked, 'section')} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Page Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Visibilité des pages dédiées
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Désactiver une page la masquera de la navigation et désactivera les boutons "En savoir plus".
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pages.map((page) => {
              const isVisible = visibility?.[page.key as keyof typeof visibility] ?? true;
              return (
                <div key={page.key} className={`flex items-center justify-between p-4 rounded-lg border ${isVisible ? 'bg-blue-50 border-blue-200' : 'bg-muted/50 border-border'}`}>
                  <div className="flex items-center gap-3">
                    <div className={isVisible ? 'text-blue-600' : 'text-muted-foreground'}>{page.icon}</div>
                    <Label htmlFor={`toggle-${page.key}`} className="font-medium cursor-pointer">{page.label}</Label>
                  </div>
                  <Switch id={`toggle-${page.key}`} checked={isVisible} onCheckedChange={(checked) => handleToggle(page.key, checked, 'page')} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Page Hero Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Paramètres des bannières de page
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AdminCompetencesPageHero />
          <AdminDomainsPageHero />
          <AdminReferencesPageHero />
        </CardContent>
      </div>
    </div>
  );
};

export default AdminSections;