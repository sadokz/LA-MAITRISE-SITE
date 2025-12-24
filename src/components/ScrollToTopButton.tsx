import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    // Show button if scrolled down more than a certain threshold (e.g., 300px)
    // And also if the user is near the bottom of the page (e.g., last 500px)
    const scrolledFromTop = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const scrolledToBottom = totalHeight - (scrolledFromTop + viewportHeight);

    if (scrolledFromTop > 300 && scrolledToBottom < 500) { // Adjust 500px threshold as needed
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [toggleVisibility]);

  return (
    <Button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-40 p-0 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-300 flex items-center justify-center",
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'
      )}
      aria-label="Retour en haut de la page"
    >
      <ArrowUp className="h-6 w-6" />
    </Button>
  );
};

export default ScrollToTopButton;