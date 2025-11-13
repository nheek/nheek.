import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

// GET all skills
export async function GET() {
  try {
    const db = getDb();
    const skills = db.prepare("SELECT * FROM skills ORDER BY name ASC").all();
    return NextResponse.json({ skills });
  } catch {
    console.error("Error fetching skills");
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 },
    );
  }
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
  } catch {
    return NextResponse.json(
      { error: "Skill already exists or error" },
      { status: 400 },
    );
  }
}
