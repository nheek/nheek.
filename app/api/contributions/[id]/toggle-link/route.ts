import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { getDb } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;

    const db = getDb();
    
    // Get current show_link value
    const current = db
      .prepare("SELECT show_link FROM contributions WHERE id = ?")
      .get(id) as { show_link: number } | undefined;

    if (!current) {
      return NextResponse.json(
        { error: "Contribution not found" },
        { status: 404 },
      );
    }

    // Toggle the value
    const newValue = current.show_link === 1 ? 0 : 1;
    
    const stmt = db.prepare(
      `UPDATE contributions SET show_link = ? WHERE id = ?`,
    );

    stmt.run(newValue, id);

    return NextResponse.json({ message: "Link visibility updated" });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating link visibility:", error);
    return NextResponse.json(
      { error: "Failed to update link visibility" },
      { status: 500 },
    );
  }
}
