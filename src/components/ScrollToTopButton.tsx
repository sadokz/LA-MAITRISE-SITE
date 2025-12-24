import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScrollToTopButtonProps {
  targetRef?: React.RefObject<HTMLElement>; // New prop to reference the last element
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ targetRef }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    const scrolledFromTop = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const scrolledToBottom = totalHeight - (scrolledFromTop + viewportHeight);

    let lastDomainReached = false;
    if (targetRef?.current) {
      const rect = targetRef.current.getBoundingClientRect();
      // Consider the last domain reached when its top is within the lower 20% of the viewport
      // or when its top has scrolled past the top of the viewport.
      lastDomainReached = rect.top <= window.innerHeight * 0.8;
    }

    // Button is visible if:
    // 1. Scrolled down more than 300px (to avoid showing it too early)
    // 2. The last domain is considered "reached"
    // 3. Not too close to the very bottom of the document (e.g., more than 100px from footer)
    if (scrolledFromTop > 300 && lastDomainReached && scrolledToBottom > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [targetRef]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    // Set initial visibility on mount
    toggleVisibility();
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [toggleVisibility]);

  return (
    <Button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-24 left-1/2 -translate-x-1/2 z-40 p-0 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-300 flex items-center justify-center",
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'
      )}
      aria-label="Retour en haut de la page"
    >
      <ArrowUp className="h-6 w-6" />
    </Button>
  );
};

export default ScrollToTopButton;