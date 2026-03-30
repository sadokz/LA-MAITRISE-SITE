import React, { useState, useMemo } from 'react';
import { useSiteTexts, useReferences, useDomaines, useSectionVisibility } from '@/hooks/useSupabaseData';
import EditableText from '@/components/EditableText';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { getRelevantFallbackImage } from '@/lib/fallbackImages';

const References = () => {
  const { getSiteText } = useSiteTexts();
  const { references, loading: referencesLoading } = useReferences();
  const { domaines, loading: domainesLoading } = useDomaines(); 
  const { data: visibility } = useSectionVisibility();

  const isPageVisible = visibility?.page_references ?? true;
  const loading = referencesLoading || domainesLoading;

  const featuredAndVisibleReferences = useMemo(() => 
    references.filter(r => r.is_visible && r.is_featured), 
    [references]
  );

  const projectsToDisplay = useMemo(() => 
    [...featuredAndVisibleReferences].sort((a, b) => a.position - b.position),
    [featuredAndVisibleReferences]
  );

  const getDisplayImage = (r: typeof references[0]) => {
    if (r.image_mode === 'upload' && r.image_file) return r.image_file;
    if (r.image_mode === 'url' && r.image_url) return r.image_url;
    const searchString = `${r.title} ${r.description} ${r.category} ${r.emplacement}`;
    return getRelevantFallbackImage(searchString, r.category.toLowerCase());
  };

  const truncateDescription = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '…';
  };

  if (loading) {
    return (
      <section id="references" className="section-padding bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="references" className="section-padding bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-gray-dark mb-6">
              <EditableText textKey="references.header.title1" defaultValue={getSiteText('references', 'header', 'title1', 'Nos')} className="inline" as="span" />{' '}
              <EditableText textKey="references.header.title2" defaultValue={getSiteText('references', 'header', 'title2', 'Références')} className="text-gradient-primary inline" as="span" />
            </h2>
            <EditableText textKey="references.header.description" defaultValue={getSiteText('references', 'header', 'description', "Découvrez nos projets illustrant notre savoir-faire et notre capacité d'innovation dans l'ingénierie électrique et le BIM.")} className="text-xl text-gray-medium max-w-3xl mx-auto leading-relaxed" as="p" multiline />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
            {projectsToDisplay.map((project, index) => {
              const displayImage = getDisplayImage(project);
              return (
                <div key={project.id} className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-card cursor-pointer animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <img src={displayImage} alt={project.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-dark/90 via-gray-dark/40 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 ease-out">
                    <span className="inline-block self-start bg-primary/90 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">{project.category}</span>
                    <h3 className="font-heading font-bold text-xl text-white mb-1 leading-tight">{project.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed line-clamp-2">{truncateDescription(project.description)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {isPageVisible && (
            <div className="text-center mb-16">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3">
                <Link to="/references">
                  En Savoir Plus
                  <span className="ml-2">→</span>
                </Link>
              </Button>
            </div>
          )}

          <div className="bg-gradient-hero rounded-2xl p-8 lg:p-12 text-center text-white animate-fade-up">
            <div className="max-w-4xl mx-auto">
              <EditableText textKey="domains.experience.title" defaultValue={getSiteText('domains', 'experience', 'title', "Plus de 30 ans d'expertise à votre service")} className="font-heading font-bold text-2xl lg:text-3xl mb-4" as="h3" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <EditableText textKey="references.stats.projects_count" defaultValue={getSiteText('references', 'stats', 'projects_count', '500+')} className="text-3xl font-bold text-primary-light mb-1" as="div" />
                  <EditableText textKey="references.stats.projects_label" defaultValue={getSiteText('references', 'stats', 'projects_label', 'Références réalisées')} className="text-sm text-white/80" as="div" />
                </div>
                <div>
                  <EditableText textKey="references.stats.countries_count" defaultValue={getSiteText('references', 'stats', 'countries_count', '5')} className="text-3xl font-bold text-primary-light mb-1" as="div" />
                  <EditableText textKey="references.stats.countries_label" defaultValue={getSiteText('references', 'stats', 'countries_label', "Pays d'intervention")} className="text-sm text-white/80" as="div" />
                </div>
                <div>
                  <EditableText textKey="references.stats.clients_satisfaction" defaultValue={getSiteText('references', 'stats', 'clients_satisfaction', '98%')} className="text-3xl font-bold text-primary-light mb-1" as="div" />
                  <EditableText textKey="references.stats.clients_label" defaultValue={getSiteText('references', 'stats', 'clients_label', 'Clients satisfaits')} className="text-sm text-white/80" as="div" />
                </div>
                <div>
                  <EditableText textKey="references.stats.experience_years" defaultValue={getSiteText('references', 'stats', 'experience_years', '30')} className="text-3xl font-bold text-primary-light mb-1" as="div" />
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