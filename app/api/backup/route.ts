import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import * as fs from "fs";
import * as path from "path";

export async function GET() {
  try {
    await requireAuth();

    const backupDir = path.join(process.cwd(), "data", "backups");

    if (!fs.existsSync(backupDir)) {
      return NextResponse.json({ backups: [] });
    }

    const files = fs.readdirSync(backupDir);
    const backups = files
      .filter((file) => file.endsWith(".db"))
      .map((file) => {
        const stats = fs.statSync(path.join(backupDir, file));
        return {
          filename: file,
          size: stats.size,
          created: stats.mtime.toISOString(),
        };
      })
      .sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
      );

    return NextResponse.json({ backups });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error listing backups:", error);
    return NextResponse.json(
      { error: "Failed to list backups" },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    await requireAuth();

    const dbPath = path.join(process.cwd(), "data", "nheek.db");
    const backupDir = path.join(process.cwd(), "data", "backups");

    if (!fs.existsSync(dbPath)) {
      return NextResponse.json(
        { error: "Database file not found" },
        { status: 404 },
      );
    }

    // Create backup directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Create backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFilename = `nheek-backup-${timestamp}.db`;
    const backupPath = path.join(backupDir, backupFilename);

    // Copy database file
    fs.copyFileSync(dbPath, backupPath);

    const stats = fs.statSync(backupPath);

    return NextResponse.json({
      message: "Backup created successfully",
      backup: {
        filename: backupFilename,
        size: stats.size,
        created: stats.mtime.toISOString(),
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating backup:", error);
    return NextResponse.json(
      { error: "Failed to create backup" },
      { status: 500 },
    );
  }
}
