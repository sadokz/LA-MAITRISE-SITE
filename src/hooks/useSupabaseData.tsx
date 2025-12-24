import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReferencesPageSettings } from './useReferencesPageSettings'; // Renamed import

// Section Visibility types
export interface SectionVisibility {
  id: number;
  home: boolean;
  about: boolean;
  skills: boolean;
  domains: boolean;
  projects: boolean; // Renamed key
  founder: boolean;
  contact: boolean;
  chatbot_visible: boolean; // New: Chatbot visibility
  created_at: string;
  updated_at: string;
}

export const useSectionVisibility = () => {
  return useQuery({
    queryKey: ['section_visibility'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_visibility')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      return data as SectionVisibility;
    },
  });
};

export interface SiteText {
  id: string;
  page: string;
  section: string;
  key: string;
  content: string;
}

export interface Competence {
  id: string;
  title: string;
  description: string; // Short description
  long_description?: string; // New: Long description
  icon: string;
  position: number;
  image_mode: 'auto' | 'url' | 'upload';
  image_url?: string;
  image_file?: string;
}

export interface Domaine {
  id: string;
  title: string;
  description: string; // Short description
  long_description?: string; // New: Long description
  image_url?: string; // New: Image URL for the domain page
  image_mode: 'auto' | 'url' | 'upload'; // New: Image mode
  image_file?: string; // New: Uploaded image file URL
  position: number;
  icon: string; // Now directly stores the text/emoji
}

export interface ReferenceImage { // Renamed interface
  id: string;
  reference_id: string; // Renamed column
  image_url?: string;
  image_file?: string;
  image_mode: 'auto' | 'url' | 'upload';
  position: number;
}

export interface Reference { // Renamed interface
  id: string;
  title: string;
  description: string;
  long_description?: string; // Added long_description
  category: string;
  image_url?: string; // Main image URL
  image_mode: 'auto' | 'url' | 'upload'; // Main image mode
  image_file?: string; // Main image file
  position: number;
  is_visible: boolean;
  is_featured: boolean;
  date_text?: string; // New: Date text for the reference
  emplacement?: string; // New: Emplacement for the reference
  reference?: string; // New: Reference for the reference
  images?: ReferenceImage[]; // New: Array of additional images (Renamed interface)
  parsed_year?: number; // New: For client-side sorting
}

export const useSiteTexts = () => {
  const [siteTexts, setSiteTexts] = useState<SiteText[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteTexts();
  }, []);

  const fetchSiteTexts = async () => {
    const { data, error } = await supabase
      .from('site_texts')
      .select('*')
      .order('page', { ascending: true });
    
    if (!error && data) {
      setSiteTexts(data);
    }
    setLoading(false);
  };

  const getSiteText = (page: string, section: string, key: string, fallback: string = '') => {
    const text = siteTexts.find(t => t.page === page && t.section === section && t.key === key);
    return text?.content || fallback;
  };

  return { siteTexts, loading, fetchSiteTexts, getSiteText };
};

export const useCompetences = () => {
  const [competences, setCompetences] = useState<Competence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompetences();
  }, []);

  const fetchCompetences = async () => {
    const { data, error } = await supabase
      .from('competences')
      .select('*')
      .order('position', { ascending: true });
    
    if (!error && data) {
      setCompetences(data as Competence[]);
    }
    setLoading(false);
  };

  return { competences, loading, fetchCompetences };
};

export const useDomaines = () => {
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDomaines();
  }, []);

  const fetchDomaines = async () => {
    const { data, error } = await supabase
      .from('domaines')
      .select('*')
      .order('position', { ascending: true });
    
    if (!error && data) {
      setDomaines(data as Domaine[]);
    }
    setLoading(false);
  };

  return { domaines, loading, fetchDomaines };
};

export interface Founder {
  id: number;
  name: string;
  title: string;
  since_year: number;
  founder_since: number;
  since_line: string;
  founder_since_line: string;
  bio_html: string;
  photo_path?: string;
  quote?: string;
  experience_text_1?: string;
  experience_text_2?: string;
  experience_text_3?: string;
  experience_text_4?: string;
  values_title?: string;
  value_1_title?: string;
  value_1_description?: string;
  value_2_title?: string;
  value_2_description?: string;
  value_3_title?: string;
  value_3_description?: string;
}

export interface ContactText {
  id: string;
  key: string;
  content: string;
}

export interface HeroSettings {
  id: number;
  hero_media_type: 'image' | 'video';
  hero_source_type: 'upload' | 'url';
  hero_media_url: string | null;
  hero_media_file: string | null;
}

export const useHeroSettings = () => {
  const [heroSettings, setHeroSettings] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHeroSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from('hero_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (!error && data) {
      setHeroSettings(data as HeroSettings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHeroSettings();
  }, [fetchHeroSettings]);

  return { heroSettings, loading, fetchHeroSettings };
};

export const useReferences = () => { // Renamed hook
  const [references, setReferences] = useState<Reference[]>([]); // Renamed state and interface
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferences(); // Renamed function
  }, []);

  const fetchReferences = async () => { // Renamed function
    const { data, error } = await supabase
      .from('references') // Renamed table
      .select('*, reference_images(*)') // Fetch related images (Renamed table and column)
      .order('position', { ascending: true }); // Keep initial order for consistency before client-side sort
    
    if (!error && data) {
      const processedReferences = data.map(r => { // Renamed variable
        // Extract year from date_text for sorting
        const yearMatch = r.date_text?.match(/\d{4}/);
        const parsedYear = yearMatch ? parseInt(yearMatch[0]) : 0;

        return {
          ...r,
          images: r.reference_images ? [...r.reference_images].sort((a, b) => a.position - b.position) : [], // Renamed column
          parsed_year: parsedYear,
        };
      });

      // Sort by year (newest first), then by original position
      const sortedReferences = processedReferences.sort((a, b) => { // Renamed variable
        if (a.parsed_year !== b.parsed_year) {
          return (b.parsed_year || 0) - (a.parsed_year || 0); // Newest year first
        }
        return a.position - b.position; // Maintain original position for same year
      });

      setReferences(sortedReferences as Reference[]); // Renamed state and interface
    }
    setLoading(false);
  };

  return { references, loading, fetchReferences }; // Renamed state and function
};

export const useFounder = () => {
  const [founder, setFounder] = useState<Founder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFounder();
  }, []);

  const fetchFounder = async () => {
    const { data, error } = await supabase
      .from('founder')
      .select('*')
      .single();
    
    if (!error && data) {
      setFounder(data);
    }
    setLoading(false);
  };

  return { founder, loading, fetchFounder };
};

export const useContactTexts = () => {
  const [contactTexts, setContactTexts] = useState<ContactText[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactTexts();
  }, []);

  const fetchContactTexts = async () => {
    const { data, error } = await supabase
      .from('contact_texts')
      .select('*')
      .order('key', { ascending: true });
    
    if (!error && data) {
      setContactTexts(data);
    }
    setLoading(false);
  };

  const getContactText = (key: string, fallback: string = '') => {
    const text = contactTexts.find(t => t.key === key);
    return text?.content || fallback;
  };

  return { contactTexts, loading, fetchContactTexts, getContactText };
};