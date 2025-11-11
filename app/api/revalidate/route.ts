import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const { type } = body; // 'albums', 'projects', or 'all'

    if (type === "albums" || type === "all") {
      // Revalidate all music-related pages
      revalidatePath("/music", "layout");
      revalidatePath("/", "page"); // Homepage for FeaturedMusic
    }

    if (type === "projects" || type === "all") {
      // Revalidate homepage for FeaturedProjects
      revalidatePath("/", "page");
    }

    if (type === "qna" || type === "all") {
      // Revalidate Q&A page
      revalidatePath("/qna", "page");
    }

    if (type === "gallery" || type === "all") {
      // Revalidate Gallery page
      revalidatePath("/gallery", "page");
    }

    return NextResponse.json({
      revalidated: true,
      type,
      now: Date.now(),
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Error revalidating cache:", error);
    return NextResponse.json(
      { error: "Failed to revalidate cache" },
      { status: 500 },
    );
  }
}
