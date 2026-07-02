"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Loader2, CheckCircle, User, Building, BookOpen, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ScholarData {
  name: string;
  affiliation: string;
  interests: string[];
  citations: number;
  hIndex: number;
  recentPapers: string[];
}

interface ScholarProfileInputProps {
  onDataFetched: (data: ScholarData) => void;
}

export function ScholarProfileInput({ onDataFetched }: ScholarProfileInputProps) {
  const [profileUrl, setProfileUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  // ✅ Initialize scholarData safely
  const [scholarData, setScholarData] = useState<ScholarData>({
    name: "",
    affiliation: "",
    interests: [],
    citations: 0,
    hIndex: 0,
    recentPapers: [],
  });

  const handleFetchProfile = async () => {
    if (!profileUrl.trim()) {
      alert("Please enter a Google Scholar profile URL");
      return;
    }

    setIsFetching(true);

    try {
      const response = await fetch("/api/scrape-scholar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setScholarData(data);
        onDataFetched(data);
      } else {
        throw new Error("Failed to fetch Scholar profile");
      }
    } catch (error) {
      console.error("Error fetching Scholar profile:", error);
      alert("Failed to fetch Google Scholar profile. Please check the URL and try again.");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Card className="h-full bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Scholar Profile</CardTitle>
              <CardDescription>Connect your Google Scholar profile for research analysis</CardDescription>
            </div>
          </div>
          {scholarData.name && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <motion.div whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <Input
                placeholder="https://scholar.google.com/citations?user=..."
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                disabled={isFetching}
                className="h-12 text-base border-2 border-purple-200 focus:border-purple-400 transition-all duration-200"
              />
            </motion.div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Find your profile URL by visiting Google Scholar and copying the link
              </p>
              <Badge variant="outline" className="text-xs">
                Required
              </Badge>
            </div>
          </div>

          <Button
            onClick={handleFetchProfile}
            disabled={isFetching || !profileUrl.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 py-3"
          >
            <AnimatePresence mode="wait">
              {isFetching ? (
                <motion.div
                  key="fetching"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Loader2 className="h-4 w-4 mr-2" />
                  </motion.div>
                  Connecting Profile...
                </motion.div>
              ) : (
                <motion.span key="fetch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Connect Scholar Profile
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>

        {scholarData.name && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200"
          >
            <div className="flex items-center mb-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-semibold text-blue-800">Profile Connected Successfully!</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-white rounded-lg border border-blue-200">
                <User className="h-4 w-4 text-blue-600 mr-2" />
                <div>
                  <p className="text-xs text-blue-600 font-medium">RESEARCHER</p>
                  <p className="text-sm font-semibold text-slate-900">{scholarData.name}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-white rounded-lg border border-blue-200">
                <Building className="h-4 w-4 text-blue-600 mr-2" />
                <div>
                  <p className="text-xs text-blue-600 font-medium">AFFILIATION</p>
                  <p className="text-sm font-semibold text-slate-900">{scholarData.affiliation}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white"
              >
                <TrendingUp className="h-5 w-5 mx-auto mb-1" />
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                  className="text-2xl font-bold"
                >
                  {(scholarData?.citations ?? 0).toLocaleString()}
                </motion.p>
                <p className="text-xs opacity-90">Citations</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white"
              >
                <BookOpen className="h-5 w-5 mx-auto mb-1" />
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                  className="text-2xl font-bold"
                >
                  {(scholarData?.hIndex ?? 0).toLocaleString()}
                </motion.p>
                <p className="text-xs opacity-90">h-index</p>
              </motion.div>
            </div>

            <div>
              <p className="text-xs text-blue-600 font-medium mb-2">RESEARCH INTERESTS</p>
              <div className="flex flex-wrap gap-1">
                {scholarData.interests.map((interest, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                      {interest}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
