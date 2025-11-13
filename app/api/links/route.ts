import { NextRequest, NextResponse } from "next/server";
import getDb from "../../../lib/db";

export async function GET() {
  const db = getDb();
  const links = db.prepare("SELECT id, name, url, desc, color, display_order FROM links ORDER BY display_order ASC, id ASC").all();
  return NextResponse.json({ links });
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const { name, url, desc, color, display_order } = await req.json();
  const stmt = db.prepare("INSERT INTO links (name, url, desc, color, display_order) VALUES (?, ?, ?, ?, ?)");
  const info = stmt.run(name, url, desc ?? "", color, display_order ?? null);
  return NextResponse.json({ id: info.lastInsertRowid });
}

export async function PUT(req: NextRequest) {
  const db = getDb();
  const { id, name, url, desc, color, display_order } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const stmt = db.prepare("UPDATE links SET name = ?, url = ?, desc = ?, color = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
  stmt.run(name, url, desc ?? "", color, display_order ?? null, id);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const db = getDb();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const stmt = db.prepare("DELETE FROM links WHERE id = ?");
  stmt.run(id);
  return NextResponse.json({ success: true });
}
