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
    const cards: SectorCardData[] = [];

    // 1. Add "Tous les projets" card
    cards.push({
      id: 'all-projects',
      title: 'TOUS LES PROJETS',
      description: 'Découvrez l\'ensemble de nos réalisations en ingénierie électrique.',
      image: getRelevantFallbackImage('default'),
      icon: LayoutGrid,
      categorySlug: 'all',
    });

    // Map for quick lookup of domains by title
    const domainesMap = new Map(domaines.map(d => [d.title, d]));

    // 2. Add specific hardcoded cards, trying to pull images from domaines
    const specificCardDefinitions = [
      {
        id: 'etablissements-hospitaliers',
        title: 'ÉTABLISSEMENTS HOSPITALIERS',
        description: 'Études et installations électriques complètes pour les infrastructures de santé.',
        defaultImage: 'https://la-maitrise.tn/MEDIA/REF.HOPITAL.png',
        icon: Hospital,
      },
      {
        id: 'batiments-patrimoine-musees',
        title: 'BÂTIMENTS DU PATRIMONIAL ET MUSÉES', // Corrected title to match potential domain
        description: 'Expertise en électricité pour la valorisation et la conservation du patrimoine.',
        defaultImage: 'https://la-maitrise.tn/MEDIA/REF.MUSEE.png',
        icon: Landmark,
      },
      {
        id: 'etablissements-scolaire',
        title: 'ÉTABLISSEMENTS SCOLAIRES',
        description: 'Solutions électriques adaptées aux besoins des établissements éducatifs.',
        defaultImage: 'https://la-maitrise.tn/MEDIA/REF.ECOLE.png',
        icon: School,
      },
      // Add other specific categories if needed, e.g., Aéroports, Ports
      {
        id: 'aeroports',
        title: 'AÉROPORTS',
        description: 'Conception et mise en œuvre de systèmes électriques pour les infrastructures aéroportuaires.',
        defaultImage: getRelevantFallbackImage('aéroport'),
        icon: Plane,
      },
      {
        id: 'ports',
        title: 'PORTS',
        description: 'Solutions d\'ingénierie électrique pour les infrastructures portuaires et maritimes.',
        defaultImage: getRelevantFallbackImage('port'),
        icon: Anchor,
      },
    ];

    specificCardDefinitions.forEach(def => {
      const matchingDomaine = domainesMap.get(def.title);
      let imageUrl = def.defaultImage;
      let cardDescription = def.description;

      if (matchingDomaine) {
        if (matchingDomaine.image_mode === 'upload' && matchingDomaine.image_file) {
          imageUrl = matchingDomaine.image_file;
        } else if (matchingDomaine.image_mode === 'url' && matchingDomaine.image_url) {
          imageUrl = matchingDomaine.image_url;
        } else {
          // Fallback for auto mode or no image set in domaine
          imageUrl = getRelevantFallbackImage(`${matchingDomaine.title} ${matchingDomaine.description}`, matchingDomaine.title.toLowerCase());
        }
        cardDescription = matchingDomaine.description; // Use description from domaine
        // Remove this domain from the map so it's not added again dynamically
        domainesMap.delete(def.title);
      }

      cards.push({
        id: def.id,
        title: def.title.toUpperCase(),
        description: cardDescription,
        image: imageUrl,
        icon: def.icon,
        categorySlug: def.title, // Use the full title as slug
      });
    });

    // 3. Add remaining dynamic cards from domaines (those not covered by specific cards)
    const dynamicCards = Array.from(domainesMap.values())
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
          icon: Building, // Generic icon, could be improved with a map
          categorySlug: domaine.title,
        };
      });

    return [...cards, ...dynamicCards];
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