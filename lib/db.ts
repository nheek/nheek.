import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "nheek.db");
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
  }
  return db;
}

export function initDb() {
  const db = getDb();

  // Albums table
  db.exec(`
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
  db.exec(`
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
  db.exec(`
    CREATE TABLE IF NOT EXISTS project_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Projects table
  db.exec(`
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
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_login TEXT
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_songs_album ON songs(album_id);
    CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
  `);

  console.log("Database initialized successfully");
}

export default getDb;
