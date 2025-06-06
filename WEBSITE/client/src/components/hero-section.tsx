import { useQuery } from "@tanstack/react-query";
import { Gamepad2, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { api } from "@/lib/api";
import { useState } from "react";

export default function HeroSection() {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: () => api.getStats(),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="student-bg pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h1 className="student-title text-5xl md:text-6xl font-bold">
            Game Stop Database
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative basic-border bg-white p-2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type a game name here"
                className="w-full pl-12 pr-24 py-3 text-base bg-transparent border-none text-black placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="retro-button absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                Search
              </button>
            </div>
          </form>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/catalog">
              <button className="retro-button text-lg px-8 py-3">
                <Gamepad2 className="w-5 h-5 mr-2 inline" />
                View All Games
              </button>
            </Link>
            <Link href="/about">
              <button className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded font-bold hover:bg-blue-50 text-lg">
                About This Site
              </button>
            </Link>
          </div>
          
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="gamer-card p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalGames}</div>
                <div className="text-black font-bold text-lg">Total Games</div>
              </div>
              <div className="gamer-card p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{stats.totalGenres}</div>
                <div className="text-black font-bold text-lg">Game Types</div>
              </div>
              <div className="gamer-card p-6 text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">{stats.totalPlatforms}</div>
                <div className="text-black font-bold text-lg">Platforms</div>
              </div>
            </div>
          )}


        </div>
      </div>
    </section>
  );
}
