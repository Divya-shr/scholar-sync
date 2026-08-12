import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resume = body.resumeData || body.resume_data || {};
    const scholar = body.scholarData || body.scholar_data || {};

    // Construct flattened payload expected by FastAPI schema
    const payload = {
      skills: resume.skills || [],
      experience: resume.experience || resume.workExperience || [],
      education: resume.education || [],
      interests: scholar.interests || [],
      citations: scholar.citations || 0,
      h_index: scholar.hIndex || scholar.h_index || 0,
      recent_papers: scholar.recentPapers || scholar.recent_papers || [],
      // Include fallback objects
      resume_data: resume,
      scholar_data: scholar,
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
      console.error(`Backend returned status ${response.status}:`, errorText);
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