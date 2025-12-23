import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSiteTexts, useRealisations, useDomaines } from '@/hooks/useSupabaseData';
import EditableText from '@/components/EditableText';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft, ArrowRight } from 'lucide-react'; // Import new icons
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';

// Fallback images by category for auto mode
const fallbackImages: Record<string, string> = {
  'CFO': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
  'CFA': 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop',
  'Éclairage Public': 'https://images.unsplash.com/photo-1545558014_8692077e9b5c?w=600&h=400&fit=crop',
  'SSI': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
  'Ascenseurs': 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop',
  'Photovoltaïque': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop',
  'default': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
};

const References = () => {
  const { getSiteText } = useSiteTexts();
  const { realisations, loading: realisationsLoading } = useRealisations();
  const { domaines, loading: domainesLoading } = useDomaines(); 

  const loading = realisationsLoading || domainesLoading;

  // Filter realisations to only include visible AND featured ones for public display on homepage
  const featuredAndVisibleRealisations = useMemo(() => 
    realisations.filter(r => r.is_visible && r.is_featured), 
    [realisations]
  );

  // The projects to display are now simply the featured and visible ones, sorted by position
  const projectsToDisplay = useMemo(() => 
    [...featuredAndVisibleRealisations].sort((a, b) => a.position - b.position),
    [featuredAndVisibleRealisations]
  );

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slides: {
        perView: 1, // Default for mobile
        spacing: 16, // Gap between slides
      },
      breakpoints: {
        '(min-width: 768px)': {
          slides: { perView: 2, spacing: 24 }, // Tablet
        },
        '(min-width: 1024px)': {
          slides: { perView: 3, spacing: 32 }, // Desktop
        },
      },
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Get display image for a realisation
  const getDisplayImage = (r: typeof realisations[0]) => {
    if (r.image_mode === 'upload' && r.image_file) {
      return r.image_file;
    }
    if (r.image_mode === 'url' && r.image_url) {
      return r.image_url;
    }
    // Auto mode: use fallback based on category
    return fallbackImages[r.category] || fallbackImages['default'];
  };

  // Truncate description to ~80 characters
  const truncateDescription = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '…';
  };

  if (loading) {
    return (
      <section id="references" className="section-padding bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="references" className="section-padding bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-gray-dark mb-6">
              <EditableText textKey="references.header.title1" defaultValue={getSiteText('references', 'header', 'title1', 'Nos')} className="inline" as="span" />{' '}
              <EditableText textKey="references.header.title2" defaultValue={getSiteText('references', 'header', 'title2', 'Réalisations')} className="text-gradient-orange inline" as="span" />
            </h2>
            <EditableText textKey="references.header.description" defaultValue={getSiteText('references', 'header', 'description', "Découvrez nos projets illustrant notre savoir-faire et notre capacité d'innovation dans l'ingénierie électrique et le BIM.")} className="text-xl text-gray-medium max-w-3xl mx-auto leading-relaxed" as="p" multiline />
          </div>

          {/* Projects Carousel */}
          {projectsToDisplay.length > 0 ? (
            <div className="relative mb-16">
              <div className="embla overflow-hidden" ref={emblaRef}>
                <div className="embla__container flex touch-pan-y">
                  {projectsToDisplay.map((project, index) => {
                    const displayImage = getDisplayImage(project);
                    return (
                      <div
                        key={project.id}
                        className="embla__slide flex-shrink-0 min-w-0"
                      >
                        <div
                          className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-card cursor-pointer"
                        >
                          {/* Background Image */}
                          <img
                            src={displayImage}
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = fallbackImages['default'];
                              console.warn(`Image admin non disponible pour "${project.title}", fallback utilisé.`);
                            }}
                          />
                          
                          {/* Dark Overlay - Always visible on mobile, hover on desktop */}
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-dark/90 via-gray-dark/40 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Content - Always visible on mobile, hover on desktop */}
                          <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 ease-out">
                            {/* Category Badge */}
                            <span className="inline-block self-start bg-orange/90 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
                              {project.category}
                            </span>
                            {/* Title */}
                            <h3 className="font-heading font-bold text-xl text-white mb-1 leading-tight">
                              {project.title}
                            </h3>
                            {/* Date and Emplacement */}
                            {(project.date_text || project.emplacement) && (
                              <div className="flex items-center text-white/80 text-sm mb-2">
                                {project.date_text && (
                                  <span className="flex items-center mr-3">
                                    <Calendar className="h-3 w-3 mr-1" /> {project.date_text}
                                  </span>
                                )}
                                {project.emplacement && (
                                  <span className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" /> {project.emplacement}
                                  </span>
                                )}
                              </div>
                            )}
                            {/* Short Description */}
                            <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
                              {truncateDescription(project.description)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Arrows */}
              <Button
                className="embla__button embla__button--prev absolute top-1/2 -translate-y-1/2 left-4 bg-white/80 hover:bg-white text-gray-dark p-2 rounded-full shadow-md hidden md:flex items-center justify-center z-10"
                onClick={scrollPrev}
                size="icon"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button
                className="embla__button embla__button--next absolute top-1/2 -translate-y-1/2 right-4 bg-white/80 hover:bg-white text-gray-dark p-2 rounded-full shadow-md hidden md:flex items-center justify-center z-10"
                onClick={scrollNext}
                size="icon"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-medium">
              <p>Aucune réalisation mise en avant n'est disponible pour le moment.</p>
            </div>
          )}

          {/* Button "En Savoir Plus" */}
          <div className="text-center mb-16">
            <Button 
              asChild 
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3"
            >
              <Link to="/realisations">
                En Savoir Plus
                <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>

          {/* Experience Banner */}
          <div className="bg-gradient-hero rounded-2xl p-8 lg:p-12 text-center text-white animate-fade-up">
            <div className="max-w-4xl mx-auto">
              <EditableText textKey="domains.experience.title" defaultValue={getSiteText('domains', 'experience', 'title', "Plus de 30 ans d'expertise à votre service")} className="font-heading font-bold text-2xl lg:text-3xl mb-4" as="h3" />
              <EditableText textKey="domains.experience.description" defaultValue={getSiteText('domains', 'experience', 'description', "De la Tunisie à l'Afrique, nous avons développé une expertise reconnue dans tous les secteurs de l'ingénierie électrique et du BIM.")} className="text-lg lg:text-xl mb-8 text-white/90" as="p" multiline />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <div className="text-3xl font-bold text-orange-light mb-1">500+</div>
                  <div className="text-sm text-white/80">Projets réalisés</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-light mb-1">5</div>
                  <div className="text-sm text-white/80">Pays d'intervention</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-light mb-1">98%</div>
                  <div className="text-sm text-white/80">Clients satisfaits</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-light mb-1">30</div>
                  <div className="text-sm text-white/80">Années d'expérience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default References;