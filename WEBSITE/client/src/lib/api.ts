import { apiRequest } from "./queryClient";
import type { SearchParams, SearchResponse, Game, GameWithReviews, GameGenre, GamePlatform, GameStats, GameReview } from "./types";

export const api = {
  // Games
  async getGames(params?: SearchParams): Promise<SearchResponse> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, value.toString());
        }
      });
    }
    
    const res = await apiRequest('GET', `/api/games?${query.toString()}`);
    return await res.json();
  },

  async getFeaturedGames(limit = 8): Promise<Game[]> {
    const res = await apiRequest('GET', `/api/games/featured?limit=${limit}`);
    return await res.json();
  },

  async getGame(id: number): Promise<GameWithReviews> {
    const res = await apiRequest('GET', `/api/games/${id}`);
    return await res.json();
  },

  async searchGames(query: string): Promise<Game[]> {
    const res = await apiRequest('GET', `/api/games/search?q=${encodeURIComponent(query)}`);
    return await res.json();
  },

  // Genres
  async getGenres(): Promise<GameGenre[]> {
    const res = await apiRequest('GET', '/api/genres');
    return await res.json();
  },

  // Platforms
  async getPlatforms(): Promise<GamePlatform[]> {
    const res = await apiRequest('GET', '/api/platforms');
    return await res.json();
  },

  // Reviews
  async getGameReviews(gameId: number): Promise<GameReview[]> {
    const res = await apiRequest('GET', `/api/games/${gameId}/reviews`);
    return await res.json();
  },

  async createReview(gameId: number, review: { reviewerName?: string; rating: number; comment?: string }): Promise<GameReview> {
    const res = await apiRequest('POST', `/api/games/${gameId}/reviews`, review);
    return await res.json();
  },

  // Stats
  async getStats(): Promise<GameStats> {
    const res = await apiRequest('GET', '/api/stats');
    return await res.json();
  }
};
