import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Domaine, Reference } from '@/hooks/useSupabaseData';

interface ReferencesSidebarProps {
  domaines: Domaine[];
  groupedReferences: { [category: string]: Reference[] };
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  expandedDomains: Set<string>;
  toggleExpand: (category: string) => void;
  scrollToSection: (sectionId: string) => void;
  categoryCounts: { [key: string]: number };
  activeDomainTitle: string | null;
  headerOffset: number;
}

const ReferencesSidebar: React.FC<ReferencesSidebarProps> = ({
  domaines,
  groupedReferences,
  selectedCategory,
  setSelectedCategory,
  expandedDomains,
  toggleExpand,
  scrollToSection,
  categoryCounts,
  activeDomainTitle,
  headerOffset,
}) => {
  return (
    <div
      className="hidden lg:block sticky top-0 bottom-0 overflow-y-auto pr-4"
      style={{ top: `${headerOffset}px`, height: `calc(100vh - ${headerOffset}px)` }}
    >
      <h3 className="font-heading font-bold text-xl text-gray-dark mb-4">Domaines</h3>
      <ScrollArea className="h-full">
        <div className="space-y-2">
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
          {domaines.sort((a, b) => a.position - b.position).map((domaine) => {
            const projectsInDomain = groupedReferences[domaine.title] || [];
            const isExpanded = expandedDomains.has(domaine.title);
            const isActive = activeDomainTitle === domaine.title;
            const canExpand = projectsInDomain.length > 3 && !isExpanded;
            const canCollapse = projectsInDomain.length > 3 && isExpanded;

            if (projectsInDomain.length === 0) return null;

            return (
              <div key={domaine.id} className="flex items-center justify-between group">
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'flex-1 justify-start text-left pr-2',
                    isActive ? 'bg-primary text-white hover:bg-primary/90' : 'text-gray-dark hover:bg-muted'
                  )}
                  onClick={() => {
                    setSelectedCategory('all'); // Always show all grouped when navigating from sidebar
                    scrollToSection(domaine.title);
                  }}
                >
                  {domaine.title}
                  <span className={cn(
                    'ml-auto px-2 py-0.5 text-xs font-semibold rounded-full',
                    isActive ? 'bg-white text-primary' : 'bg-primary-light text-white'
                  )}>
                    {projectsInDomain.length}
                  </span>
                </Button>
                {isActive && projectsInDomain.length > 3 && (
                  <div className="flex items-center ml-2">
                    {canExpand && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleExpand(domaine.title)}
                        className={cn(
                          'h-8 w-8',
                          isActive ? 'text-white hover:bg-white/20' : 'text-gray-dark hover:bg-muted'
                        )}
                        title="Afficher plus"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {canCollapse && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleExpand(domaine.title)}
                        className={cn(
                          'h-8 w-8',
                          isActive ? 'text-white hover:bg-white/20' : 'text-gray-dark hover:bg-muted'
                        )}
                        title="Afficher moins"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ReferencesSidebar;