import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { requireAuth } from "../../../../lib/session";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

// GET single film
export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const { id } = await params;
    const db = getDb();
    const film = db.prepare("SELECT * FROM films WHERE id = ?").get(id);

    if (!film) {
      return NextResponse.json({ error: "Film not found" }, { status: 404 });
    }

    return NextResponse.json({ film });
  } catch (error) {
    console.error("Error fetching film:", error);
    return NextResponse.json(
      { error: "Failed to fetch film" },
      { status: 500 },
    );
  }
}

// PUT - Update film
export async function PUT(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    // Verify session
    await requireAuth();

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      type,
      cover_image_url,
      rating,
      review,
      release_year,
      genre,
      director,
      duration,
      episode_count,
      watch_date,
      songs,
      featured,
      display_order,
    } = body;

    const db = getDb();

    // Check if film exists
    const existing = db.prepare("SELECT * FROM films WHERE id = ?").get(id);
    if (!existing) {
      return NextResponse.json({ error: "Film not found" }, { status: 404 });
    }

    db.prepare(
      `UPDATE films SET 
        title = ?, type = ?, cover_image_url = ?, rating = ?, review = ?,
        release_year = ?, genre = ?, director = ?, duration = ?, episode_count = ?,
        watch_date = ?, songs = ?, featured = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
    ).run(
      title,
      type,
      cover_image_url || null,
      rating || null,
      review || null,
      release_year || null,
      genre || null,
      director || null,
      duration || null,
      episode_count || null,
      watch_date || null,
      songs || null,
      featured ? 1 : 0,
      display_order || null,
      id,
    );

    const updatedFilm = db.prepare("SELECT * FROM films WHERE id = ?").get(id);

    // Revalidate cache
    revalidateTag("films");
    revalidateTag(`film-${id}`);

    return NextResponse.json({ film: updatedFilm });
  } catch (error) {
    console.error("Error updating film:", error);
    return NextResponse.json(
      { error: "Failed to update film" },
      { status: 500 },
    );
  }
}

// DELETE - Delete film
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    // Verify session
    await requireAuth();

    const { id } = await params;
    const db = getDb();

    // Check if film exists
    const existing = db.prepare("SELECT * FROM films WHERE id = ?").get(id);
    if (!existing) {
      return NextResponse.json({ error: "Film not found" }, { status: 404 });
    }

    db.prepare("DELETE FROM films WHERE id = ?").run(id);

    // Revalidate cache
    revalidateTag("films");
    revalidateTag(`film-${id}`);

    return NextResponse.json({ message: "Film deleted successfully" });
  } catch (error) {
    console.error("Error deleting film:", error);
    return NextResponse.json(
      { error: "Failed to delete film" },
      { status: 500 },
    );
  }
}
