import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "data", "nheek.db");
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    // Ensure the data directory exists
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log("Created data directory:", dataDir);
    }

    // Check if database file exists (to know if we need to init schema)
    const dbExists = fs.existsSync(dbPath);

    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");

    // If database was just created, initialize schema
    if (!dbExists) {
      console.log("Database not found. Initializing schema...");
      initializeSchema(db);
    }
  }
  return db;
}

function initializeSchema(database: Database.Database) {
  // Albums table
  database.exec(`
    CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      codename TEXT NOT NULL UNIQUE,
      artist TEXT NOT NULL,
      release_date TEXT NOT NULL,
      cover_image_url TEXT,
      spotify_link TEXT,
      apple_music_link TEXT,
      custom_links TEXT DEFAULT '[]',
      featured BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Songs table
  database.exec(`
    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      album_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      codename TEXT NOT NULL,
      duration TEXT NOT NULL,
      track_number INTEGER NOT NULL,
      spotify_link TEXT,
      apple_music_link TEXT,
      custom_links TEXT DEFAULT '[]',
      lyrics TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
    )
  `);

  // Project categories table
  database.exec(`
    CREATE TABLE IF NOT EXISTS project_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Projects table
  database.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      codename TEXT NOT NULL UNIQUE,
      description TEXT,
      category_id INTEGER,
      image_url TEXT,
      github_link TEXT,
      live_link TEXT,
      custom_links TEXT DEFAULT '[]',
      date_added TEXT NOT NULL,
      featured BOOLEAN DEFAULT 0,
      display_order INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES project_categories(id) ON DELETE SET NULL
    )
  `);

  // Admin users table
  database.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_login TEXT
    )
  `);

  // Visitor contributions table
  database.exec(`
    CREATE TABLE IF NOT EXISTS contributions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      content TEXT NOT NULL,
      website_url TEXT,
      fingerprint_hash TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      approved_at TEXT,
      UNIQUE(fingerprint_hash, category)
    )
  `);

  // Create indexes
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_songs_album ON songs(album_id);
    CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
    CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
    CREATE INDEX IF NOT EXISTS idx_contributions_category ON contributions(category);
  `);

  console.log("Database schema initialized successfully");
}

export function initDb() {
  const database = getDb();
  initializeSchema(database);
  console.log("Database initialized successfully");
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
    console.log("Database connection closed");
  }
}

export default getDb;
