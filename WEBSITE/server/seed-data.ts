import { db } from "./db";
import { games, gameGenres, gamePlatforms, gameReviews } from "@shared/schema";

const sampleGenres = [
  { name: "Action", description: "Fast-paced games with combat and adventure" },
  { name: "Adventure", description: "Story-driven exploration games" },
  { name: "RPG", description: "Role-playing games with character development" },
  { name: "Strategy", description: "Games requiring tactical thinking" },
  { name: "Simulation", description: "Games that simulate real-world activities" },
  { name: "Sports", description: "Athletic and competitive sports games" },
  { name: "Racing", description: "High-speed vehicle racing games" },
  { name: "Puzzle", description: "Brain-teasing logic games" },
  { name: "Fighting", description: "Combat-focused competitive games" },
  { name: "Shooter", description: "First or third-person shooting games" }
];

const samplePlatforms = [
  { name: "PC", manufacturer: "Various", releaseYear: 1980 },
  { name: "PlayStation 5", manufacturer: "Sony", releaseYear: 2020 },
  { name: "Xbox Series X", manufacturer: "Microsoft", releaseYear: 2020 },
  { name: "Nintendo Switch", manufacturer: "Nintendo", releaseYear: 2017 },
  { name: "PlayStation 4", manufacturer: "Sony", releaseYear: 2013 },
  { name: "Xbox One", manufacturer: "Microsoft", releaseYear: 2013 },
  { name: "Nintendo 3DS", manufacturer: "Nintendo", releaseYear: 2011 },
  { name: "Steam Deck", manufacturer: "Valve", releaseYear: 2022 }
];

const sampleGames = [
  {
    title: "The Legend of Zelda: Breath of the Wild",
    description: "An open-world adventure game that redefines the Zelda franchise with innovative gameplay mechanics.",
    developer: "Nintendo EPD",
    publisher: "Nintendo",
    releaseDate: new Date("2017-03-03"),
    genre: "Adventure",
    platform: "Nintendo Switch",
    rating: "4.8",
    price: "59.99",
    esrbRating: "E10+",
    metascore: 97,
    userScore: "8.7"
  },
  {
    title: "Cyberpunk 2077",
    description: "A futuristic RPG set in Night City where you play as a mercenary seeking immortality.",
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    releaseDate: new Date("2020-12-10"),
    genre: "RPG",
    platform: "PC",
    rating: "4.2",
    price: "49.99",
    esrbRating: "M",
    metascore: 86,
    userScore: "7.1"
  },
  {
    title: "God of War",
    description: "Kratos and his son Atreus embark on a journey through Norse mythology.",
    developer: "Santa Monica Studio",
    publisher: "Sony Interactive Entertainment",
    releaseDate: new Date("2018-04-20"),
    genre: "Action",
    platform: "PlayStation 5",
    rating: "4.9",
    price: "39.99",
    esrbRating: "M",
    metascore: 94,
    userScore: "9.1"
  },
  {
    title: "Halo Infinite",
    description: "Master Chief returns in this latest installment of the iconic sci-fi shooter series.",
    developer: "343 Industries",
    publisher: "Microsoft Studios",
    releaseDate: new Date("2021-12-08"),
    genre: "Shooter",
    platform: "Xbox Series X",
    rating: "4.3",
    price: "59.99",
    esrbRating: "T",
    metascore: 87,
    userScore: "8.3"
  },
  {
    title: "Grand Theft Auto V",
    description: "An open-world crime game following three protagonists in Los Santos.",
    developer: "Rockstar North",
    publisher: "Rockstar Games",
    releaseDate: new Date("2013-09-17"),
    genre: "Action",
    platform: "PC",
    rating: "4.6",
    price: "29.99",
    esrbRating: "M",
    metascore: 96,
    userScore: "8.2"
  },
  {
    title: "Mario Kart 8 Deluxe",
    description: "The ultimate racing experience with Mario and friends on Nintendo Switch.",
    developer: "Nintendo EPD",
    publisher: "Nintendo",
    releaseDate: new Date("2017-04-28"),
    genre: "Racing",
    platform: "Nintendo Switch",
    rating: "4.7",
    price: "59.99",
    esrbRating: "E",
    metascore: 92,
    userScore: "8.9"
  },
  {
    title: "Elden Ring",
    description: "A dark fantasy action RPG created by FromSoftware and George R.R. Martin.",
    developer: "FromSoftware",
    publisher: "Bandai Namco",
    releaseDate: new Date("2022-02-25"),
    genre: "RPG",
    platform: "PC",
    rating: "4.8",
    price: "59.99",
    esrbRating: "M",
    metascore: 96,
    userScore: "8.6"
  },
  {
    title: "FIFA 23",
    description: "The latest installment in the world's most popular soccer game series.",
    developer: "EA Sports",
    publisher: "Electronic Arts",
    releaseDate: new Date("2022-09-30"),
    genre: "Sports",
    platform: "PlayStation 5",
    rating: "4.1",
    price: "69.99",
    esrbRating: "E",
    metascore: 78,
    userScore: "7.3"
  },
  {
    title: "Minecraft",
    description: "A sandbox game where you can build, explore, and survive in procedurally generated worlds.",
    developer: "Mojang Studios",
    publisher: "Microsoft",
    releaseDate: new Date("2011-11-18"),
    genre: "Simulation",
    platform: "PC",
    rating: "4.9",
    price: "26.95",
    esrbRating: "E10+",
    metascore: 93,
    userScore: "8.0"
  },
  {
    title: "Street Fighter 6",
    description: "The latest chapter in the legendary fighting game franchise.",
    developer: "Capcom",
    publisher: "Capcom",
    releaseDate: new Date("2023-06-02"),
    genre: "Fighting",
    platform: "PC",
    rating: "4.5",
    price: "59.99",
    esrbRating: "T",
    metascore: 92,
    userScore: "8.1"
  },
  {
    title: "Portal 2",
    description: "A mind-bending puzzle game with innovative portal mechanics.",
    developer: "Valve",
    publisher: "Valve",
    releaseDate: new Date("2011-04-18"),
    genre: "Puzzle",
    platform: "PC",
    rating: "4.9",
    price: "9.99",
    esrbRating: "E10+",
    metascore: 95,
    userScore: "8.8"
  },
  {
    title: "Age of Empires IV",
    description: "Real-time strategy game featuring historical civilizations and epic battles.",
    developer: "Relic Entertainment",
    publisher: "Microsoft Studios",
    releaseDate: new Date("2021-10-28"),
    genre: "Strategy",
    platform: "PC",
    rating: "4.4",
    price: "59.99",
    esrbRating: "T",
    metascore: 81,
    userScore: "7.8"
  }
];

export async function seedDatabase() {
  console.log("Starting database seeding...");
  
  try {
    // Insert genres
    for (const genre of sampleGenres) {
      try {
        await db.insert(gameGenres).values(genre).onConflictDoNothing();
      } catch (error) {
        console.warn(`Failed to insert genre ${genre.name}:`, error);
      }
    }
    console.log(`Inserted ${sampleGenres.length} genres`);
    
    // Insert platforms
    for (const platform of samplePlatforms) {
      try {
        await db.insert(gamePlatforms).values(platform).onConflictDoNothing();
      } catch (error) {
        console.warn(`Failed to insert platform ${platform.name}:`, error);
      }
    }
    console.log(`Inserted ${samplePlatforms.length} platforms`);
    
    // Insert games
    let gameCount = 0;
    for (const game of sampleGames) {
      try {
        await db.insert(games).values(game);
        gameCount++;
      } catch (error) {
        console.warn(`Failed to insert game ${game.title}:`, error);
      }
    }
    console.log(`Inserted ${gameCount} games`);
    
    // Add some sample reviews
    const sampleReviews = [
      { gameId: 1, reviewerName: "GameMaster", rating: "5.0", comment: "Amazing open-world experience!" },
      { gameId: 1, reviewerName: "ZeldaFan", rating: "4.8", comment: "Best Zelda game ever made." },
      { gameId: 3, reviewerName: "ActionGamer", rating: "5.0", comment: "Perfect blend of action and story." },
      { gameId: 7, reviewerName: "SoulsVeteran", rating: "4.9", comment: "Challenging but rewarding gameplay." },
      { gameId: 9, reviewerName: "Builder", rating: "5.0", comment: "Endless creativity and fun!" }
    ];
    
    let reviewCount = 0;
    for (const review of sampleReviews) {
      try {
        await db.insert(gameReviews).values(review);
        reviewCount++;
      } catch (error) {
        console.warn(`Failed to insert review:`, error);
      }
    }
    console.log(`Inserted ${reviewCount} reviews`);
    
    console.log("Database seeding completed successfully!");
    
  } catch (error) {
    console.error("Database seeding failed:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
}