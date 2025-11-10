# Quick Fix Guide - Manual Database Editing

## Current Issue
Your database has an old schema and the migration is failing. You want to edit the SQLite database manually.

## Option 1: Quick Fix - Update Schema Only (RECOMMENDED)

### Step 1: Stop and restart with schema-only migration
```bash
# Stop the container
docker-compose down

# Start with schema updates only (no data migration)
SKIP_DATA_MIGRATION=true docker-compose up
```

Or add to your `docker-compose.yml`:
```yaml
environment:
  - NODE_ENV=production
  - SKIP_DATA_MIGRATION=true  # Add this line
```

Then:
```bash
docker-compose up --build
```

This will:
- ✅ Create all missing columns in your existing tables
- ✅ Fix column names (track_number → track_order)
- ✅ Keep all your existing data
- ❌ NOT import data from JSON files (you keep manual control)

### Step 2: Access the database
```bash
# Connect to the running container
docker exec -it nheek-nheek-1 sh

# Install sqlite if needed
apk add sqlite

# Open the database
sqlite3 /app/data/nheek.db
```

### Step 3: Verify schema is correct
```sql
.headers on
.mode column

-- Check albums columns
PRAGMA table_info(albums);

-- Check songs columns
PRAGMA table_info(songs);

-- Should have these columns:
-- albums: id, title, codename, artist, release_date, cover_image_url, 
--         spotify_link, apple_music_link, custom_links, featured
-- songs: id, album_id, title, codename, duration, track_order,
--        spotify_link, apple_music_link, custom_links, lyrics
```

### Step 4: Exit and restart without skip flag
```sql
.quit
```

```bash
# Exit container
exit

# Remove the SKIP_DATA_MIGRATION flag
docker-compose down
# Remove SKIP_DATA_MIGRATION from docker-compose.yml or don't use the env var
docker-compose up
```

## Option 2: Fresh Start (Clean Database)

```bash
# Stop container
docker-compose down

# Delete the old database
rm -rf data/nheek.db

# Rebuild and start
docker-compose up --build
```

This will create a fresh database with the correct schema and import data from JSON files.

## Option 3: Manual Database Access (No Container Changes)

### From your host machine (if volume is mounted):
```bash
# Install sqlite3 if needed
brew install sqlite  # macOS
# or
apt-get install sqlite3  # Linux

# Access the database directly
sqlite3 ./data/nheek.db
```

### Run these SQL commands to fix schema:
```sql
-- Enable better output
.headers on
.mode column

-- Add missing columns to albums
ALTER TABLE albums ADD COLUMN codename TEXT;
ALTER TABLE albums ADD COLUMN featured BOOLEAN DEFAULT 0;
ALTER TABLE albums ADD COLUMN custom_links TEXT DEFAULT '[]';

-- Update codenames for existing albums
UPDATE albums SET codename = lower(
  replace(
    replace(
      replace(title, ' ', '-'),
      '''', ''
    ),
    '.', ''
  )
) WHERE codename IS NULL OR codename = '';

-- Add missing columns to songs  
ALTER TABLE songs ADD COLUMN codename TEXT;
ALTER TABLE songs ADD COLUMN custom_links TEXT DEFAULT '[]';

-- Update codenames for existing songs
UPDATE songs SET codename = lower(
  replace(
    replace(
      replace(title, ' ', '-'),
      '''', ''
    ),
    '.', ''
  )
) WHERE codename IS NULL OR codename = '';

-- Fix track_number to track_order (if needed)
-- First check if track_number exists
PRAGMA table_info(songs);

-- If track_number exists but track_order doesn't, run this:
CREATE TABLE songs_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  album_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  codename TEXT NOT NULL,
  duration TEXT NOT NULL,
  track_order INTEGER NOT NULL DEFAULT 1,
  spotify_link TEXT,
  apple_music_link TEXT,
  custom_links TEXT DEFAULT '[]',
  lyrics TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);

INSERT INTO songs_new 
SELECT id, album_id, title, codename, duration, 
       track_number as track_order, 
       spotify_link, apple_music_link, custom_links, lyrics,
       created_at, updated_at 
FROM songs;

DROP TABLE songs;
ALTER TABLE songs_new RENAME TO songs;
CREATE INDEX idx_songs_album ON songs(album_id);

-- Verify the changes
SELECT * FROM albums LIMIT 3;
SELECT * FROM songs LIMIT 3;

.quit
```

## Verify It's Working

After applying the fix, check your application logs:
```bash
docker-compose logs -f
```

You should see:
- ✅ Schema check completed
- ✅ Migration completed (if not skipped)
- ✅ Starting Next.js server
- ✅ No "no such column" errors

## Backup Before Making Changes

Always backup first:
```bash
# Backup the database
cp ./data/nheek.db ./data/nheek-backup-$(date +%Y%m%d-%H%M%S).db
```

## Summary

**Fastest solution**: Use `SKIP_DATA_MIGRATION=true` to update schema only, then manually edit as needed.

**Cleanest solution**: Delete database and let migration create it fresh.

**Most control**: Access SQLite directly and run the manual SQL commands above.
