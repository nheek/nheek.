import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import * as fs from "fs";
import * as path from "path";

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth();

    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 },
      );
    }

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

    fs.unlinkSync(backupPath);

    return NextResponse.json({
      message: "Backup deleted successfully",
      filename,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting backup:", error);
    return NextResponse.json(
      { error: "Failed to delete backup" },
      { status: 500 },
    );
  }
}
