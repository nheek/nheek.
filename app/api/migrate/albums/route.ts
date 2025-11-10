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

    // Read albums.json
    const albumsPath = path.join(
      process.cwd(),
      "public",
      "featured-music",
      "albums.json",
    );

    if (!fs.existsSync(albumsPath)) {
      return NextResponse.json(
        { error: "albums.json not found" },
        { status: 404 },
      );
    }

    const albumsData = JSON.parse(fs.readFileSync(albumsPath, "utf-8"));

    const insertAlbum = db.prepare(`
      INSERT OR REPLACE INTO albums (id, title, codename, artist, release_date, cover_image_url, spotify_link, apple_music_link, custom_links, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertSong = db.prepare(`
      INSERT OR REPLACE INTO songs (id, album_id, title, codename, duration, track_order, lyrics, spotify_link, apple_music_link, custom_links)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let albumsCount = 0;
    let songsCount = 0;

    const migrateAlbums = db.transaction(() => {
      albumsData.albums.forEach((album: any) => {
        insertAlbum.run(
          album.id || null,
          album.title,
          album.codename ||
            album.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
          album.artist,
          album.releaseDate || album.release_date,
          album.coverImage || album.cover_image_url,
          album.spotifyLink || album.spotify_link || null,
          album.appleMusicLink || album.apple_music_link || null,
          "[]",
          album.featured ? 1 : 0,
        );
        albumsCount++;

        if (album.songs && Array.isArray(album.songs)) {
          album.songs.forEach((song: any, index: number) => {
            insertSong.run(
              song.id || null,
              album.id,
              song.title,
              song.codename ||
                song.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
              song.duration,
              song.trackNumber || song.track_number || index + 1,
              song.lyrics || null,
              song.spotifyLink || song.spotify_link || null,
              song.appleMusicLink || song.apple_music_link || null,
              "[]",
            );
            songsCount++;
          });
        }
      });
    });

    migrateAlbums();

    return NextResponse.json({
      message: "Albums and songs migrated successfully",
      stats: {
        albums: albumsCount,
        songs: songsCount,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error migrating albums:", error);
    return NextResponse.json(
      { error: "Failed to migrate albums" },
      { status: 500 },
    );
  }
}
