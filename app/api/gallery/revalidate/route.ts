import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/session";

export async function POST(req: Request) {
  try {
    await requireAuth();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Revalidate the gallery page
    revalidatePath("/gallery");

    return NextResponse.json({
      success: true,
      message: "Gallery cache cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing gallery cache:", error);
    return NextResponse.json(
      { error: "Failed to clear cache" },
      { status: 500 },
    );
  }
}
