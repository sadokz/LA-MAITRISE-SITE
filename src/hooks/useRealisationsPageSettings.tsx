import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RealisationsPageSettings {
  id: number;
  media_type: 'image' | 'video';
  source_type: 'upload' | 'url';
  media_url: string | null;
  media_file: string | null;
}

export const useRealisationsPageSettings = () => {
  const [settings, setSettings] = useState<RealisationsPageSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from('realisations_page_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (!error && data) {
      setSettings(data as RealisationsPageSettings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { realisationsPageSettings: settings, loading, fetchRealisationsPageSettings: fetchSettings };
};