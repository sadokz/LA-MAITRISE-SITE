import React, { useEffect, useState, useCallback, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { ArrowLeft as ArrowLeftIcon, ArrowRight, Calendar, MapPin, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInterval } from '@/hooks/useInterval';
import { Realisation } from '@/hooks/useSupabaseData';
import { getRelevantFallbackImage } from '@/lib/fallbackImages'; // Import the new utility

interface RealisationItemProps {
  project: Realisation;
  index: number;
}

const RealisationItem: React.FC<RealisationItemProps> = ({ project, index }) => {
  const isImageLeft = index % 2 === 0; // True for 0, 2, 4... (image on left on desktop)

  // Combine main image and additional images, then sort by position
  const allProjectImages = useMemo(() => {
    const images = [
      ...(project.image_file || project.image_url ? [{ 
        id: 'main', 
        image_file: project.image_file, 
        image_url: project.image_url, 
        image_mode: project.image_mode, 
        position: -1 // Ensure main image is first
      }] : []),
      ...(project.images || []),
    ].sort((a, b) => a.position - b.position);
    return images;
  }, [project.image_file, project.image_url, project.image_mode, project.images]);

  // Embla Carousel setup for each project
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      };
      emblaApi.on('select', onSelect);
      onSelect(); // Set initial index
      return () => {
        emblaApi.off('select', onSelect);
      };
    }
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Auto-swipe logic
  useInterval(() => {
    if (emblaApi && allProjectImages.length > 1) {
      emblaApi.scrollNext();
    }
  }, allProjectImages.length > 1 ? 5000 : null); // 5 seconds delay, or null to disable

  const getDisplayImage = (r: { image_mode: string; image_file: string | null; image_url: string | null; category?: string; title?: string; description?: string }) => {
    if (r.image_mode === 'upload' && r.image_file) {
      return r.image_file;
    }
    if (r.image_mode === 'url' && r.image_url) {
      return r.image_url;
    }
    // Auto mode: use keyword-based fallback
    const searchString = `${r.title || ''} ${r.description || ''} ${r.category || ''} ${project.emplacement || ''}`;
    return getRelevantFallbackImage(searchString, r.category?.toLowerCase() || 'default');
  };

  return (
    <div 
      className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-fade-up`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image Gallery Column - Always first in source order for mobile stacking */}
      <div className={isImageLeft ? 'md:order-1' : 'md:order-2'}> 
        {allProjectImages.length > 0 ? (
          <div className="relative">
            <div className="embla overflow-hidden rounded-xl shadow-lg" ref={emblaRef}>
              <div className="embla__container flex">
                {allProjectImages.map((img, imgIndex) => (
                  <div className="embla__slide flex-[0_0_100%] min-w-0" key={img.id || imgIndex}>
                    <img 
                      src={getDisplayImage({ ...img, category: project.category, title: project.title, description: project.description })} 
                      alt={`${project.title} - Image ${imgIndex + 1}`} 
                      className="w-full h-72 object-cover rounded-xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getRelevantFallbackImage('default'); // Fallback to generic default on error
                        console.warn(`Image non disponible pour "${project.title}", fallback utilisé.`);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            {allProjectImages.length > 1 && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={scrollPrev} 
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/70 text-gray-dark rounded-full"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={scrollNext} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/70 text-gray-dark rounded-full"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                  {allProjectImages.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      onClick={() => emblaApi && emblaApi.scrollTo(dotIndex)}
                      className={cn(
                        'h-2 w-2 rounded-full bg-white/50',
                        dotIndex === selectedIndex && 'bg-primary'
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <img 
            src={getRelevantFallbackImage(`${project.title} ${project.description} ${project.category} ${project.emplacement}`)} 
            alt={project.title} 
            className="w-full h-72 object-cover rounded-xl shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getRelevantFallbackImage('default'); // Fallback to generic default on error
              console.warn(`Image non disponible pour "${project.title}", fallback utilisé.`);
            }}
          />
        )}
      </div>

      {/* Description Column - Always second in source order for mobile stacking */}
      <div className={isImageLeft ? 'md:order-2' : 'md:order-1'} > 
        <h2 className="font-heading font-bold text-3xl text-gray-dark">
          {project.title}
        </h2>
        <p className="text-lg font-medium text-primary mb-2">
          {project.category}
        </p>
        {(project.date_text || project.emplacement || project.reference) && (
          <div className="flex flex-wrap items-center text-gray-medium text-sm mb-4 gap-x-4 gap-y-2">
            {project.date_text && (
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-primary" /> {project.date_text}
              </span>
            )}
            {project.emplacement && (
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-primary" /> {project.emplacement}
              </span>
            )}
            {project.reference && (
              <span className="flex items-center">
                <Hash className="h-4 w-4 mr-1 text-primary" /> {project.reference}
              </span>
            )}
          </div>
        )}
        <p className="text-gray-medium leading-relaxed">
          {project.description}
        </p>
        {project.long_description && (
          <p className="text-gray-medium leading-relaxed border-t pt-4 mt-4">
            {project.long_description}
          </p>
        )}
      </div>
    </div>
  );
};

export default RealisationItem;