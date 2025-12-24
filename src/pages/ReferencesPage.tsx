import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, MinusCircle } from 'lucide-react';
import EditableText from '@/components/EditableText';
import { useSiteTexts, useReferences, useDomaines, Reference } from '@/hooks/useSupabaseData'; // Renamed hook and interface
import { useReferencesPageSettings } from '@/hooks/useReferencesPageSettings'; // Renamed hook
import AdminEditBar from '@/components/AdminEditBar';
import { useEditMode } from '@/contexts/EditModeContext';
import heroImage from '@/assets/hero-engineering.jpg';
import ReferenceItem from '@/components/ReferenceItem'; // Renamed import

const ReferencesPage = () => { // Renamed component
  const { getSiteText } = useSiteTexts();
  const { isAdmin } = useEditMode();
  const { references, loading: referencesLoading } = useReferences(); // Renamed hook
  const { domaines, loading: domainesLoading } = useDomaines();
  const { referencesPageSettings } = useReferencesPageSettings(); // Renamed hook
  const location = useLocation();

  // Initialize selectedCategory to 'all'
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Effect to update selectedCategory based on location.state
  useEffect(() => {
    console.log('ReferencesPage useEffect triggered. location.state:', location.state); // Renamed text
    const categoryFromState = (location.state as { category?: string })?.category;
    console.log('categoryFromState:', categoryFromState);
    if (categoryFromState) {
      setSelectedCategory(categoryFromState);
      setExpandedDomains(new Set()); // Collapse all when a new category is selected
    } else {
      setSelectedCategory('all'); // Default to 'all' if no category in state
      setExpandedDomains(new Set());
    }
  }, [location.state]); // Only re-run when location.state changes

  // Log the current selectedCategory whenever it changes
  useEffect(() => {
    console.log('Current selectedCategory state:', selectedCategory);
  }, [selectedCategory]);

  const visibleReferences = useMemo(() => // Renamed variable
    references.filter(r => r.is_visible), 
    [references]
  );

  const groupedReferences = useMemo(() => { // Renamed variable
    const groups: { [category: string]: Reference[] } = {}; // Renamed interface
    visibleReferences.forEach(r => { // Renamed variable
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
  }, [visibleReferences]); // Renamed variable

  const filteredReferences = useMemo(() => { // Renamed variable
    if (selectedCategory === 'all') {
      // When 'all' is selected, we'll render grouped projects, so this memo returns an empty array
      // The rendering logic below handles displaying all grouped projects.
      return []; 
    }
    return groupedReferences[selectedCategory] || []; // Renamed variable
  }, [selectedCategory, groupedReferences]); // Renamed variable

  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { all: visibleReferences.length }; // Renamed variable
    domaines.forEach(domaine => {
      counts[domaine.title] = (groupedReferences[domaine.title] || []).length; // Renamed variable
    });
    return counts;
  }, [visibleReferences, domaines, groupedReferences]); // Renamed variable

  const getHeroMedia = () => {
    if (!referencesPageSettings) return { type: 'image', url: heroImage }; // Renamed hook
    
    const { media_type, source_type, media_url, media_file } = referencesPageSettings; // Renamed hook

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

  const allLoading = referencesLoading || domainesLoading; // Renamed hook

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
                  alt="Références en ingénierie électrique" // Renamed alt text
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
                  textKey="references.page.title" // Renamed text key
                  defaultValue={getSiteText('references', 'page', 'title', 'Nos Références')} // Renamed text key and default value
                  className="inline" 
                  as="span" 
                />
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                <EditableText 
                  textKey="references.page.description" // Renamed text key
                  defaultValue={getSiteText('references', 'page', 'description', 'Découvrez nos projets et références dans le domaine de l\'ingénierie électrique')} // Renamed text key and default value
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
                    Object.keys(groupedReferences).length === 0 ? ( // Renamed variable
                      <div className="text-center py-20 text-gray-medium">
                        <p>Aucune référence n'est disponible pour le moment.</p> {/* Renamed text */}
                      </div>
                    ) : (
                      <div className="space-y-20">
                        {domaines.sort((a, b) => a.position - b.position).map(domaine => {
                          const projectsInDomain = groupedReferences[domaine.title] || []; // Renamed variable
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
                                  <ReferenceItem key={project.id} project={project} index={index} /> // Renamed component and prop
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
                    filteredReferences.length === 0 ? ( // Renamed variable
                      <div className="text-center py-20 text-gray-medium">
                        <p>Aucune référence n'est disponible pour cette catégorie.</p> {/* Renamed text */}
                        <Button onClick={() => setSelectedCategory('all')} className="mt-8">
                          Voir tous les projets
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-20">
                        {filteredReferences.map((project, index) => ( // Renamed variable
                          <ReferenceItem key={project.id} project={project} index={index} /> // Renamed component and prop
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

export default ReferencesPage;