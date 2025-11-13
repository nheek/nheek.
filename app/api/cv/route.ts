import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const db = getDb();
    const cv = db
      .prepare("SELECT * FROM cv ORDER BY date_from DESC, id DESC")
      .all();
    return NextResponse.json({ cv });
  } catch (error) {
    console.error("Error fetching CV entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch CV entries" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const {
      company,
      position,
      date_from,
      date_to,
      present,
      link,
      description,
      location,
    } = await req.json();
    const stmt = db.prepare(`
      INSERT INTO cv (company, position, date_from, date_to, present, link, description, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      company,
      position,
      date_from,
      date_to ?? null,
      present ? 1 : 0,
      link,
      description,
      location,
    );
    revalidatePath("/cv");
    return NextResponse.json({ id: info.lastInsertRowid });
  } catch (error) {
    console.error("Error creating CV entry:", error);
    return NextResponse.json(
      { error: "Failed to create CV entry" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const {
      id,
      company,
      position,
      date_from,
      date_to,
      present,
      link,
      description,
      location,
    } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const stmt = db.prepare(`
      UPDATE cv SET company = ?, position = ?, date_from = ?, date_to = ?, present = ?, link = ?, description = ?, location = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    stmt.run(
      company,
      position,
      date_from,
      date_to ?? null,
      present ? 1 : 0,
      link,
      description,
      location,
      id,
    );
    revalidatePath("/cv");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating CV entry:", error);
    return NextResponse.json(
      { error: "Failed to update CV entry" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const stmt = db.prepare("DELETE FROM cv WHERE id = ?");
    stmt.run(id);
    revalidatePath("/cv");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting CV entry:", error);
    return NextResponse.json(
      { error: "Failed to delete CV entry" },
      { status: 500 },
    );
  }
}
