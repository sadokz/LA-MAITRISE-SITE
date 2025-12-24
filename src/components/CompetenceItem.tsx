import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Competence } from '@/hooks/useSupabaseData';
import { getRelevantFallbackImage } from '@/lib/fallbackImages';

interface CompetenceItemProps {
  competence: Competence;
  index: number;
  ref?: React.Ref<HTMLDivElement>;
}

const CompetenceItem = React.forwardRef<HTMLDivElement, CompetenceItemProps>(({ competence, index }, ref) => {
  const isImageLeft = index % 2 === 0;

  const getDisplayImage = useMemo(() => {
    if (competence.image_mode === 'upload' && competence.image_file) {
      return competence.image_file;
    }
    if (competence.image_mode === 'url' && competence.image_url) {
      return competence.image_url;
    }
    const searchString = `${competence.title} ${competence.description} ${competence.long_description || ''}`;
    return getRelevantFallbackImage(searchString, competence.title.toLowerCase());
  }, [competence]);

  return (
    <div
      ref={ref}
      className={cn(
        "group p-8 rounded-2xl shadow-elegant border-2 border-transparent transition-all duration-300 hover:shadow-hover hover:border-primary/20 hover:scale-[1.01]",
        index % 2 === 0 ? "bg-white" : "bg-muted/50"
      )}
    >
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-fade-up`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {getDisplayImage && (
          <div className={isImageLeft ? 'md:order-1' : 'md:order-2'}>
            <img
              src={getDisplayImage}
              alt={competence.title}
              className="w-full h-72 object-cover rounded-xl shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getRelevantFallbackImage('default');
                console.warn(`Image non disponible pour "${competence.title}", fallback utilisé.`);
              }}
            />
          </div>
        )}

        <div className={isImageLeft ? 'md:order-2' : 'md:order-1'} >
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-3xl text-primary flex-shrink-0">
              {competence.icon}
            </div>
            <h2 className="font-heading font-bold text-3xl text-gray-dark">
              {competence.title}
            </h2>
          </div>
          <p className="text-gray-medium leading-relaxed">
            {competence.description}
          </p>
          {competence.long_description && (
            <p className="text-gray-medium leading-relaxed border-t pt-4 mt-4">
              {competence.long_description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

CompetenceItem.displayName = 'CompetenceItem';

export default CompetenceItem;