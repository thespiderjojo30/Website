export interface Game {
  id: number;
  title: string;
  description?: string;
  developer?: string;
  publisher?: string;
  releaseDate?: string;
  genre: string;
  platform: string;
  rating?: string;
  price?: string;
  imageUrl?: string;
  esrbRating?: string;
  metascore?: number;
  userScore?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GameWithReviews extends Game {
  reviews: GameReview[];
  averageRating?: number;
  reviewCount?: number;
}

export interface GameReview {
  id: number;
  gameId: number;
  reviewerName?: string;
  rating: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface GameGenre {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface GamePlatform {
  id: number;
  name: string;
  manufacturer?: string;
  releaseYear?: number;
  createdAt: string;
}

export interface SearchParams {
  search?: string;
  genre?: string;
  platform?: string;
  minRating?: number;
  maxRating?: number;
  yearFrom?: number;
  yearTo?: number;
  sortBy?: 'title' | 'releaseDate' | 'rating' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  games: Game[];
  total: number;
}

export interface GameStats {
  totalGames: number;
  totalGenres: number;
  totalPlatforms: number;
}
