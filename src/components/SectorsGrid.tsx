import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, LayoutGrid, Building, Hospital, Home, Factory, Sun, Lightbulb, Landmark, School, Plane, Anchor } from 'lucide-react';
import { useDomaines } from '@/hooks/useSupabaseData';
import { getRelevantFallbackImage } from '@/lib/fallbackImages';
import { cn } from '@/lib/utils';

interface SectorCardData {
  id: string;
  title: string;
  description: string;
  image: string;
  icon?: React.ElementType;
  categorySlug: string;
}

const SectorsGrid = () => {
  const { domaines, loading: domainesLoading } = useDomaines();

  const sectorCards: SectorCardData[] = useMemo(() => {
    const baseCards: SectorCardData[] = [
      {
        id: 'all-projects',
        title: 'TOUS LES PROJETS',
        description: 'Découvrez l\'ensemble de nos réalisations en ingénierie électrique.',
        image: getRelevantFallbackImage('default'),
        icon: LayoutGrid,
        categorySlug: 'all',
      },
      // Specific cards with provided images
      {
        id: 'etablissements-hospitaliers',
        title: 'ÉTABLISSEMENTS HOSPITALIERS',
        description: 'Études et installations électriques complètes pour les infrastructures de santé.',
        image: 'https://la-maitrise.tn/MEDIA/REF.HOPITAL.png',
        icon: Hospital,
        categorySlug: 'Établissements Hospitaliers',
      },
      {
        id: 'batiments-patrimoine-musees',
        title: 'BÂTIMENTS DU PATRIMOINE ET MUSÉES',
        description: 'Expertise en électricité pour la valorisation et la conservation du patrimoine.',
        image: 'https://la-maitrise.tn/MEDIA/REF.MUSEE.png',
        icon: Landmark,
        categorySlug: 'Bâtiments du Patrimoine et Musées',
      },
      {
        id: 'etablissements-scolaire',
        title: 'ÉTABLISSEMENTS SCOLAIRES',
        description: 'Solutions électriques adaptées aux besoins des établissements éducatifs.',
        image: 'https://la-maitrise.tn/MEDIA/REF.ECOLE.png',
        icon: School,
        categorySlug: 'Établissements Scolaire',
      },
    ];

    // Dynamically add cards for other domains, ensuring no duplicates with specific cards
    const existingSlugs = new Set(baseCards.map(card => card.categorySlug));
    const dynamicCards = domaines
      .filter(domaine => !existingSlugs.has(domaine.title))
      .sort((a, b) => a.position - b.position) // Sort by position
      .map(domaine => ({
        id: domaine.id,
        title: domaine.title.toUpperCase(),
        description: domaine.description,
        image: getRelevantFallbackImage(`${domaine.title} ${domaine.description}`, domaine.title.toLowerCase()),
        icon: Building, // Generic icon, could be improved with a map
        categorySlug: domaine.title,
      }));

    return [...baseCards, ...dynamicCards];
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
        const Icon = card.icon;
        return (
          <Link 
            key={card.id} 
            to={`/references/${card.categorySlug}`} 
            className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-card cursor-pointer animate-scale-in"
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
                console.warn(`Image non disponible pour "${card.title}", fallback utilisé.`);
              }}
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-dark/90 via-gray-dark/40 to-transparent opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
              {Icon && (
                <div className="mb-3 self-start p-2 bg-primary/80 rounded-lg group-hover:bg-primary transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
              )}
              <h3 className="font-heading font-bold text-xl uppercase mb-2 leading-tight">
                {card.title}
              </h3>
              <p className="text-sm text-white/80 mb-4">
                {card.description}
              </p>
              <Button 
                variant="secondary" 
                className="self-start bg-white text-primary hover:bg-gray-100 font-semibold px-4 py-2 rounded-lg"
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