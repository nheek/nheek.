import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";

type QnA = {
  id: number;
  question: string;
  answer: string | null;
  asker_name: string | null;
  status: string;
  created_at: string;
  answered_at: string | null;
};

// GET all answered questions (public) or all questions (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    // Check if user is authenticated (admin)
    let isAdmin = false;
    try {
      await requireAuth();
      isAdmin = true;
    } catch {
      // Not authenticated, proceed as public user
    }

    const db = getDb();

    let query = "SELECT * FROM qna";
    const params: string[] = [];

    if (!isAdmin) {
      // Public users only see answered questions
      query += " WHERE status = 'answered'";
    } else if (statusFilter) {
      query += " WHERE status = ?";
      params.push(statusFilter);
    }

    query += " ORDER BY created_at DESC";

    const questions = db.prepare(query).all(...params) as QnA[];

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching Q&A:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 },
    );
  }
}

// POST new question (public)
export async function POST(request: NextRequest) {
  try {
    const { question, asker_name } = await request.json();

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 },
      );
    }

    if (question.length > 500) {
      return NextResponse.json(
        { error: "Question is too long (max 500 characters)" },
        { status: 400 },
      );
    }

    const db = getDb();

    const result = db
      .prepare(
        "INSERT INTO qna (question, asker_name, status) VALUES (?, ?, 'pending')",
      )
      .run(question.trim(), asker_name?.trim() || null);

    const newQuestion = db
      .prepare("SELECT * FROM qna WHERE id = ?")
      .get(result.lastInsertRowid) as QnA;

    return NextResponse.json(
      {
        message: "Question submitted successfully",
        question: newQuestion,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error submitting question:", error);
    return NextResponse.json(
      { error: "Failed to submit question" },
      { status: 500 },
    );
  }
}
