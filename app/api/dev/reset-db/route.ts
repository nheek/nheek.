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
    const dataDir = path.join(process.cwd(), "data");
    const dbPath = path.join(dataDir, "nheek.db");
    const backupDir = path.join(dataDir, "backups");
    const tempBackupDir = path.join(process.cwd(), "temp-backups");

    // Create backup first if database exists
    let backupName = null;
    if (fs.existsSync(dbPath)) {
      // Ensure temp backup directory exists
      if (!fs.existsSync(tempBackupDir)) {
        fs.mkdirSync(tempBackupDir, { recursive: true });
      }

      // Create backup with timestamp in temp location
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      backupName = `backup-before-reset-${timestamp}.db`;
      const tempBackupPath = path.join(tempBackupDir, backupName);

      fs.copyFileSync(dbPath, tempBackupPath);
      console.log(`Created backup in temp location: ${backupName}`);
    }

    // Close database connection first
    closeDb();

    // Delete entire data directory
    if (fs.existsSync(dataDir)) {
      fs.rmSync(dataDir, { recursive: true, force: true });
      console.log("Deleted data directory");
    }

    // Recreate data directory structure
    fs.mkdirSync(dataDir, { recursive: true });
    fs.mkdirSync(backupDir, { recursive: true });

    // Move backup from temp to proper location
    if (backupName) {
      const tempBackupPath = path.join(tempBackupDir, backupName);
      const finalBackupPath = path.join(backupDir, backupName);
      fs.copyFileSync(tempBackupPath, finalBackupPath);
      console.log(`Moved backup to: ${finalBackupPath}`);

      // Clean up temp directory
      fs.rmSync(tempBackupDir, { recursive: true, force: true });
    }

    // Reinitialize the database with latest schema
    initDb();

    return NextResponse.json({
      message: backupName
        ? `Database reset successfully! Backup saved as: ${backupName}\n\nFresh schema created with track_order column. You can now run migrations.`
        : "Database reset successfully! Fresh schema created with track_order column. You can now run migrations.",
      backup: backupName,
    });
  } catch (error) {
    console.error("Error resetting database:", error);
    return NextResponse.json(
      { error: "Failed to reset database" },
      { status: 500 },
    );
  }
}
