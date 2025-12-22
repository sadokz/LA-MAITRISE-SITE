import React from 'react';
import { Home, Building2, Factory, Heart, Sun, Lightbulb, Landmark, Box } from 'lucide-react';
import { useSiteTexts, useDomaines } from '@/hooks/useSupabaseData';
import EditableText from '@/components/EditableText';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Domains = () => {
  const { getSiteText } = useSiteTexts();
  const { domaines } = useDomaines();
  
  // Configuration des icônes et couleurs pour chaque domaine (fallback)
  const domainConfig = [
    { icon: Home, color: 'from-orange-500 to-orange-600' },
    { icon: Building2, color: 'from-blue-500 to-blue-600' },
    { icon: Factory, color: 'from-green-500 to-green-600' },
    { icon: Heart, color: 'from-red-500 to-red-600' },
    { icon: Sun, color: 'from-yellow-500 to-yellow-600' },
    { icon: Lightbulb, color: 'from-purple-500 to-purple-600' },
    { icon: Landmark, color: 'from-indigo-500 to-indigo-600' },
  ];

  // Get custom icon URL based on icon_type
  const getCustomIconUrl = (domaine: typeof domaines[0]) => {
    if (domaine.icon_type === 'upload' && domaine.icon_file) {
      return domaine.icon_file;
    }
    if (domaine.icon_type === 'url' && domaine.icon_url) {
      return domaine.icon_url;
    }
    return null;
  };

  return (
    <section id="domaines" className="section-padding bg-gray-light/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-gray-dark mb-6">
              <EditableText textKey="domains.header.title1" defaultValue={getSiteText('domains', 'header', 'title1', 'Nos Domaines')} className="inline" as="span" />{' '}
              <EditableText textKey="domains.header.title2" defaultValue={getSiteText('domains', 'header', 'title2', "d'Intervention")} className="text-gradient-orange inline" as="span" />
            </h2>
            <EditableText textKey="domains.header.description" defaultValue={getSiteText('domains', 'header', 'description', 'Nous adaptons nos solutions aux spécificités de chaque secteur pour offrir des infrastructures fiables, durables et adaptées aux besoins de nos clients.')} className="text-xl text-gray-medium max-w-3xl mx-auto leading-relaxed" as="p" multiline />
          </div>

          {/* Domains Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {domaines.map((domaine, index) => {
              const config = domainConfig[index] || domainConfig[0];
              const FallbackIcon = config.icon;
              const customIconUrl = getCustomIconUrl(domaine);

              return (
                <div key={domaine.id} className="card-elegant bg-white group hover:shadow-hover animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    {customIconUrl ? (
                      <div 
                        className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-3 group-hover:scale-110 transition-transform duration-300 shadow-md"
                        style={{ 
                          border: `3px solid ${domaine.icon_border_color || '#3B82F6'}`,
                          boxShadow: `0 4px 12px ${domaine.icon_border_color || '#3B82F6'}30`
                        }}
                      >
                        <img 
                          src={customIconUrl} 
                          alt={domaine.title} 
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            // Hide image and show fallback on error
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`;
                              parent.appendChild(fallback.firstChild!);
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <FallbackIcon className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-semibold text-xl text-gray-dark mb-4 text-center">
                    {domaine.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-muted text-center leading-relaxed">
                    {domaine.description}
                  </p>
                </div>
              );
            })}
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

              {/* Button to link to the new page */}
              <div className="mt-8">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4 text-lg">
                  <Link to="/domaines">
                    Découvrir tous nos domaines
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Domains;