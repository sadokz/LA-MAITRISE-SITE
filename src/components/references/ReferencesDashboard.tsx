"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, LayoutGrid, List, ArrowUpDown, RefreshCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useReferences, useDomaines, Reference } from '@/hooks/useSupabaseData';
import ProjectCard from './ProjectCard';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Main Filters */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-elegant border border-border/50 sticky top-20 z-30">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-muted" size={20} />
            <Input 
              placeholder="Rechercher un projet, client, lieu..." 
              className="pl-10 h-12 bg-gray-light/50 border-none focus-visible:ring-primary rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 w-full lg:w-auto">
            <Button 
              variant={showFilters ? "default" : "outline"} 
              className="h-12 rounded-xl flex-1 lg:flex-none"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} className="mr-2" />
              Filtres
              { (selectedYear !== 'all' || selectedLocation !== 'all') && (
                <Badge className="ml-2 bg-white text-primary hover:bg-white h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {(selectedYear !== 'all' ? 1 : 0) + (selectedLocation !== 'all' ? 1 : 0)}
                </Badge>
              )}
            </Button>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12 rounded-xl flex-1 lg:w-48 bg-white border-border">
                <ArrowUpDown size={18} className="mr-2 text-gray-muted" />
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent className="bg-white border-border z-50">
                <SelectItem value="newest">Plus récents</SelectItem>
                <SelectItem value="oldest">Plus anciens</SelectItem>
                <SelectItem value="alpha">Alphabétique</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-gray-muted hover:text-primary" onClick={handleReset} title="Réinitialiser">
              <RefreshCcw size={20} />
            </Button>
          </div>
        </div>

        {/* Advanced Filters Dropdown */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border animate-fade-up">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-muted uppercase tracking-wider">Année</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-gray-light/30 border-none rounded-lg">
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
              <label className="text-xs font-bold text-gray-muted uppercase tracking-wider">Localisation</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="bg-gray-light/30 border-none rounded-lg">
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
              <Button variant="ghost" className="w-full text-gray-muted hover:text-destructive" onClick={handleReset}>
                Effacer tous les filtres
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Category Quick Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 ${
            selectedCategory === 'all' 
            ? 'bg-primary border-primary text-white shadow-lg scale-105' 
            : 'bg-white border-border text-gray-medium hover:border-primary/50 hover:text-primary'
          }`}
        >
          Tous les projets
          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${selectedCategory === 'all' ? 'bg-white/20' : 'bg-gray-light'}`}>
            {references.length}
          </span>
        </button>
        {domaines.sort((a, b) => a.position - b.position).map((domaine) => {
          const count = references.filter(r => r.category === domaine.title).length;
          if (count === 0) return null;
          
          return (
            <button
              key={domaine.id}
              onClick={() => setSelectedCategory(domaine.title)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 flex items-center gap-2 ${
                selectedCategory === domaine.title 
                ? 'bg-primary border-primary text-white shadow-lg scale-105' 
                : 'bg-white border-border text-gray-medium hover:border-primary/50 hover:text-primary'
              }`}
            >
              <span className="text-xl">{domaine.icon}</span>
              {domaine.title}
              <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${selectedCategory === domaine.title ? 'bg-white/20' : 'bg-gray-light'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-medium font-medium">
          Affichage de <span className="text-gray-dark font-bold">{Math.min(paginatedReferences.length, filteredReferences.length)}</span> sur <span className="text-primary font-bold">{filteredReferences.length}</span> projets
        </div>
      </div>

      {/* Projects Grid */}
      {filteredReferences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {paginatedReferences.map((project, index) => (
            <div key={project.id} className="animate-fade-up" style={{ animationDelay: `${(index % 6) * 0.1}s` }}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-light/30 rounded-3xl border-2 border-dashed border-border">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Search size={32} className="text-gray-muted" />
          </div>
          <h3 className="text-xl font-bold text-gray-dark mb-2">Aucun projet trouvé</h3>
          <p className="text-gray-medium max-w-md mx-auto">
            Nous n'avons trouvé aucun résultat correspondant à vos critères de recherche. Essayez de modifier vos filtres ou votre recherche.
          </p>
          <Button variant="outline" className="mt-6" onClick={handleReset}>
            Réinitialiser tout
          </Button>
        </div>
      )}

      {/* Load More / Pagination */}
      {currentPage < totalPages && (
        <div className="flex justify-center pt-12">
          <Button 
            size="lg" 
            className="bg-white hover:bg-primary hover:text-white text-primary border-2 border-primary px-12 py-6 rounded-2xl font-bold shadow-lg transition-all duration-300"
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Charger plus de projets
            <ChevronDown className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReferencesDashboard;