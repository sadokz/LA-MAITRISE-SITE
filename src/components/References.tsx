import React, { useState, useMemo } from 'react';
import { useSiteTexts, useRealisations, useDomaines } from '@/hooks/useSupabaseData';
import EditableText from '@/components/EditableText';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react'; // Import new icons

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
              <EditableText textKey="references.header.title2" defaultValue={getSiteText('references', 'header', 'title2', 'Réalisations')} className="text-gradient-blue inline" as="span" />
            </h2>
            <EditableText textKey="references.header.description" defaultValue={getSiteText('references', 'header', 'description', "Découvrez nos projets illustrant notre savoir-faire et notre capacité d'innovation dans l'ingénierie électrique et le BIM.")} className="text-xl text-gray-medium max-w-3xl mx-auto leading-relaxed" as="p" multiline />
          </div>

          {/* Projects Grid - Image Cards with Hover Overlay */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
            {projectsToDisplay.map((project, index) => {
              const displayImage = getDisplayImage(project);
              return (
                <div
                  key={project.id}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-card cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
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
                    <span className="inline-block self-start bg-primary/90 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
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
              );
            })}
          </div>

          {/* Empty state */}
          {projectsToDisplay.length === 0 && (
            <div className="text-center py-12 text-gray-medium">
              <p>Aucune réalisation trouvée pour cette catégorie.</p>
            </div>
          )}

          {/* Button moved here - directly under the projects list */}
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
                  <EditableText textKey="references.stats.projects_count" defaultValue={getSiteText('references', 'stats', 'projects_count', '500+')} className="text-3xl font-bold text-blue-light mb-1" as="div" />
                  <EditableText textKey="references.stats.projects_label" defaultValue={getSiteText('references', 'stats', 'projects_label', 'Projets réalisés')} className="text-sm text-white/80" as="div" />
                </div>
                <div>
                  <EditableText textKey="references.stats.countries_count" defaultValue={getSiteText('references', 'stats', 'countries_count', '5')} className="text-3xl font-bold text-blue-light mb-1" as="div" />
                  <EditableText textKey="references.stats.countries_label" defaultValue={getSiteText('references', 'stats', 'countries_label', "Pays d'intervention")} className="text-sm text-white/80" as="div" />
                </div>
                <div>
                  <EditableText textKey="references.stats.clients_satisfaction" defaultValue={getSiteText('references', 'stats', 'clients_satisfaction', '98%')} className="text-3xl font-bold text-blue-light mb-1" as="div" />
                  <EditableText textKey="references.stats.clients_label" defaultValue={getSiteText('references', 'stats', 'clients_label', 'Clients satisfaits')} className="text-sm text-white/80" as="div" />
                </div>
                <div>
                  <EditableText textKey="references.stats.experience_years" defaultValue={getSiteText('references', 'stats', 'experience_years', '30')} className="text-3xl font-bold text-blue-light mb-1" as="div" />
                  <EditableText textKey="references.stats.experience_label" defaultValue={getSiteText('references', 'stats', 'experience_label', "Années d'expérience")} className="text-sm text-white/80" as="div" />
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