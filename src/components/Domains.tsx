import React from 'react';
import { Box } from 'lucide-react'; // Only Box is needed for fallback if icon is empty
import { useSiteTexts, useDomaines } from '@/hooks/useSupabaseData';
import EditableText from '@/components/EditableText';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Domains = () => {
  const { getSiteText } = useSiteTexts();
  const { domaines } = useDomaines();

  // Configuration des icônes et couleurs pour chaque domaine (fallback)
  // This is now only for fallback if icon is empty
  const defaultColors = [
    'from-primary-light to-primary-dark', // Using dynamic primary shades
    'from-cyan-500 to-cyan-600',
    'from-teal-500 to-teal-600',
    'from-indigo-500 to-indigo-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-green-500 to-green-600',
  ];

  return (
    <section id="domaines" className="section-padding bg-gray-light/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-gray-dark mb-6">
              <EditableText textKey="domains.header.title1" defaultValue={getSiteText('domains', 'header', 'title1', 'Nos')} className="inline" as="span" />{' '}
              <EditableText textKey="domains.header.title2" defaultValue={getSiteText('domains', 'header', 'title2', "Domaines d'Intervention")} className="text-gradient-primary inline" as="span" />
            </h2>
            <EditableText textKey="domains.header.description" defaultValue={getSiteText('domains', 'header', 'description', 'Nous adaptons nos solutions aux spécificités de chaque secteur pour offrir des infrastructures fiables, durables et adaptées aux besoins de nos clients.')} className="text-xl text-gray-medium max-w-3xl mx-auto leading-relaxed" as="p" multiline />
          </div>
          
          {/* Domains Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {domaines.map((domaine, index) => {
              const defaultColorClass = defaultColors[index % defaultColors.length];
              
              return (
                <div key={domaine.id} className="card-elegant bg-white group hover:shadow-hover animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    {domaine.icon ? (
                      <div className="text-5xl text-primary group-hover:scale-110 transition-transform duration-300">
                        {domaine.icon}
                      </div>
                    ) : (
                      <div className={`w-16 h-16 bg-gradient-to-br ${defaultColorClass} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Box className="w-8 h-8 text-white" /> {/* Fallback Lucide icon */}
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
          
          {/* Button moved here - directly under the domains list */}
          <div className="text-center mb-16">
            <Button 
              asChild 
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3"
            >
              <Link to="/domaines">
                En Savoir Plus
                <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Domains;