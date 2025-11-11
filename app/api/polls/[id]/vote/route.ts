import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

// POST /api/polls/[id]/vote - Vote on a poll option
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = getDb();
  const { id } = await params;

  try {
    const body = await request.json();
    const { optionId, fingerprint } = body;

    if (!optionId || !fingerprint) {
      return NextResponse.json(
        { error: "Option ID and fingerprint are required" },
        { status: 400 }
      );
    }

    // Check if poll exists and is active
    const poll = db.prepare("SELECT * FROM polls WHERE id = ?").get(id);

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    // Type assertion for poll object
    const pollData = poll as { status: string; end_date: string | null; allow_multiple_votes: number };

    if (pollData.status !== "active") {
      return NextResponse.json(
        { error: "Poll is not active" },
        { status: 400 }
      );
    }

    // Check if poll has ended
    if (pollData.end_date) {
      const endDate = new Date(pollData.end_date);
      if (endDate < new Date()) {
        return NextResponse.json(
          { error: "Poll has ended" },
          { status: 400 }
        );
      }
    }

    // Check if option exists for this poll
    const option = db
      .prepare("SELECT * FROM poll_options WHERE id = ? AND poll_id = ?")
      .get(optionId, id);

    if (!option) {
      return NextResponse.json(
        { error: "Option not found" },
        { status: 404 }
      );
    }

    // Hash the fingerprint for privacy
    const hashedFingerprint = crypto
      .createHash("sha256")
      .update(fingerprint)
      .digest("hex");

    // Check if user already voted
    const existingVote = db
      .prepare(
        "SELECT * FROM poll_votes WHERE poll_id = ? AND voter_fingerprint = ?"
      )
      .get(id, hashedFingerprint);

    if (existingVote && pollData.allow_multiple_votes === 0) {
      return NextResponse.json(
        { error: "You have already voted on this poll" },
        { status: 400 }
      );
    }

    // Check if user already voted for this specific option
    const existingOptionVote = db
      .prepare(
        "SELECT * FROM poll_votes WHERE poll_id = ? AND option_id = ? AND voter_fingerprint = ?"
      )
      .get(id, optionId, hashedFingerprint);

    if (existingOptionVote) {
      return NextResponse.json(
        { error: "You have already voted for this option" },
        { status: 400 }
      );
    }

    // Record the vote
    db.prepare(
      "INSERT INTO poll_votes (poll_id, option_id, voter_fingerprint) VALUES (?, ?, ?)"
    ).run(id, optionId, hashedFingerprint);

    // Increment vote count
    db.prepare("UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = ?").run(
      optionId
    );

    // Revalidate polls page
    revalidatePath("/polls");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording vote:", error);
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 }
    );
  }
}

// GET /api/polls/[id]/vote - Check if user has voted
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = getDb();
  const { id } = await params;

  try {
    const { searchParams } = new URL(request.url);
    const fingerprint = searchParams.get("fingerprint");

    if (!fingerprint) {
      return NextResponse.json(
        { error: "Fingerprint is required" },
        { status: 400 }
      );
    }

    // Hash the fingerprint
    const hashedFingerprint = crypto
      .createHash("sha256")
      .update(fingerprint)
      .digest("hex");

    // Check if user has voted
    const votes = db
      .prepare(
        "SELECT option_id FROM poll_votes WHERE poll_id = ? AND voter_fingerprint = ?"
      )
      .all(id, hashedFingerprint);

    return NextResponse.json({
      hasVoted: votes.length > 0,
      votedOptions: votes.map((v: any) => v.option_id),
    });
  } catch (error) {
    console.error("Error checking vote status:", error);
    return NextResponse.json(
      { error: "Failed to check vote status" },
      { status: 500 }
    );
  }
}
