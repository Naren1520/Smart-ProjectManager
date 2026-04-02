"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, FileText, Loader2, Play, Square } from "lucide-react";
import toast from "react-hot-toast";

// Add SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function MeetPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Your browser doesn't support speech recognition. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let currentInterim = "";
      let finalTranscriptChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const tr = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptChunk += tr + " ";
        } else {
          currentInterim += tr;
        }
      }

      if (finalTranscriptChunk) {
        setTranscript((prev) => {
          const newTranscript = prev + finalTranscriptChunk;
          // Limit length to ~10000 characters to prevent huge state and API size
          if (newTranscript.length > 10000) {
            return newTranscript.slice(newTranscript.length - 10000);
          }
          return newTranscript;
        });
      }
      setInterimTranscript(currentInterim);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (event.error === 'not-allowed') {
        toast.error("Microphone permission denied.");
        setIsRecording(false);
      }
    };

    recognition.onend = () => {
      // If we are still supposed to be recording, restart it (handles auto-stop timeouts)
      if (isRecording) {
        try {
          recognition.start();
        } catch (e) {
          console.error("Error restarting recognition", e);
          setIsRecording(false);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  const startMeeting = async () => {
    try {
      // Ask for mic permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.success("Meeting started. Listening...");
      }
    } catch (err) {
      console.error("Mic access denied", err);
      toast.error("Please allow microphone access to start the meeting.");
    }
  };

  const endMeeting = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setInterimTranscript("");
      toast.success("Meeting ended.");
    }
  };

  const generateSummary = async () => {
    if (!transcript) {
      toast.error("No transcript available to summarize.");
      return;
    }

    setIsGenerating(true);
    setSummary("");
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate summary");
      }

      setSummary(data.summary);
      toast.success("Summary generated successfully!");
    } catch (err: any) {
      console.error("Error generating summary:", err);
      toast.error(err.message || "Failed to generate summary.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderFormattedSummary = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => {
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-xl font-semibold mt-4 mb-2 text-neutral-800 dark:text-neutral-200">{line.replace("## ", "")}</h3>;
      }
      if (line.startsWith("- ")) {
        return <li key={idx} className="ml-4 mb-1 text-neutral-600 dark:text-neutral-400">{line.replace("- ", "")}</li>;
      }
      if (line.trim() === "") {
        return <br key={idx} />;
      }
      return <p key={idx} className="mb-2 text-neutral-600 dark:text-neutral-400">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Mic className="w-6 h-6 text-blue-500" />
            AI Meeting Assistant
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time transcription and automatic summaries powered by Gemini AI.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isRecording ? (
            <button
              onClick={startMeeting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Play className="w-4 h-4" />
              Start Meeting
            </button>
          ) : (
            <button
              onClick={endMeeting}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors animate-pulse"
            >
              <Square className="w-4 h-4" />
              End Meeting
            </button>
          )}

          <button
            onClick={generateSummary}
            disabled={isGenerating || transcript.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-neutral-400 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            Generate Summary
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
        {/* Jitsi Video Section */}
        <div className="flex-1 xl:flex-[2] bg-black min-h-[400px] xl:min-h-0 relative border-b xl:border-b-0 xl:border-r border-neutral-200 dark:border-neutral-800">
          <iframe
            src="https://meet.jit.si/TeamForge-Demo"
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>

        {/* AI Assistant Section */}
        <div className="flex-1 xl:flex-[1] flex flex-col bg-neutral-50 dark:bg-neutral-900 min-h-[500px] xl:min-h-0 overflow-hidden">
          {/* Transcript Section */}
          <div className="flex-1 flex flex-col border-b border-neutral-200 dark:border-neutral-700 overflow-hidden">
            <div className="p-3 border-b border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-black/20 flex justify-between items-center">
              <h2 className="font-semibold text-sm text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Live Transcript
              </h2>
              {isRecording && (
                <span className="flex items-center gap-2 text-xs font-medium text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Listening...
                </span>
              )}
            </div>
            <div className="flex-1 p-4 overflow-y-auto text-sm font-sans leading-relaxed text-neutral-700 dark:text-neutral-300">
              {transcript ? (
                <>
                  <p>{transcript}</p>
                  <p className="text-blue-500 animate-pulse mt-2">{interimTranscript}</p>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 space-y-3">
                  <MicOff className="w-8 h-8 opacity-50" />
                  <p className="text-center text-sm">No transcript yet.<br/>Click "Start Meeting" to begin.</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary Section */}
          <div className="flex-1 flex flex-col overflow-hidden bg-amber-50/30 dark:bg-amber-900/5">
            <div className="p-3 border-b border-amber-200 dark:border-amber-900/30 bg-amber-100/50 dark:bg-amber-900/20">
              <h2 className="font-semibold text-sm text-amber-900 dark:text-amber-500 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                AI Meeting Summary
              </h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto text-sm">
              {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-amber-600 dark:text-amber-500 space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p>Gemini AI is analyzing the meeting...</p>
                </div>
              ) : summary ? (
                <div className="prose dark:prose-invert prose-sm max-w-none">
                  {renderFormattedSummary(summary)}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-amber-600/50 dark:text-amber-500/50 space-y-3">
                  <FileText className="w-8 h-8 opacity-50" />
                  <p className="text-center">Summary will appear here after the meeting.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}