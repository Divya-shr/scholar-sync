import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Transform camelCase keys to snake_case expected by FastAPI / Pydantic
    const payload = {
      resume_data: body.resumeData || body.resume_data || {},
      scholar_data: body.scholarData || body.scholar_data || {},
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