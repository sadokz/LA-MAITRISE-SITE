import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSectionVisibility } from '@/hooks/useSupabaseData';
import { useAppColors } from '@/hooks/useAppColors'; // Import the new hook
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Home, Users, Zap, Grid3X3, FolderOpen, User, Mail, Lightbulb, Building, Trophy, LayoutGrid, Image, MessageCircle, Palette, RefreshCw } from 'lucide-react'; // Added Palette and RefreshCw icons
import AdminCompetencesPageHero from './AdminCompetencesPageHero';
import AdminDomainsPageHero from './AdminDomainsPageHero';
import AdminReferencesPageHero from './AdminReferencesPageHero'; // Renamed import

interface SectionConfig {
  key: string;
  label: string;
  icon: React.ReactNode;
}

const sections: SectionConfig[] = [
  { key: 'home', label: 'Accueil (Hero)', icon: <Home className="h-5 w-5" /> },
  { key: 'about', label: 'À propos', icon: <Users className="h-5 w-5" /> },
  { key: 'skills', label: 'Compétences', icon: <Zap className="h-5 w-5" /> },
  { key: 'domains', label: 'Domaines d\'intervention', icon: <Grid3X3 className="h-5 w-5" /> },
  { key: 'projects', label: 'Références', icon: <FolderOpen className="h-5 w-5" /> }, // Renamed label
  { key: 'founder', label: 'Le Fondateur', icon: <User className="h-5 w-5" /> },
  { key: 'contact', label: 'Contact', icon: <Mail className="h-5 w-5" /> },
  { key: 'chatbot_visible', label: 'Chatbot', icon: <MessageCircle className="h-5 w-5" /> }, // New chatbot toggle
];

const AdminSections = () => {
  const { data: visibility, isLoading, refetch } = useSectionVisibility();
  const { appColors, loading: colorsLoading, updateAppColors, isUpdating } = useAppColors();
  const [primaryColor, setPrimaryColor] = useState<string>('#FF7F00'); // Changed default to corporate orange
  const [secondaryColor, setSecondaryColor] = useState<string>('#F0F0F0'); // Default light gray

  useEffect(() => {
    if (appColors) {
      setPrimaryColor(appColors.primary_color_hex);
      setSecondaryColor(appColors.secondary_color_hex);
    }
  }, [appColors]);

  const handleToggle = async (sectionKey: string, newValue: boolean) => {
    try {
      const { error } = await supabase
        .from('section_visibility')
        .update({ [sectionKey]: newValue })
        .eq('id', 1);

      if (error) throw error;

      toast.success(`Section "${sections.find(s => s.key === sectionKey)?.label}" ${newValue ? 'affichée' : 'masquée'}`);
      refetch();
    } catch (error) {
      console.error('Error updating section visibility:', error);
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
      primary_color_hex: '#FF7F00', // Default primary color (corporate orange)
      secondary_color_hex: '#F0F0F0', // Default secondary color (light gray)
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
            Paramètres des couleurs de l'application
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Personnalisez les couleurs principales de votre site.
          </p>
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
              Réinitialiser les couleurs
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5" />
            Visibilité des sections
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Activez ou désactivez les sections du site public. Les sections masquées ne seront plus visibles par les visiteurs.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sections.map((section) => {
              const visibilityValue = visibility?.[section.key as keyof typeof visibility];
              const isVisible = typeof visibilityValue === 'boolean' ? visibilityValue : true;
              
              return (
                <div
                  key={section.key}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    isVisible 
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
                      : 'bg-muted/50 border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${isVisible ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {section.icon}
                    </div>
                    <Label 
                      htmlFor={`toggle-${section.key}`} 
                      className={`font-medium cursor-pointer ${
                        isVisible ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {section.label}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${isVisible ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {isVisible ? 'Visible' : 'Masquée'}
                    </span>
                    <Switch
                      id={`toggle-${section.key}`}
                      checked={isVisible}
                      onCheckedChange={(checked) => handleToggle(section.key, checked)}
                    />
                  </div>
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
          <p className="text-sm text-muted-foreground">
            Gérez les images ou vidéos de fond pour les pages dédiées aux compétences, domaines et références.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <AdminCompetencesPageHero />
          <AdminDomainsPageHero />
          <AdminReferencesPageHero /> {/* Renamed component */}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSections;