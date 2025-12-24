import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Domaine } from '@/hooks/useSupabaseData';
import { getRelevantFallbackImage } from '@/lib/fallbackImages';

interface DomainItemProps {
  domaine: Domaine;
  index: number;
  // Add ref prop
  ref?: React.Ref<HTMLDivElement>;
}

const DomainItem = React.forwardRef<HTMLDivElement, DomainItemProps>(({ domaine, index, ...props }, ref) => {
  const isImageLeft = index % 2 === 0; // True for 0, 2, 4... (image on left on desktop)

  const getDisplayImage = useMemo(() => {
    if (domaine.image_mode === 'upload' && domaine.image_file) {
      return domaine.image_file;
    }
    if (domaine.image_mode === 'url' && domaine.image_url) {
      return domaine.image_url;
    }
    // Auto mode: use keyword-based fallback
    const searchString = `${domaine.title} ${domaine.description} ${domaine.long_description || ''}`;
    return getRelevantFallbackImage(searchString, domaine.title.toLowerCase());
  }, [domaine]);

  return (
    <div
      ref={ref} // Apply the ref here
      className={cn(
        "group p-8 rounded-2xl shadow-elegant border-2 border-transparent transition-all duration-300 hover:shadow-hover hover:border-primary/20 hover:scale-[1.01]", // Frame styling with hover effects
        index % 2 === 0 ? "bg-white" : "bg-muted/50" // Alternating background
      )}
    >
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-fade-up`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Image Column */}
        {getDisplayImage && (
          <div className={isImageLeft ? 'md:order-1' : 'md:order-2'}>
            <img
              src={getDisplayImage}
              alt={domaine.title}
              className="w-full h-72 object-cover rounded-xl shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getRelevantFallbackImage('default'); // Fallback to generic default on error
                console.warn(`Image non disponible pour "${domaine.title}", fallback utilisé.`);
              }}
            />
          </div>
        )}

        {/* Text Content Column */}
        <div className={isImageLeft ? 'md:order-2' : 'md:order-1'} >
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-3xl text-primary flex-shrink-0">
              {domaine.icon}
            </div>
            <h2 className="font-heading font-bold text-3xl text-gray-dark">
              {domaine.title}
            </h2>
          </div>
          <p className="text-gray-medium leading-relaxed">
            {domaine.description}
          </p>
          {domaine.long_description && (
            <p className="text-gray-medium leading-relaxed border-t pt-4 mt-4">
              {domaine.long_description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

DomainItem.displayName = 'DomainItem'; // Add display name for forwardRef

export default DomainItem;