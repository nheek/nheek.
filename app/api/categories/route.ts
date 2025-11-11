import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const db = getDb();
    const categories = db
      .prepare("SELECT * FROM project_categories ORDER BY name")
      .all();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const db = getDb();

    const result = db
      .prepare(
        `
      INSERT INTO project_categories (name, slug, description)
      VALUES (?, ?, ?)
    `,
      )
      .run(body.name, body.slug, body.description || null);

    const category = db
      .prepare("SELECT * FROM project_categories WHERE id = ?")
      .get(result.lastInsertRowid);

    // Revalidate home page (featured projects)
    revalidatePath("/");

    return NextResponse.json({ category }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
