import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const db = getDb();
    const project = db
      .prepare(
        `
      SELECT p.*, c.name as category_name 
      FROM projects p 
      LEFT JOIN project_categories c ON p.category_id = c.id
      WHERE p.id = ?
    `,
      )
      .get(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;

    const body = await request.json();
    const db = getDb();

    db.prepare(
      `
      UPDATE projects 
      SET title = ?, codename = ?, description = ?, category_id = ?, 
          image_url = ?, github_link = ?, live_link = ?, featured = ?, 
          display_order = ?, date_added = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    ).run(
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
      id,
    );

    const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(id);

    // Revalidate home page (featured projects)
    revalidatePath("/");

    return NextResponse.json({ project });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;

    const db = getDb();
    db.prepare("DELETE FROM projects WHERE id = ?").run(id);

    // Revalidate home page (featured projects)
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
