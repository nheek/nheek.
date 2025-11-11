import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import * as fs from "fs";
import * as path from "path";

// This endpoint can be called by a cron job or external scheduler
// No auth required for automated calls, but should be secured via API key or environment check
export async function POST(request: Request) {
  try {
    // Simple security: check for a secret key in headers or environment
    const authHeader = request.headers.get("x-cron-secret");
    const cronSecret = process.env.CRON_SECRET || "change_me_in_production";

    if (authHeader !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();

    // Check if auto backup is enabled
    const autoBackupEnabled = db
      .prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?")
      .get("auto_backup_enabled") as { setting_value: string } | undefined;

    if (autoBackupEnabled?.setting_value !== "true") {
      return NextResponse.json({
        message: "Auto backup is disabled",
        skipped: true,
      });
    }

    // Check last backup time
    const lastBackup = db
      .prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?")
      .get("last_auto_backup") as { setting_value: string } | undefined;

    const backupInterval = db
      .prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?")
      .get("backup_interval_hours") as { setting_value: string } | undefined;

    const intervalHours = parseInt(backupInterval?.setting_value || "24");
    const intervalMs = intervalHours * 60 * 60 * 1000;

    if (lastBackup?.setting_value) {
      const lastBackupTime = new Date(lastBackup.setting_value).getTime();
      const now = Date.now();
      const timeSinceLastBackup = now - lastBackupTime;

      if (timeSinceLastBackup < intervalMs) {
        return NextResponse.json({
          message: "Backup interval not reached yet",
          skipped: true,
          nextBackupIn: intervalMs - timeSinceLastBackup,
        });
      }
    }

    // Create the backup
    const dbPath = path.join(process.cwd(), "data", "nheek.db");
    const backupDir = path.join(process.cwd(), "data", "backups");

    if (!fs.existsSync(dbPath)) {
      return NextResponse.json(
        { error: "Database file not found" },
        { status: 404 },
      );
    }

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFilename = `nheek-auto-backup-${timestamp}.db`;
    const backupPath = path.join(backupDir, backupFilename);

    fs.copyFileSync(dbPath, backupPath);

    // Update last backup time
    db.prepare(
      `
      INSERT INTO site_settings (setting_key, setting_value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(setting_key) DO UPDATE SET
        setting_value = excluded.setting_value,
        updated_at = CURRENT_TIMESTAMP
    `,
    ).run("last_auto_backup", new Date().toISOString());

    // Clean up old backups
    await cleanupOldBackups(db, backupDir);

    const stats = fs.statSync(backupPath);

    return NextResponse.json({
      message: "Auto backup created successfully",
      backup: {
        filename: backupFilename,
        size: stats.size,
        created: stats.mtime.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating auto backup:", error);
    return NextResponse.json(
      { error: "Failed to create auto backup" },
      { status: 500 },
    );
  }
}

async function cleanupOldBackups(
  db: ReturnType<typeof getDb>,
  backupDir: string,
) {
  try {
    const maxBackups = db
      .prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?")
      .get("max_backups_to_keep") as { setting_value: string } | undefined;

    const maxToKeep = parseInt(maxBackups?.setting_value || "10");

    const files = fs.readdirSync(backupDir);
    const autoBackups = files
      .filter((file) => file.startsWith("nheek-auto-backup-") && file.endsWith(".db"))
      .map((file) => ({
        filename: file,
        path: path.join(backupDir, file),
        created: fs.statSync(path.join(backupDir, file)).mtime,
      }))
      .sort((a, b) => b.created.getTime() - a.created.getTime());

    // Keep only the most recent maxToKeep backups
    if (autoBackups.length > maxToKeep) {
      const toDelete = autoBackups.slice(maxToKeep);
      for (const backup of toDelete) {
        fs.unlinkSync(backup.path);
        console.log(`Deleted old backup: ${backup.filename}`);
      }
    }
  } catch (error) {
    console.error("Error cleaning up old backups:", error);
  }
}
