import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { getDb } from "@/lib/db";

// Get current backup schedule settings
export async function GET() {
  try {
    await requireAuth();

    const db = getDb();

    const autoBackupEnabled = db
      .prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?")
      .get("auto_backup_enabled") as { setting_value: string } | undefined;

    const backupInterval = db
      .prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?")
      .get("backup_interval_hours") as { setting_value: string } | undefined;

    const lastBackup = db
      .prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?")
      .get("last_auto_backup") as { setting_value: string } | undefined;

    const maxBackups = db
      .prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?")
      .get("max_backups_to_keep") as { setting_value: string } | undefined;

    return NextResponse.json({
      autoBackupEnabled: autoBackupEnabled?.setting_value === "true",
      backupIntervalHours: parseInt(backupInterval?.setting_value || "24"),
      lastAutoBackup: lastBackup?.setting_value || null,
      maxBackupsToKeep: parseInt(maxBackups?.setting_value || "10"),
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching backup schedule:", error);
    return NextResponse.json(
      { error: "Failed to fetch backup schedule" },
      { status: 500 },
    );
  }
}

// Update backup schedule settings
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const { autoBackupEnabled, backupIntervalHours, maxBackupsToKeep } =
      await request.json();

    const db = getDb();

    // Update or insert settings
    const upsertSetting = db.prepare(`
      INSERT INTO site_settings (setting_key, setting_value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(setting_key) DO UPDATE SET
        setting_value = excluded.setting_value,
        updated_at = CURRENT_TIMESTAMP
    `);

    if (autoBackupEnabled !== undefined) {
      upsertSetting.run("auto_backup_enabled", String(autoBackupEnabled));
    }

    if (backupIntervalHours !== undefined) {
      const hours = parseInt(backupIntervalHours);
      if (hours < 1 || hours > 168) {
        // Max 1 week
        return NextResponse.json(
          { error: "Backup interval must be between 1 and 168 hours" },
          { status: 400 },
        );
      }
      upsertSetting.run("backup_interval_hours", String(hours));
    }

    if (maxBackupsToKeep !== undefined) {
      const max = parseInt(maxBackupsToKeep);
      if (max < 1 || max > 100) {
        return NextResponse.json(
          { error: "Max backups must be between 1 and 100" },
          { status: 400 },
        );
      }
      upsertSetting.run("max_backups_to_keep", String(max));
    }

    return NextResponse.json({
      message: "Backup schedule updated successfully",
      settings: {
        autoBackupEnabled,
        backupIntervalHours,
        maxBackupsToKeep,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating backup schedule:", error);
    return NextResponse.json(
      { error: "Failed to update backup schedule" },
      { status: 500 },
    );
  }
}
