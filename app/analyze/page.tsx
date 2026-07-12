"use client";

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
import { CheckCircle, Clock, Sparkles } from "lucide-react";

import { setSuggestions } from "@/store/suggestionSlice";

export default function AnalyzePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const resumeData = useSelector((state: RootState) => state.resume.data);
  const scholarData = useSelector((state: RootState) => state.scholar.data);

  const isReady = !!resumeData && !!scholarData;
  const progress = isReady ? 100 : resumeData || scholarData ? 50 : 0;

  const handleGenerate = async () => {
    if (!isReady) {
      alert("Please upload resume and connect Scholar profile");
      return;
    }

    try {
      const res = await fetch("/api/suggest-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData,
          scholarData,
        }),
      });

      const data = await res.json();

      dispatch(setSuggestions(data.projects));

      router.push("/results");
    } catch (err) {
      console.error(err);
      alert("Failed to generate suggestions.");
    }
  };

  return (
    <div className="py-10 px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Analyze Your Profile</h1>
        <p className="text-slate-600 mt-1">
          Upload your resume and connect your Google Scholar profile
        </p>

        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ResumeUploader
          onDataExtracted={(data) =>
            dispatch({
              type: "resume/setResumeData",
              payload: data,
            })
          }
        />

        <ScholarProfileInput
          onDataFetched={(data) =>
            dispatch({
              type: "scholar/setScholarData",
              payload: data,
            })
          }
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
            className="mt-4"
            onClick={handleGenerate}
            disabled={!isReady}
          >
            Generate AI-Powered Projects
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className={resumeData ? "border-green-300 bg-green-50" : ""}>
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
              <p className="text-sm">
                {resumeData ? "Uploaded" : "Waiting..."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={scholarData ? "border-green-300 bg-green-50" : ""}>
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
              <p className="text-sm">
                {scholarData ? "Connected" : "Waiting..."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}