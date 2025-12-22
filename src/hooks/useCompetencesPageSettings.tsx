import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CompetencesPageSettings {
  id: number;
  media_type: 'image' | 'video';
  source_type: 'upload' | 'url';
  media_url: string | null;
  media_file: string | null;
}

export const useCompetencesPageSettings = () => {
  const [settings, setSettings] = useState<CompetencesPageSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from('competences_page_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (!error && data) {
      setSettings(data as CompetencesPageSettings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { competencesPageSettings: settings, loading, fetchCompetencesPageSettings: fetchSettings };
};