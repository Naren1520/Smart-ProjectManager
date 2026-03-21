'use client';

import { Play, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Back Button */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400 mb-4">
                Watch TeamForge in Action
            </h1>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
                See how AI transforms chaotic project requirements into structured, actionable tasks in seconds.
            </p>
        </div>

        <div className="aspect-video w-full bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl relative group overflow-hidden flex items-center justify-center">
            {/* Placeholder for video */}
            <div className="text-center">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md mx-auto mb-4 group-hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
                <p className="text-neutral-500 font-medium">Click to Play Demo (Placeholder)</p>
            </div>
            
            {/* Simulate interface overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                <div className="text-3xl font-bold text-blue-500 mb-2">30s</div>
                <p className="text-neutral-400 text-sm">Average time to generate a full project plan</p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                <div className="text-3xl font-bold text-violet-500 mb-2">95%</div>
                <p className="text-neutral-400 text-sm">Accuracy in skill-based task matching</p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                <div className="text-3xl font-bold text-green-500 mb-2">24/7</div>
                <p className="text-neutral-400 text-sm">Real-time AI Project Manager availability</p>
            </div>
        </div>
      </div>
    </div>
  );
}