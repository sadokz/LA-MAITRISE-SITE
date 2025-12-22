import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import EditableText from '@/components/EditableText';
import { useSiteTexts, useRealisations } from '@/hooks/useSupabaseData';
import { useRealisationsPageSettings } from '@/hooks/useRealisationsPageSettings'; // Import the new hook
import AdminEditBar from '@/components/AdminEditBar';
import { useEditMode } from '@/contexts/EditModeContext';
import heroImage from '@/assets/hero-engineering.jpg'; // Default hero image

// Fallback images by category for auto mode (copied from References.tsx for consistency)
const fallbackImages: Record<string, string> = {
  'CFO': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
  'CFA': 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop',
  'Éclairage Public': 'https://images.unsplash.com/photo-1545558014_8692077e9b5c?w=600&h=400&fit=crop',
  'SSI': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
  'Ascenseurs': 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop',
  'Photovoltaïque': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop',
  'default': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
};

const RealisationsPage = () => {
  const { getSiteText } = useSiteTexts();
  const { isAdmin } = useEditMode();
  const { realisations, loading: realisationsLoading } = useRealisations();
  const { realisationsPageSettings } = useRealisationsPageSettings(); // Use the new hook

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter realisations to only include visible ones for public display
  const visibleRealisations = useMemo(() => realisations.filter(r => r.is_visible), [realisations]);

  // Get display image for a realisation (copied from References.tsx for consistency)
  const getDisplayImage = (r: typeof realisations[0]) => {
    if (r.image_mode === 'upload' && r.image_file) {
      return r.image_file;
    }
    if (r.image_mode === 'url' && r.image_url) {
      return r.image_url;
    }
    // Auto mode: use fallback based on category
    return fallbackImages[r.category] || fallbackImages['default'];
  };

  // Determine hero media based on settings
  const getHeroMedia = () => {
    if (!realisationsPageSettings) return { type: 'image', url: heroImage };
    
    const { media_type, source_type, media_url, media_file } = realisationsPageSettings;

    if (source_type === 'upload' && media_file) {
      return { type: media_type, url: media_file };
    }
    if (source_type === 'url' && media_url) {
      return { type: media_type, url: media_url };
    }
    return { type: 'image', url: heroImage }; // Fallback to default hero image
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
                  alt="Réalisations en ingénierie électrique" 
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
                  textKey="realisations.page.title" 
                  defaultValue={getSiteText('realisations', 'page', 'title', 'Nos Réalisations')} 
                  className="inline" 
                  as="span" 
                />
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                <EditableText 
                  textKey="realisations.page.description" 
                  defaultValue={getSiteText('realisations', 'page', 'description', 'Découvrez nos projets et réalisations dans le domaine de l\'ingénierie électrique')} 
                  className="inline" 
                  as="span" 
                  multiline 
                />
              </p>
            </div>
          </section>

          {/* Back to Home Button */}
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <Button asChild variant="outline" className="group">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Accueil
              </Link>
            </Button>
          </div>

          {/* Projects Section */}
          <section className="section-padding bg-white pt-0"> {/* Adjusted padding-top */}
            <div className="container mx-auto px-4 lg:px-8">
              {realisationsLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : visibleRealisations.length === 0 ? (
                <div className="text-center py-20 text-gray-medium">
                  <p>Aucune réalisation n'est disponible pour le moment.</p>
                  <Button asChild className="mt-8">
                    <Link to="/" className="inline-flex items-center">
                      <ArrowLeft className="mr-2 h-4 w-4" /> 
                      Retour à l'accueil
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-20">
                  {visibleRealisations.sort((a, b) => a.position - b.position).map((project, index) => {
                    const isImageLeft = index % 2 === 0; // Alternate layout
                    const displayImage = getDisplayImage(project);

                    return (
                      <div 
                        key={project.id} 
                        className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-fade-up`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Image Column */}
                        <div className={`${isImageLeft ? 'order-1' : 'order-2'} md:order-none`}>
                          <img 
                            src={displayImage} 
                            alt={project.title} 
                            className="w-full h-72 object-cover rounded-xl shadow-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = fallbackImages['default'];
                              console.warn(`Image non disponible pour "${project.title}", fallback utilisé.`);
                            }}
                          />
                        </div>

                        {/* Description Column */}
                        <div className={`${isImageLeft ? 'order-2' : 'order-1'} md:order-none space-y-4`}>
                          <h2 className="font-heading font-bold text-3xl text-gray-dark">
                            {project.title}
                          </h2>
                          <p className="text-lg font-medium text-orange">
                            {project.category}
                          </p>
                          <p className="text-gray-medium leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default RealisationsPage;