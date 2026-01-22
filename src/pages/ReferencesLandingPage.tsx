import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminEditBar from '@/components/AdminEditBar';
import { useEditMode } from '@/contexts/EditModeContext';
import EditableText from '@/components/EditableText';
import { useSiteTexts } from '@/hooks/useSupabaseData'; // Removed useReferencesPageSettings from here
import { useReferencesPageSettings } from '@/hooks/useReferencesPageSettings'; // Corrected import path
import heroImage from '@/assets/hero-engineering.jpg';
import SectorsGrid from '@/components/SectorsGrid';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const ReferencesLandingPage = () => {
  const { getSiteText } = useSiteTexts();
  const { isAdmin } = useEditMode();
  const { referencesPageSettings } = useReferencesPageSettings();

  const sectorsGridRef = useRef<HTMLDivElement>(null); // Ref for the sectors grid

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getHeroMedia = () => {
    if (!referencesPageSettings) return { type: 'image', url: heroImage };
    
    const { media_type, source_type, media_url, media_file } = referencesPageSettings;

    if (source_type === 'upload' && media_file) {
      return { type: media_type, url: media_file };
    }
    if (source_type === 'url' && media_url) {
      return { type: media_type, url: media_url };
    }
    return { type: 'image', url: heroImage };
  };

  const heroMedia = getHeroMedia();
  const isVideo = heroMedia.type === 'video' && heroMedia.url;

  return (
    <div className="min-h-screen flex flex-col">
      <AdminEditBar />
      <div className={isAdmin ? 'pt-12' : ''}>
        <Header />
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative min-h-[33vh] flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-background overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              {isVideo ? (
                <video 
                  src={heroMedia.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={heroMedia.url} 
                  alt="Références en ingénierie électrique"
                  className="w-full h-full object-cover"
                  width="1920"
                  height="1080"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 pointer-events-none"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                <EditableText 
                  textKey="references.landing.title"
                  defaultValue={getSiteText('references', 'landing', 'title', 'Nos Références par Secteur d\'Activité')}
                  className="inline" 
                  as="span" 
                />
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                <EditableText 
                  textKey="references.landing.description"
                  defaultValue={getSiteText('references', 'landing', 'description', 'Explorez nos réalisations classées par domaines d\'expertise et types de projets.')}
                  className="inline" 
                  as="span" 
                  multiline 
                />
              </p>
            </div>
          </section>

          {/* Sectors Grid Section */}
          <section id="sectors-grid" className="section-padding bg-white">
            <div className="container mx-auto px-4 lg:px-8" ref={sectorsGridRef}>
              <SectorsGrid />
            </div>
          </section>
        </main>
        <Footer />
      </div>
      <ScrollToTopButton targetRef={sectorsGridRef} />
    </div>
  );
};

export default ReferencesLandingPage;