import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// PUT - Update question (answer it or change status) - Admin only
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await requireAuth();

    const { id } = await context.params;
    const { answer, status } = await request.json();

    const db = getDb();

    // Check if question exists
    const existing = db.prepare("SELECT * FROM qna WHERE id = ?").get(id);

    if (!existing) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    // Update the question
    let query = "UPDATE qna SET ";
    const updates: string[] = [];
    const params: (string | number)[] = [];

    if (answer !== undefined) {
      updates.push("answer = ?");
      params.push(answer);
      updates.push("answered_at = CURRENT_TIMESTAMP");
    }

    if (status !== undefined) {
      updates.push("status = ?");
      params.push(status);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No updates provided" },
        { status: 400 },
      );
    }

    query += updates.join(", ") + " WHERE id = ?";
    params.push(Number(id));

    db.prepare(query).run(...params);

    const updated = db.prepare("SELECT * FROM qna WHERE id = ?").get(id);

    return NextResponse.json({
      message: "Question updated successfully",
      question: updated,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 },
    );
  }
}

// DELETE question - Admin only
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await requireAuth();

    const { id } = await context.params;

    const db = getDb();

    const existing = db.prepare("SELECT * FROM qna WHERE id = ?").get(id);

    if (!existing) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    db.prepare("DELETE FROM qna WHERE id = ?").run(id);

    return NextResponse.json({
      message: "Question deleted successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 },
    );
  }
}
