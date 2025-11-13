import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

// GET all skills
export async function GET() {
  const db = getDb();
  const skills = db.prepare("SELECT * FROM skills ORDER BY name ASC").all();
  return NextResponse.json({ skills });
}

// POST create a new skill
export async function POST(request: NextRequest) {
  const db = getDb();
  const { name, description } = await request.json();
  try {
    const stmt = db.prepare(
      "INSERT INTO skills (name, description) VALUES (?, ?)",
    );
    stmt.run(name, description || "");
    revalidatePath("/skills");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Skill already exists or error" },
      { status: 400 },
    );
  }
}
