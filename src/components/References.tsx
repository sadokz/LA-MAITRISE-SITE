import React, { useState, useMemo } from 'react';
import { useSiteTexts, useRealisations, useCompetences } from '@/hooks/useSupabaseData';
import EditableText from '@/components/EditableText';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Fallback images by category for auto mode
const fallbackImages: Record<string, string> = {
  'CFO': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
  'CFA': 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop',
  'Éclairage Public': 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&h=400&fit=crop',
  'SSI': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
  'Ascenseurs': 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop',
  'Photovoltaïque': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop',
  'default': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
};

const References = () => {
  const { getSiteText } = useSiteTexts();
  const { realisations, loading: realisationsLoading } = useRealisations();
  const { competences } = useCompetences();
  const [activeFilter, setActiveFilter] = useState('all');

  // Build category labels from competences
  const categoryLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    competences.forEach(c => {
      labels[c.title] = c.title;
    });
    return labels;
  }, [competences]);

  // Build dynamic filters based on realisations data
  const filters = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    realisations.forEach(r => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    });

    const dynamicFilters = [
      { id: 'all', label: 'Tous les projets', count: realisations.length },
    ];

    Object.entries(categoryCounts).forEach(([category, count]) => {
      dynamicFilters.push({
        id: category,
        label: categoryLabels[category] || category,
        count,
      });
    });

    return dynamicFilters;
  }, [realisations, categoryLabels]);

  const filteredProjects = useMemo(() => {
    const sorted = [...realisations].sort((a, b) => a.position - b.position);
    if (activeFilter === 'all') return sorted;
    return sorted.filter(project => project.category === activeFilter);
  }, [realisations, activeFilter]);

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

  if (realisationsLoading) {
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

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-gradient-primary text-white shadow-hover'
                    : 'bg-gray-light text-gray-dark hover:bg-gray-light/70'
                }`}
              >
                {filter.label}
                <span className="ml-2 text-sm opacity-75">({filter.count})</span>
              </button>
            ))}
          </div>

          {/* Projects Grid - Image Cards with Hover Overlay */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
            {filteredProjects.map((project, index) => {
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
                    <span className="inline-block self-start bg-orange/90 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 uppercase tracking-wide">
                      {categoryLabels[project.category] || project.category}
                    </span>

                    {/* Title */}
                    <h3 className="font-heading font-bold text-xl text-white mb-1 leading-tight">
                      {project.title}
                    </h3>

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
          {filteredProjects.length === 0 && (
            <div className="text-center py-12 text-gray-medium">
              <p>Aucune réalisation trouvée pour cette catégorie.</p>
            </div>
          )}

          {/* Button moved here - directly under the projects list */}
          <div className="text-center mb-16">
            <Button asChild size="lg" className="bg-gradient-primary text-white hover:opacity-90 font-semibold px-8 py-4 text-lg">
              <Link to="/realisations">
                En Savoir Plus <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default References;