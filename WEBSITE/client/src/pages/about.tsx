import { useQuery } from "@tanstack/react-query";
import { Database, Search, Star, Gamepad, Users, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function About() {
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: () => api.getStats(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-space-blue pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-orbitron font-bold text-4xl mb-4 text-white">About Game Stop Database</h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            A comprehensive gaming database featuring detailed information, reviews, and insights across all gaming platforms and genres.
          </p>
        </div>

        {/* What We Offer */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="font-orbitron font-bold text-2xl text-electric-green">What We Offer</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Database className="text-cyber-purple text-xl mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white">Comprehensive Database</h3>
                  <p className="text-slate-300">
                    Over {stats?.totalGames?.toLocaleString() || '50,000'} games from classic arcade titles to modern AAA releases, 
                    all meticulously cataloged with detailed information including developer, publisher, release dates, and more.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Search className="text-cyber-purple text-xl mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white">Advanced Search</h3>
                  <p className="text-slate-300">
                    Powerful filtering by genre, platform, release year, rating, and more. Our search engine helps you find 
                    exactly what you're looking for with intelligent matching and suggestions.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Star className="text-cyber-purple text-xl mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white">Detailed Game Information</h3>
                  <p className="text-slate-300">
                    Each game entry includes comprehensive details such as screenshots, system requirements, 
                    ESRB ratings, Metacritic scores, and community reviews to help you make informed decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1556438064-2d7646166914?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Extensive video game collection" 
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6 bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <Gamepad className="text-4xl text-electric-green mb-4 mx-auto" />
              <h3 className="font-semibold text-xl mb-2 text-white">
                {stats?.totalGames?.toLocaleString() || '50,000+'}
              </h3>
              <p className="text-slate-300">Games in Database</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <Users className="text-4xl text-cyber-purple mb-4 mx-auto" />
              <h3 className="font-semibold text-xl mb-2 text-white">
                {stats?.totalGenres || '25+'}
              </h3>
              <p className="text-slate-300">Game Genres</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <Trophy className="text-4xl text-yellow-400 mb-4 mx-auto" />
              <h3 className="font-semibold text-xl mb-2 text-white">
                {stats?.totalPlatforms || '15+'}
              </h3>
              <p className="text-slate-300">Gaming Platforms</p>
            </CardContent>
          </Card>
        </div>

        {/* How to Search */}
        <Card className="bg-slate-800 border-slate-700 p-8">
          <h2 className="font-orbitron font-bold text-2xl text-center mb-6 text-white">How to Search Our Database</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-cyber-purple w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-lg text-white">1</span>
              </div>
              <h3 className="font-semibold mb-2 text-white">Browse or Search</h3>
              <p className="text-slate-300 text-sm">
                Use the search bar in the navigation or browse by category to find games. 
                Start typing for instant suggestions.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-electric-green w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-lg text-space-blue">2</span>
              </div>
              <h3 className="font-semibold mb-2 text-white">Apply Filters</h3>
              <p className="text-slate-300 text-sm">
                Narrow results by genre, platform, year, and rating. Combine multiple filters 
                for precise results.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-lg text-space-blue">3</span>
              </div>
              <h3 className="font-semibold mb-2 text-white">Explore Details</h3>
              <p className="text-slate-300 text-sm">
                Click on any game to see detailed information, screenshots, reviews, 
                and similar game recommendations.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-lg text-white">4</span>
              </div>
              <h3 className="font-semibold mb-2 text-white">Discover More</h3>
              <p className="text-slate-300 text-sm">
                Find similar games, explore new genres, and build your gaming wishlist 
                with our recommendation engine.
              </p>
            </div>
          </div>
        </Card>

        {/* Data Sources */}
        <div className="mt-16 text-center">
          <h2 className="font-orbitron font-bold text-2xl mb-6 text-white">Our Data Sources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 text-white">Gaming Retailers</h3>
                <p className="text-slate-300">
                  We aggregate data from major gaming retailers and digital distribution platforms 
                  to provide comprehensive game catalogs with accurate pricing and availability information.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 text-white">Community Contributions</h3>
                <p className="text-slate-300">
                  Our database is enhanced by a passionate gaming community that contributes reviews, 
                  ratings, and additional game information to keep our content fresh and accurate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-16 text-center bg-gradient-to-r from-cyber-purple/20 to-electric-green/20 rounded-xl p-8">
          <h2 className="font-orbitron font-bold text-2xl mb-4 text-white">Our Mission</h2>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            This database helps gamers discover their next favorite game. Whether you're looking for 
            the latest AAA blockbuster or a hidden indie gem, our comprehensive database and powerful search 
            tools make game discovery easy and enjoyable. We believe every gamer deserves to find games 
            that match their unique preferences and interests.
          </p>
        </div>
      </div>
    </div>
  );
}
