import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, LayoutGrid, Hospital, Landmark, School, Plane, Anchor, Building2, Factory, Lightbulb } from 'lucide-react';
import { useDomaines } from '@/hooks/useSupabaseData';
import { getRelevantFallbackImage } from '@/lib/fallbackImages';

interface SectorCardData {
  id: string;
  title: string;
  description: string;
  image: string;
  icon?: string | React.ElementType;
  categorySlug: string;
}

// Helper to map domain titles to Lucide icons for better visuals
const getIconForDomain = (title: string, dbIcon?: string): string | React.ElementType => {
  if (dbIcon && dbIcon.trim().length > 0) return dbIcon;
  
  const t = title.toLowerCase();
  if (t.includes('hospital') || t.includes('santé')) return Hospital;
  if (t.includes('musée') || t.includes('patrimoine') || t.includes('culture')) return Landmark;
  if (t.includes('scolaire') || t.includes('école') || t.includes('enseignement')) return School;
  if (t.includes('aéroport') || t.includes('aviation')) return Plane;
  if (t.includes('port') || t.includes('maritime')) return Anchor;
  if (t.includes('tertiaire') || t.includes('bureau')) return Building2;
  if (t.includes('industrie')) return Factory;
  
  return Lightbulb; // Default icon
};

const SectorsGrid = () => {
  const { domaines, loading: domainesLoading } = useDomaines();

  const sectorCards: SectorCardData[] = useMemo(() => {
    // 1. Start with the "All Projects" static card
    const cards: SectorCardData[] = [
      {
        id: 'all-projects',
        title: 'TOUS LES PROJETS',
        description: 'Découvrez l\'ensemble de nos réalisations en ingénierie électrique.',
        image: getRelevantFallbackImage('engineering complex'),
        icon: LayoutGrid,
        categorySlug: 'all',
      }
    ];

    // 2. Add all domains from database dynamically
    const dynamicCards = domaines
      .sort((a, b) => a.position - b.position)
      .map(domaine => {
        let imageUrl;
        if (domaine.image_mode === 'upload' && domaine.image_file) {
          imageUrl = domaine.image_file;
        } else if (domaine.image_mode === 'url' && domaine.image_url) {
          imageUrl = domaine.image_url;
        } else {
          imageUrl = getRelevantFallbackImage(`${domaine.title} ${domaine.description}`, domaine.title.toLowerCase());
        }

        return {
          id: domaine.id,
          title: domaine.title.toUpperCase(),
          description: domaine.description,
          image: imageUrl,
          icon: getIconForDomain(domaine.title, domaine.icon),
          categorySlug: domaine.title,
        };
      });

    return [...cards, ...dynamicCards];
  }, [domaines]);

  if (domainesLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {sectorCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Link 
            key={card.id} 
            to={`/references/${card.categorySlug}`} 
            className="group relative aspect-[2/3] rounded-xl overflow-hidden shadow-card cursor-pointer animate-scale-in hover:scale-[1.02] transition-transform duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Background Image */}
            <img
              src={card.image}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getRelevantFallbackImage('default');
              }}
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              {IconComponent && (
                <div className="mb-4 self-start w-16 h-16 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  {typeof IconComponent === 'string' ? (
                    <span className="text-5xl">{IconComponent}</span>
                  ) : (
                    <IconComponent className="h-10 w-10 text-white" />
                  )}
                </div>
              )}
              <h3 className="font-heading font-bold text-2xl uppercase mb-3 leading-tight">
                {card.title}
              </h3>
              <p className="text-base text-white/90 mb-6 line-clamp-3">
                {card.description}
              </p>
              <Button 
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 font-semibold px-6 py-3 rounded-lg w-auto inline-flex items-center self-start transition-all duration-300"
              >
                Découvrir <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SectorsGrid;