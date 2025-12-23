import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react'; // Import ArrowRight for the new button
import EditableText from '@/components/EditableText';
import { useSiteTexts, useRealisations, useDomaines, Realisation } from '@/hooks/useSupabaseData';
import { useRealisationsPageSettings } from '@/hooks/useRealisationsPageSettings';
import AdminEditBar from '@/components/AdminEditBar';
import { useEditMode } from '@/contexts/EditModeContext';
import heroImage from '@/assets/hero-engineering.jpg';
import RealisationItem from '@/components/RealisationItem';

const RealisationsPage = () => {
  const { getSiteText } = useSiteTexts();
  const { isAdmin } = useEditMode();
  const { realisations, loading: realisationsLoading } = useRealisations();
  const { domaines, loading: domainesLoading } = useDomaines();
  const { realisationsPageSettings } = useRealisationsPageSettings();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const visibleRealisations = useMemo(() => 
    realisations.filter(r => r.is_visible), 
    [realisations]
  );

  // Group all visible realisations by category for easy access
  const groupedVisibleRealisations = useMemo(() => {
    const grouped: { [key: string]: Realisation[] } = {};
    visibleRealisations.forEach(r => {
      if (!grouped[r.category]) {
        grouped[r.category] = [];
      }
      grouped[r.category].push(r);
    });
    return grouped;
  }, [visibleRealisations]);

  // Determine which categories have more than 2 projects
  const categoriesWithMoreProjects = useMemo(() => {
    const categories: Set<string> = new Set();
    for (const category in groupedVisibleRealisations) {
      if (groupedVisibleRealisations[category].length > 2) {
        categories.add(category);
      }
    }
    return categories;
  }, [groupedVisibleRealisations]);

  const filteredRealisations = useMemo(() => {
    if (selectedCategory === 'all') {
      let limitedProjects: Realisation[] = [];
      
      // Sort categories for consistent display (e.g., by the year of their first project)
      const sortedCategories = Object.keys(groupedVisibleRealisations).sort((catA, catB) => {
        const firstProjectA = groupedVisibleRealisations[catA][0];
        const firstProjectB = groupedVisibleRealisations[catB][0];
        if (firstProjectA && firstProjectB) {
          // Sort by year (newest first), then by original position
          if (firstProjectA.parsed_year !== firstProjectB.parsed_year) {
            return (firstProjectB.parsed_year || 0) - (firstProjectA.parsed_year || 0);
          }
          return firstProjectA.position - firstProjectB.position;
        }
        return 0; 
      });

      sortedCategories.forEach(category => {
        limitedProjects = limitedProjects.concat(groupedVisibleRealisations[category].slice(0, 2));
      });
      return limitedProjects;
    }
    return visibleRealisations.filter(r => r.category === selectedCategory);
  }, [visibleRealisations, selectedCategory, groupedVisibleRealisations]);

  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { all: visibleRealisations.length };
    domaines.forEach(domaine => {
      counts[domaine.title] = visibleRealisations.filter(r => r.category === domaine.title).length;
    });
    return counts;
  }, [visibleRealisations, domaines]);

  const getHeroMedia = () => {
    if (!realisationsPageSettings) return { type: 'image', url: heroImage };
    
    const { media_type, source_type, media_url, media_file } = realisationsPageSettings;

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

  const allLoading = realisationsLoading || domainesLoading;

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

          {/* Filter Buttons */}
          <div className="container mx-auto px-4 lg:px-8 pb-8">
            <div className="flex flex-wrap justify-center gap-2 w-full">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                disabled={allLoading}
                className="flex items-center gap-1"
              >
                Tous les projets
                <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-light text-white">
                  {categoryCounts.all}
                </span>
              </Button>
              {domaines.sort((a, b) => a.position - b.position).map((domaine) => (
                <Button
                  key={domaine.id}
                  variant={selectedCategory === domaine.title ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(domaine.title)}
                  disabled={allLoading}
                  className="flex items-center gap-1"
                >
                  {domaine.title}
                  <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-light text-white">
                    {categoryCounts[domaine.title] || 0}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <section className="section-padding bg-white pt-0">
            <div className="container mx-auto px-4 lg:px-8">
              {allLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredRealisations.length === 0 ? (
                <div className="text-center py-20 text-gray-medium">
                  <p>Aucune réalisation n'est disponible pour le moment ou ne correspond à votre filtre.</p>
                  <Button onClick={() => setSelectedCategory('all')} className="mt-8">
                    Voir tous les projets
                  </Button>
                </div>
              ) : (
                <div className="space-y-20">
                  {selectedCategory === 'all' ? (
                    // Group the already filtered (limited) realisations by category for display
                    (() => {
                      const groupedForDisplay: { [key: string]: Realisation[] } = {};
                      filteredRealisations.forEach(r => {
                        if (!groupedForDisplay[r.category]) {
                          groupedForDisplay[r.category] = [];
                        }
                        groupedForDisplay[r.category].push(r);
                      });

                      // Sort categories for consistent display, similar to how `limitedProjects` were formed
                      const sortedCategories = Object.keys(groupedForDisplay).sort((catA, catB) => {
                        const firstProjectA = groupedForDisplay[catA][0];
                        const firstProjectB = groupedForDisplay[catB][0];
                        if (firstProjectA && firstProjectB) {
                          if (firstProjectA.parsed_year !== firstProjectB.parsed_year) {
                            return (firstProjectB.parsed_year || 0) - (firstProjectA.parsed_year || 0);
                          }
                          return firstProjectA.position - firstProjectB.position;
                        }
                        return 0;
                      });

                      return sortedCategories.map(category => (
                        <React.Fragment key={category}>
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                            {groupedForDisplay[category].map((project, index) => (
                              <RealisationItem key={project.id} project={project} index={index} />
                            ))}
                          </div>
                          {categoriesWithMoreProjects.has(category) && (
                            <div className="text-center mt-4 mb-12">
                              <Button 
                                onClick={() => setSelectedCategory(category)}
                                className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3"
                              >
                                Plus de Projets {category} <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </React.Fragment>
                      ));
                    })()
                  ) : (
                    // Existing rendering for a single selected category
                    <div className="space-y-20">
                      {filteredRealisations.map((project, index) => (
                        <RealisationItem key={project.id} project={project} index={index} />
                      ))}
                    </div>
                  )}
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