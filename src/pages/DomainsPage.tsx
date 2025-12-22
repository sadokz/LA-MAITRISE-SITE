' button after the hero section on the Domains page.">
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import EditableText from '@/components/EditableText';
import { useSiteTexts, useDomaines } from '@/hooks/useSupabaseData';
import { useDomainsPageSettings } from '@/hooks/useDomainsPageSettings'; // Import the new hook
import AdminEditBar from '@/components/AdminEditBar';
import { useEditMode } from '@/contexts/EditModeContext';
import heroImage from '@/assets/hero-engineering.jpg'; // Default hero image

// Fallback images for auto mode (consistent with AdminDomaines)
const fallbackImages: Record<string, string> = {
  'default': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
  'Bâtiments Résidentiels': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
  'Bâtiments Tertiaires': 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop',
  'Industrie': 'https://images.unsplash.com/photo-1545558014_8692077e9b5c?w=600&h=400&fit=crop',
  'Infrastructures': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
  'Énergie': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop',
  'Santé': 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop',
};

const DomainsPage = () => {
  const { getSiteText } = useSiteTexts();
  const { isAdmin } = useEditMode();
  const { domaines, loading: domainesLoading } = useDomaines();
  const { domainsPageSettings } = useDomainsPageSettings(); // Use the new hook

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get display image for a domain (for the DomainsPage)
  const getDisplayImage = (domaine: typeof domaines[0]) => {
    if (domaine.image_mode === 'upload' && domaine.image_file) {
      return domaine.image_file;
    }
    if (domaine.image_mode === 'url' && domaine.image_url) {
      return domaine.image_url;
    }
    // Auto mode: use fallback based on title
    return fallbackImages[domaine.title] || fallbackImages['default'];
  };

  // Determine hero media based on settings
  const getHeroMedia = () => {
    if (!domainsPageSettings) return { type: 'image', url: heroImage };
    
    const { media_type, source_type, media_url, media_file } = domainsPageSettings;

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
                  alt="Domaines d'intervention" 
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
                  textKey="domains.page.title" 
                  defaultValue={getSiteText('domains', 'page', 'title', 'Nos Domaines d\'Intervention')} 
                  className="inline" 
                  as="span" 
                />
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                <EditableText 
                  textKey="domains.page.description" 
                  defaultValue={getSiteText('domains', 'page', 'description', 'Découvrez les secteurs dans lesquels notre expertise en ingénierie électrique et BIM s\'exprime')} 
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

          {/* Domains List Section */}
          <section className="section-padding bg-white pt-0">
            <div className="container mx-auto px-4 lg:px-8">
              {domainesLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : domaines.length === 0 ? (
                <div className="text-center py-20 text-gray-medium">
                  <p>Aucun domaine d'intervention n'est disponible pour le moment.</p>
                  <Button asChild className="mt-8">
                    <Link to="/" className="inline-flex items-center">
                      <ArrowLeft className="mr-2 h-4 w-4" /> 
                      Retour à l'accueil
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-20">
                  {domaines.sort((a, b) => a.position - b.position).map((domaine, index) => {
                    const displayImage = getDisplayImage(domaine);
                    const isImageLeft = index % 2 === 0; // Alternate layout

                    return (
                      <div 
                        key={domaine.id} 
                        className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-fade-up`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Image Column */}
                        {displayImage && (
                          <div className={`${isImageLeft ? 'order-1' : 'order-2'} md:order-none`}>
                            <img 
                              src={displayImage} 
                              alt={domaine.title} 
                              className="w-full h-72 object-cover rounded-xl shadow-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = fallbackImages['default'];
                                console.warn(`Image non disponible pour "${domaine.title}", fallback utilisé.`);
                              }}
                            />
                          </div>
                        )}

                        {/* Text Content Column */}
                        <div className={`${isImageLeft ? 'order-2' : 'order-1'} md:order-none space-y-4`}>
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl text-primary flex-shrink-0">
                              {domaine.icon}
                            </div>
                            <h2 className="font-heading font-bold text-3xl text-gray-dark">
                              {domaine.title}
                            </h2>
                          </div>
                          <p className="text-gray-medium leading-relaxed">
                            {domaine.description}
                          </p>
                          {domaine.long_description && (
                            <p className="text-gray-medium leading-relaxed border-t pt-4 mt-4">
                              {domaine.long_description}
                            </p>
                          )}
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

export default DomainsPage;