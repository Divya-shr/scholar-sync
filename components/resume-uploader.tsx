"use client";
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CheckCircle, Loader2, User, Mail, GraduationCap, Code } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ResumeData {
  name: string
  emails: string[]
  skills: string[]
  education: string[]
  experience: string[]
}

interface ResumeUploaderProps {
  onDataExtracted: (data: ResumeData) => void
}

export function ResumeUploader({ onDataExtracted }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [extractedData, setExtractedData] = useState<ResumeData | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0]
    if (uploadedFile) {
      setFile(uploadedFile)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
  })

  const handleUpload = async () => {
  if (!file) return;

  setIsUploading(true);

  try {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await fetch("/api/parse-resume", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resume parse failed:", errorText);
      throw new Error("Resume parsing failed.");
    }

    const data: ResumeData = await response.json();

    setExtractedData(data);
    onDataExtracted(data);
  } catch (error) {
    console.error("Error uploading resume:", error);
    alert("Failed to parse resume. Please ensure it's a valid PDF or DOCX file.");
  } finally {
    setIsUploading(false);
  }
};


  return (
    <Card className="h-full bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Resume Analysis</CardTitle>
              <CardDescription>Upload your PDF or DOCX resume for AI-powered extraction</CardDescription>
            </div>
          </div>
          {extractedData && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Analyzed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? "border-blue-400 bg-blue-100 scale-105"
                  : "border-slate-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              <input {...getInputProps()} />
              <motion.div animate={{ y: isDragActive ? -5 : 0 }} transition={{ type: "spring", stiffness: 300 }}>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              {isDragActive ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-blue-600 font-semibold text-lg mb-2">Drop your resume here!</p>
                  <p className="text-blue-500 text-sm">We'll analyze it instantly</p>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-slate-700 font-semibold text-lg mb-2">Drag & drop your resume here</p>
                  <p className="text-slate-500 text-sm mb-4">or click to browse files</p>
                  <div className="flex justify-center space-x-2">
                    <Badge variant="secondary">PDF</Badge>
                    <Badge variant="secondary">DOCX</Badge>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="file-uploaded"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border-2 border-blue-200"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{file.name}</p>
                  <p className="text-sm text-slate-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <AnimatePresence>
                  {extractedData && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <AnimatePresence>
                {!extractedData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-200 py-3"
                    >
                      <AnimatePresence mode="wait">
                        {isUploading ? (
                          <motion.div
                            key="uploading"
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
                            Analyzing Resume...
                          </motion.div>
                        ) : (
                          <motion.span
                            key="parse"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            Analyze Resume
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {extractedData && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="space-y-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200"
            >
              <div className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-800">Analysis Complete!</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-3 bg-white rounded-lg border border-green-200">
                  <User className="h-4 w-4 text-green-600 mr-2" />
                  <div>
                    <p className="text-xs text-green-600 font-medium">NAME</p>
                    <p className="text-sm font-semibold text-slate-900">{extractedData.name}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-white rounded-lg border border-green-200">
                  <Mail className="h-4 w-4 text-green-600 mr-2" />
                  <div>
                    <p className="text-xs text-green-600 font-medium">EMAIL</p>
                    <p className="text-sm font-semibold text-slate-900">
                        {extractedData.emails.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center mb-2">
                    <Code className="h-4 w-4 text-green-600 mr-2" />
                    <p className="text-xs text-green-600 font-medium">SKILLS EXTRACTED</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {extractedData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <GraduationCap className="h-4 w-4 text-green-600 mr-2" />
                    <p className="text-xs text-green-600 font-medium">EDUCATION</p>
                  </div>
                  <div className="space-y-1">
                    {extractedData.education.map((edu, index) => (
                      <p key={index} className="text-sm text-slate-700 bg-white p-2 rounded border border-green-200">
                        {edu}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                <div className="flex items-center mb-2">
                  <FileText className="h-4 w-4 text-green-600 mr-2" />
                  <p className="text-xs text-green-600 font-medium">EXPERIENCE</p>
                </div>
                <div className="space-y-1">
                  {extractedData.experience.map((exp, index) => (
                    <p key={index} className="text-sm text-slate-700 bg-white p-2 rounded border border-green-200">
                      {exp}
                    </p>
                  ))}
                </div>
              </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
