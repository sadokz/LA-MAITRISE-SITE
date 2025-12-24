import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ScrollToTopButton: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="container mx-auto px-4 lg:px-8"> {/* Add a container for consistent padding */}
      <Button
        onClick={scrollToTop}
        className={cn(
          "mx-auto block mt-12 mb-12", // Centered block with vertical margins
          "bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg shadow-lg", // Standard button styling
          "flex items-center justify-center" // Ensure icon and text are centered
        )}
        aria-label="Retour en haut de la page"
      >
        <ArrowUp className="h-5 w-5 mr-2" />
        Retour en haut
      </Button>
    </div>
  );
};

export default ScrollToTopButton;