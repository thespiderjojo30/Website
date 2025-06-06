import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { SearchParams, GameGenre, GamePlatform } from "@/lib/types";

interface SearchFiltersProps {
  filters: SearchParams;
  onFiltersChange: (filters: SearchParams) => void;
  className?: string;
}

export default function SearchFilters({ filters, onFiltersChange, className = "" }: SearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchParams>(filters);
  const [showFilters, setShowFilters] = useState(false);

  const { data: genres = [] } = useQuery<GameGenre[]>({
    queryKey: ['/api/genres'],
  });

  const { data: platforms = [] } = useQuery<GamePlatform[]>({
    queryKey: ['/api/platforms'],
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof SearchParams, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange({ ...localFilters, page: 1 });
    setShowFilters(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      page: 1,
      limit: filters.limit || 12
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.search) count++;
    if (localFilters.genre) count++;
    if (localFilters.platform) count++;
    if (localFilters.minRating !== undefined) count++;
    if (localFilters.maxRating !== undefined) count++;
    if (localFilters.yearFrom) count++;
    if (localFilters.yearTo) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={className}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="w-full border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-cyber-purple text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      <Card className={`bg-space-blue border-slate-700 ${showFilters || 'hidden lg:block'}`}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-orbitron text-white flex items-center justify-between">
            Filters
            {activeFiltersCount > 0 && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Search */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">Search</Label>
            <Input
              type="text"
              placeholder="Game title, developer..."
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white focus:border-cyber-purple"
            />
          </div>

          {/* Genre */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">Genre</Label>
            <Select
              value={localFilters.genre || 'all-genres'}
              onValueChange={(value) => handleFilterChange('genre', value === 'all-genres' ? undefined : value)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-cyber-purple">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all-genres">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.name}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Platform */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">Platform</Label>
            <Select
              value={localFilters.platform || 'all-platforms'}
              onValueChange={(value) => handleFilterChange('platform', value === 'all-platforms' ? undefined : value)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-cyber-purple">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all-platforms">All Platforms</SelectItem>
                {platforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.name}>
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating Range */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Rating: {localFilters.minRating?.toFixed(1) || '0.0'} - {localFilters.maxRating?.toFixed(1) || '5.0'}
            </Label>
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-slate-400">Minimum Rating</Label>
                <Slider
                  value={[localFilters.minRating || 0]}
                  onValueChange={([value]) => handleFilterChange('minRating', value)}
                  max={5}
                  min={0}
                  step={0.1}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400">Maximum Rating</Label>
                <Slider
                  value={[localFilters.maxRating || 5]}
                  onValueChange={([value]) => handleFilterChange('maxRating', value)}
                  max={5}
                  min={0}
                  step={0.1}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Release Year Range */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">Release Year</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="From"
                value={localFilters.yearFrom || ''}
                onChange={(e) => handleFilterChange('yearFrom', e.target.value ? parseInt(e.target.value) : undefined)}
                className="bg-slate-700 border-slate-600 text-white focus:border-cyber-purple"
                min={1970}
                max={2030}
              />
              <Input
                type="number"
                placeholder="To"
                value={localFilters.yearTo || ''}
                onChange={(e) => handleFilterChange('yearTo', e.target.value ? parseInt(e.target.value) : undefined)}
                className="bg-slate-700 border-slate-600 text-white focus:border-cyber-purple"
                min={1970}
                max={2030}
              />
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">Sort By</Label>
            <div className="space-y-2">
              <Select
                value={localFilters.sortBy || 'title'}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-cyber-purple">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="releaseDate">Release Date</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={localFilters.sortOrder || 'asc'}
                onValueChange={(value) => handleFilterChange('sortOrder', value)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-cyber-purple">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={applyFilters}
            className="w-full bg-cyber-purple hover:bg-purple-600 text-white font-semibold"
          >
            Apply Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
