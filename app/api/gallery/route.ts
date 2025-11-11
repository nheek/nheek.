import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import getDb from "@/lib/db";
import { requireAuth } from "@/lib/session";

// GET all gallery images
export async function GET() {
  try {
    const db = getDb();
    const images = db
      .prepare(
        "SELECT * FROM gallery_images ORDER BY display_order ASC, created_at DESC",
      )
      .all();

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 },
    );
  }
}

// POST new gallery image (admin only)
export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { image_url, alt_text, display_order } = body;

    if (!image_url || !alt_text) {
      return NextResponse.json(
        { error: "image_url and alt_text are required" },
        { status: 400 },
      );
    }

    const db = getDb();

    // If no display_order provided, set it to the end
    let order = display_order;
    if (order === undefined || order === null) {
      const maxOrder = db
        .prepare("SELECT MAX(display_order) as max FROM gallery_images")
        .get() as { max: number | null };
      order = (maxOrder?.max || 0) + 1;
    }

    const result = db
      .prepare(
        `
      INSERT INTO gallery_images (image_url, alt_text, display_order)
      VALUES (?, ?, ?)
    `,
      )
      .run(image_url, alt_text, order);

    const newImage = db
      .prepare("SELECT * FROM gallery_images WHERE id = ?")
      .get(result.lastInsertRowid);

    // Revalidate gallery cache
    revalidateTag("gallery");

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error("Error creating gallery image:", error);
    return NextResponse.json(
      { error: "Failed to create gallery image" },
      { status: 500 },
    );
  }
}
