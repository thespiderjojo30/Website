import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GameCard from "@/components/game-card";
import HeroSection from "@/components/hero-section";
import { api } from "@/lib/api";
import type { Game } from "@/lib/types";

export default function Home() {
  const { data: featuredGames = [], isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games/featured'],
    queryFn: () => api.getFeaturedGames(8),
  });

  return (
    <div className="min-h-screen bg-space-blue text-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Games Section */}
      <section className="py-20 bg-gradient-to-b from-space-blue to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-orbitron font-bold text-4xl mb-4 text-white">Featured Games</h2>
            <p className="text-slate-300 text-lg">Discover the most popular and trending games in our database</p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-slate-800 rounded-xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {featuredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/catalog">
              <Button className="bg-slate-700 hover:bg-slate-600 px-8 py-3 text-white font-semibold transition-colors">
                View All Games 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
}
