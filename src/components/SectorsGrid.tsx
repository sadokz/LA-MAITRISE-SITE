import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, LayoutGrid, Hospital, Landmark, School, Plane, Anchor } from 'lucide-react';
import { useDomaines } from '@/hooks/useSupabaseData';
import { getRelevantFallbackImage } from '@/lib/fallbackImages';

interface SectorCardData {
  id: string;
  title: string;
  description: string;
  image: string;
  icon?: string | React.ElementType; // Allow string for emojis
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
      // Add other specific categories if needed, e.g., Aéroports, Ports
      {
        id: 'aeroports',
        title: 'AÉROPORTS',
        description: 'Conception et mise en œuvre de systèmes électriques pour les infrastructures aéroportuaires.',
        image: getRelevantFallbackImage('aéroport'),
        icon: Plane,
        categorySlug: 'Aéroports',
      },
      {
        id: 'ports',
        title: 'PORTS',
        description: 'Solutions d\'ingénierie électrique pour les infrastructures portuaires et maritimes.',
        image: getRelevantFallbackImage('port'),
        icon: Anchor,
        categorySlug: 'Ports',
      },
    ];

    // Dynamically add cards for other domains, ensuring no duplicates with specific cards
    const existingSlugs = new Set(baseCards.map(card => card.categorySlug));
    const dynamicCards = domaines
      .filter(domaine => !existingSlugs.has(domaine.title))
      .sort((a, b) => a.position - b.position) // Sort by position
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
          icon: domaine.icon, // Use the actual icon from Supabase
          categorySlug: domaine.title,
        };
      });

    return [...baseCards, ...dynamicCards];
  }, [domaines]); // Depend on domaines to re-calculate when data changes

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
                console.warn(`Image non disponible pour "${card.title}", fallback utilisé.`);
              }}
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              {IconComponent && (
                <div className="mb-4 self-start w-16 h-16 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  {typeof IconComponent === 'string' ? (
                    <span className="text-5xl">{IconComponent}</span> // Render emoji directly
                  ) : (
                    <IconComponent className="h-10 w-10 text-white" /> // Render Lucide icon slightly larger
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