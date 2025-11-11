import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const db = getDb();
    const projects = db
      .prepare(
        `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM projects p 
      LEFT JOIN project_categories c ON p.category_id = c.id
      ORDER BY p.display_order, p.created_at DESC
    `,
      )
      .all();

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
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
      INSERT INTO projects (title, codename, description, category_id, image_url, github_link, live_link, featured, display_order, date_added)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        body.title,
        body.codename,
        body.description || null,
        body.category_id || null,
        body.image_url || null,
        body.github_link || null,
        body.live_link || null,
        body.featured ? 1 : 0,
        body.display_order || 0,
        body.date_added || null,
      );

    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(result.lastInsertRowid);

    // Revalidate home page (featured projects)
    revalidatePath("/");

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
