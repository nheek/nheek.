import { getDb } from '../lib/db';

// Migration to add custom_links column
function addCustomLinksColumn() {
  const db = getDb();

  console.log('Adding custom_links columns...');

  // Add custom_links to albums
  try {
    db.exec(`ALTER TABLE albums ADD COLUMN custom_links TEXT DEFAULT '[]'`);
    console.log('✓ Added custom_links to albums');
  } catch (e: any) {
    if (e.message.includes('duplicate column')) {
      console.log('  custom_links already exists in albums');
    } else {
      throw e;
    }
  }

  // Add custom_links to songs
  try {
    db.exec(`ALTER TABLE songs ADD COLUMN custom_links TEXT DEFAULT '[]'`);
    console.log('✓ Added custom_links to songs');
  } catch (e: any) {
    if (e.message.includes('duplicate column')) {
      console.log('  custom_links already exists in songs');
    } else {
      throw e;
    }
  }

  // Add custom_links to projects
  try {
    db.exec(`ALTER TABLE projects ADD COLUMN custom_links TEXT DEFAULT '[]'`);
    console.log('✓ Added custom_links to projects');
  } catch (e: any) {
    if (e.message.includes('duplicate column')) {
      console.log('  custom_links already exists in projects');
    } else {
      throw e;
    }
  }

  console.log('\n✅ Migration complete!');
  console.log('\nYou can now add custom links with name, URL, and color for each album, song, and project.');
}

addCustomLinksColumn();
