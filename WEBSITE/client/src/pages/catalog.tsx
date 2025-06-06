import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import GameCard from "@/components/game-card";
import SearchFilters from "@/components/search-filters";
import { api } from "@/lib/api";
import type { SearchParams, SearchResponse } from "@/lib/types";

export default function Catalog() {
  const [location] = useLocation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Parse URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialFilters: SearchParams = {
    search: urlParams.get('search') || undefined,
    genre: urlParams.get('genre') || undefined,
    platform: urlParams.get('platform') || undefined,
    minRating: urlParams.get('minRating') ? parseFloat(urlParams.get('minRating')!) : undefined,
    maxRating: urlParams.get('maxRating') ? parseFloat(urlParams.get('maxRating')!) : undefined,
    yearFrom: urlParams.get('yearFrom') ? parseInt(urlParams.get('yearFrom')!) : undefined,
    yearTo: urlParams.get('yearTo') ? parseInt(urlParams.get('yearTo')!) : undefined,
    sortBy: (urlParams.get('sortBy') as any) || 'title',
    sortOrder: (urlParams.get('sortOrder') as any) || 'asc',
    page: parseInt(urlParams.get('page') || '1'),
    limit: parseInt(urlParams.get('limit') || '12')
  };

  const [filters, setFilters] = useState<SearchParams>(initialFilters);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });
    
    const newUrl = `/catalog${params.toString() ? `?${params.toString()}` : ''}`;
    if (newUrl !== location) {
      window.history.replaceState({}, '', newUrl);
    }
  }, [filters, location]);

  const { data: searchResponse, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ['/api/games', filters],
    queryFn: () => api.getGames(filters),
  });

  const games = searchResponse?.games || [];
  const totalGames = searchResponse?.total || 0;
  const totalPages = Math.ceil(totalGames / (filters.limit || 12));

  const handleFiltersChange = (newFilters: SearchParams) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy: sortBy as any, page: 1 }));
  };

  const handleLimitChange = (limit: string) => {
    setFilters(prev => ({ ...prev, limit: parseInt(limit), page: 1 }));
  };

  return (
    <div className="min-h-screen bg-slate-800 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-orbitron font-bold text-4xl mb-4 text-white">Game Catalog</h1>
          <p className="text-slate-300 text-lg">Advanced search and filtering to find exactly what you're looking for</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-slate-300">
                  {isLoading ? 'Loading...' : `${totalGames.toLocaleString()} games found`}
                </span>
                <Select value={(filters.limit || 12).toString()} onValueChange={handleLimitChange}>
                  <SelectTrigger className="w-20 bg-slate-700 border-slate-600 text-white focus:border-cyber-purple">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Select value={filters.sortBy || 'title'} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white focus:border-cyber-purple">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="releaseDate">Release Date</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center space-x-1 border border-slate-600 rounded-lg bg-slate-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-slate-600' : ''} text-white hover:bg-slate-600`}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-slate-600' : ''} text-white hover:bg-slate-600`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <Card className="bg-red-900/20 border-red-500">
                <CardContent className="p-6">
                  <p className="text-red-400">
                    Error loading games: {error instanceof Error ? error.message : 'Unknown error'}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {Array.from({ length: filters.limit || 12 }).map((_, i) => (
                  <div key={i} className="bg-slate-800 rounded-xl h-80 animate-pulse"></div>
                ))}
              </div>
            )}

            {/* Games Grid */}
            {!isLoading && games.length > 0 && (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && games.length === 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">🎮</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No games found</h3>
                  <p className="text-slate-400">
                    Try adjusting your search criteria or filters to find more games.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-12 space-x-4">
                <Button
                  onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
                  disabled={filters.page === 1}
                  variant="outline"
                  className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 4, (filters.page || 1) - 2)) + i;
                    if (page > totalPages) return null;
                    
                    return (
                      <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        variant={page === filters.page ? "default" : "outline"}
                        className={page === filters.page 
                          ? "bg-cyber-purple text-white" 
                          : "border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
                        }
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  {totalPages > 5 && (filters.page || 1) < totalPages - 2 && (
                    <>
                      <span className="px-4 py-2 text-slate-400">...</span>
                      <Button
                        onClick={() => handlePageChange(totalPages)}
                        variant="outline"
                        className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                
                <Button
                  onClick={() => handlePageChange(Math.min(totalPages, (filters.page || 1) + 1))}
                  disabled={filters.page === totalPages}
                  variant="outline"
                  className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
