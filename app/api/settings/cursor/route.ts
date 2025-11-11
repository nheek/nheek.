import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";

// GET cursor image URL (public)
export async function GET() {
  try {
    const db = getDb();
    const setting = db
      .prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?")
      .get("cursor_image_url") as { setting_value: string } | undefined;

    return NextResponse.json({
      cursor_image_url:
        setting?.setting_value ||
        "https://flies.nheek.com/uploads/nheek/pfp/pfp-main.jpg",
    });
  } catch (error) {
    console.error("Error fetching cursor setting:", error);
    return NextResponse.json(
      { error: "Failed to fetch cursor image" },
      { status: 500 },
    );
  }
}

// POST update cursor image URL (admin only)
export async function POST(req: Request) {
  try {
    await requireAuth();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { cursor_image_url } = await req.json();

    if (!cursor_image_url || typeof cursor_image_url !== "string") {
      return NextResponse.json(
        { error: "Invalid cursor image URL" },
        { status: 400 },
      );
    }

    const db = getDb();
    db.prepare(
      `INSERT INTO site_settings (setting_key, setting_value, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(setting_key)
       DO UPDATE SET setting_value = ?, updated_at = CURRENT_TIMESTAMP`,
    ).run("cursor_image_url", cursor_image_url, cursor_image_url);

    return NextResponse.json({
      success: true,
      cursor_image_url,
    });
  } catch (error) {
    console.error("Error updating cursor setting:", error);
    return NextResponse.json(
      { error: "Failed to update cursor image" },
      { status: 500 },
    );
  }
}
