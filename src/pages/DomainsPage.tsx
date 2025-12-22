import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Building2, Factory, Heart, Sun, Lightbulb, Landmark, Box } from 'lucide-react'; // Added imports for Lucide icons
import EditableText from '@/components/EditableText';
import { useSiteTexts, useDomaines } from '@/hooks/useSupabaseData';
import AdminEditBar from '@/components/AdminEditBar';
import { useEditMode } from '@/contexts/EditModeContext';

const DomainsPage = () => {
  const { getSiteText } = useSiteTexts();
  const { isAdmin } = useEditMode();
  const { domaines, loading: domainesLoading } = useDomaines();

  // Configuration des icônes et couleurs pour chaque domaine (fallback)
  const domainConfig = [
    { icon: 'Home', color: 'from-orange-500 to-orange-600' },
    { icon: 'Building2', color: 'from-blue-500 to-blue-600' },
    { icon: 'Factory', color: 'from-green-500 to-green-600' },
    { icon: 'Heart', color: 'from-red-500 to-red-600' },
    { icon: 'Sun', color: 'from-yellow-500 to-yellow-600' },
    { icon: 'Lightbulb', color: 'from-purple-500 to-purple-600' },
    { icon: 'Landmark', color: 'from-indigo-500 to-indigo-600' },
  ];

  // Get custom icon URL based on icon_type
  const getCustomIconUrl = (domaine: typeof domaines[0]) => {
    if (domaine.icon_type === 'upload' && domaine.icon_file) {
      return domaine.icon_file;
    }
    if (domaine.icon_type === 'url' && domaine.icon_url) {
      return domaine.icon_url;
    }
    return null;
  };

  // Map Lucide icon names to components
  const LucideIcons: { [key: string]: React.ElementType } = {
    Home, Building2, Factory, Heart, Sun, Lightbulb, Landmark, Box
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
                    const config = domainConfig[index % domainConfig.length];
                    const FallbackIcon = LucideIcons[config.icon] || Box;
                    const customIconUrl = getCustomIconUrl(domaine);

                    return (
                      <div 
                        key={domaine.id} 
                        className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-fade-up`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Icon/Image Column (always on left for simplicity, or could alternate) */}
                        <div className="flex justify-center md:justify-start">
                          {customIconUrl ? (
                            <div 
                              className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-4 shadow-md"
                              style={{ 
                                border: `4px solid ${domaine.icon_border_color || '#3B82F6'}`,
                                boxShadow: `0 6px 16px ${domaine.icon_border_color || '#3B82F6'}30`
                              }}
                            >
                              <img 
                                src={customIconUrl} 
                                alt={domaine.title} 
                                className="w-12 h-12 object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  const parent = (e.target as HTMLImageElement).parentElement;
                                  if (parent) {
                                    const fallback = document.createElement('div');
                                    fallback.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`;
                                    parent.appendChild(fallback.firstChild!);
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className={`w-24 h-24 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center`}>
                              <FallbackIcon className="w-12 h-12 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Text Content Column */}
                        <div className="space-y-4">
                          <h2 className="font-heading font-bold text-3xl text-gray-dark">
                            {domaine.title}
                          </h2>
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