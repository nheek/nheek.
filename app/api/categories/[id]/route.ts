import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";

// GET single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const db = getDb();
    const category = db
      .prepare("SELECT * FROM project_categories WHERE id = ?")
      .get(params.id);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 },
    );
  }
}

// PUT update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 },
      );
    }

    const db = getDb();
    const stmt = db.prepare(`
      UPDATE project_categories 
      SET name = ?, slug = ?, description = ?
      WHERE id = ?
    `);

    const result = stmt.run(name, slug, description || null, params.id);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const updated = db
      .prepare("SELECT * FROM project_categories WHERE id = ?")
      .get(params.id);

    return NextResponse.json({ category: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

// DELETE category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  try {
    const db = getDb();
    const stmt = db.prepare("DELETE FROM project_categories WHERE id = ?");
    const result = stmt.run(params.id);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
