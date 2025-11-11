import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const db = getDb();
    const song = db
      .prepare(
        `
      SELECT s.*, a.title as album_title, a.codename as album_codename
      FROM songs s
      LEFT JOIN albums a ON s.album_id = a.id
      WHERE s.id = ?
    `,
      )
      .get(id);

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    return NextResponse.json({ song });
  } catch (error) {
    console.error("Error fetching song:", error);
    return NextResponse.json(
      { error: "Failed to fetch song" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;

    const body = await request.json();
    const db = getDb();

    db.prepare(
      `
      UPDATE songs 
      SET title = ?, codename = ?, duration = ?, spotify_link = ?, 
          apple_music_link = ?, lyrics = ?, track_order = ?, custom_links = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    ).run(
      body.title,
      body.codename,
      body.duration,
      body.spotify_link || null,
      body.apple_music_link || null,
      body.lyrics || null,
      body.track_order,
      body.custom_links || "[]",
      id,
    );

    const song = db.prepare("SELECT * FROM songs WHERE id = ?").get(id);

    // Revalidate music pages
    revalidatePath("/music");
    revalidatePath("/");

    return NextResponse.json({ song });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating song:", error);
    return NextResponse.json(
      { error: "Failed to update song" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;

    const db = getDb();
    db.prepare("DELETE FROM songs WHERE id = ?").run(id);

    // Revalidate music pages
    revalidatePath("/music");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting song:", error);
    return NextResponse.json(
      { error: "Failed to delete song" },
      { status: 500 },
    );
  }
}
