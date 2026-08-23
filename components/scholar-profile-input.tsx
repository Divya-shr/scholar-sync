"use client";

import { useState } from "react";
import { GraduationCap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function scholarProfile({ onConnect }: { onConnect?: (data: any) => void }) {
  const [scholarUrl, setScholarUrl] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [scholarData, setScholarData] = useState<any>({
    interests: ["Science", "Microbiology", "Nanotechnology"],
  });

  const handleConnect = () => {
    if (!scholarUrl) return;
    setIsConnected(true);
    if (onConnect) onConnect(scholarData);
  };

  return (
    <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Scholar Profile</h3>
            <p className="text-xs text-slate-500">
              Connect your Google Scholar profile for research analysis
            </p>
          </div>
        </div>

        {isConnected && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <Check className="w-3.5 h-3.5" />
            Connected
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="space-y-2">
        <input
          type="text"
          value={scholarUrl}
          onChange={(e) => setScholarUrl(e.target.value)}
          placeholder="https://scholar.google.com/citations?user=..."
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-purple-200 bg-purple-50/20 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400/40"
        />
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Find your profile URL by visiting Google Scholar and copying the link</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200">
            Required
          </span>
        </div>
      </div>

      {/* Connect Button */}
      <Button
        onClick={handleConnect}
        className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:opacity-90 text-white font-medium rounded-xl shadow-sm transition-all"
      >
        Connect Scholar Profile
      </Button>

      {/* Connected Profile - Research Interests Only */}
      {isConnected && (
        <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-base mb-2">
            <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            Profile Connected Successfully!
          </div>

          <p className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
            RESEARCH INTERESTS
          </p>
          <div className="flex flex-wrap gap-2">
            {scholarData.interests.map((interest: string, idx: number) => (
              <span
                key={idx}
                className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-lg font-medium shadow-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}