'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bot, FileText, Briefcase, Loader2, Sparkles, User, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIToolsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'tasks' | 'resume'>('tasks');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch current user skills on mount
  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/user/me')
        .then(res => res.json())
        .then(data => {
          if (data && data.email) {
            setCurrentUser(data);
          }
        })
        .catch(err => console.error("Error fetching user data", err));
    }
  }, [session]);

  // Task Generator State
  const [projectDesc, setProjectDesc] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);

  // Resume Analyzer State
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<any>(null);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);

  const generateTasks = async () => {
    if (!projectDesc.trim()) return;
    setIsGeneratingTasks(true);
    setTasks([]);

    // Get current user skills or defaults
    const userSkills = currentUser?.skills || [];
    const githubLangs = currentUser?.githubProfile?.topLanguages || [];
    const allSkills = Array.from(new Set([...userSkills, ...githubLangs]));

    const teamMembers = [
      { 
        name: currentUser?.name || "You", 
        role: "Team Lead / Developer", 
        skills: allSkills.length > 0 ? allSkills : ["Project Management"] 
      },
      { name: "John Doe", role: "Frontend Dev", skills: ["React", "CSS", "TypeScript"] },
      { name: "Jane Smith", role: "Backend Dev", skills: ["Node.js", "MongoDB", "Python"] },
    ];

    try {
      const res = await fetch('/api/tasks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: projectDesc,
          teamMembers: teamMembers
        }),
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else if (data.tasks) {
        setTasks(data.tasks); // Handle case where API returns { tasks: [] }
      } else if (data.message) {
        // Error message
        console.error("Error from API:", data.message);
      } else {
        console.error("Unexpected task format:", data);
        // Fallback for raw string if needed, currently just empty
      }
    } catch (error) {
      console.error("Failed to generate tasks:", error);
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim() && !resumeFile) return;
    setIsAnalyzingResume(true);
    setResumeAnalysis(null);
    try {
      let res;
      if (resumeFile) {
        const formData = new FormData();
        formData.append('file', resumeFile);
        res = await fetch('/api/resume/analyze', {
            method: 'POST',
            body: formData,
        });
      } else {
        res = await fetch('/api/resume/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeText }),
        });
      }

      const data = await res.json();
      setResumeAnalysis(data);
    } catch (error) {
      console.error("Failed to analyze resume:", error);
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-blue-500" />
          AI Power Tools
        </h1>
        <p className="text-neutral-500">Leverage Gemini AI to automate your workflows.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`pb-4 px-4 font-medium transition-colors relative ${
            activeTab === 'tasks' 
              ? 'text-blue-600' 
              : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Task Generator
          </div>
          {activeTab === 'tasks' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          className={`pb-4 px-4 font-medium transition-colors relative ${
            activeTab === 'resume' 
              ? 'text-blue-600' 
              : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resume Analyzer
          </div>
          {activeTab === 'resume' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'tasks' ? (
          <motion.div 
            key="tasks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
                <label className="block font-medium mb-2 text-neutral-700 dark:text-neutral-300">
                  Project Description
                </label>
                <textarea
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Describe your project (e.g., 'Build a React Native mobile app for e-commerce with Stripe integration...')"
                  className="w-full h-40 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none transition-all"
                />
                <button
                  onClick={generateTasks}
                  disabled={isGeneratingTasks || !projectDesc.trim()}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                >
                  {isGeneratingTasks ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Bot className="w-5 h-5" />
                      Generate Tasks
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {tasks.length > 0 ? (
                tasks.map((task, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{task.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                            task.priority === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                            {task.priority || 'Normal'}
                        </span>
                    </div>
                    <p className="text-neutral-500 text-sm mb-4">{task.description}</p>
                    <div className="flex items-center justify-between text-sm text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Assigned to: <span className="text-neutral-700 dark:text-neutral-200 font-medium">{task.assignedTo || 'Unassigned'}</span>
                        </div>
                        <div>Due: {task.dueDate || 'TBD'}</div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400 p-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                    <Bot className="w-12 h-12 mb-4 opacity-20" />
                    <p>Enter a description to generate AI tasks</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="resume"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
             {/* Input Section */}
             <div className="space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
                <label className="block font-medium mb-4 text-neutral-700 dark:text-neutral-300">
                  Upload PDF or Paste Resume
                </label>
                
                <div className="mb-6 p-4 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:border-blue-500 transition-colors cursor-pointer relative group">
                    <input 
                        type="file" 
                        accept=".pdf"
                        aria-label="Upload PDF Resume"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setResumeFile(e.target.files[0]);
                              setResumeText('');
                            }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400 py-4 group-hover:text-blue-500 transition-colors">
                        <FileText className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">
                            {resumeFile ? resumeFile.name : "Click to upload PDF"}
                        </span>
                        {!resumeFile && <span className="text-xs text-neutral-400 mt-1">PDF files only (max 5MB)</span>}
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-neutral-200 dark:bg-neutral-700 flex-1"></div>
                    <span className="text-sm text-neutral-400">OR</span>
                    <div className="h-px bg-neutral-200 dark:bg-neutral-700 flex-1"></div>
                </div>

                <textarea
                  value={resumeText}
                  onChange={(e) => {
                    setResumeText(e.target.value);
                    setResumeFile(null);
                  }}
                  placeholder="Paste the text from a resume here..."
                  className="w-full h-40 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none transition-all font-mono text-sm"
                />
                <button
                  onClick={analyzeResume}
                  disabled={isAnalyzingResume || (!resumeText.trim() && !resumeFile)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                >
                  {isAnalyzingResume ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Analyze Resume
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Analysis Result */}
            <div className="space-y-6">
                {resumeAnalysis ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-6"
                    >
                        <div>
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                Professional Summary
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                {resumeAnalysis.summary}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-3">Key Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {resumeAnalysis.skills?.map((skill: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                                <span className="text-sm text-neutral-500 block mb-1">Experience Level</span>
                                <span className="font-semibold text-lg">{resumeAnalysis.experienceLevel}</span>
                            </div>
                            <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                                <span className="text-sm text-neutral-500 block mb-1">Recommended Roles</span>
                                <div className="font-semibold text-sm">
                                    {resumeAnalysis.suggestedRoles?.join(', ')}
                                </div>
                            </div>
                         </div>
                    </motion.div>
                ) : (
                     <div className="h-full flex flex-col items-center justify-center text-neutral-400 p-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                        <FileText className="w-12 h-12 mb-4 opacity-20" />
                        <p>Paste resume text to see AI analysis</p>
                    </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}