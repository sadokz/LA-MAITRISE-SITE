import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSectionVisibility } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Home, Users, Zap, Grid3X3, FolderOpen, User, Mail } from 'lucide-react';

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
  { key: 'projects', label: 'Références / Réalisations', icon: <FolderOpen className="h-5 w-5" /> },
  { key: 'founder', label: 'Le Fondateur', icon: <User className="h-5 w-5" /> },
  { key: 'contact', label: 'Contact', icon: <Mail className="h-5 w-5" /> },
];

const AdminSections = () => {
  const { data: visibility, isLoading, refetch } = useSectionVisibility();

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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visibilité des sections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3X3 className="h-5 w-5" />
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
  );
};

export default AdminSections;
