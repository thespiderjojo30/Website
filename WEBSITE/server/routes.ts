import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gameSearchSchema, insertGameReviewSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Games endpoints
  app.get("/api/games", async (req, res) => {
    try {
      const searchParams = gameSearchSchema.parse(req.query);
      const result = await storage.getGames(searchParams);
      res.json(result);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid search parameters",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/games/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
      const games = await storage.getFeaturedGames(limit);
      res.json(games);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch featured games",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/games/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const games = await storage.searchGames(query);
      res.json(games);
    } catch (error) {
      res.status(500).json({ 
        message: "Search failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }
      
      const game = await storage.getGame(id);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json(game);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch game",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Genres endpoint
  app.get("/api/genres", async (req, res) => {
    try {
      const genres = await storage.getGenres();
      res.json(genres);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch genres",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Platforms endpoint
  app.get("/api/platforms", async (req, res) => {
    try {
      const platforms = await storage.getPlatforms();
      res.json(platforms);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch platforms",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Reviews endpoints
  app.get("/api/games/:id/reviews", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      if (isNaN(gameId)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }
      
      const reviews = await storage.getGameReviews(gameId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch reviews",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/games/:id/reviews", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      if (isNaN(gameId)) {
        return res.status(400).json({ message: "Invalid game ID" });
      }
      
      const reviewData = insertGameReviewSchema.parse({
        ...req.body,
        gameId
      });
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid review data",
          errors: error.errors
        });
      }
      res.status(500).json({ 
        message: "Failed to create review",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getGameStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch stats",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
