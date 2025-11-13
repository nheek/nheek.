import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";

// GET /api/polls - Get all polls (public for active, admin for all)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeAll = searchParams.get("includeAll") === "true";

  try {
    // Check if admin is requesting all polls
    if (includeAll) {
      const auth = await requireAuth();
      if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const db = getDb();

    // Get polls based on status
    const pollsQuery = includeAll
      ? "SELECT * FROM polls ORDER BY created_at DESC"
      : "SELECT * FROM polls WHERE status = 'active' ORDER BY created_at DESC";

    const polls = db.prepare(pollsQuery).all();

    // For each poll, get its options
    const pollsWithOptions = polls.map((poll: any) => {
      const options = db
        .prepare(
          "SELECT * FROM poll_options WHERE poll_id = ? ORDER BY display_order",
        )
        .all(poll.id);

      // Calculate total votes
      const totalVotes = options.reduce(
        (sum: number, opt: any) => sum + (opt.vote_count || 0),
        0,
      );

      return {
        ...(poll as object),
        options,
        totalVotes,
      };
    });

    return NextResponse.json(pollsWithOptions);
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json(
      { error: "Failed to fetch polls" },
      { status: 500 },
    );
  }
}

// POST /api/polls - Create new poll (admin only)
export async function POST(request: Request) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();

  try {
    const body = await request.json();
    const {
      title,
      description,
      status = "active",
      allow_multiple_votes = 0,
      end_date,
      options,
    } = body;

    if (!title || !options || options.length < 2) {
      return NextResponse.json(
        { error: "Title and at least 2 options are required" },
        { status: 400 },
      );
    }

    // Insert poll
    const insertPoll = db.prepare(`
      INSERT INTO polls (title, description, status, allow_multiple_votes, end_date)
      VALUES (?, ?, ?, ?, ?)
    `);

    const pollResult = insertPoll.run(
      title,
      description || null,
      status,
      allow_multiple_votes,
      end_date || null,
    );

    const pollId = pollResult.lastInsertRowid;

    // Insert options
    const insertOption = db.prepare(`
      INSERT INTO poll_options (poll_id, name, description, image_url, link, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    options.forEach((option: any, index: number) => {
      insertOption.run(
        pollId,
        option.name,
        option.description || null,
        option.image_url || null,
        option.link || null,
        index,
      );
    });

    // Fetch the created poll with options
    const createdPoll = db
      .prepare("SELECT * FROM polls WHERE id = ?")
      .get(pollId);

    const pollOptions = db
      .prepare(
        "SELECT * FROM poll_options WHERE poll_id = ? ORDER BY display_order",
      )
      .all(pollId);

    // Revalidate polls page
    revalidatePath("/polls");

    return NextResponse.json({
      ...(createdPoll as object),
      options: pollOptions,
      totalVotes: 0,
    });
  } catch (error) {
    console.error("Error creating poll:", error);
    return NextResponse.json(
      { error: "Failed to create poll" },
      { status: 500 },
    );
  }
}
