import { NextRequest, NextResponse } from "next/server";
import { suggestProjects } from "@/lib/suggest/matcher";

export async function POST(req: NextRequest) {
  try {
    const { resumeData, scholarData } = await req.json();

    if (!resumeData || !scholarData) {
      return NextResponse.json({ error: "Resume and Scholar data are required" }, { status: 400 });
    }

    const input = {
      skills: resumeData.skills || [],
      interests: scholarData.interests || [],
      publications: scholarData.publications || []
    };

    const projects = suggestProjects(input);
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("[SuggestProjectsError]:", error);
    return NextResponse.json({ error: "Failed to generate project suggestions" }, { status: 500 });
  }
}
