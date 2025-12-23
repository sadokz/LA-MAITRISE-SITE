import React, { useMemo } from 'react';
import { MapPin, CheckCircle } from 'lucide-react';
import { useRealisations, useSiteTexts } from '@/hooks/useSupabaseData';
import EditableText from '@/components/EditableText';
// import tunisiaMapImage from '@/assets/tunisia-map.png'; // Removed this import
import { cn } from '@/lib/utils';

// A generic map image URL for better visibility
const DEFAULT_TUNISIA_MAP_IMAGE = 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

// Define approximate coordinates for cities on a 800x600px map image (relative percentages)
// These coordinates are illustrative and would need fine-tuning with an actual map image.
const cityCoordinates: { [key: string]: { x: number; y: number } } = {
  'Tunis': { x: 50, y: 20 },
  'Nabeul': { x: 60, y: 25 },
  'Sousse': { x: 55, y: 40 },
  'Monastir': { x: 58, y: 45 },
  'Korba': { x: 65, y: 28 },
  'Mégrine': { x: 52, y: 22 },
  'Ksar Hellal': { x: 60, y: 48 },
  'Kairouan': { x: 45, y: 40 },
  'Sfax': { x: 48, y: 60 },
  'Gabès': { x: 40, y: 75 },
  'Djerba': { x: 60, y: 85 },
  'Bizerte': { x: 45, y: 10 },
  'Jendouba': { x: 25, y: 20 },
  'Le Kef': { x: 20, y: 35 },
  'Gafsa': { x: 25, y: 60 },
  'Tozeur': { x: 15, y: 70 },
  'Tataouine': { x: 40, y: 90 },
  'Mahdia': { x: 65, y: 50 },
  'Zaghouan': { x: 48, y: 30 },
  'Grombalia': { x: 55, y: 22 },
  'Kélibia': { x: 70, y: 30 },
  'Hawaria': { x: 75, y: 25 },
  'Soliman': { x: 58, y: 18 },
  'Takelsa': { x: 68, y: 20 },
  'Bembla': { x: 60, y: 42 },
  'Chrarda': { x: 50, y: 50 },
  'Bouhajla': { x: 40, y: 45 },
  'Menzel Bouzelfa': { x: 62, y: 20 },
  'Dar Chaabane El Fehri': { x: 63, y: 23 },
};

const TunisiaMap = () => {
  const { realisations, loading: realisationsLoading } = useRealisations();
  const { getSiteText } = useSiteTexts();

  const projectsByLocation = useMemo(() => {
    const map = new Map<string, number>();
    realisations.forEach(project => {
      if (project.emplacement) {
        const location = project.emplacement.split(',')[0].trim(); // Use first part of emplacement
        map.set(location, (map.get(location) || 0) + 1);
      }
    });
    return map;
  }, [realisations]);

  if (realisationsLoading) {
    return (
      <section id="tunisia-map" className="section-padding bg-muted/30 min-h-[400px]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  const locationsWithProjects = Array.from(projectsByLocation.keys()).filter(location => cityCoordinates[location]);

  return (
    <section id="tunisia-map" className="section-padding bg-muted/30 min-h-[400px]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-gray-dark mb-6">
              <EditableText textKey="tunisiaMap.header.title1" defaultValue={getSiteText('tunisiaMap', 'header', 'title1', 'Notre présence')} className="inline" as="span" />{' '}
              <EditableText textKey="tunisiaMap.header.title2" defaultValue={getSiteText('tunisiaMap', 'header', 'title2', 'en Tunisie')} className="text-gradient-primary inline" as="span" />
            </h2>
            <EditableText textKey="tunisiaMap.header.description" defaultValue={getSiteText('tunisiaMap', 'header', 'description', 'Découvrez les villes où nous avons réalisé des projets, témoignant de notre engagement national.')} className="text-xl text-gray-medium max-w-3xl mx-auto leading-relaxed" as="p" multiline />
          </div>

          <div className="relative w-full max-w-4xl mx-auto aspect-[4/3] bg-gray-200 rounded-xl shadow-elegant overflow-hidden min-h-[300px]">
            <img 
              src={DEFAULT_TUNISIA_MAP_IMAGE} 
              alt="Carte de la Tunisie" 
              className="w-full h-full object-cover" 
            />
            {locationsWithProjects.map(location => {
              const coords = cityCoordinates[location];
              const projectCount = projectsByLocation.get(location) || 0;
              if (!coords) return null;

              return (
                <div
                  key={location}
                  className="absolute flex items-center justify-center p-1 rounded-full bg-primary text-white text-xs font-bold shadow-md cursor-pointer group"
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    transform: 'translate(-50%, -50%)',
                    minWidth: '24px',
                    minHeight: '24px',
                  }}
                >
                  {projectCount > 0 ? projectCount : <MapPin className="h-3 w-3" />}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-dark text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {location} ({projectCount} projet{projectCount > 1 ? 's' : ''})
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-dark"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {locationsWithProjects.length > 0 && (
            <div className="mt-16 text-center">
              <EditableText 
                textKey="tunisiaMap.cities.title" 
                defaultValue={getSiteText('tunisiaMap', 'cities', 'title', 'Villes avec projets')} 
                className="font-heading font-bold text-2xl text-gray-dark mb-6 inline-block" 
                as="h3" 
              />
              <div className="flex flex-wrap justify-center gap-4">
                {locationsWithProjects.sort().map(location => (
                  <div key={location} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm text-gray-dark text-sm font-medium">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {location} ({projectsByLocation.get(location)})
                  </div>
                ))}
              </div>
            </div>
          )}

          {locationsWithProjects.length === 0 && (
            <div className="text-center py-12 text-gray-medium">
              <p>Aucun projet avec une localisation définie n'is disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TunisiaMap;