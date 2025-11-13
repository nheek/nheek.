import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function POST(req: NextRequest) {
  const db = getDb();
  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!Array.isArray(data)) {
    return NextResponse.json(
      { error: "Expected an array of links" },
      { status: 400 },
    );
  }
  const insert = db.prepare(
    "INSERT INTO links (name, url, desc, color, display_order) VALUES (?, ?, ?, ?, ?)",
  );
  let imported = 0;
  for (const link of data) {
    if (typeof link.name === "string" && typeof link.url === "string") {
      insert.run(
        link.name,
        link.url,
        link.desc ?? null,
        link.color ?? null,
        link.display_order ?? null,
      );
      imported++;
    }
  }
  return NextResponse.json({ imported });
}
