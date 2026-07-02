import { COMMON_SKILLS } from "./constants";

export function extractStructuredData(text: string) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const lowerText = text.toLowerCase();

  return {
    name: extractName(lines),
    emails: extractEmails(text),
    phone: extractPhone(text),
    skills: extractSkills(lowerText),
    education: extractEducation(text),
    experience: extractExperience(lines),
  };
}

function extractName(lines: string[]): string {
  const nameLine = lines.find(l => /^[A-Z][a-z]+ [A-Z][a-z]+(?: [A-Z][a-z]+)?$/.test(l));
  return nameLine || lines[0] || "Unknown";
}

function extractEmails(text: string): string[] {
  return Array.from(text.matchAll(/[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi), m => m[0]);
}

function extractPhone(text: string): string {
  return (
    text.match(/(\+91[\s-]?)?[6789]\d{9}/) ||
    text.match(/(\+?\d[\d\s-]{8,15})/)
  )?.[0] || "";
}

function extractSkills(lowerText: string): string[] {
  return COMMON_SKILLS.filter(skill => lowerText.includes(skill.toLowerCase()));
}

function extractEducation(text: string): string[] {
  const matches = text.match(/(Bachelor|Master|PhD|MSc|BSc|BE|B\.Tech|M\.Tech)[^\n]{0,80}/gi) || [];
  const cgpa = text.match(/CGPA[:\s]?[0-9.]{1,4}/i);
  if (cgpa) matches.push(cgpa[0]);
  return Array.from(new Set(matches.map(m => m.trim())));
}

function extractExperience(lines: string[]): string[] {
  const result: string[] = [];
  const verbs = /(developed|engineered|led|built|created|project|intern|implemented|managed)/i;

  for (const line of lines) {
    if (/^[-•*]/.test(line) || verbs.test(line)) {
      result.push(line);
    }
  }

  return result;
}
