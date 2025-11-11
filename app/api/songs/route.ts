import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const db = getDb();
    const songs = db
      .prepare(
        `
      SELECT s.*, a.title as album_title, a.codename as album_codename
      FROM songs s 
      LEFT JOIN albums a ON s.album_id = a.id
      ORDER BY a.release_date DESC, s.track_order ASC
    `,
      )
      .all();

    return NextResponse.json({ songs });
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const db = getDb();

    const result = db
      .prepare(
        `
      INSERT INTO songs (album_id, title, codename, duration, spotify_link, apple_music_link, lyrics, track_order, custom_links)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        body.album_id,
        body.title,
        body.codename,
        body.duration,
        body.spotify_link || null,
        body.apple_music_link || null,
        body.lyrics || null,
        body.track_order || 1,
        body.custom_links || "[]",
      );

    const song = db
      .prepare("SELECT * FROM songs WHERE id = ?")
      .get(result.lastInsertRowid);

    // Revalidate music pages
    revalidatePath("/music");
    revalidatePath("/");

    return NextResponse.json({ song }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating song:", error);
    return NextResponse.json(
      { error: "Failed to create song" },
      { status: 500 },
    );
  }
}
