import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { initDb, closeDb } from "@/lib/db";

// Only allow in development
export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in development mode" },
      { status: 403 },
    );
  }

  try {
    const dbPath = path.join(process.cwd(), "data", "nheek.db");

    // Close database connection first
    closeDb();

    // Delete the database file if it exists
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log("Deleted existing database");
    }

    // Delete WAL files if they exist
    const walPath = dbPath + "-wal";
    const shmPath = dbPath + "-shm";
    if (fs.existsSync(walPath)) fs.unlinkSync(walPath);
    if (fs.existsSync(shmPath)) fs.unlinkSync(shmPath);

    // Reinitialize the database with latest schema
    initDb();

    return NextResponse.json({
      message:
        "Database reset successfully! Fresh schema created. You can now run migrations.",
    });
  } catch (error) {
    console.error("Error resetting database:", error);
    return NextResponse.json(
      { error: "Failed to reset database" },
      { status: 500 },
    );
  }
}
