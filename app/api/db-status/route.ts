import { NextResponse } from "next/server";
import { existsSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const dbPath = join(process.cwd(), "data", "nheek.db");
    const exists = existsSync(dbPath);

    return NextResponse.json({ exists });
  } catch (error) {
    console.error("Error checking database:", error);
    return NextResponse.json({ exists: false });
  }
}
