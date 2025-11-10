# Manual SQLite Database Editing on Server

## Access the Database in Your Docker Container

### 1. Connect to the running container

```bash
docker exec -it <container-name> sh
# Or if you know the container name:
docker exec -it nheek-nheek-1 sh
```

### 2. Install sqlite3 if not available

```bash
apk add sqlite
```

### 3. Open the database

```bash
sqlite3 /app/data/nheek.db
```

## Useful SQLite Commands

### View all tables

```sql
.tables
```

### View table schema

```sql
.schema albums
.schema songs
.schema projects
.schema project_categories
.schema admin_users
```

### View column information

```sql
PRAGMA table_info(albums);
PRAGMA table_info(songs);
```

### Enable column headers and better formatting

```sql
.headers on
.mode column
```

## Common Database Operations

### View all albums

```sql
SELECT * FROM albums;
```

### View all songs with album info

```sql
SELECT s.*, a.title as album_title
FROM songs s
LEFT JOIN albums a ON s.album_id = a.id;
```

### Add missing columns (if needed)

#### For albums table:

```sql
-- Add codename column
ALTER TABLE albums ADD COLUMN codename TEXT;

-- Add featured column
ALTER TABLE albums ADD COLUMN featured BOOLEAN DEFAULT 0;

-- Add custom_links column
ALTER TABLE albums ADD COLUMN custom_links TEXT DEFAULT '[]';

-- Update codenames from existing titles
UPDATE albums SET codename = lower(replace(replace(replace(title, ' ', '-'), '''', ''), '.', ''))
WHERE codename IS NULL;
```

#### For songs table:

```sql
-- Add codename column
ALTER TABLE songs ADD COLUMN codename TEXT;

-- Add custom_links column
ALTER TABLE songs ADD COLUMN custom_links TEXT DEFAULT '[]';

-- If you have track_number instead of track_order
-- You'll need to recreate the table (see below)
```

### Rename track_number to track_order (requires table recreation)

```sql
-- Create new table with correct schema
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

-- Copy data from old table
INSERT INTO songs_new (id, album_id, title, codename, duration, track_order, spotify_link, apple_music_link, custom_links, lyrics, created_at, updated_at)
SELECT id, album_id, title, codename, duration, track_number, spotify_link, apple_music_link, custom_links, lyrics, created_at, updated_at
FROM songs;

-- Drop old table
DROP TABLE songs;

-- Rename new table
ALTER TABLE songs_new RENAME TO songs;

-- Recreate index
CREATE INDEX idx_songs_album ON songs(album_id);
```

### Update admin password

```sql
-- View current admin user
SELECT * FROM admin_users;

-- To update password, you'll need to generate a bcrypt hash
-- You can do this from the admin panel or use Node.js:
```

## Backup Database Before Making Changes

### From your host machine:

```bash
# Copy database out of container
docker cp <container-name>:/app/data/nheek.db ./nheek-backup-$(date +%Y%m%d).db

# Or if using docker-compose with volumes
cp ./data/nheek.db ./nheek-backup-$(date +%Y%m%d).db
```

### Restore from backup:

```bash
# Copy backup into container
docker cp ./nheek-backup-20251110.db <container-name>:/app/data/nheek.db

# Or with volumes
cp ./nheek-backup-20251110.db ./data/nheek.db
```

## Exit SQLite

```sql
.quit
```

## Alternative: Use SQLite from Host Machine

If you have a volume mounted, you can edit the database directly from your host:

```bash
# Install sqlite3 on your host if not available
# macOS
brew install sqlite

# Linux
apt-get install sqlite3  # Debian/Ubuntu
yum install sqlite       # CentOS/RHEL

# Then access the database
sqlite3 ./data/nheek.db
```

## Disable Auto-Migration

To prevent the migration script from running, you can:

1. Comment out the migration in `docker-entrypoint.sh`
2. Or set an environment variable to skip migration
3. Or remove the database check from the entrypoint script

## Re-enable Auto-Migration

Once you're done with manual edits, you can let the auto-migration handle schema updates again.
