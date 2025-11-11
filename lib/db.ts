import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const dbPath = path.join(process.cwd(), "data", "nheek.db");
let db: Database.Database | null = null;

function ensureTablesExist(database: Database.Database) {
  // Check if gallery_images table exists
  const galleryTableExists = database
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='gallery_images'",
    )
    .get();

  if (!galleryTableExists) {
    console.log("Gallery table not found. Creating gallery_images table...");
    database.exec(`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_url TEXT NOT NULL,
        alt_text TEXT NOT NULL,
        display_order INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    database.exec(`
      CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery_images(display_order);
    `);
    console.log("✅ Gallery table created successfully");
  }

  // Check if site_settings table exists
  const settingsTableExists = database
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='site_settings'",
    )
    .get();

  if (!settingsTableExists) {
    console.log("Settings table not found. Creating site_settings table...");
    database.exec(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT NOT NULL UNIQUE,
        setting_value TEXT,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // Insert default settings
    const insertSetting = database.prepare(
      "INSERT OR IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)",
    );
    insertSetting.run(
      "cursor_image_url",
      "https://flies.nheek.com/uploads/nheek/pfp/pfp-main.jpg",
    );
    insertSetting.run("auto_backup_enabled", "false");
    insertSetting.run("backup_interval_hours", "24");
    insertSetting.run("max_backups_to_keep", "10");
    console.log("✅ Settings table created successfully");
  }

  // Check if films table exists
  const filmsTableExists = database
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='films'",
    )
    .get();

  if (!filmsTableExists) {
    console.log("Films table not found. Creating films table...");
    database.exec(`
      CREATE TABLE IF NOT EXISTS films (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'film',
        cover_image_url TEXT,
        rating REAL,
        review TEXT,
        release_year INTEGER,
        genre TEXT,
        director TEXT,
        duration TEXT,
        episode_count INTEGER,
        watch_date TEXT,
        songs TEXT,
        featured BOOLEAN DEFAULT 0,
        display_order INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    database.exec(`
      CREATE INDEX IF NOT EXISTS idx_films_featured ON films(featured);
      CREATE INDEX IF NOT EXISTS idx_films_order ON films(display_order);
    `);
    console.log("✅ Films table created successfully");
  } else {
    // Check if songs column exists, if not add it
    const songsColumnExists = database
      .prepare("PRAGMA table_info(films)")
      .all()
      .some((col: any) => col.name === "songs");

    if (!songsColumnExists) {
      console.log("Adding songs column to films table...");
      database.exec(`ALTER TABLE films ADD COLUMN songs TEXT`);
      console.log("✅ Songs column added successfully");
    }
    
    // Note: songs column stores JSON array of objects with structure:
    // [{ "title": "Song Name", "link": "https://..." }, ...]
  }

  // Check if qna table exists
  const qnaTableExists = database
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='qna'")
    .get();

  if (!qnaTableExists) {
    console.log("Q&A table not found. Creating qna table...");
    database.exec(`
      CREATE TABLE IF NOT EXISTS qna (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        answer TEXT,
        asker_name TEXT,
        status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        answered_at TEXT
      )
    `);
    database.exec(`
      CREATE INDEX IF NOT EXISTS idx_qna_status ON qna(status);
    `);
    console.log("✅ Q&A table created successfully");
  }

  // Check if polls table exists
  const pollsTableExists = database
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='polls'",
    )
    .get();

  if (!pollsTableExists) {
    console.log("Polls table not found. Creating polls tables...");
    database.exec(`
      CREATE TABLE IF NOT EXISTS polls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        allow_multiple_votes INTEGER DEFAULT 0,
        end_date TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    database.exec(`
      CREATE TABLE IF NOT EXISTS poll_options (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        poll_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        link TEXT,
        vote_count INTEGER DEFAULT 0,
        display_order INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
      )
    `);
    database.exec(`
      CREATE TABLE IF NOT EXISTS poll_votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        poll_id INTEGER NOT NULL,
        option_id INTEGER NOT NULL,
        voter_fingerprint TEXT NOT NULL,
        voted_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
        FOREIGN KEY (option_id) REFERENCES poll_options(id) ON DELETE CASCADE,
        UNIQUE(poll_id, voter_fingerprint, option_id)
      )
    `);
    database.exec(`
      CREATE INDEX IF NOT EXISTS idx_poll_options_poll ON poll_options(poll_id);
      CREATE INDEX IF NOT EXISTS idx_poll_votes_poll ON poll_votes(poll_id);
      CREATE INDEX IF NOT EXISTS idx_poll_votes_fingerprint ON poll_votes(voter_fingerprint);
    `);
    console.log("✅ Polls tables created successfully");
  }
}

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
    db.pragma("foreign_keys = ON");

    // If database was just created, initialize schema
    if (!dbExists) {
      console.log("Database not found. Initializing schema...");
      initializeSchema(db);
    } else {
      // Database exists, but we need to ensure all tables exist (for migrations)
      ensureTablesExist(db);
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
      track_order INTEGER NOT NULL,
      spotify_link TEXT,
      apple_music_link TEXT,
      custom_links TEXT DEFAULT '[]',
      lyrics TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
      UNIQUE(album_id, codename)
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
      song_link TEXT,
      show_link INTEGER DEFAULT 1,
      fingerprint_hash TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      approved_at TEXT,
      UNIQUE(fingerprint_hash, category)
    )
  `);

  // Gallery images table
  database.exec(`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      alt_text TEXT NOT NULL,
      display_order INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Films/Series table
  database.exec(`
    CREATE TABLE IF NOT EXISTS films (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'film',
      cover_image_url TEXT,
      rating REAL,
      review TEXT,
      release_year INTEGER,
      genre TEXT,
      director TEXT,
      duration TEXT,
      episode_count INTEGER,
      watch_date TEXT,
      featured BOOLEAN DEFAULT 0,
      display_order INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Q&A table
  database.exec(`
    CREATE TABLE IF NOT EXISTS qna (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT,
      asker_name TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      answered_at TEXT
    )
  `);

  // Polls table
  database.exec(`
    CREATE TABLE IF NOT EXISTS polls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active',
      allow_multiple_votes INTEGER DEFAULT 0,
      end_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Poll options table
  database.exec(`
    CREATE TABLE IF NOT EXISTS poll_options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      link TEXT,
      vote_count INTEGER DEFAULT 0,
      display_order INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
    )
  `);

  // Poll votes table (to track who voted)
  database.exec(`
    CREATE TABLE IF NOT EXISTS poll_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id INTEGER NOT NULL,
      option_id INTEGER NOT NULL,
      voter_fingerprint TEXT NOT NULL,
      voted_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
      FOREIGN KEY (option_id) REFERENCES poll_options(id) ON DELETE CASCADE,
      UNIQUE(poll_id, voter_fingerprint, option_id)
    )
  `);

  // Create indexes
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_songs_album ON songs(album_id);
    CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
    CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
    CREATE INDEX IF NOT EXISTS idx_contributions_category ON contributions(category);
    CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery_images(display_order);
    CREATE INDEX IF NOT EXISTS idx_qna_status ON qna(status);
    CREATE INDEX IF NOT EXISTS idx_poll_options_poll ON poll_options(poll_id);
    CREATE INDEX IF NOT EXISTS idx_poll_votes_poll ON poll_votes(poll_id);
    CREATE INDEX IF NOT EXISTS idx_poll_votes_fingerprint ON poll_votes(voter_fingerprint);
    CREATE INDEX IF NOT EXISTS idx_films_featured ON films(featured);
    CREATE INDEX IF NOT EXISTS idx_films_order ON films(display_order);
  `);

  // Create default admin user
  createDefaultAdminUser(database);

  console.log("Database schema initialized successfully");
}

function createDefaultAdminUser(database: Database.Database) {
  const username = "admin";
  const password = "change_me_123";

  // Check if admin user already exists
  const existingAdmin = database
    .prepare("SELECT id FROM admin_users WHERE username = ?")
    .get(username);

  if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync(password, 10);
    database
      .prepare(
        "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
      )
      .run(username, passwordHash);
    console.log(
      "✅ Default admin user created (username: admin, password: change_me_123)",
    );
  }
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
