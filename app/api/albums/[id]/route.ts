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
    const album = db.prepare("SELECT * FROM albums WHERE id = ?").get(id);

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    const songs = db
      .prepare("SELECT * FROM songs WHERE album_id = ? ORDER BY track_order")
      .all(id);

    return NextResponse.json({ album, songs });
  } catch (error) {
    console.error("Error fetching album:", error);
    return NextResponse.json(
      { error: "Failed to fetch album" },
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
      UPDATE albums 
      SET title = ?, codename = ?, cover_image_url = ?, release_date = ?, 
          spotify_link = ?, apple_music_link = ?, featured = ?, custom_links = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    ).run(
      body.title,
      body.codename,
      body.cover_image_url || body.cover_image || null,
      body.release_date,
      body.spotify_link || null,
      body.apple_music_link || null,
      body.featured ? 1 : 0,
      body.custom_links || "[]",
      id,
    );

    const album = db.prepare("SELECT * FROM albums WHERE id = ?").get(id);

    // Revalidate music pages
    revalidatePath("/music");
    revalidatePath(`/music/${body.codename}`);
    revalidatePath("/");

    return NextResponse.json({ album });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating album:", error);
    return NextResponse.json(
      { error: "Failed to update album" },
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
    db.prepare("DELETE FROM albums WHERE id = ?").run(id);

    // Revalidate music pages
    revalidatePath("/music");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting album:", error);
    return NextResponse.json(
      { error: "Failed to delete album" },
      { status: 500 },
    );
  }
}
