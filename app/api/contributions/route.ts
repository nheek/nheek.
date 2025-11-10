import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import crypto from "crypto";

const VALID_CATEGORIES = [
  "graffiti",
  "guestbook",
  "song",
  "star",
  "fortune",
];

// GET - Fetch approved contributions (public)
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status"); // for admin

    let query = "SELECT * FROM contributions";
    const conditions: string[] = [];
    const params: string[] = [];

    // Public users only see approved
    if (status !== "all") {
      if (status === "pending" || status === "approved") {
        conditions.push("status = ?");
        params.push(status);
      } else {
        conditions.push("status = 'approved'");
      }
    }

    if (category && VALID_CATEGORIES.includes(category)) {
      conditions.push("category = ?");
      params.push(category);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC";

    const stmt = db.prepare(query);
    const contributions = stmt.all(...params);

    return NextResponse.json({ contributions });
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: 500 },
    );
  }
}

// POST - Submit new contribution
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, content, website_url, fingerprint } = body;

    // Validation
    if (!name || !category || !content || !fingerprint) {
      return NextResponse.json(
        { error: "Name, category, content, and fingerprint are required" },
        { status: 400 },
      );
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 },
      );
    }

    // Validate content length based on category
    const maxLengths: Record<string, number> = {
      graffiti: 50, // Short tag
      guestbook: 200, // Medium message
      song: 100, // Song name + artist
      star: 150, // Short wish
      fortune: 200, // Wisdom/quote
    };

    if (content.length > maxLengths[category]) {
      return NextResponse.json(
        {
          error: `Content too long. Max ${maxLengths[category]} characters for ${category}`,
        },
        { status: 400 },
      );
    }

    // Hash the fingerprint for privacy
    const fingerprintHash = crypto
      .createHash("sha256")
      .update(fingerprint)
      .digest("hex");

    const db = getDb();

    // Check if user already submitted in this category
    const existing = db
      .prepare(
        "SELECT id FROM contributions WHERE fingerprint_hash = ? AND category = ?",
      )
      .get(fingerprintHash, category);

    if (existing) {
      return NextResponse.json(
        {
          error: `You've already submitted a ${category} entry. Only one per category!`,
        },
        { status: 409 },
      );
    }

    // Insert contribution
    const stmt = db.prepare(
      `INSERT INTO contributions (name, category, content, website_url, fingerprint_hash, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
    );

    const result = stmt.run(
      name,
      category,
      content,
      website_url || null,
      fingerprintHash,
    );

    return NextResponse.json(
      {
        message:
          "Contribution submitted! It will appear after admin approval.",
        id: result.lastInsertRowid,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating contribution:", error);
    return NextResponse.json(
      { error: "Failed to submit contribution" },
      { status: 500 },
    );
  }
}
