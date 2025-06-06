import { db } from "./db";
import { games, gameGenres, gamePlatforms } from "@shared/schema";
import Database from "better-sqlite3";
import fs from "fs";

interface SqliteGame {
  id: number;
  title: string;
  description?: string;
  developer?: string;
  publisher?: string;
  release_date?: string;
  genre: string;
  platform: string;
  rating?: number;
  price?: number;
  image_url?: string;
  esrb_rating?: string;
  metascore?: number;
  user_score?: number;
}

export async function migrateGameStopData() {
  console.log("Starting Game Stop database migration...");
  
  // Check if SQLite database file exists
  const sqliteDbPath = "attached_assets/Game Stop.db";
  if (!fs.existsSync(sqliteDbPath)) {
    console.error("SQLite database file not found:", sqliteDbPath);
    return;
  }

  try {
    // Connect to SQLite database
    const sqliteDb = new Database(sqliteDbPath, { readonly: true });
    
    // Get table info to understand structure
    const tables = sqliteDb.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log("Available tables:", tables);
    
    // Try to find games table (common names)
    const possibleGameTables = ['games', 'game', 'products', 'items', 'inventory', 'Video Game'];
    let gameTableName = '';
    
    for (const tableName of possibleGameTables) {
      try {
        const info = sqliteDb.prepare(`PRAGMA table_info([${tableName}])`).all();
        if (info.length > 0) {
          gameTableName = tableName;
          console.log(`Found games table: ${tableName}`);
          console.log("Columns:", info.map((col: any) => `${col.name} (${col.type})`));
          break;
        }
      } catch (e) {
        // Table doesn't exist, continue
      }
    }
    
    if (!gameTableName) {
      console.error("Could not find games table in SQLite database");
      return;
    }
    
    // Extract games from SQLite
    const sqliteGames = sqliteDb.prepare(`SELECT * FROM ${gameTableName}`).all() as SqliteGame[];
    console.log(`Found ${sqliteGames.length} games in SQLite database`);
    
    if (sqliteGames.length === 0) {
      console.log("No games found to migrate");
      return;
    }
    
    // Extract unique genres and platforms
    const uniqueGenres = [...new Set(sqliteGames.map(game => game.genre).filter(Boolean))];
    const uniquePlatforms = [...new Set(sqliteGames.map(game => game.platform).filter(Boolean))];
    
    console.log(`Found ${uniqueGenres.length} unique genres and ${uniquePlatforms.length} unique platforms`);
    
    // Insert genres
    for (const genreName of uniqueGenres) {
      try {
        await db.insert(gameGenres).values({
          name: genreName,
          description: `${genreName} games category`
        }).onConflictDoNothing();
      } catch (error) {
        console.warn(`Failed to insert genre ${genreName}:`, error);
      }
    }
    
    // Insert platforms
    for (const platformName of uniquePlatforms) {
      try {
        await db.insert(gamePlatforms).values({
          name: platformName,
          manufacturer: "Unknown"
        }).onConflictDoNothing();
      } catch (error) {
        console.warn(`Failed to insert platform ${platformName}:`, error);
      }
    }
    
    // Insert games in batches
    const batchSize = 100;
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < sqliteGames.length; i += batchSize) {
      const batch = sqliteGames.slice(i, i + batchSize);
      
      for (const sqliteGame of batch) {
        try {
          const gameData = {
            title: sqliteGame.title || "Unknown Title",
            description: sqliteGame.description || null,
            developer: sqliteGame.developer || null,
            publisher: sqliteGame.publisher || null,
            releaseDate: sqliteGame.release_date ? new Date(sqliteGame.release_date) : null,
            genre: sqliteGame.genre || "Unknown",
            platform: sqliteGame.platform || "Unknown",
            rating: sqliteGame.rating ? sqliteGame.rating.toString() : null,
            price: sqliteGame.price ? sqliteGame.price.toString() : null,
            imageUrl: sqliteGame.image_url || null,
            esrbRating: sqliteGame.esrb_rating || null,
            metascore: sqliteGame.metascore || null,
            userScore: sqliteGame.user_score ? sqliteGame.user_score.toString() : null,
            isActive: true
          };
          
          await db.insert(games).values(gameData);
          successCount++;
          
          if (successCount % 50 === 0) {
            console.log(`Migrated ${successCount} games...`);
          }
        } catch (error) {
          errorCount++;
          console.warn(`Failed to insert game ${sqliteGame.title}:`, error);
        }
      }
    }
    
    sqliteDb.close();
    
    console.log(`Migration completed! Successfully migrated ${successCount} games with ${errorCount} errors.`);
    
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateGameStopData().catch(console.error);
}
