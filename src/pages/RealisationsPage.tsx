import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import EditableText from '@/components/EditableText';
import { useSiteTexts, useRealisations, useDomaines } from '@/hooks/useSupabaseData';
import { useRealisationsPageSettings } from '@/hooks/useRealisationsPageSettings';
import AdminEditBar from '@/components/AdminEditBar';
import { useEditMode } from '@/contexts/EditModeContext';
import heroImage from '@/assets/hero-engineering.jpg';
import RealisationItem from '@/components/RealisationItem';
// Removed Select import as it's no longer needed

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

  const filteredRealisations = useMemo(() => {
    if (selectedCategory === 'all') {
      return visibleRealisations;
    }
    return visibleRealisations.filter(r => r.category === selectedCategory);
  }, [visibleRealisations, selectedCategory]);

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

          {/* Back to Home Button and Filter Buttons */}
          <div className="container mx-auto px-4 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button asChild variant="outline" className="group w-full sm:w-auto">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Accueil
              </Link>
            </Button>

            <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
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
              {domaines.sort((a, b) => a.title.localeCompare(b.title)).map((domaine) => (
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
                  {filteredRealisations.map((project, index) => (
                    <RealisationItem key={project.id} project={project} index={index} />
                  ))}
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