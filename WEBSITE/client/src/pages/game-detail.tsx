import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Star, Calendar, Monitor, User, DollarSign, Award, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import type { GameWithReviews } from "@/lib/types";

export default function GameDetail() {
  const params = useParams();
  const gameId = parseInt(params.id || '0');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [reviewForm, setReviewForm] = useState({
    reviewerName: '',
    rating: 5,
    comment: ''
  });

  const { data: game, isLoading, error } = useQuery<GameWithReviews>({
    queryKey: ['/api/games', gameId],
    queryFn: () => api.getGame(gameId),
    enabled: gameId > 0,
  });

  const createReviewMutation = useMutation({
    mutationFn: (reviewData: typeof reviewForm) => api.createReview(gameId, reviewData),
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      });
      setReviewForm({ reviewerName: '', rating: 5, comment: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/games', gameId] });
    },
    onError: (error) => {
      toast({
        title: "Error submitting review",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-space-blue pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-700 rounded w-32"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-slate-700 rounded"></div>
                <div className="h-12 bg-slate-700 rounded"></div>
                <div className="h-32 bg-slate-700 rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-slate-700 rounded"></div>
                <div className="h-32 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-space-blue pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-red-900/20 border-red-500">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-red-400 mb-4">Game Not Found</h1>
              <p className="text-red-300 mb-6">
                {error instanceof Error ? error.message : 'The requested game could not be found.'}
              </p>
              <Link href="/catalog">
                <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Catalog
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatRating = (rating?: string) => {
    if (!rating) return "N/A";
    const num = parseFloat(rating);
    return isNaN(num) ? "N/A" : num.toFixed(1);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Unknown";
    }
  };

  const getImageUrl = () => {
    if (game.imageUrl) return game.imageUrl;
    
    // Fallback based on genre
    const genre = game.genre?.toLowerCase() || '';
    if (genre.includes('action') || genre.includes('adventure')) {
      return 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
    }
    return 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.reviewerName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name for the review.",
        variant: "destructive",
      });
      return;
    }
    createReviewMutation.mutate(reviewForm);
  };

  return (
    <div className="min-h-screen bg-space-blue pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/catalog">
          <Button variant="ghost" className="mb-6 text-slate-300 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Image */}
            <div className="relative">
              <img
                src={getImageUrl()}
                alt={game.title}
                className="w-full h-96 object-cover rounded-xl shadow-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
                }}
              />
              {game.price && (
                <div className="absolute top-4 right-4 bg-electric-green text-space-blue px-4 py-2 rounded-lg font-semibold text-lg">
                  ${parseFloat(game.price).toFixed(2)}
                </div>
              )}
            </div>

            {/* Game Title and Basic Info */}
            <div>
              <h1 className="font-orbitron font-bold text-4xl mb-4 text-white">{game.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-400 w-5 h-5" />
                  <span className="text-lg font-semibold text-white">{formatRating(game.rating)}</span>
                  {game.reviewCount && game.reviewCount > 0 && (
                    <span className="text-slate-400">({game.reviewCount} reviews)</span>
                  )}
                </div>
                <Badge className="bg-cyber-purple text-white">{game.genre}</Badge>
                <Badge className="bg-slate-600 text-white">{game.platform}</Badge>
                {game.esrbRating && (
                  <Badge className="bg-yellow-500 text-black">{game.esrbRating}</Badge>
                )}
              </div>
            </div>

            {/* Description */}
            {game.description && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed">{game.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Reviews ({game.reviews?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Review Form */}
                <form onSubmit={handleSubmitReview} className="space-y-4 p-4 bg-slate-700 rounded-lg">
                  <h3 className="font-semibold text-white">Write a Review</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reviewerName" className="text-slate-300">Your Name</Label>
                      <Input
                        id="reviewerName"
                        value={reviewForm.reviewerName}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, reviewerName: e.target.value }))}
                        className="bg-slate-600 border-slate-500 text-white"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rating" className="text-slate-300">Rating</Label>
                      <Select
                        value={reviewForm.rating.toString()}
                        onValueChange={(value) => setReviewForm(prev => ({ ...prev, rating: parseInt(value) }))}
                      >
                        <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-600 border-slate-500">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                              {rating} Star{rating !== 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comment" className="text-slate-300">Comment</Label>
                    <Textarea
                      id="comment"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      className="bg-slate-600 border-slate-500 text-white"
                      placeholder="Share your thoughts about this game..."
                      rows={3}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={createReviewMutation.isPending}
                    className="bg-cyber-purple hover:bg-purple-600 text-white"
                  >
                    {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>

                {/* Existing Reviews */}
                {game.reviews && game.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {game.reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="font-semibold text-white">{review.reviewerName || 'Anonymous'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-white">{formatRating(review.rating)}</span>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-slate-300 mb-2">{review.comment}</p>
                        )}
                        <span className="text-xs text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-8">No reviews yet. Be the first to review this game!</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Details */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Game Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {game.developer && (
                  <div>
                    <Label className="text-slate-400">Developer</Label>
                    <p className="text-white font-medium">{game.developer}</p>
                  </div>
                )}
                
                {game.publisher && (
                  <div>
                    <Label className="text-slate-400">Publisher</Label>
                    <p className="text-white font-medium">{game.publisher}</p>
                  </div>
                )}
                
                <div>
                  <Label className="text-slate-400">Release Date</Label>
                  <p className="text-white font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(game.releaseDate)}
                  </p>
                </div>
                
                <div>
                  <Label className="text-slate-400">Platform</Label>
                  <p className="text-white font-medium flex items-center">
                    <Monitor className="w-4 h-4 mr-2" />
                    {game.platform}
                  </p>
                </div>
                
                <div>
                  <Label className="text-slate-400">Genre</Label>
                  <p className="text-white font-medium">{game.genre}</p>
                </div>

                {game.price && (
                  <div>
                    <Label className="text-slate-400">Price</Label>
                    <p className="text-white font-medium flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {parseFloat(game.price).toFixed(2)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scores */}
            {(game.metascore || game.userScore) && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Scores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {game.metascore && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center">
                        <Award className="w-4 h-4 mr-2" />
                        Metascore
                      </span>
                      <span className="text-white font-bold text-lg">{game.metascore}</span>
                    </div>
                  )}
                  
                  {game.userScore && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        User Score
                      </span>
                      <span className="text-white font-bold text-lg">{formatRating(game.userScore)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      Average Rating
                    </span>
                    <span className="text-white font-bold text-lg">
                      {game.averageRating ? game.averageRating.toFixed(1) : formatRating(game.rating)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
