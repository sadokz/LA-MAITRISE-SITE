import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, ChevronDown, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Domaine, Reference } from '@/hooks/useSupabaseData';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MobileReferencesNavProps {
  domaines: Domaine[];
  groupedReferences: { [category: string]: Reference[] };
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  scrollToSection: (sectionId: string) => void;
  categoryCounts: { [key: string]: number };
  activeDomainTitle: string | null;
  headerOffset: number;
}

const MobileReferencesNav: React.FC<MobileReferencesNavProps> = ({
  domaines,
  groupedReferences,
  selectedCategory,
  setSelectedCategory,
  scrollToSection,
  categoryCounts,
  activeDomainTitle,
  headerOffset,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const currentActiveDomainLabel = activeDomainTitle || 'Tous les projets';

  return (
    <div
      className="lg:hidden sticky z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
      style={{ top: `${headerOffset}px` }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-gray-dark flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-primary" />
          {currentActiveDomainLabel}
        </span>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Menu className="h-4 w-4" />
              Domaines
              <ChevronDown className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
            <div className="flex flex-col h-full">
              <h3 className="font-heading font-bold text-xl text-gray-dark p-4 border-b">Domaines</h3>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                  <SheetClose asChild>
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                      className={cn(
                        'w-full justify-start text-left',
                        selectedCategory === 'all' ? 'bg-primary text-white hover:bg-primary/90' : 'text-gray-dark hover:bg-muted'
                      )}
                      onClick={() => {
                        setSelectedCategory('all');
                        scrollToSection('all'); // Scroll to top or hero section
                      }}
                    >
                      Tous les projets
                      <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-light text-white">
                        {categoryCounts.all}
                      </span>
                    </Button>
                  </SheetClose>
                  {domaines.sort((a, b) => a.position - b.position).map((domaine) => {
                    const projectsInDomain = groupedReferences[domaine.title] || [];
                    if (projectsInDomain.length === 0) return null;
                    return (
                      <SheetClose asChild key={domaine.id}>
                        <Button
                          variant={activeDomainTitle === domaine.title ? 'default' : 'ghost'}
                          className={cn(
                            'w-full justify-start text-left',
                            activeDomainTitle === domaine.title ? 'bg-primary text-white hover:bg-primary/90' : 'text-gray-dark hover:bg-muted'
                          )}
                          onClick={() => {
                            setSelectedCategory('all'); // Always show all grouped when navigating from sidebar
                            scrollToSection(domaine.title);
                          }}
                        >
                          {domaine.title}
                          <span className={cn(
                            'ml-auto px-2 py-0.5 text-xs font-semibold rounded-full',
                            activeDomainTitle === domaine.title ? 'bg-white text-primary' : 'bg-primary-light text-white'
                          )}>
                            {projectsInDomain.length}
                          </span>
                        </Button>
                      </SheetClose>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileReferencesNav;