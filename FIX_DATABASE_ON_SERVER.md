# Fix Database Schema Directly on Your Server

## Step 1: Connect to Your Server

```bash
ssh user@your-server.com
cd /path/to/your/nheek/project
```

## Step 2: Access the Running Docker Container

```bash
# Find your container name
docker ps

# Connect to the container (replace with your container name)
docker exec -it nheek-nheek-1 sh
```

## Step 3: Install SQLite (if not already installed)

```bash
apk add sqlite
```

## Step 4: Open the Database

```bash
sqlite3 /app/data/nheek.db
```

## Step 5: Run These SQL Commands to Fix Schema

```sql
-- Enable better output
.headers on
.mode column

-- Check current albums schema
PRAGMA table_info(albums);

-- Add missing columns to albums table
ALTER TABLE albums ADD COLUMN codename TEXT;
ALTER TABLE albums ADD COLUMN featured BOOLEAN DEFAULT 0;
ALTER TABLE albums ADD COLUMN custom_links TEXT DEFAULT '[]';

-- Update codenames for existing albums (if any exist)
UPDATE albums SET codename = lower(
  replace(
    replace(
      replace(
        replace(title, ' ', '-'),
        '''', ''
      ),
      '.', ''
    ),
    '&', 'and'
  )
) WHERE codename IS NULL OR codename = '';

-- Check current songs schema
PRAGMA table_info(songs);

-- Add missing columns to songs table
ALTER TABLE songs ADD COLUMN codename TEXT;
ALTER TABLE songs ADD COLUMN custom_links TEXT DEFAULT '[]';

-- If you have track_number instead of track_order, migrate it
-- First check what you have:
PRAGMA table_info(songs);

-- If you see track_number but not track_order, run this:
-- (Skip if you already have track_order)

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

INSERT INTO songs_new (id, album_id, title, codename, duration, track_order, spotify_link, apple_music_link, custom_links, lyrics, created_at, updated_at)
SELECT id, album_id, title, codename, duration, track_number, spotify_link, apple_music_link,
       COALESCE(custom_links, '[]'), lyrics,
       COALESCE(created_at, CURRENT_TIMESTAMP),
       COALESCE(updated_at, CURRENT_TIMESTAMP)
FROM songs;

DROP TABLE songs;
ALTER TABLE songs_new RENAME TO songs;
CREATE INDEX idx_songs_album ON songs(album_id);

-- Update codenames for existing songs (if any exist)
UPDATE songs SET codename = lower(
  replace(
    replace(
      replace(
        replace(title, ' ', '-'),
        '''', ''
      ),
      '.', ''
    ),
    '&', 'and'
  )
) WHERE codename IS NULL OR codename = '';

-- Verify the changes
PRAGMA table_info(albums);
PRAGMA table_info(songs);

-- Check some data
SELECT * FROM albums LIMIT 3;
SELECT * FROM songs LIMIT 3;

-- Exit SQLite
.quit
```

## Step 6: Exit the Container

```bash
exit
```

## Step 7: Restart Your Container

```bash
docker-compose restart
# or
docker restart nheek-nheek-1
```

## Step 8: Check Logs

```bash
docker-compose logs -f
# or
docker logs -f nheek-nheek-1
```

You should see:

- ✅ Starting Next.js server...
- ✅ Ready in XXXms
- ❌ NO "no such column" errors

## Quick One-Liner SQL Fix

If you want to run all the fixes at once, you can create a SQL file and pipe it:

```bash
# On your server, create a fix script
cat > /tmp/fix-schema.sql << 'EOF'
ALTER TABLE albums ADD COLUMN codename TEXT;
ALTER TABLE albums ADD COLUMN featured BOOLEAN DEFAULT 0;
ALTER TABLE albums ADD COLUMN custom_links TEXT DEFAULT '[]';
ALTER TABLE songs ADD COLUMN codename TEXT;
ALTER TABLE songs ADD COLUMN custom_links TEXT DEFAULT '[]';
UPDATE albums SET codename = lower(replace(replace(replace(title, ' ', '-'), '''', ''), '.', '')) WHERE codename IS NULL;
UPDATE songs SET codename = lower(replace(replace(replace(title, ' ', '-'), '''', ''), '.', '')) WHERE codename IS NULL;
EOF

# Run it
docker exec -i nheek-nheek-1 sh -c 'apk add sqlite && sqlite3 /app/data/nheek.db' < /tmp/fix-schema.sql

# Restart
docker-compose restart
```

## If Columns Already Exist

If you get errors like "duplicate column name", that's fine - it means those columns already exist. Just skip those ALTER TABLE commands and move to the next ones.

## Backup First (Recommended)

```bash
# Backup the database before making changes
docker cp nheek-nheek-1:/app/data/nheek.db ./nheek-backup-$(date +%Y%m%d-%H%M%S).db

# To restore if something goes wrong:
docker cp ./nheek-backup-20251110-120000.db nheek-nheek-1:/app/data/nheek.db
docker-compose restart
```

## Alternative: Replace the Migration Script Without Rebuilding

If you want to update the migration script without rebuilding:

```bash
# On your server
# Edit the migration script directly in the running container
docker exec -it nheek-nheek-1 sh

# Install a text editor (vi is usually available, or use nano)
apk add nano

# Edit the migration script
nano /app/scripts/docker-migrate.js

# Make the changes, then save and exit
# Ctrl+X, then Y, then Enter (for nano)

exit

# Restart the container
docker-compose restart
```

But honestly, the SQL fix above is faster and cleaner! 🚀
