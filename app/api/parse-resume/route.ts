import { type NextRequest, NextResponse } from "next/server";
import { parseResumeFile } from "@/lib/resume/parser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded or invalid format" }, { status: 400 });
    }

    if (file.size > 5_000_000) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const parsedData = await parseResumeFile(file);
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("[ResumeParsingError]", error);
    return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 });
  }
}
