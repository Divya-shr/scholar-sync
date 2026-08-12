import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resume = body.resumeData || body.resume_data || {};
    const scholar = body.scholarData || body.scholar_data || {};

    // Safely extract arrays
    const skills = Array.isArray(resume.skills) ? resume.skills : [];
    const experience = Array.isArray(resume.experience)
      ? resume.experience
      : Array.isArray(resume.workExperience)
      ? resume.workExperience
      : [];
    const education = Array.isArray(resume.education) ? resume.education : [];
    const interests = Array.isArray(scholar.interests) ? scholar.interests : [];
    const recentPapers = Array.isArray(scholar.recentPapers)
      ? scholar.recentPapers
      : Array.isArray(scholar.recent_papers)
      ? scholar.recent_papers
      : [];

    // Construct unified payload supporting flattened, camelCase, and snake_case backend schemas
    const payload = {
      skills,
      experience,
      education,
      interests,
      citations: scholar.citations ?? 0,
      h_index: scholar.hIndex ?? scholar.h_index ?? 0,
      hIndex: scholar.hIndex ?? scholar.h_index ?? 0,
      recent_papers: recentPapers,
      recentPapers: recentPapers,
      name: scholar.name || "Researcher",
      affiliation: scholar.affiliation || "",
      resume_data: resume,
      scholar_data: scholar,
      resumeData: resume,
      scholarData: scholar,
    };

    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

    const response = await fetch(`${backendUrl}/suggest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend API error (${response.status}):`, errorText);
      return NextResponse.json(
        { error: `Backend API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error connecting to backend:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to connect to backend API." },
      { status: 500 }
    );
  }
}