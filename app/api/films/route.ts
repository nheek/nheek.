import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { requireAuth } from "../../../lib/session";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// GET all films
export async function GET() {
  try {
    const db = getDb();
    const films = db
      .prepare(
        "SELECT * FROM films ORDER BY display_order ASC, created_at DESC",
      )
      .all();

    return NextResponse.json({ films });
  } catch (error) {
    console.error("Error fetching films:", error);
    return NextResponse.json(
      { error: "Failed to fetch films" },
      { status: 500 },
    );
  }
}

// POST - Create new film
export async function POST(request: NextRequest) {
  try {
    // Verify session
    await requireAuth();

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

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const db = getDb();

    // If no display_order provided, set it to max + 1
    let finalDisplayOrder = display_order;
    if (!finalDisplayOrder) {
      const maxOrder = db
        .prepare("SELECT MAX(display_order) as max FROM films")
        .get() as { max: number | null };
      finalDisplayOrder = (maxOrder?.max || 0) + 1;
    }

    const result = db
      .prepare(
        `INSERT INTO films (title, type, cover_image_url, rating, review, release_year, genre, director, duration, episode_count, watch_date, songs, featured, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
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
        finalDisplayOrder,
      );

    const newFilm = db
      .prepare("SELECT * FROM films WHERE id = ?")
      .get(result.lastInsertRowid);

    // Revalidate films cache
    revalidatePath("/watch", "page");

    return NextResponse.json({ film: newFilm }, { status: 201 });
  } catch (error) {
    console.error("Error creating film:", error);
    return NextResponse.json(
      { error: "Failed to create film" },
      { status: 500 },
    );
  }
}
