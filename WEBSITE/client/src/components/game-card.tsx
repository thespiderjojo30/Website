import { Link } from "wouter";
import { Star, Calendar, Monitor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Game } from "@/lib/types";

interface GameCardProps {
  game: Game;
  className?: string;
}

export default function GameCard({ game, className = "" }: GameCardProps) {
  const formatRating = (rating?: string) => {
    if (!rating) return "N/A";
    const num = parseFloat(rating);
    return isNaN(num) ? "N/A" : num.toFixed(1);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).getFullYear().toString();
    } catch {
      return "Unknown";
    }
  };

  const getPlatformColor = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('pc') || platformLower.includes('steam')) return 'bg-cyber-purple';
    if (platformLower.includes('playstation') || platformLower.includes('ps')) return 'bg-blue-500';
    if (platformLower.includes('xbox')) return 'bg-green-500';
    if (platformLower.includes('nintendo') || platformLower.includes('switch')) return 'bg-red-500';
    return 'bg-slate-600';
  };

  const getImageUrl = () => {
    if (game.imageUrl) return game.imageUrl;
    
    // Fallback images based on genre
    const genre = game.genre?.toLowerCase() || '';
    if (genre.includes('action') || genre.includes('adventure')) {
      return 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300';
    }
    if (genre.includes('racing')) {
      return 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300';
    }
    if (genre.includes('strategy')) {
      return 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300';
    }
    if (genre.includes('simulation') || genre.includes('space')) {
      return 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300';
    }
    if (genre.includes('platformer') || genre.includes('retro') || genre.includes('pixel')) {
      return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300';
    }
    if (genre.includes('fps') || genre.includes('shooter')) {
      return 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300';
    }
    
    // Default gaming image
    return 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300';
  };

  return (
    <Link href={`/games/${game.id}`}>
      <Card className={`gamer-card hover:shadow-lg cursor-pointer ${className}`}>
        <div className="relative">
          <img 
            src={getImageUrl()} 
            alt={game.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300';
            }}
          />
          {game.price && (
            <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
              ${parseFloat(game.price).toFixed(2)}
            </div>
          )}
        </div>
        
        <CardContent className="p-4 bg-white">
          <h3 className="font-bold text-lg mb-2 text-black">
            {game.title}
          </h3>
          
          {game.description && (
            <p className="text-gray-600 text-sm mb-3">
              {game.description}
            </p>
          )}
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-700 text-sm flex items-center">
              <Monitor className="w-4 h-4 mr-1" />
              {game.genre}
            </span>
            <span className="text-gray-700 text-sm flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(game.releaseDate)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="text-yellow-500 w-4 h-4" />
              <span className="text-sm text-black">{formatRating(game.rating)}</span>
            </div>
            <Badge className="bg-blue-600 text-white text-xs px-2 py-1">
              {game.platform}
            </Badge>
          </div>
          
          {game.developer && (
            <div className="mt-2 text-xs text-gray-500">
              by {game.developer}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
