import { fetchProjects } from "@/lib/drupal";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const projects = await fetchProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
