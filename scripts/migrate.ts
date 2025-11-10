import { getDb, initDb } from '../lib/db';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

async function migrate() {
  console.log('Starting migration...');
  
  // Initialize database
  initDb();
  const db = getDb();

  // Read existing albums.json
  const albumsPath = path.join(process.cwd(), 'public', 'featured-music', 'albums.json');
  const albumsData = JSON.parse(fs.readFileSync(albumsPath, 'utf-8'));

  // Read existing projects.json if it exists
  const projectsPath = path.join(process.cwd(), 'public', 'featured-projects', 'json', 'projects.json');
  let projectsData: any = { projects: [] };
  if (fs.existsSync(projectsPath)) {
    projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'));
  }

  // Migrate albums and songs
  console.log('Migrating albums and songs...');
  const insertAlbum = db.prepare(`
    INSERT INTO albums (id, title, codename, cover_image, release_date, spotify_link, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertSong = db.prepare(`
    INSERT INTO songs (id, album_id, title, codename, duration, spotify_link, lyrics, track_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const migrateAlbums = db.transaction(() => {
    for (const album of albumsData.albums) {
      insertAlbum.run(
        album.id,
        album.title,
        album.codename,
        album.coverImage || null,
        album.releaseDate,
        album.links?.spotify || null,
        album.featured ? 1 : 0
      );

      if (album.songs && Array.isArray(album.songs)) {
        album.songs.forEach((song: any, index: number) => {
          insertSong.run(
            song.id,
            album.id,
            song.title,
            song.codename,
            song.duration,
            song.links?.spotify || null,
            song.lyrics || null,
            index + 1
          );
        });
      }
    }
  });

  try {
    migrateAlbums();
    console.log('Albums and songs migrated successfully');
  } catch (error) {
    console.error('Error migrating albums:', error);
  }

  // Migrate project categories and projects
  console.log('Migrating projects...');
  
  // First, create default categories
  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO project_categories (name, slug, description)
    VALUES (?, ?, ?)
  `);

  insertCategory.run('Web Development', 'web-development', 'Web applications and websites');
  insertCategory.run('Mobile Apps', 'mobile-apps', 'Mobile applications');
  insertCategory.run('Tools & Utilities', 'tools-utilities', 'Developer tools and utilities');
  insertCategory.run('Other', 'other', 'Other projects');

  const webDevCategoryId = db.prepare("SELECT id FROM project_categories WHERE slug = 'web-development'").get() as any;

  const insertProject = db.prepare(`
    INSERT INTO projects (id, title, codename, description, category_id, image_url, github_link, live_link, featured, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  if (projectsData.projects && Array.isArray(projectsData.projects)) {
    const migrateProjects = db.transaction(() => {
      projectsData.projects.forEach((project: any, index: number) => {
        insertProject.run(
          project.id || null,
          project.title,
          project.codename || project.title.toLowerCase().replace(/\s+/g, '-'),
          project.description || null,
          webDevCategoryId?.id || null,
          project.image || project.imageUrl || null,
          project.githubLink || project.github_link || null,
          project.liveLink || project.live_link || null,
          project.featured ? 1 : 0,
          index + 1
        );
      });
    });

    try {
      migrateProjects();
      console.log('Projects migrated successfully');
    } catch (error) {
      console.error('Error migrating projects:', error);
    }
  }

  // Create default admin user (username: admin, password: change_me_123)
  console.log('Creating default admin user...');
  const passwordHash = await bcrypt.hash('change_me_123', 10);
  
  try {
    db.prepare(`
      INSERT OR IGNORE INTO admin_users (username, password_hash, email)
      VALUES (?, ?, ?)
    `).run('admin', passwordHash, 'admin@nheek.com');
    
    console.log('Default admin user created (username: admin, password: change_me_123)');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }

  console.log('Migration completed!');
  db.close();
}

migrate().catch(console.error);
