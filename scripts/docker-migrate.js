const { initDb, getDb } = require('../lib/db');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function migrate() {
  console.log('🔧 Initializing database schema...');
  
  try {
    // Initialize database (creates tables)
    initDb();
    const db = getDb();
    
    console.log('📚 Migrating albums and songs...');
    
    // Read albums.json
    const albumsPath = path.join(process.cwd(), 'public', 'featured-music', 'albums.json');
    
    if (!fs.existsSync(albumsPath)) {
      console.error('❌ albums.json not found at:', albumsPath);
      process.exit(1);
    }
    
    const albumsData = JSON.parse(fs.readFileSync(albumsPath, 'utf-8'));
    
    const insertAlbum = db.prepare(`
      INSERT OR REPLACE INTO albums (id, title, artist, release_date, cover_image_url, spotify_link, apple_music_link, custom_links)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertSong = db.prepare(`
      INSERT OR REPLACE INTO songs (id, album_id, title, duration, track_number, lyrics, spotify_link, apple_music_link, custom_links)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    let albumsCount = 0;
    let songsCount = 0;
    
    const migrateAlbums = db.transaction(() => {
      albumsData.albums.forEach((album) => {
        insertAlbum.run(
          album.id || null,
          album.title,
          album.artist,
          album.releaseDate || album.release_date,
          album.coverImage || album.cover_image_url,
          album.spotifyLink || album.spotify_link || null,
          album.appleMusicLink || album.apple_music_link || null,
          '[]'
        );
        albumsCount++;
        
        if (album.songs && Array.isArray(album.songs)) {
          album.songs.forEach((song, index) => {
            insertSong.run(
              song.id || null,
              album.id,
              song.title,
              song.duration,
              song.trackNumber || song.track_number || index + 1,
              song.lyrics || null,
              song.spotifyLink || song.spotify_link || null,
              song.appleMusicLink || song.apple_music_link || null,
              '[]'
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
        INSERT OR REPLACE INTO projects (title, description, category_id, image_url, custom_links, date_added, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?)
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
            project.description || null,
            categoryId,
            project.image || null,
            JSON.stringify(customLinks),
            dateAdded,
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
