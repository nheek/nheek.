import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET() {
  const db = getDb();
  const cv = db
    .prepare("SELECT * FROM cv ORDER BY date_from DESC, id DESC")
    .all();
  return NextResponse.json({ cv });
}

export async function POST(req: NextRequest) {
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
}

export async function PUT(req: NextRequest) {
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
}

export async function DELETE(req: NextRequest) {
  const db = getDb();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const stmt = db.prepare("DELETE FROM cv WHERE id = ?");
  stmt.run(id);
  revalidatePath("/cv");
  return NextResponse.json({ success: true });
}
