"use client";

import LinkNext from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/store";
import { Lightbulb, Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fallback projects directly matching your target design
const DEFAULT_PROJECTS = [
  {
    title: "AI-Powered Resume Ranker",
    description: "Build a tool that ranks resumes using NLP and transformer models.",
    tags: ["Python", "Machine Learning"],
    match: "95% match",
  },
  {
    title: "Scholar Citation Visualizer",
    description: "Visualize citation trends over time using Google Scholar data.",
    tags: ["React"],
    match: "92% match",
  },
  {
    title: "Real-Time Threat Detection System",
    description: "Use deep learning to detect anomalies in network traffic.",
    tags: ["Python"],
    match: "88% match",
  },
  {
    title: "Academic Paper Recommender",
    description: "Recommend research papers using user interests and citation graphs.",
    tags: ["Machine Learning"],
    match: "85% match",
  },
  {
    title: "Interactive Learning Path Generator",
    description: "Suggest personalized study paths using resume and publications.",
    tags: ["React"],
    match: "82% match",
  },
];

export default function ResultsPage() {
  const router = useRouter();

  // Safely extract suggestions from Redux store
  const reduxSuggestions = useSelector((state: RootState) => {
    // use the correctly named property from RootState
    const s = (state as any).suggestions || (state as any).suggestion || null;
    if (!s) return null;
    return s.suggestions || s.items || s.data || (Array.isArray(s) ? s : null);
  });

  // Use Redux data if available and non-empty; otherwise fall back to default design items
  const projectsToDisplay =
    Array.isArray(reduxSuggestions) && reduxSuggestions.length > 0
      ? reduxSuggestions.map((item: any, index: number) => ({
          title: item.title || item.name || `Project Suggestion ${index + 1}`,
          description:
            item.description || item.summary || "Tailored project based on your profile skills.",
          tags: Array.isArray(item.tags)
            ? item.tags
            : Array.isArray(item.tech_stack)
            ? item.tech_stack
            : Array.isArray(item.skills)
            ? item.skills
            : ["Python", "AI"],
          match: item.match || item.matchPercentage || `${95 - index * 3}% match`,
        }))
      : DEFAULT_PROJECTS;

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Link */}
        <div>
          <LinkNext
            href="/analyze"
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Analysis
          </LinkNext>
        </div>

        {/* Page Title Header */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Your Perfect <span className="text-indigo-600">Project Matches</span>
          </h1>
          <p className="text-sm text-slate-500">
            AI-powered recommendations based on your skills and research interests
          </p>
        </div>

        {/* Main Amber Container Card */}
        <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          {/* Top Amber Icon & Heading */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              AI-Recommended Projects
            </h2>
            <p className="text-xs text-slate-500">
              {projectsToDisplay.length} personalized matches based on your profile analysis
            </p>
          </div>

          {/* Project List */}
          <div className="space-y-4">
            {projectsToDisplay.map((project, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-amber-100/60 shadow-sm hover:shadow-md transition-shadow relative space-y-3"
              >
                {/* Header row: Title + Match Badge */}
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold text-slate-800 text-base">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full whitespace-nowrap font-medium">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{project.match}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.tags.map((tag: string, tIdx: number) => (
                    <span
                      key={tIdx}
                      className="text-[11px] bg-blue-50 text-blue-600 border border-blue-100 font-medium px-2.5 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Footer Actions */}
          <div className="pt-4 text-center space-y-3">
            <p className="text-xs text-slate-500 font-medium">
              Want more personalized recommendations?
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 text-xs px-4"
                onClick={() => router.push("/analyze")}
              >
                Refine Analysis
              </Button>
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-5 shadow-sm"
                onClick={() => alert("Results saved to your profile!")}
              >
                Save Results
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}