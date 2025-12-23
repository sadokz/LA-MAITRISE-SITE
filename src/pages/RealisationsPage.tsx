import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, MinusCircle } from 'lucide-react';
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
  const location = useLocation();

  // Initialize selectedCategory to 'all'
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Effect to update selectedCategory based on location.state
  useEffect(() => {
    const categoryFromState = (location.state as { category?: string })?.category;
    if (categoryFromState) {
      setSelectedCategory(categoryFromState);
      setExpandedDomains(new Set()); // Collapse all when a new category is selected
    } else {
      setSelectedCategory('all'); // Default to 'all' if no category in state
      setExpandedDomains(new Set());
    }
  }, [location.state]); // Only re-run when location.state changes

  const visibleRealisations = useMemo(() => 
    realisations.filter(r => r.is_visible), 
    [realisations]
  );

  const groupedRealisations = useMemo(() => {
    const groups: { [category: string]: Realisation[] } = {};
    visibleRealisations.forEach(r => {
      if (!groups[r.category]) {
        groups[r.category] = [];
      }
      groups[r.category].push(r);
    });
    // Sort projects within each category by parsed_year (newest first) then position
    for (const category in groups) {
      groups[category].sort((a, b) => {
        if (a.parsed_year !== b.parsed_year) {
          return (b.parsed_year || 0) - (a.parsed_year || 0);
        }
        return a.position - b.position;
      });
    }
    return groups;
  }, [visibleRealisations]);

  const filteredRealisations = useMemo(() => {
    if (selectedCategory === 'all') {
      // When 'all' is selected, we'll render grouped projects, so this memo returns an empty array
      // The rendering logic below handles displaying all grouped projects.
      return []; 
    }
    return groupedRealisations[selectedCategory] || [];
  }, [selectedCategory, groupedRealisations]);

  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { all: visibleRealisations.length };
    domaines.forEach(domaine => {
      counts[domaine.title] = (groupedRealisations[domaine.title] || []).length;
    });
    return counts;
  }, [visibleRealisations, domaines, groupedRealisations]);

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

  const toggleExpand = (category: string) => {
    setExpandedDomains(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

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
              ) : (
                <>
                  {selectedCategory === 'all' ? (
                    // Display grouped projects when 'all' is selected
                    Object.keys(groupedRealisations).length === 0 ? (
                      <div className="text-center py-20 text-gray-medium">
                        <p>Aucune réalisation n'is disponible pour le moment.</p>
                      </div>
                    ) : (
                      <div className="space-y-20">
                        {domaines.sort((a, b) => a.position - b.position).map(domaine => {
                          const projectsInDomain = groupedRealisations[domaine.title] || [];
                          const isExpanded = expandedDomains.has(domaine.title);
                          const projectsToShow = isExpanded ? projectsInDomain : projectsInDomain.slice(0, 3);

                          if (projectsInDomain.length === 0) return null;

                          return (
                            <div key={domaine.id} className="space-y-8">
                              <h2 className="font-heading font-bold text-3xl text-gray-dark border-b pb-4 mb-8">
                                {domaine.title}
                              </h2>
                              <div className="space-y-20"> {/* Nested space-y-20 for individual project items */}
                                {projectsToShow.map((project, index) => (
                                  <RealisationItem key={project.id} project={project} index={index} />
                                ))}
                              </div>
                              {projectsInDomain.length > 3 && (
                                <div className="text-center mt-8">
                                  <Button 
                                    variant="outline" 
                                    onClick={() => toggleExpand(domaine.title)}
                                    className="group"
                                  >
                                    {isExpanded ? (
                                      <>
                                        <MinusCircle className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                        Afficher moins
                                      </>
                                    ) : (
                                      <>
                                        <PlusCircle className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        Afficher plus ({projectsInDomain.length - 3} de plus)
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )
                  ) : (
                    // Display filtered projects for a specific category
                    filteredRealisations.length === 0 ? (
                      <div className="text-center py-20 text-gray-medium">
                        <p>Aucune réalisation n'est disponible pour cette catégorie.</p>
                        <Button onClick={() => setSelectedCategory('all')} className="mt-8">
                          Voir tous les projets
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-20">
                        {filteredRealisations.map((project, index) => (
                          <RealisationItem key={project.id} project={project} index={index} />
                        ))}
                      </div>
                    )
                  )}
                </>
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