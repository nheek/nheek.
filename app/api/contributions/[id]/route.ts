import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { getDb } from "@/lib/db";

// PATCH - Approve contribution
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;

    const db = getDb();
    const stmt = db.prepare(
      `UPDATE contributions 
       SET status = 'approved', approved_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
    );

    const result = stmt.run(id);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Contribution not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Contribution approved" });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error approving contribution:", error);
    return NextResponse.json(
      { error: "Failed to approve contribution" },
      { status: 500 },
    );
  }
}

// DELETE - Reject/delete contribution
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;

    const db = getDb();
    const stmt = db.prepare("DELETE FROM contributions WHERE id = ?");
    const result = stmt.run(id);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Contribution not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Contribution deleted" });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting contribution:", error);
    return NextResponse.json(
      { error: "Failed to delete contribution" },
      { status: 500 },
    );
  }
}
