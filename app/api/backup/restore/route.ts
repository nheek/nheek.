import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import * as fs from "fs";
import * as path from "path";

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 },
      );
    }

    const dbPath = path.join(process.cwd(), "data", "nheek.db");
    const backupPath = path.join(
      process.cwd(),
      "data",
      "backups",
      filename,
    );

    if (!fs.existsSync(backupPath)) {
      return NextResponse.json(
        { error: "Backup file not found" },
        { status: 404 },
      );
    }

    // Create a backup of current database before restoring
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const autoBackupFilename = `nheek-auto-backup-before-restore-${timestamp}.db`;
    const autoBackupPath = path.join(
      process.cwd(),
      "data",
      "backups",
      autoBackupFilename,
    );

    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, autoBackupPath);
    }

    // Restore the backup
    fs.copyFileSync(backupPath, dbPath);

    return NextResponse.json({
      message: "Database restored successfully",
      restoredFrom: filename,
      autoBackup: autoBackupFilename,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error restoring backup:", error);
    return NextResponse.json(
      { error: "Failed to restore backup" },
      { status: 500 },
    );
  }
}
