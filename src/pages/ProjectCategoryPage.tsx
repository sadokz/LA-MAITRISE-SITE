import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
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
import ScrollToTopButton from '@/components/ScrollToTopButton';

const ProjectCategoryPage = () => {
  const { getSiteText } = useSiteTexts();
  const { isAdmin } = useEditMode();
  const { references, loading: referencesLoading } = useReferences();
  const { domaines, loading: domainesLoading } = useDomaines();
  const { referencesPageSettings } = useReferencesPageSettings();
  const { categorySlug } = useParams<{ categorySlug: string }>(); // Get category slug from URL
  const location = useLocation();

  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const lastReferenceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    if (!categorySlug || categorySlug === 'all') {
      return visibleReferences; // Show all visible references if 'all' or no slug
    }
    return groupedReferences[categorySlug] || [];
  }, [categorySlug, groupedReferences, visibleReferences]);

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

  const pageTitle = categorySlug === 'all' 
    ? getSiteText('references.page.title.all', 'Toutes nos Références')
    : domaines.find(d => d.title === categorySlug)?.title || getSiteText('references.page.title.category', 'Références');

  const pageDescription = categorySlug === 'all'
    ? getSiteText('references.page.description.all', 'Découvrez l\'ensemble de nos projets et réalisations dans tous les domaines d\'ingénierie électrique.')
    : domaines.find(d => d.title === categorySlug)?.long_description || getSiteText('references.page.description.category', 'Découvrez nos projets spécifiques à ce domaine d\'expertise en ingénierie électrique.');

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
                  textKey={`references.page.title.${categorySlug || 'all'}`}
                  defaultValue={pageTitle}
                  className="inline" 
                  as="span" 
                />
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                <EditableText 
                  textKey={`references.page.description.${categorySlug || 'all'}`}
                  defaultValue={pageDescription}
                  className="inline" 
                  as="span" 
                  multiline 
                />
              </p>
            </div>
          </section>

          {/* Back to References Landing Page Button */}
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <Button asChild variant="outline" className="group">
              <Link to="/references">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Retour aux secteurs
              </Link>
            </Button>
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
                  {filteredReferences.length === 0 ? (
                    <div className="text-center py-20 text-gray-medium">
                      <p>Aucune référence n'est disponible pour cette catégorie.</p>
                      <Button asChild className="mt-8">
                        <Link to="/references" className="inline-flex items-center">
                          <ArrowLeft className="mr-2 h-4 w-4" /> 
                          Retour aux secteurs
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-20">
                      {filteredReferences.map((project, index) => (
                        <ReferenceItem 
                          key={project.id} 
                          project={project} 
                          index={index} 
                          ref={index === filteredReferences.length - 1 ? lastReferenceRef : null}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
      <ScrollToTopButton targetRef={lastReferenceRef} />
    </div>
  );
};

export default ProjectCategoryPage;