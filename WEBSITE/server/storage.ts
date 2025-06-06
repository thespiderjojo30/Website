import { games, gameGenres, gamePlatforms, gameReviews, type Game, type InsertGame, type GameGenre, type InsertGameGenre, type GamePlatform, type InsertGamePlatform, type GameReview, type InsertGameReview, type GameSearchParams, type GameWithReviews } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, gte, lte, ilike, desc, asc, count, avg, sql } from "drizzle-orm";

export interface IStorage {
  // Games
  getGame(id: number): Promise<GameWithReviews | undefined>;
  getGames(params?: GameSearchParams): Promise<{ games: Game[]; total: number }>;
  getFeaturedGames(limit?: number): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, game: Partial<InsertGame>): Promise<Game | undefined>;
  deleteGame(id: number): Promise<boolean>;
  
  // Genres
  getGenres(): Promise<GameGenre[]>;
  createGenre(genre: InsertGameGenre): Promise<GameGenre>;
  
  // Platforms
  getPlatforms(): Promise<GamePlatform[]>;
  createPlatform(platform: InsertGamePlatform): Promise<GamePlatform>;
  
  // Reviews
  getGameReviews(gameId: number): Promise<GameReview[]>;
  createReview(review: InsertGameReview): Promise<GameReview>;
  
  // Search and stats
  searchGames(query: string): Promise<Game[]>;
  getGameStats(): Promise<{ totalGames: number; totalGenres: number; totalPlatforms: number }>;
}

export class DatabaseStorage implements IStorage {
  async getGame(id: number): Promise<GameWithReviews | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    if (!game) return undefined;
    
    const reviews = await db.select().from(gameReviews).where(eq(gameReviews.gameId, id));
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + parseFloat(review.rating || "0"), 0) / reviews.length
      : 0;
    
    return {
      ...game,
      reviews,
      averageRating: avgRating,
      reviewCount: reviews.length
    };
  }

  async getGames(params: GameSearchParams = {}): Promise<{ games: Game[]; total: number }> {
    const {
      search,
      genre,
      platform,
      minRating,
      maxRating,
      yearFrom,
      yearTo,
      sortBy = 'title',
      sortOrder = 'asc',
      page = 1,
      limit = 12
    } = params;

    let query = db.select().from(games);
    let countQuery = db.select({ count: count() }).from(games);
    
    const conditions = [];
    
    if (search) {
      const searchCondition = or(
        ilike(games.title, `%${search}%`),
        ilike(games.description, `%${search}%`),
        ilike(games.developer, `%${search}%`),
        ilike(games.publisher, `%${search}%`)
      );
      conditions.push(searchCondition);
    }
    
    if (genre) {
      conditions.push(eq(games.genre, genre));
    }
    
    if (platform) {
      conditions.push(eq(games.platform, platform));
    }
    
    if (minRating !== undefined) {
      conditions.push(gte(games.rating, minRating.toString()));
    }
    
    if (maxRating !== undefined) {
      conditions.push(lte(games.rating, maxRating.toString()));
    }
    
    if (yearFrom) {
      conditions.push(gte(sql`EXTRACT(YEAR FROM ${games.releaseDate})`, yearFrom));
    }
    
    if (yearTo) {
      conditions.push(lte(sql`EXTRACT(YEAR FROM ${games.releaseDate})`, yearTo));
    }
    
    conditions.push(eq(games.isActive, true));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
      countQuery = countQuery.where(and(...conditions));
    }
    
    // Add sorting
    const sortColumn = games[sortBy as keyof typeof games] || games.title;
    query = sortOrder === 'desc' ? query.orderBy(desc(sortColumn)) : query.orderBy(asc(sortColumn));
    
    // Add pagination
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset);
    
    const [gameResults, totalResults] = await Promise.all([
      query,
      countQuery
    ]);
    
    return {
      games: gameResults,
      total: totalResults[0]?.count || 0
    };
  }

  async getFeaturedGames(limit = 8): Promise<Game[]> {
    return await db
      .select()
      .from(games)
      .where(eq(games.isActive, true))
      .orderBy(desc(games.rating))
      .limit(limit);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const [game] = await db
      .insert(games)
      .values(insertGame)
      .returning();
    return game;
  }

  async updateGame(id: number, updateData: Partial<InsertGame>): Promise<Game | undefined> {
    const [game] = await db
      .update(games)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(games.id, id))
      .returning();
    return game || undefined;
  }

  async deleteGame(id: number): Promise<boolean> {
    const result = await db
      .update(games)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(games.id, id));
    return result.rowCount > 0;
  }

  async getGenres(): Promise<GameGenre[]> {
    return await db.select().from(gameGenres).orderBy(asc(gameGenres.name));
  }

  async createGenre(insertGenre: InsertGameGenre): Promise<GameGenre> {
    const [genre] = await db
      .insert(gameGenres)
      .values(insertGenre)
      .returning();
    return genre;
  }

  async getPlatforms(): Promise<GamePlatform[]> {
    return await db.select().from(gamePlatforms).orderBy(asc(gamePlatforms.name));
  }

  async createPlatform(insertPlatform: InsertGamePlatform): Promise<GamePlatform> {
    const [platform] = await db
      .insert(gamePlatforms)
      .values(insertPlatform)
      .returning();
    return platform;
  }

  async getGameReviews(gameId: number): Promise<GameReview[]> {
    return await db
      .select()
      .from(gameReviews)
      .where(eq(gameReviews.gameId, gameId))
      .orderBy(desc(gameReviews.createdAt));
  }

  async createReview(insertReview: InsertGameReview): Promise<GameReview> {
    const [review] = await db
      .insert(gameReviews)
      .values(insertReview)
      .returning();
    return review;
  }

  async searchGames(query: string): Promise<Game[]> {
    if (!query.trim()) return [];
    
    return await db
      .select()
      .from(games)
      .where(
        and(
          eq(games.isActive, true),
          or(
            ilike(games.title, `%${query}%`),
            ilike(games.developer, `%${query}%`),
            ilike(games.publisher, `%${query}%`)
          )
        )
      )
      .limit(10)
      .orderBy(desc(games.rating));
  }

  async getGameStats(): Promise<{ totalGames: number; totalGenres: number; totalPlatforms: number }> {
    const [gamesCount, genresCount, platformsCount] = await Promise.all([
      db.select({ count: count() }).from(games).where(eq(games.isActive, true)),
      db.select({ count: count() }).from(gameGenres),
      db.select({ count: count() }).from(gamePlatforms)
    ]);
    
    return {
      totalGames: gamesCount[0]?.count || 0,
      totalGenres: genresCount[0]?.count || 0,
      totalPlatforms: platformsCount[0]?.count || 0
    };
  }
}

export const storage = new DatabaseStorage();
