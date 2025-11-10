const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function migrate() {
  console.log('🔧 Initializing database...');
  
  try {
    // Initialize database
    const dbPath = path.join(process.cwd(), 'data', 'nheek.db');
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    
    console.log('📋 Creating database schema...');
    
    // Create tables
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
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS songs (
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
      )
    `);
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS project_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
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
    
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_songs_album ON songs(album_id);
      CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
    `);
    
    console.log('🔄 Checking and updating schema...');
    
    // Check and add missing columns to albums table
    try {
      const albumColumns = db.pragma('table_info(albums)');
      const columnNames = albumColumns.map(col => col.name);
      
      if (!columnNames.includes('codename')) {
        console.log('  Adding codename column to albums table...');
        db.exec('ALTER TABLE albums ADD COLUMN codename TEXT');
        
        // Update existing albums with codenames from titles
        const albums = db.prepare('SELECT id, title FROM albums').all();
        const updateStmt = db.prepare('UPDATE albums SET codename = ? WHERE id = ?');
        
        for (const album of albums) {
          const codename = album.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
          updateStmt.run(codename, album.id);
        }
        
        console.log('  ✓ Codename column added');
      }
      
      if (!columnNames.includes('featured')) {
        console.log('  Adding featured column to albums table...');
        db.exec('ALTER TABLE albums ADD COLUMN featured BOOLEAN DEFAULT 0');
        console.log('  ✓ Featured column added');
      }
      
      if (!columnNames.includes('custom_links')) {
        console.log('  Adding custom_links column to albums table...');
        db.exec('ALTER TABLE albums ADD COLUMN custom_links TEXT DEFAULT \'[]\'');
        console.log('  ✓ Custom_links column added');
      }
    } catch (err) {
      console.error('  Warning: Could not update albums schema:', err.message);
    }
    
    // Check and add missing columns to songs table
    try {
      const songColumns = db.pragma('table_info(songs)');
      const columnNames = songColumns.map(col => col.name);
      
      if (!columnNames.includes('track_order') && columnNames.includes('track_number')) {
        console.log('  Migrating track_number to track_order in songs table...');
        db.exec(`
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
          SELECT id, album_id, title, codename, duration, track_number, spotify_link, apple_music_link, custom_links, lyrics, created_at, updated_at FROM songs;
          
          DROP TABLE songs;
          ALTER TABLE songs_new RENAME TO songs;
          CREATE INDEX IF NOT EXISTS idx_songs_album ON songs(album_id);
        `);
        console.log('  ✓ Track column migrated');
      } else if (!columnNames.includes('track_order')) {
        console.log('  Adding track_order column to songs table...');
        db.exec('ALTER TABLE songs ADD COLUMN track_order INTEGER NOT NULL DEFAULT 1');
        console.log('  ✓ Track_order column added');
      }
      
      if (!columnNames.includes('custom_links')) {
        console.log('  Adding custom_links column to songs table...');
        db.exec('ALTER TABLE songs ADD COLUMN custom_links TEXT DEFAULT \'[]\'');
        console.log('  ✓ Custom_links column added');
      }
      
      if (!columnNames.includes('codename')) {
        console.log('  Adding codename column to songs table...');
        db.exec('ALTER TABLE songs ADD COLUMN codename TEXT');
        
        // Update existing songs with codenames from titles
        const songs = db.prepare('SELECT id, title FROM songs').all();
        const updateStmt = db.prepare('UPDATE songs SET codename = ? WHERE id = ?');
        
        for (const song of songs) {
          const codename = song.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
          updateStmt.run(codename, song.id);
        }
        
        console.log('  ✓ Codename column added');
      }
    } catch (err) {
      console.error('  Warning: Could not update songs schema:', err.message);
    }
    
    console.log('✅ Schema check completed!');
    
    // Check if we should skip data migration
    if (process.env.SKIP_DATA_MIGRATION === 'true') {
      console.log('⏭️  Skipping data migration (SKIP_DATA_MIGRATION=true)');
      console.log('� You can now manually edit the database');
      db.close();
      return;
    }
    
    console.log('�📚 Migrating albums and songs...');
    
    // Read albums.json
    const albumsPath = path.join(process.cwd(), 'public', 'featured-music', 'albums.json');
    
    if (!fs.existsSync(albumsPath)) {
      console.error('❌ albums.json not found at:', albumsPath);
      process.exit(1);
    }
    
    const albumsData = JSON.parse(fs.readFileSync(albumsPath, 'utf-8'));
    
    const insertAlbum = db.prepare(`
      INSERT OR REPLACE INTO albums (title, codename, artist, release_date, cover_image_url, spotify_link, apple_music_link, custom_links, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertSong = db.prepare(`
      INSERT OR REPLACE INTO songs (album_id, title, codename, duration, track_order, spotify_link, apple_music_link, custom_links, lyrics)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    let albumsCount = 0;
    let songsCount = 0;
    
    const migrateAlbums = db.transaction(() => {
      albumsData.albums.forEach((album) => {
        const result = insertAlbum.run(
          album.title || 'Untitled',
          album.codename || album.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          album.artist || 'Unknown Artist',
          album.releaseDate || album.release_date || '2000-01-01',
          album.coverImage || album.cover_image_url || null,
          album.links?.spotify || album.spotifyLink || album.spotify_link || null,
          album.links?.appleMusic || album.appleMusicLink || album.apple_music_link || null,
          '[]',
          album.featured ? 1 : 0
        );
        albumsCount++;
        
        const albumId = result.lastInsertRowid;
        
        if (album.songs && Array.isArray(album.songs)) {
          album.songs.forEach((song, index) => {
            insertSong.run(
              albumId,
              song.title,
              song.codename || song.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
              song.duration,
              song.trackNumber || song.track_number || index + 1,
              song.links?.spotify || song.spotifyLink || song.spotify_link || null,
              song.links?.appleMusic || song.appleMusicLink || song.apple_music_link || null,
              '[]',
              song.lyrics || null
            );
            songsCount++;
          });
        }
      });
    });
    
    migrateAlbums();
    console.log(`✅ Migrated ${albumsCount} albums and ${songsCount} songs`);
    
    // Migrate projects
    console.log('🚀 Migrating projects...');
    
    const projectsPath = path.join(process.cwd(), 'public', 'featured-projects', 'json', 'projects.json');
    
    if (!fs.existsSync(projectsPath)) {
      console.log('⚠️  projects.json not found, skipping projects migration');
    } else {
      const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'));
      
      // Category mapping
      const categoryMap = {
        websites: { name: 'Websites', slug: 'websites', description: 'Web applications and websites' },
        desktop: { name: 'Desktop Applications', slug: 'desktop', description: 'Desktop software and applications' },
        mobile: { name: 'Mobile Apps', slug: 'mobile', description: 'Mobile applications for iOS and Android' },
        consulting: { name: 'Consulting', slug: 'consulting', description: 'Consulting and professional services' },
        contributions: { name: 'Open Source', slug: 'contributions', description: 'Open source contributions and collaborations' },
        static: { name: 'Static Sites', slug: 'static', description: 'Static websites and landing pages' },
        template: { name: 'Templates', slug: 'template', description: 'Templates and boilerplates' },
        utility: { name: 'Utilities', slug: 'utility', description: 'Tools and utilities' }
      };
      
      // Create categories
      const insertCategory = db.prepare(`
        INSERT OR IGNORE INTO project_categories (name, slug, description)
        VALUES (?, ?, ?)
      `);
      
      Object.values(categoryMap).forEach(cat => {
        insertCategory.run(cat.name, cat.slug, cat.description);
      });
      
      // Insert projects
      const insertProject = db.prepare(`
        INSERT OR REPLACE INTO projects (title, codename, description, category_id, image_url, github_link, live_link, custom_links, date_added, featured, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const getCategoryId = db.prepare('SELECT id FROM project_categories WHERE slug = ?');
      
      let projectsCount = 0;
      let categoriesCount = Object.keys(categoryMap).length;
      
      Object.entries(projectsData).forEach(([categoryKey, data]) => {
        const category = categoryMap[categoryKey];
        if (!category) return;
        
        const projects = data.projects || [];
        const categoryRow = getCategoryId.get(category.slug);
        const categoryId = categoryRow?.id;
        
        if (!categoryId) return;
        
        projects.forEach((project, index) => {
          // Convert date from DD.MM.YYYY to YYYY-MM-DD
          let dateAdded = new Date().toISOString().split('T')[0];
          if (project.dateAdded) {
            const [day, month, year] = project.dateAdded.split('.');
            dateAdded = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
          
          // Create custom_links array
          const customLinks = [];
          if (project.link) {
            customLinks.push({ name: 'Live Demo', url: project.link, color: '#3B82F6' });
          }
          if (project.onGithub) {
            customLinks.push({ name: 'GitHub', url: project.onGithub, color: '#181717' });
          }
          if (project.onGrit) {
            customLinks.push({ name: 'Grit', url: project.onGrit, color: '#FF6B6B' });
          }
          
          insertProject.run(
            project.title,
            project.codename || project.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            project.description || null,
            categoryId,
            project.image || null,
            project.onGithub || null,
            project.link || null,
            JSON.stringify(customLinks),
            dateAdded,
            project.featured ? 1 : 0,
            index + 1
          );
          projectsCount++;
        });
      });
      
      console.log(`✅ Migrated ${categoriesCount} categories and ${projectsCount} projects`);
    }
    
    // Create admin user
    console.log('👤 Creating admin user...');
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    db.prepare(`
      INSERT OR IGNORE INTO admin_users (username, password_hash, email)
      VALUES (?, ?, ?)
    `).run('admin', passwordHash, 'admin@nheek.com');
    
    console.log('✅ Admin user created (username: admin, password: admin123)');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
    
    // Migrate custom links from old format
    console.log('🔗 Migrating custom links...');
    
    const albumsWithOldLinks = db.prepare(`
      SELECT id, spotify_link, apple_music_link, custom_links 
      FROM albums 
      WHERE (spotify_link IS NOT NULL OR apple_music_link IS NOT NULL)
      AND (custom_links IS NULL OR custom_links = '[]')
    `).all();
    
    const updateAlbumLinks = db.prepare(`UPDATE albums SET custom_links = ? WHERE id = ?`);
    
    let albumsLinksUpdated = 0;
    
    albumsWithOldLinks.forEach((album) => {
      const customLinks = [];
      
      if (album.spotify_link) {
        customLinks.push({ name: 'Spotify', url: album.spotify_link, color: '#1DB954' });
      }
      
      if (album.apple_music_link) {
        customLinks.push({ name: 'Apple Music', url: album.apple_music_link, color: '#FA243C' });
      }
      
      if (customLinks.length > 0) {
        updateAlbumLinks.run(JSON.stringify(customLinks), album.id);
        albumsLinksUpdated++;
      }
    });
    
    const songsWithOldLinks = db.prepare(`
      SELECT id, spotify_link, apple_music_link, custom_links 
      FROM songs 
      WHERE (spotify_link IS NOT NULL OR apple_music_link IS NOT NULL)
      AND (custom_links IS NULL OR custom_links = '[]')
    `).all();
    
    const updateSongLinks = db.prepare(`UPDATE songs SET custom_links = ? WHERE id = ?`);
    
    let songsLinksUpdated = 0;
    
    songsWithOldLinks.forEach((song) => {
      const customLinks = [];
      
      if (song.spotify_link) {
        customLinks.push({ name: 'Spotify', url: song.spotify_link, color: '#1DB954' });
      }
      
      if (song.apple_music_link) {
        customLinks.push({ name: 'Apple Music', url: song.apple_music_link, color: '#FA243C' });
      }
      
      if (customLinks.length > 0) {
        updateSongLinks.run(JSON.stringify(customLinks), song.id);
        songsLinksUpdated++;
      }
    });
    
    console.log(`✅ Updated ${albumsLinksUpdated} albums and ${songsLinksUpdated} songs with custom links`);
    
    console.log('🎉 Migration completed successfully!');
    db.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
