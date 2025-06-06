import { pgTable, text, serial, integer, decimal, timestamp, boolean, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  developer: text("developer"),
  publisher: text("publisher"),
  releaseDate: timestamp("release_date"),
  genre: text("genre").notNull(),
  platform: text("platform").notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  imageUrl: text("image_url"),
  esrbRating: varchar("esrb_rating", { length: 10 }),
  metascore: integer("metascore"),
  userScore: decimal("user_score", { precision: 3, scale: 1 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const gameGenres = pgTable("game_genres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow()
});

export const gamePlatforms = pgTable("game_platforms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  manufacturer: text("manufacturer"),
  releaseYear: integer("release_year"),
  createdAt: timestamp("created_at").defaultNow()
});

export const gameReviews = pgTable("game_reviews", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").references(() => games.id).notNull(),
  reviewerName: text("reviewer_name"),
  rating: decimal("rating", { precision: 3, scale: 1 }).notNull(),
  comment: text("comment"),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Relations
export const gamesRelations = relations(games, ({ many }) => ({
  reviews: many(gameReviews)
}));

export const gameReviewsRelations = relations(gameReviews, ({ one }) => ({
  game: one(games, {
    fields: [gameReviews.gameId],
    references: [games.id]
  })
}));

// Schemas
export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertGameGenreSchema = createInsertSchema(gameGenres).omit({
  id: true,
  createdAt: true
});

export const insertGamePlatformSchema = createInsertSchema(gamePlatforms).omit({
  id: true,
  createdAt: true
});

export const insertGameReviewSchema = createInsertSchema(gameReviews).omit({
  id: true,
  createdAt: true
});

export const gameSearchSchema = z.object({
  search: z.string().optional(),
  genre: z.string().optional(),
  platform: z.string().optional(),
  minRating: z.number().min(0).max(5).optional(),
  maxRating: z.number().min(0).max(5).optional(),
  yearFrom: z.number().min(1970).max(2030).optional(),
  yearTo: z.number().min(1970).max(2030).optional(),
  sortBy: z.enum(['title', 'releaseDate', 'rating', 'popularity']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional()
});

// Types
export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type GameGenre = typeof gameGenres.$inferSelect;
export type InsertGameGenre = z.infer<typeof insertGameGenreSchema>;
export type GamePlatform = typeof gamePlatforms.$inferSelect;
export type InsertGamePlatform = z.infer<typeof insertGamePlatformSchema>;
export type GameReview = typeof gameReviews.$inferSelect;
export type InsertGameReview = z.infer<typeof insertGameReviewSchema>;
export type GameSearchParams = z.infer<typeof gameSearchSchema>;

export type GameWithReviews = Game & {
  reviews: GameReview[];
  averageRating?: number;
  reviewCount?: number;
};
