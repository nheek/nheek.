import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAuth } from "@/lib/session";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// PUT update gallery image (admin only)
export async function PUT(request: Request, context: RouteContext) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const { image_url, alt_text, display_order } = body;

    const db = getDb();

    // Check if image exists
    const existingImage = db
      .prepare("SELECT * FROM gallery_images WHERE id = ?")
      .get(id);

    if (!existingImage) {
      return NextResponse.json(
        { error: "Gallery image not found" },
        { status: 404 },
      );
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (image_url !== undefined) {
      updates.push("image_url = ?");
      values.push(image_url);
    }
    if (alt_text !== undefined) {
      updates.push("alt_text = ?");
      values.push(alt_text);
    }
    if (display_order !== undefined) {
      updates.push("display_order = ?");
      values.push(display_order);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");

    if (updates.length === 1) {
      // Only updated_at, nothing to update
      return NextResponse.json(existingImage);
    }

    values.push(id);

    db.prepare(
      `UPDATE gallery_images SET ${updates.join(", ")} WHERE id = ?`,
    ).run(...values);

    const updatedImage = db
      .prepare("SELECT * FROM gallery_images WHERE id = ?")
      .get(id);

    return NextResponse.json(updatedImage);
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return NextResponse.json(
      { error: "Failed to update gallery image" },
      { status: 500 },
    );
  }
}

// DELETE gallery image (admin only)
export async function DELETE(request: Request, context: RouteContext) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const db = getDb();

    const existingImage = db
      .prepare("SELECT * FROM gallery_images WHERE id = ?")
      .get(id);

    if (!existingImage) {
      return NextResponse.json(
        { error: "Gallery image not found" },
        { status: 404 },
      );
    }

    db.prepare("DELETE FROM gallery_images WHERE id = ?").run(id);

    return NextResponse.json({ message: "Gallery image deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery image" },
      { status: 500 },
    );
  }
}
