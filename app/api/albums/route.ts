import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";

// GET all albums
export async function GET() {
  try {
    const db = getDb();
    const albums = db.prepare(`
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM songs WHERE album_id = a.id) as song_count
      FROM albums a
      ORDER BY release_date DESC
    `).all();

    // Get songs for each album
    const albumsWithSongs = albums.map((album: any) => {
      const songs = db.prepare(`
        SELECT * FROM songs 
        WHERE album_id = ? 
        ORDER BY track_order ASC
      `).all(album.id);
      
      return {
        ...album,
        songs
      };
    });

    return NextResponse.json({ albums: albumsWithSongs });
  } catch (error) {
    console.error("Error fetching albums:", error);
    return NextResponse.json(
      { error: "Failed to fetch albums" },
      { status: 500 },
    );
  }
}

// POST create new album
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const {
      title,
      codename,
      cover_image,
      release_date,
      spotify_link,
      apple_music_link,
      featured,
      custom_links,
    } = body;

    if (!title || !codename || !release_date) {
      return NextResponse.json(
        { error: "Title, codename, and release date are required" },
        { status: 400 },
      );
    }

    const db = getDb();
    const result = db
      .prepare(
        `
      INSERT INTO albums (title, codename, cover_image, release_date, spotify_link, apple_music_link, featured, custom_links)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        title,
        codename,
        cover_image || null,
        release_date,
        spotify_link || null,
        apple_music_link || null,
        featured ? 1 : 0,
        custom_links || "[]",
      );

    const album = db
      .prepare("SELECT * FROM albums WHERE id = ?")
      .get(result.lastInsertRowid);

    return NextResponse.json({ album }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error creating album:", error);
    return NextResponse.json(
      { error: "Failed to create album" },
      { status: 500 },
    );
  }
}
