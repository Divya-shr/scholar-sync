"use client";
import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Lightbulb, Star, Target, TrendingUp, User, GraduationCap, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ResultsPage() {
  const router = useRouter()
  const resumeData = useSelector((state: RootState) => state.resume.data)
  const scholarData = useSelector((state: RootState) => state.scholar.data)
  const projects = useSelector((state: RootState) => state.suggestions.projects)

  useEffect(() => {
    if (!resumeData || !scholarData) {
      router.replace("/analyze")
    }
  }, [resumeData, scholarData])

  if (!resumeData || !scholarData) return null

  const getMatchColor = (score: number) => {
    if (score >= 90) return "from-green-500 to-emerald-500"
    if (score >= 80) return "from-blue-500 to-cyan-500"
    if (score >= 70) return "from-yellow-500 to-orange-500"
    return "from-gray-500 to-slate-500"
  }

  const getMatchBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 80) return "bg-blue-100 text-blue-800 border-blue-200"
    if (score >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const handleSave = () => {
    const timestamp = new Date().toISOString()
    const resultToSave = { timestamp, resumeData, scholarData, projects }
    const saved = JSON.parse(localStorage.getItem("savedResults") || "[]")
    saved.push(resultToSave)
    localStorage.setItem("savedResults", JSON.stringify(saved))
    alert("Results saved!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link href="/analyze" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 group">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Analysis
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Your Perfect {" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Project Matches
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              AI-powered recommendations based on your skills and research interests
            </p>
          </div>
        </motion.div>

        {/* ... keep all your Resume and Scholar summary cards ... */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-white to-yellow-50 border-2 border-yellow-200 hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-slate-900">AI-Recommended Projects</CardTitle>
              <CardDescription className="text-lg text-slate-600">
                {projects.length} personalized matches based on your profile analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="relative overflow-hidden border-2 border-slate-200 rounded-xl p-6 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  >
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <Badge className={getMatchBadgeColor(project.matchScore)}>
                          {project.matchScore}% match
                        </Badge>
                      </div>
                    </div>
                    <div className="pr-24">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 mb-4 leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.relevantSkills.map((skill, i) => (
                          <Badge key={i} className="bg-blue-100 text-blue-700 border-blue-200">
                            {skill}
                          </Badge>
                        ))}
                        {project.researchAreas.map((area, i) => (
                          <Badge key={i} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${getMatchColor(project.matchScore)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    ></div>
                  </motion.div>
                ))}
              </div>

              {projects.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center mt-8 pt-6 border-t border-yellow-200"
                >
                  <p className="text-slate-600 mb-4">Want more personalized recommendations?</p>
                  <Link href="/analyze">
                    <Button variant="outline" className="mr-4 bg-transparent">
                      Refine Analysis
                    </Button>
                  </Link>
                  <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Save Results
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
