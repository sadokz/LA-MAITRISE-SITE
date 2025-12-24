import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ReferencesPageSettings { // Renamed interface
  id: number;
  media_type: 'image' | 'video';
  source_type: 'upload' | 'url';
  media_url: string | null;
  media_file: string | null;
}

export const useReferencesPageSettings = () => { // Renamed hook
  const [settings, setSettings] = useState<ReferencesPageSettings | null>(null); // Renamed state and interface
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from('references_page_settings') // Renamed table
      .select('*')
      .eq('id', 1)
      .single();
    
    if (!error && data) {
      setSettings(data as ReferencesPageSettings); // Renamed interface
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { referencesPageSettings: settings, loading, fetchReferencesPageSettings: fetchSettings }; // Renamed return values
};