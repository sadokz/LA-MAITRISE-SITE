import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DomainsPageSettings {
  id: number;
  media_type: 'image' | 'video';
  source_type: 'upload' | 'url';
  media_url: string | null;
  media_file: string | null;
}

export const useDomainsPageSettings = () => {
  const [settings, setSettings] = useState<DomainsPageSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from('domains_page_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (!error && data) {
      setSettings(data as DomainsPageSettings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { domainsPageSettings: settings, loading, fetchDomainsPageSettings: fetchSettings };
};