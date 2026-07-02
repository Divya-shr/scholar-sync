// @ts-ignore
const pdfParse = require("pdf-parse");
import mammoth from "mammoth";
import { extractStructuredData } from "./extractor";

export async function parseResumeFile(file: File) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = file.name.toLowerCase().split(".").pop() || "";
    const mime = file.type || "";
    let text = "";

    if (ext === "pdf" || mime === "application/pdf") {
      const { text: pdfText } = await pdfParse(buffer);
      text = pdfText || "";
    } else if (ext === "docx" || mime.includes("wordprocessingml")) {
      const { value } = await mammoth.extractRawText({ buffer });
      text = value || "";
    } else {
      throw new Error("Unsupported file type. Only PDF and DOCX are allowed.");
    }

    if (!text || text.trim().length < 20) {
      throw new Error("Resume content is empty or could not be parsed.");
    }

    console.log("[Resume Text Preview]:", text.slice(0, 300));
    return extractStructuredData(text);
  } catch (error: any) {
    console.error("[parseResumeFile error]", error);
    throw new Error("Failed to parse resume. Ensure it's a valid PDF or DOCX.");
  }
}
