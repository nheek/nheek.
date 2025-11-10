import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import * as fs from "fs";
import * as path from "path";

export async function POST() {
  try {
    const dbPath = path.join(process.cwd(), "data", "nheek.db");
    const dbExists = fs.existsSync(dbPath);

    if (dbExists) {
      await requireAuth();
    }

    const db = getDb();

    // Migrate albums with old spotify/apple music links
    const albumsWithOldLinks = db
      .prepare(
        `
      SELECT id, spotify_link, apple_music_link, custom_links 
      FROM albums 
      WHERE (spotify_link IS NOT NULL OR apple_music_link IS NOT NULL)
      AND (custom_links IS NULL OR custom_links = '[]')
    `,
      )
      .all() as any[];

    const updateAlbumLinks = db.prepare(`
      UPDATE albums SET custom_links = ? WHERE id = ?
    `);

    let albumsUpdated = 0;

    albumsWithOldLinks.forEach((album) => {
      const customLinks = [];

      if (album.spotify_link) {
        customLinks.push({
          name: "Spotify",
          url: album.spotify_link,
          color: "#1DB954",
        });
      }

      if (album.apple_music_link) {
        customLinks.push({
          name: "Apple Music",
          url: album.apple_music_link,
          color: "#FA243C",
        });
      }

      if (customLinks.length > 0) {
        updateAlbumLinks.run(JSON.stringify(customLinks), album.id);
        albumsUpdated++;
      }
    });

    // Migrate songs with old spotify/apple music links
    const songsWithOldLinks = db
      .prepare(
        `
      SELECT id, spotify_link, apple_music_link, custom_links 
      FROM songs 
      WHERE (spotify_link IS NOT NULL OR apple_music_link IS NOT NULL)
      AND (custom_links IS NULL OR custom_links = '[]')
    `,
      )
      .all() as any[];

    const updateSongLinks = db.prepare(`
      UPDATE songs SET custom_links = ? WHERE id = ?
    `);

    let songsUpdated = 0;

    songsWithOldLinks.forEach((song) => {
      const customLinks = [];

      if (song.spotify_link) {
        customLinks.push({
          name: "Spotify",
          url: song.spotify_link,
          color: "#1DB954",
        });
      }

      if (song.apple_music_link) {
        customLinks.push({
          name: "Apple Music",
          url: song.apple_music_link,
          color: "#FA243C",
        });
      }

      if (customLinks.length > 0) {
        updateSongLinks.run(JSON.stringify(customLinks), song.id);
        songsUpdated++;
      }
    });

    return NextResponse.json({
      message: "Custom links migrated successfully",
      stats: {
        albums: albumsUpdated,
        songs: songsUpdated,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error migrating links:", error);
    return NextResponse.json(
      { error: "Failed to migrate links" },
      { status: 500 },
    );
  }
}
