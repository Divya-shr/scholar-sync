import { NextResponse } from "next/server";

export const maxDuration = 60; // Extends serverless execution limit on Vercel

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

    const response = await fetch(`${backendUrl}/suggest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend returned status ${response.status}:`, errorText);
      return NextResponse.json(
        { error: `Backend API error: ${response.status}` },
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