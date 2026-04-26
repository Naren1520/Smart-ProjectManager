"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  Bot,
  FileText,
  Briefcase,
  Loader2,
  Sparkles,
  User,
  CheckCircle2,
  MessageSquare,
  Send,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIToolsPage() {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"tasks" | "resume" | "assistant">(
    "tasks",
  );
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch current user skills on mount
  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/user/me")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.email) {
            setCurrentUser(data);
          }
        })
        .catch((err) => console.error("Error fetching user data", err));
    }
  }, [session]);

  // Task Generator State
  const [projectDesc, setProjectDesc] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);

  // Resume Analyzer State
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<any>(null);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);

  // AI Assistant State
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([
    {
      role: "ai",
      content: "Hello! I'm your AI Assistant. How can I help you today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatSeding, setIsChatSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("aiAssistantChat");
    if (saved) {
      try {
        setChatMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved chat");
      }
    }
  }, []);

  useEffect(() => {
    if (chatMessages.length > 1 || (chatMessages.length === 1 && chatMessages[0].role !== "ai" || chatMessages[0].content !== "Hello! I'm your AI Assistant. How can I help you today?")) {
      localStorage.setItem("aiAssistantChat", JSON.stringify(chatMessages));
    }
  }, [chatMessages]);

  const clearChat = () => {
    if (confirm("Are you sure you want to delete the chat history?")) {
      const initial = [{ role: "ai" as const, content: "Hello! I'm your AI Assistant. How can I help you today?" }];
      setChatMessages(initial);
      localStorage.removeItem("aiAssistantChat");
    }
  };

  useEffect(() => {
    if (activeTab === "assistant") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsChatSending(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: chatMessages }),
      });
      const data = await res.json();
      if (res.ok) {
        setChatMessages((prev) => [
          ...prev,
          { role: "ai", content: data.reply },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "ai", content: "Sorry, I encountered an error." },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsChatSending(false);
    }
  };

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
        skills: allSkills.length > 0 ? allSkills : ["Project Management"],
      },
      {
        name: "John Doe",
        role: "Frontend Dev",
        skills: ["React", "CSS", "TypeScript"],
      },
      {
        name: "Jane Smith",
        role: "Backend Dev",
        skills: ["Node.js", "MongoDB", "Python"],
      },
    ];

    try {
      const res = await fetch("/api/tasks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: projectDesc,
          teamMembers: teamMembers,
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
        formData.append("file", resumeFile);
        res = await fetch("/api/resume/analyze", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/resume/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2 md:gap-3">
          <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-black dark:text-white" />
          AI Power Tools
        </h1>
        <p className="text-sm md:text-base text-neutral-500">
          Leverage AI to automate your workflows.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-4 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`whitespace-nowrap pb-3 sm:pb-4 px-3 sm:px-4 font-medium transition-colors relative text-sm sm:text-base ${
            activeTab === "tasks"
              ? "text-black dark:text-white"
              : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          }`}
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
            Task Generator
          </div>
          {activeTab === "tasks" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("resume")}
          className={`whitespace-nowrap pb-3 sm:pb-4 px-3 sm:px-4 font-medium transition-colors relative text-sm sm:text-base ${
            activeTab === "resume"
              ? "text-black dark:text-white"
              : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          }`}
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            Resume Analyzer
          </div>
          {activeTab === "resume" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("assistant")}
          className={`whitespace-nowrap pb-3 sm:pb-4 px-3 sm:px-4 font-medium transition-colors relative text-sm sm:text-base ${
            activeTab === "assistant"
              ? "text-black dark:text-white"
              : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          }`}
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            AI Assistant
          </div>
          {activeTab === "assistant" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
            />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "tasks" ? (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
          >
            {/* Input Section */}
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 md:p-6 shadow-sm">
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
                  className={`mt-4 w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg ${
                    theme === 'dark'
                      ? 'bg-white hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed text-black shadow-white/20'
                      : 'bg-black hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-black/20'
                  }`}
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
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          task.priority === "High"
                            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : task.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {task.priority || "Normal"}
                      </span>
                    </div>
                    <p className="text-neutral-500 text-sm mb-4">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Assigned to:{" "}
                        <span className="text-neutral-700 dark:text-neutral-200 font-medium">
                          {task.assignedTo || "Unassigned"}
                        </span>
                      </div>
                      <div>Due: {task.dueDate || "TBD"}</div>
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
        ) : activeTab === "resume" ? (
          <motion.div
            key="resume"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
          >
            {/* Input Section */}
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 md:p-6 shadow-sm">
                <label className="block font-medium mb-4 text-neutral-700 dark:text-neutral-300">
                  Upload PDF or Paste Resume
                </label>

                <div className="mb-6 p-4 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:border-black dark:hover:border-white transition-colors cursor-pointer relative group">
                  <input
                    type="file"
                    accept=".pdf"
                    aria-label="Upload PDF Resume"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setResumeFile(e.target.files[0]);
                        setResumeText("");
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400 py-4 group-hover:text-black dark:group-hover:text-white transition-colors">
                    <FileText className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">
                      {resumeFile ? resumeFile.name : "Click to upload PDF"}
                    </span>
                    {!resumeFile && (
                      <span className="text-xs text-neutral-400 mt-1">
                        PDF files only (max 5MB)
                      </span>
                    )}
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
                  disabled={
                    isAnalyzingResume || (!resumeText.trim() && !resumeFile)
                  }
                  className={`mt-4 w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg ${
                    theme === 'dark'
                      ? 'bg-white hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed text-black shadow-white/20'
                      : 'bg-black hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-black/20'
                  }`}
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
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6"
                >
                  <div>
                    <h3 className="text-base sm:text-lg font-bold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      Professional Summary
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm sm:text-base">
                      {resumeAnalysis.summary}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                      <span className="text-sm text-neutral-500 block mb-1">
                        Experience Level
                      </span>
                      <span className="font-semibold text-lg">
                        {resumeAnalysis.experienceLevel}
                      </span>
                    </div>
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                      <span className="text-sm text-neutral-500 block mb-2">
                        Recommended Roles & Matching Skills
                      </span>
                      <div className="flex flex-col gap-3">
                        {resumeAnalysis.suggestedRoles?.map(
                          (suggestedParams: any, idx: number) => (
                            <div key={idx} className="flex flex-col">
                              <span className="font-semibold text-sm">
                                {typeof suggestedParams === "string"
                                  ? suggestedParams
                                  : suggestedParams.role}
                              </span>
                              {typeof suggestedParams !== "string" &&
                                suggestedParams.matchingSkills && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {suggestedParams.matchingSkills.map(
                                      (ms: string, msIdx: number) => (
                                        <span
                                          key={msIdx}
                                          className="text-[10px] px-2 py-0.5 bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white rounded border border-neutral-300 dark:border-neutral-600"
                                        >
                                          {ms}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-3">Key Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeAnalysis.skills?.map(
                        (skill: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                  {resumeAnalysis.projects &&
                    resumeAnalysis.projects.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                          <span>ðŸš€</span> Personal & Professional Projects
                        </h3>
                        <div className="space-y-3">
                          {resumeAnalysis.projects.map(
                            (proj: any, idx: number) => (
                              <div
                                key={idx}
                                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
                              >
                                <h4 className="font-semibold text-black dark:text-white mb-1 flex items-center justify-between">
                                  {proj.title}
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-2">
                                  {proj.description}
                                </p>
                                {proj.appliedSkills &&
                                  proj.appliedSkills.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                                      {proj.appliedSkills.map(
                                        (skill: string, sIdx: number) => (
                                          <span
                                            key={sIdx}
                                            className="text-[10px] px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full"
                                          >
                                            {skill}
                                          </span>
                                        ),
                                      )}
                                    </div>
                                  )}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}{" "}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400 p-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                  <FileText className="w-12 h-12 mb-4 opacity-20" />
                  <p>Paste resume text to see AI analysis</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : activeTab === "assistant" ? (
          <motion.div
            key="assistant"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-[calc(100vh-14rem)] min-h-[500px] md:h-[600px] flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm w-full max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
              <h3 className="font-semibold flex items-center gap-2">
                <Bot className="w-5 h-5 text-black dark:text-white" />
                AI Assistant
              </h3>
              <button
                onClick={clearChat}
                disabled={chatMessages.length <= 1}
                className="text-sm p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            </div>
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-4 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-black dark:bg-white text-white dark:text-black rounded-br-none"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-gray-100 rounded-bl-none whitespace-pre-wrap"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}
              {isChatSeding && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                    <Loader2 className="w-5 h-5 animate-spin text-black dark:text-white" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={handleSendChatMessage}
              className="p-3 md:p-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-800 flex gap-2 md:gap-4"
            >
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 md:px-4 md:py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-sm md:text-base"
              />
              <button
                type="submit"
                disabled={isChatSeding || !chatInput.trim()}
                className="p-2.5 md:p-3 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
