"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/store";

import { ResumeUploader } from "@/components/resume-uploader";
import { ScholarProfileInput } from "@/components/scholar-profile-input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, Sparkles, Loader2 } from "lucide-react";

import { setResumeData } from "@/store/resumeSlice";
import { setScholarData } from "@/store/scholarSlice";
import { setSuggestions } from "@/store/suggestionSlice";

export default function AnalyzePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const resumeData = useSelector((state: RootState) => state.resume.data);
  const scholarData = useSelector((state: RootState) => state.scholar.data);

  const isReady = !!resumeData && !!scholarData;
  const progress = isReady ? 100 : resumeData || scholarData ? 50 : 0;

  const handleGenerate = async () => {
    if (!isReady) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/suggest-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, scholarData }),
      });

      const data = await res.json();
      console.log("🔥 Raw AI Backend Response:", data);

      if (!res.ok) {
        const errorDetail =
          typeof data.error === "string" ? data.error : JSON.stringify(data);
        throw new Error(errorDetail || `Request failed with status ${res.status}`);
      }

      let extractedProjects: any[] = [];

      // 1. Direct array
      if (Array.isArray(data)) {
        extractedProjects = data;
      }
      // 2. Object with nested array
      else if (data && typeof data === "object") {
        if (Array.isArray(data.projects)) extractedProjects = data.projects;
        else if (Array.isArray(data.suggestions)) extractedProjects = data.suggestions;
        else if (Array.isArray(data.data)) extractedProjects = data.data;
        else if (Array.isArray(data.results)) extractedProjects = data.results;

        // 3. Stringified JSON or Markdown response wrapper
        if (extractedProjects.length === 0) {
          const rawText =
            data.text || data.response || data.result || data.message || data.output || "";
          if (typeof rawText === "string" && rawText.length > 0) {
            // Strip markdown backticks ```json ... ```
            const cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
            try {
              const parsed = JSON.parse(cleanText);
              if (Array.isArray(parsed)) extractedProjects = parsed;
              else if (parsed.projects && Array.isArray(parsed.projects))
                extractedProjects = parsed.projects;
              else if (parsed.suggestions && Array.isArray(parsed.suggestions))
                extractedProjects = parsed.suggestions;
            } catch (pErr) {
              console.error("Failed to parse nested JSON string:", pErr);
            }
          }
        }
      }

      if (extractedProjects.length === 0) {
        console.warn("Could not parse project list from backend response.");
      }

      dispatch(setSuggestions(extractedProjects));
      router.push("/results");
    } catch (err: any) {
      console.error("Suggestion error:", err);
      // Fall back directly to results page on error
      router.push("/results");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-10 px-4 space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Analyze Your Profile</h1>
        <p className="text-slate-600">
          Upload your resume and connect your Google Scholar profile
        </p>

        <div className="mt-4 max-w-md mx-auto">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ResumeUploader
          onDataExtracted={(data) => dispatch(setResumeData(data))}
        />

        <ScholarProfileInput
          onDataFetched={(data) => dispatch(setScholarData(data))}
        />
      </div>

      <Separator />

      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>

          <CardTitle className="mt-4 text-2xl">
            Generate Project Suggestions
          </CardTitle>

          <CardDescription>
            Based on your resume and academic profile
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          <Button
            size="lg"
            className="mt-4 min-w-[240px]"
            onClick={handleGenerate}
            disabled={!isReady || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Profile...
              </>
            ) : (
              "Generate AI-Powered Projects"
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className={resumeData ? "border-green-300 bg-green-50/50" : ""}>
          <CardContent className="flex items-center p-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                resumeData ? "bg-green-100" : "bg-slate-100"
              }`}
            >
              {resumeData ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-slate-400" />
              )}
            </div>

            <div>
              <p className="font-medium">Resume</p>
              <p className="text-sm text-slate-500">
                {resumeData ? "Uploaded & Parsed" : "Waiting for upload..."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={scholarData ? "border-green-300 bg-green-50/50" : ""}>
          <CardContent className="flex items-center p-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                scholarData ? "bg-green-100" : "bg-slate-100"
              }`}
            >
              {scholarData ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-slate-400" />
              )}
            </div>

            <div>
              <p className="font-medium">Scholar Profile</p>
              <p className="text-sm text-slate-500">
                {scholarData ? "Connected" : "Waiting for link..."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}