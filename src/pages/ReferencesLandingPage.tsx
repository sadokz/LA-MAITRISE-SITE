"use client";

import React, { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminEditBar from '@/components/AdminEditBar';
import { useEditMode } from '@/contexts/EditModeContext';
import { useDomainsPageSettings } from '@/hooks/useDomainsPageSettings';
import heroImage from '@/assets/hero-engineering.jpg';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import StatsHeader from '@/components/references/StatsHeader';
import ReferencesDashboard from '@/components/references/ReferencesDashboard';

const ReferencesLandingPage = () => {
  const { isAdmin } = useEditMode();
  const { domainsPageSettings } = useDomainsPageSettings();

  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getHeroMedia = () => {
    if (!domainsPageSettings) return { type: 'image', url: heroImage };
    
    const { media_type, source_type, media_url, media_file } = domainsPageSettings;

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
    <div className="min-h-screen flex flex-col bg-gray-light/20">
      <AdminEditBar />
      <div className={isAdmin ? 'pt-12' : ''}>
        <Header />
        <main className="flex-grow">
          {/* Hero Section - Plus compacte pour laisser place au dashboard */}
          <section className="relative min-h-[30vh] flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-background overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 pointer-events-none"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Nos Réalisations
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md">
                Découvrez l'expertise de LA MAITRISE ENGINEERING à travers nos projets emblématiques.
              </p>
            </div>
          </section>

          {/* Dashboard Section */}
          <section className="py-16 bg-transparent">
            <div className="container mx-auto px-4 lg:px-8" ref={dashboardRef}>
              {/* Stats Header */}
              <StatsHeader />
              
              {/* Main Dashboard */}
              <ReferencesDashboard />
            </div>
          </section>
        </main>
        <Footer />
      </div>
      <ScrollToTopButton targetRef={dashboardRef} />
    </div>
  );
};

export default ReferencesLandingPage;