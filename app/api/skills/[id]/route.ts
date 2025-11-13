import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// GET, PATCH, DELETE for individual skill
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const db = getDb();
  const skill = db.prepare("SELECT * FROM skills WHERE id = ?").get(params.id);
  if (!skill) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ skill });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await requireAuth();
  const db = getDb();
  const { name, description } = await request.json();
  db.prepare(
    "UPDATE skills SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
  ).run(name, description, params.id);
  revalidatePath("/skills");
  revalidatePath(`/skills/${name}`);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await requireAuth();
  const db = getDb();
  db.prepare("DELETE FROM skills WHERE id = ?").run(params.id);
  revalidatePath("/skills");
  return NextResponse.json({ success: true });
}
