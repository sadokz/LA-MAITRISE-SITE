import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Box } from 'lucide-react'; // Removed unused Lucide icons
import EditableText from '@/components/EditableText';
import { useSiteTexts, useDomaines } from '@/hooks/useSupabaseData';
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

  return (
    <div className="min-h-screen flex flex-col">
      <AdminEditBar />
      <div className={isAdmin ? 'pt-12' : ''}>
        <Header />
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-background overflow-hidden">
            <div className="absolute inset-0 bg-[url('/src/assets/hero-engineering.jpg')] bg-cover bg-center opacity-20"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6">
                <EditableText 
                  textKey="domains.page.title" 
                  defaultValue={getSiteText('domains', 'page', 'title', 'Nos Domaines d\'Intervention')} 
                  className="inline" 
                  as="span" 
                />
              </h1>
              <p className="text-xl text-gray-medium max-w-3xl mx-auto">
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

          {/* Domains List Section */}
          <section className="section-padding bg-white">
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
                            <div 
                              className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2 shadow-md flex-shrink-0 text-2xl"
                              style={{ 
                                border: `2px solid ${domaine.icon_border_color || '#3B82F6'}`,
                                boxShadow: `0 3px 8px ${domaine.icon_border_color || '#3B82F6'}20`
                              }}
                            >
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