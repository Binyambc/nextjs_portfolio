import { fetchPageBySlug } from "@/lib/drupal";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const page = await fetchPageBySlug(slug);
    
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    
    return NextResponse.json(page);
  } catch (error) {
    console.error("Failed to fetch page:", error);
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}
