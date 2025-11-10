import { getDb } from "../lib/db";

function migrateOldLinksToCustomLinks() {
  const db = getDb();

  console.log("Migrating old Spotify/Apple Music links to custom_links...\n");

  // Migrate albums
  const albums = db
    .prepare(
      "SELECT * FROM albums WHERE spotify_link IS NOT NULL OR apple_music_link IS NOT NULL",
    )
    .all() as any[];

  console.log(`Found ${albums.length} albums with old links`);

  albums.forEach((album: any) => {
    const existingLinks = album.custom_links
      ? JSON.parse(album.custom_links)
      : [];
    const newLinks = [...existingLinks];

    // Add Spotify if exists and not already in custom_links
    if (
      album.spotify_link &&
      !newLinks.some((l: any) => l.url === album.spotify_link)
    ) {
      newLinks.push({
        name: "Spotify",
        url: album.spotify_link,
        color: "#1DB954",
      });
    }

    // Add Apple Music if exists and not already in custom_links
    if (
      album.apple_music_link &&
      !newLinks.some((l: any) => l.url === album.apple_music_link)
    ) {
      newLinks.push({
        name: "Apple Music",
        url: album.apple_music_link,
        color: "#FA243C",
      });
    }

    if (newLinks.length > existingLinks.length) {
      db.prepare("UPDATE albums SET custom_links = ? WHERE id = ?").run(
        JSON.stringify(newLinks),
        album.id,
      );
      console.log(`  ✓ Migrated album: ${album.title}`);
    }
  });

  // Migrate songs
  const songs = db
    .prepare(
      "SELECT * FROM songs WHERE spotify_link IS NOT NULL OR apple_music_link IS NOT NULL",
    )
    .all() as any[];

  console.log(`\nFound ${songs.length} songs with old links`);

  songs.forEach((song: any) => {
    const existingLinks = song.custom_links
      ? JSON.parse(song.custom_links)
      : [];
    const newLinks = [...existingLinks];

    // Add Spotify if exists and not already in custom_links
    if (
      song.spotify_link &&
      !newLinks.some((l: any) => l.url === song.spotify_link)
    ) {
      newLinks.push({
        name: "Spotify",
        url: song.spotify_link,
        color: "#1DB954",
      });
    }

    // Add Apple Music if exists and not already in custom_links
    if (
      song.apple_music_link &&
      !newLinks.some((l: any) => l.url === song.apple_music_link)
    ) {
      newLinks.push({
        name: "Apple Music",
        url: song.apple_music_link,
        color: "#FA243C",
      });
    }

    if (newLinks.length > existingLinks.length) {
      db.prepare("UPDATE songs SET custom_links = ? WHERE id = ?").run(
        JSON.stringify(newLinks),
        song.id,
      );
      console.log(`  ✓ Migrated song: ${song.title}`);
    }
  });

  console.log("\n✅ Migration complete!");
  console.log(
    "\nYour existing Spotify and Apple Music links are now in custom_links.",
  );
  console.log(
    "You can still see the old columns, but the new system uses custom_links.",
  );
}

migrateOldLinksToCustomLinks();
