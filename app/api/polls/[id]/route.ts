import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { revalidatePath } from "next/cache";

// GET /api/polls/[id] - Get single poll with options
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = getDb();
  const { id } = await params;

  try {
    const poll = db.prepare("SELECT * FROM polls WHERE id = ?").get(id);

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    const options = db
      .prepare(
        "SELECT * FROM poll_options WHERE poll_id = ? ORDER BY display_order"
      )
      .all(id);

    const totalVotes = options.reduce(
      (sum: number, opt: any) => sum + (opt.vote_count || 0),
      0
    );

    return NextResponse.json({
      ...poll,
      options,
      totalVotes,
    });
  } catch (error) {
    console.error("Error fetching poll:", error);
    return NextResponse.json(
      { error: "Failed to fetch poll" },
      { status: 500 }
    );
  }
}

// PUT /api/polls/[id] - Update poll (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const { id } = await params;

  try {
    const body = await request.json();
    const {
      title,
      description,
      status,
      allow_multiple_votes,
      end_date,
      options,
    } = body;

    // Update poll
    if (title !== undefined) {
      const updatePoll = db.prepare(`
        UPDATE polls 
        SET title = ?, description = ?, status = ?, allow_multiple_votes = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      updatePoll.run(
        title,
        description || null,
        status || "active",
        allow_multiple_votes || 0,
        end_date || null,
        id
      );
    }

    // Update options if provided
    if (options && Array.isArray(options)) {
      // Delete existing options
      db.prepare("DELETE FROM poll_options WHERE poll_id = ?").run(id);

      // Insert new options
      const insertOption = db.prepare(`
        INSERT INTO poll_options (poll_id, name, description, image_url, link, display_order, vote_count)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      options.forEach((option: any, index: number) => {
        insertOption.run(
          id,
          option.name,
          option.description || null,
          option.image_url || null,
          option.link || null,
          index,
          option.vote_count || 0
        );
      });
    }

    // Revalidate polls page
    revalidatePath("/polls");

    // Fetch updated poll
    const updatedPoll = db
      .prepare("SELECT * FROM polls WHERE id = ?")
      .get(id);

    const pollOptions = db
      .prepare(
        "SELECT * FROM poll_options WHERE poll_id = ? ORDER BY display_order"
      )
      .all(id);

    const totalVotes = pollOptions.reduce(
      (sum: number, opt: any) => sum + (opt.vote_count || 0),
      0
    );

    return NextResponse.json({
      ...updatedPoll,
      options: pollOptions,
      totalVotes,
    });
  } catch (error) {
    console.error("Error updating poll:", error);
    return NextResponse.json(
      { error: "Failed to update poll" },
      { status: 500 }
    );
  }
}

// DELETE /api/polls/[id] - Delete poll (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const { id } = await params;

  try {
    // Delete poll (cascade will delete options and votes)
    const result = db.prepare("DELETE FROM polls WHERE id = ?").run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    // Revalidate polls page
    revalidatePath("/polls");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting poll:", error);
    return NextResponse.json(
      { error: "Failed to delete poll" },
      { status: 500 }
    );
  }
}
