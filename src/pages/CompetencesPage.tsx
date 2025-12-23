import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react'; // Import ArrowRight for the new button
import EditableText from '@/components/EditableText';
import { useSiteTexts, useCompetences } from '@/hooks/useSupabaseData';
import { useCompetencesPageSettings } from '@/hooks/useCompetencesPageSettings';
import AdminEditBar from '@/components/AdminEditBar';
import { useEditMode } from '@/contexts/EditModeContext';
import heroImage from '@/assets/hero-engineering.jpg';
import { getRelevantFallbackImage } from '@/lib/fallbackImages'; // Import the new utility

const CompetencesPage = () => {
  const { getSiteText } = useSiteTexts();
  const { isAdmin } = useEditMode();
  const { competences, loading: competencesLoading } = useCompetences();
  const { competencesPageSettings } = useCompetencesPageSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getDisplayImage = (c: typeof competences[0]) => {
    if (c.image_mode === 'upload' && c.image_file) {
      return c.image_file;
    }
    if (c.image_mode === 'url' && c.image_url) {
      return c.image_url;
    }
    // Auto mode: use keyword-based fallback
    const searchString = `${c.title} ${c.description} ${c.long_description || ''}`;
    return getRelevantFallbackImage(searchString, c.title.toLowerCase());
  };

  const getHeroMedia = () => {
    if (!competencesPageSettings) return { type: 'image', url: heroImage };
    
    const { media_type, source_type, media_url, media_file } = competencesPageSettings;

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
                  alt="Compétences en ingénierie électrique" 
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
                  textKey="competences.page.title" 
                  defaultValue={getSiteText('competences', 'page', 'title', 'Nos Compétences en ingénierie électrique')} 
                  className="inline" 
                  as="span" 
                />
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                <EditableText 
                  textKey="competences.page.description" 
                  defaultValue={getSiteText('competences', 'page', 'description', 'Découvrez notre expertise technique et nos domaines de spécialisation')} 
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

          {/* Competences Section */}
          <section className="section-padding bg-white pt-0"> {/* Adjusted padding-top */}
            <div className="container mx-auto px-4 lg:px-8">
              {competencesLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : competences.length === 0 ? (
                <div className="text-center py-20 text-gray-medium">
                  <p>Aucune compétence n'est disponible pour le moment.</p>
                  <Button asChild className="mt-8">
                    <Link to="/" className="inline-flex items-center">
                      <ArrowLeft className="mr-2 h-4 w-4" /> 
                      Retour à l'accueil
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-20">
                  {competences.sort((a, b) => a.position - b.position).map((competence, index) => {
                    const isImageLeft = index % 2 === 0;
                    const displayImage = getDisplayImage(competence);

                    return (
                      <div 
                        key={competence.id} 
                        className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-fade-up`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Image Column */}
                        {displayImage && (
                          <div className={`${isImageLeft ? 'order-1' : 'order-2'} md:order-none`}>
                            <img 
                              src={displayImage} 
                              alt={competence.title} 
                              className="w-full h-72 object-cover rounded-xl shadow-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = getRelevantFallbackImage('default'); // Fallback to generic default on error
                                console.warn(`Image non disponible pour "${competence.title}", fallback utilisé.`);
                              }}
                            />
                          </div>
                        )}

                        {/* Text Content Column */}
                        <div className={`${isImageLeft ? 'order-2' : 'order-1'} md:order-none space-y-4`}>
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl text-primary flex-shrink-0">
                              {competence.icon}
                            </div>
                            <h2 className="font-heading font-bold text-3xl text-gray-dark">
                              {competence.title}
                            </h2>
                          </div>
                          <p className="text-gray-medium leading-relaxed">
                            {competence.description}
                          </p>
                          {competence.long_description && (
                            <p className="text-gray-medium leading-relaxed border-t pt-4 mt-4">
                              {competence.long_description}
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

export default CompetencesPage;