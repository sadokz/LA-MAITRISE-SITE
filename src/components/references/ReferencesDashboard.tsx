"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ChevronDown, ArrowUpDown, RefreshCcw, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useReferences, useDomaines } from '@/hooks/useSupabaseData';
import ProjectCard from './ProjectCard';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 12;

const ReferencesDashboard = () => {
  const { references, loading: refLoading } = useReferences();
  const { domaines, loading: domLoading } = useDomaines();

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedYear, selectedLocation, sortBy]);

  // Extract unique values for filters
  const years = useMemo(() => {
    const uniqueYears = new Set<string>();
    references.forEach(r => {
      if (r.date_text) {
        const yearMatch = r.date_text.match(/\d{4}/);
        if (yearMatch) uniqueYears.add(yearMatch[0]);
      }
    });
    return Array.from(uniqueYears).sort((a, b) => b.localeCompare(a));
  }, [references]);

  const locations = useMemo(() => {
    const uniqueLocs = new Set<string>();
    references.forEach(r => {
      if (r.emplacement) {
        const city = r.emplacement.split(',')[0].trim();
        uniqueLocs.add(city);
      }
    });
    return Array.from(uniqueLocs).sort();
  }, [references]);

  // Filtering Logic
  const filteredReferences = useMemo(() => {
    let result = references.filter(r => r.is_visible);

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.title.toLowerCase().includes(query) || 
        r.description.toLowerCase().includes(query) ||
        r.emplacement?.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query) ||
        r.reference?.toLowerCase().includes(query)
      );
    }

    // Category
    if (selectedCategory !== 'all') {
      result = result.filter(r => r.category === selectedCategory);
    }

    // Year
    if (selectedYear !== 'all') {
      result = result.filter(r => r.date_text?.includes(selectedYear));
    }

    // Location
    if (selectedLocation !== 'all') {
      result = result.filter(r => r.emplacement?.includes(selectedLocation));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') return (b.parsed_year || 0) - (a.parsed_year || 0);
      if (sortBy === 'oldest') return (a.parsed_year || 0) - (b.parsed_year || 0);
      if (sortBy === 'alpha') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [references, searchQuery, selectedCategory, selectedYear, selectedLocation, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredReferences.length / ITEMS_PER_PAGE);
  const paginatedReferences = filteredReferences.slice(0, currentPage * ITEMS_PER_PAGE);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedYear('all');
    setSelectedLocation('all');
    setSortBy('newest');
  };

  if (refLoading || domLoading) {
    return (
      <div className="space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 1. SECTION CATÉGORIES */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-dark flex items-center gap-2">
          Catégories
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {/* "Tous les projets" Card */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 aspect-square group",
              selectedCategory === 'all'
                ? "bg-primary border-primary text-white shadow-lg scale-105 z-10"
                : "bg-white border-border/50 text-gray-medium hover:border-primary/30 hover:shadow-md"
            )}
          >
            <LayoutGrid className={cn("mb-3 w-8 h-8", selectedCategory === 'all' ? "text-white" : "text-primary")} />
            <span className="font-bold text-sm uppercase tracking-tight text-center">Tous les projets</span>
            <span className={cn("mt-2 text-xs px-2 py-0.5 rounded-full", selectedCategory === 'all' ? "bg-white/20" : "bg-gray-light")}>
              {references.length}
            </span>
          </button>

          {/* Dynamic Domain Cards */}
          {domaines.sort((a, b) => a.position - b.position).map((domaine) => {
            const count = references.filter(r => r.category === domaine.title).length;
            if (count === 0) return null;
            
            const isActive = selectedCategory === domaine.title;

            return (
              <button
                key={domaine.id}
                onClick={() => setSelectedCategory(domaine.title)}
                className={cn(
                  "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 aspect-square group",
                  isActive
                    ? "bg-primary border-primary text-white shadow-lg scale-105 z-10"
                    : "bg-white border-border/50 text-gray-medium hover:border-primary/30 hover:shadow-md"
                )}
              >
                <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{domaine.icon}</span>
                <span className="font-bold text-sm uppercase tracking-tight text-center line-clamp-2">{domaine.title}</span>
                <span className={cn("mt-2 text-xs px-2 py-0.5 rounded-full", isActive ? "bg-white/20" : "bg-gray-light")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. BARRE DE RECHERCHE */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-muted" size={22} />
            <Input 
              placeholder="Rechercher un projet, client, lieu..." 
              className="pl-12 h-14 bg-white border-border/50 shadow-sm focus-visible:ring-primary rounded-2xl text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button 
            variant={showFilters ? "default" : "outline"} 
            className="h-14 px-8 rounded-2xl flex items-center gap-2 font-bold border-border/50 shadow-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filtres
            { (selectedYear !== 'all' || selectedLocation !== 'all') && (
              <Badge className="ml-1 bg-white text-primary hover:bg-white h-6 w-6 p-0 flex items-center justify-center rounded-full">
                {(selectedYear !== 'all' ? 1 : 0) + (selectedLocation !== 'all' ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </div>

        {/* Advanced Filters Dropdown */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white rounded-2xl border border-border/50 shadow-lg animate-fade-up">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-muted uppercase tracking-wider ml-1">Année du projet</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="h-12 bg-gray-light/30 border-none rounded-xl">
                  <SelectValue placeholder="Toutes les années" />
                </SelectTrigger>
                <SelectContent className="bg-white border-border z-50">
                  <SelectItem value="all">Toutes les années</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-muted uppercase tracking-wider ml-1">Localisation</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-12 bg-gray-light/30 border-none rounded-xl">
                  <SelectValue placeholder="Toutes les villes" />
                </SelectTrigger>
                <SelectContent className="bg-white border-border z-50">
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="ghost" className="w-full h-12 text-gray-muted hover:text-destructive rounded-xl" onClick={handleReset}>
                <RefreshCcw size={16} className="mr-2" />
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 3. LIGNE INFÉRIEURE (Compteur + Tri) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-border/50 pb-6">
        <div className="text-gray-medium font-medium text-lg">
          Affichage de <span className="text-gray-dark font-bold">{Math.min(paginatedReferences.length, filteredReferences.length)}</span> sur <span className="text-primary font-bold">{filteredReferences.length}</span> projets
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm font-bold text-gray-muted uppercase tracking-wider whitespace-nowrap">Trier par :</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-11 rounded-xl w-full sm:w-48 bg-white border-border/50 shadow-sm">
              <ArrowUpDown size={16} className="mr-2 text-gray-muted" />
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent className="bg-white border-border z-50">
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="oldest">Plus anciens</SelectItem>
              <SelectItem value="alpha">Alphabétique</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredReferences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedReferences.map((project, index) => (
            <div key={project.id} className="animate-fade-up" style={{ animationDelay: `${(index % 6) * 0.1}s` }}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-border/50">
          <div className="w-24 h-24 bg-gray-light/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={40} className="text-gray-muted" />
          </div>
          <h3 className="text-2xl font-bold text-gray-dark mb-3">Aucun projet trouvé</h3>
          <p className="text-gray-medium max-w-md mx-auto text-lg">
            Nous n'avons trouvé aucun résultat correspondant à vos critères. Essayez de modifier vos filtres.
          </p>
          <Button variant="outline" className="mt-8 px-8 h-12 rounded-xl border-primary text-primary hover:bg-primary hover:text-white" onClick={handleReset}>
            Réinitialiser tout
          </Button>
        </div>
      )}

      {/* Load More / Pagination */}
      {currentPage < totalPages && (
        <div className="flex justify-center pt-8">
          <Button 
            size="lg" 
            className="bg-white hover:bg-primary hover:text-white text-primary border-2 border-primary px-16 py-7 rounded-2xl font-bold shadow-lg transition-all duration-300 text-lg"
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Charger plus de projets
            <ChevronDown className="ml-2 w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReferencesDashboard;