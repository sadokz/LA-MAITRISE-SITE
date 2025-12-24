import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, MinusCircle } from 'lucide-react';
import EditableText from '@/components/EditableText';
import { useSiteTexts, useReferences, useDomaines, Reference } from '@/hooks/useSupabaseData';
import { useReferencesPageSettings } from '@/hooks/useReferencesPageSettings';
import AdminEditBar from '@/components/AdminEditBar';
import { useEditMode } from '@/contexts/EditModeContext';
import heroImage from '@/assets/hero-engineering.jpg';
import ReferenceItem from '@/components/ReferenceItem';
import ReferencesSidebar from '@/components/ReferencesSidebar'; // New import
import MobileReferencesNav from '@/components/MobileReferencesNav'; // New import
import { cn } from '@/lib/utils'; // For conditional classNames

const ReferencesPage = () => {
  const { getSiteText } = useSiteTexts();
  const { isAdmin } = useEditMode();
  const { references, loading: referencesLoading } = useReferences();
  const { domaines, loading: domainesLoading } = useDomaines();
  const { referencesPageSettings } = useReferencesPageSettings();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const [activeDomainTitle, setActiveDomainTitle] = useState<string | null>(null); // State for active domain in view

  // Refs for each domain section
  const domainRefs = useRef<Map<string, HTMLElement>>(new Map());
  const setDomainRef = useCallback((domaineTitle: string) => (node: HTMLElement | null) => {
    if (node) {
      domainRefs.current.set(domaineTitle, node);
    } else {
      domainRefs.current.delete(domaineTitle);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Effect to update selectedCategory based on location.state
  useEffect(() => {
    const categoryFromState = (location.state as { category?: string })?.category;
    if (categoryFromState) {
      setSelectedCategory(categoryFromState);
      setExpandedDomains(new Set());
    } else {
      setSelectedCategory('all');
      setExpandedDomains(new Set());
    }
  }, [location.state]);

  // Intersection Observer to detect active domain
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting entry that is significantly visible
        const intersectingEntry = entries.find(entry => entry.isIntersecting && entry.intersectionRatio >= 0.5);
        if (intersectingEntry) {
          setActiveDomainTitle(intersectingEntry.target.id);
        } else {
          // If no domain is significantly visible, try to find the one closest to the top
          const sortedEntries = entries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          const topMostEntry = sortedEntries.find(entry => entry.boundingClientRect.top < window.innerHeight / 2);
          if (topMostEntry) {
            setActiveDomainTitle(topMostEntry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0% -70% 0%' } // Adjust this to control when the active state changes
    );

    // Observe all domain sections
    domainRefs.current.forEach((element) => observer.observe(element));

    return () => {
      domainRefs.current.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, [domaines, references]); // Re-run if domaines or references change

  const visibleReferences = useMemo(() =>
    references.filter(r => r.is_visible),
    [references]
  );

  const groupedReferences = useMemo(() => {
    const groups: { [category: string]: Reference[] } = {};
    visibleReferences.forEach(r => {
      if (!groups[r.category]) {
        groups[r.category] = [];
      }
      groups[r.category].push(r);
    });
    for (const category in groups) {
      groups[category].sort((a, b) => {
        if (a.parsed_year !== b.parsed_year) {
          return (b.parsed_year || 0) - (a.parsed_year || 0);
        }
        return a.position - b.position;
      });
    }
    return groups;
  }, [visibleReferences]);

  const filteredReferences = useMemo(() => {
    if (selectedCategory === 'all') {
      return [];
    }
    return groupedReferences[selectedCategory] || [];
  }, [selectedCategory, groupedReferences]);

  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { all: visibleReferences.length };
    domaines.forEach(domaine => {
      counts[domaine.title] = (groupedReferences[domaine.title] || []).length;
    });
    return counts;
  }, [visibleReferences, domaines, groupedReferences]);

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

  const allLoading = referencesLoading || domainesLoading;

  const toggleExpand = useCallback((category: string) => {
    setExpandedDomains(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    if (sectionId === 'all') { // Special case for "Tous les projets"
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setSelectedCategory('all');
      return;
    }
    const element = domainRefs.current.get(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setSelectedCategory(sectionId); // Update selected category when scrolling
  }, []);

  // Calculate dynamic padding top for main content based on admin bar and header
  const adminBarHeight = isAdmin ? 48 : 0; // AdminEditBar is approx h-12 (48px)
  const headerHeight = 64; // Header is approx h-16 (64px)
  const totalHeaderOffset = adminBarHeight + headerHeight;

  return (
    <div className="min-h-screen flex flex-col">
      <AdminEditBar />
      <Header isAdmin={isAdmin} /> {/* Pass isAdmin to Header */}
      <main className="flex-grow" style={{ paddingTop: `${totalHeaderOffset}px` }}>
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
                textKey="references.page.title"
                defaultValue={getSiteText('references', 'page', 'title', 'Nos Références')}
                className="inline"
                as="span"
              />
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              <EditableText
                textKey="references.page.description"
                defaultValue={getSiteText('references', 'page', 'description', 'Découvrez nos projets et références dans le domaine de l\'ingénierie électrique')}
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

        {/* Mobile Navigation */}
        <MobileReferencesNav
          domaines={domaines}
          groupedReferences={groupedReferences}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          scrollToSection={scrollToSection}
          categoryCounts={categoryCounts}
          activeDomainTitle={activeDomainTitle}
          headerOffset={totalHeaderOffset}
        />

        {/* Main Content Area with Sidebar (Desktop) */}
        <div className="container mx-auto px-4 lg:px-8 pb-8 lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Desktop Sidebar */}
          <ReferencesSidebar
            domaines={domaines}
            groupedReferences={groupedReferences}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            expandedDomains={expandedDomains}
            toggleExpand={toggleExpand}
            scrollToSection={scrollToSection}
            categoryCounts={categoryCounts}
            activeDomainTitle={activeDomainTitle}
            headerOffset={totalHeaderOffset}
          />

          {/* References List */}
          <div className="lg:col-span-1">
            {allLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {selectedCategory === 'all' ? (
                  Object.keys(groupedReferences).length === 0 ? (
                    <div className="text-center py-20 text-gray-medium">
                      <p>Aucune référence n'est disponible pour le moment.</p>
                    </div>
                  ) : (
                    <div className="space-y-20">
                      {domaines.sort((a, b) => a.position - b.position).map(domaine => {
                        const projectsInDomain = groupedReferences[domaine.title] || [];
                        const isExpanded = expandedDomains.has(domaine.title);
                        const projectsToShow = isExpanded ? projectsInDomain : projectsInDomain.slice(0, 3);

                        if (projectsInDomain.length === 0) return null;

                        return (
                          <div key={domaine.id} id={domaine.title} ref={setDomainRef(domaine.title)} className="space-y-8">
                            <h2 className="font-heading font-bold text-3xl text-gray-dark border-b pb-4 mb-8">
                              {domaine.title}
                            </h2>
                            <div className="space-y-20">
                              {projectsToShow.map((project, index) => (
                                <ReferenceItem key={project.id} project={project} index={index} />
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
                  filteredReferences.length === 0 ? (
                    <div className="text-center py-20 text-gray-medium">
                      <p>Aucune référence n'est disponible pour cette catégorie.</p>
                      <Button onClick={() => setSelectedCategory('all')} className="mt-8">
                        Voir tous les projets
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-20">
                      {filteredReferences.map((project, index) => (
                        <ReferenceItem key={project.id} project={project} index={index} />
                      ))}
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReferencesPage;