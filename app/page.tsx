"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, BarChart3, Activity, User, Plus } from 'lucide-react';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  return (
    <div 
      ref={containerRef}
      className="h-screen w-screen bg-white text-slate-900 overflow-hidden relative selection:bg-black/10 font-sans flex items-center"
    >
      {/* Background Gradients & Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Radial Gradient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-black/5 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute top-1/3 right-1/4 w-[40vw] h-[40vw] bg-black/3 rounded-full blur-[100px] mix-blend-multiply" />
        
        {/* Ambient grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-[0.3]" />
      </div>

      <div className="relative z-10 container mx-auto px-8 py-0 flex flex-col items-center justify-center h-full">
        
        <div className="grid lg:grid-cols-2 gap-8 items-center w-full max-w-7xl h-full">
          
          {/* Left Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left max-w-lg py-8"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/10 border border-black/20 backdrop-blur-md text-sm text-black mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              TeamForge AI 1.0 is Here
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-black leading-[1.1]">
              Manage Projects <br className="hidden md:block"/>  with AI
            </h1>

            <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
              Break down complex features, assign tasks to the perfect team member, and visualize development progress in a beautiful, futuristic workspace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/dashboard/teams" className="px-6 py-3 bg-black hover:bg-slate-900 text-white rounded-xl font-medium transition-all shadow-lg shadow-black/20 hover:shadow-black/30 flex items-center justify-center gap-2 group ring-1 ring-black/10">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-black" /> No credit card
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-black" /> Free trial
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-black" /> Instant setup
              </div>
            </div>
          </motion.div>

          {/* Right 3D Dashboard UI */}
          <div className="relative w-full h-[350px] md:h-[420px] lg:h-[480px] perspective-[1200px] flex items-center justify-center lg:justify-end mt-6 lg:mt-0 z-20">
            
            {/* Main Interactive Container */}
            <motion.div 
              initial={{ opacity: 0, rotateX: 20, rotateY: -15, scale: 0.8 }}
              animate={{ opacity: 1, rotateX: 5, rotateY: -15, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              style={{ y }}
              whileHover={{ rotateX: 0, rotateY: 0, scale: 1.02, transition: { duration: 0.4 } }}
              className="relative w-full max-w-[550px] aspect-[4/3] transform-style-3d preserve-3d cursor-pointer group"
            >
              {/* Back Glow */}
              <div className="absolute inset-0 bg-black/10 blur-[80px] rounded-full group-hover:bg-black/15 transition-colors duration-500" />
              
              {/* Main Dashboard Panel */}
              <div className="absolute inset-0 rounded-2xl bg-white border border-black/10 backdrop-blur-xl shadow-2xl overflow-hidden group-hover:border-black/20 transition-colors duration-500 shadow-black/5">
                {/* Header */}
                <div className="h-12 border-b border-black/10 flex items-center px-4 gap-3 bg-slate-50">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="h-4 w-24 bg-black/10 rounded-md ml-2" />
                </div>
                
                {/* Body */}
                <div className="p-4 md:p-6 grid grid-cols-2 gap-4 h-[calc(100%-3rem)] bg-gradient-to-b from-transparent to-slate-100">
                  {/* Left Column (Tasks) */}
                  <div className="space-y-4">
                    <div className="w-full flex justify-between items-center mb-2">
                      <div className="h-4 w-1/2 bg-black/10 rounded-md" />
                      <div className="h-4 w-4 bg-black/10 rounded-full" />
                    </div>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-black/5 shrink-0 hover:bg-slate-100 transition-colors group/item">
                        <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-black group-hover/item:text-white group-hover/item:bg-black transition-colors">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="h-1.5 md:h-2 w-full bg-black/20 rounded" />
                          <div className="h-1.5 md:h-2 w-2/3 bg-black/10 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Column (Analytics & Users) */}
                  <div className="space-y-4">
                     {/* Analytics Chart */}
                     <div className="h-32 w-full rounded-xl bg-gradient-to-br from-black/10 to-black/5 border border-black/10 p-4 flex flex-col justify-between group-hover:border-black/20 transition-colors">
                       <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-black" />
                       <div className="space-y-2 mt-2 md:mt-4 flex items-end gap-2 h-full">
                         <div className="w-1/4 bg-black/60 rounded-t-sm h-1/2" />
                         <div className="w-1/4 bg-black/50 rounded-t-sm h-3/4" />
                         <div className="w-1/4 bg-black/40 rounded-t-sm h-full group-hover:h-[110%] transition-all" />
                         <div className="w-1/4 bg-black/30 rounded-t-sm h-2/3" />
                       </div>
                     </div>
                     
                     {/* Users Card */}
                     <div className="h-24 w-full rounded-xl bg-slate-50 border border-black/5 p-4 flex flex-col gap-3 group-hover:bg-slate-100 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center">
                                <User className="w-3 h-3 md:w-4 md:h-4 text-slate-600" />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2 mt-auto">
                            <div className="h-1.5 md:h-2 w-full bg-black/20 rounded" />
                            <div className="h-1.5 md:h-2 w-4/5 bg-black/10 rounded" />
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Floating Element 1 - Notification */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 -top-8 md:-right-8 md:-top-8 p-3 md:p-4 rounded-xl bg-white border border-black/10 shadow-lg backdrop-blur-xl z-30 flex items-center gap-3 min-w-[160px] md:min-w-[190px]"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-semibold text-black">Sprint Deployed</p>
                  <p className="text-[10px] md:text-xs text-slate-500">Just now</p>
                </div>
              </motion.div>

              {/* Floating Element 2 - Chat/AI Agent */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-4 bottom-8 md:-left-12 md:bottom-12 p-3 md:p-4 rounded-xl bg-white border border-black/10 shadow-lg backdrop-blur-xl z-30 max-w-[200px] md:max-w-[240px]"
              >
                <div className="flex gap-2 md:gap-3 items-start">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-black flex items-center justify-center shrink-0 shadow-[0_0_15px_-3px_rgba(0,0,0,0.3)]">
                    <Plus className="w-3 h-3 md:w-4 md:h-4 text-white rotate-45" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] md:text-xs text-black font-semibold tracking-wide uppercase">AI Agent</p>
                    <p className="text-xs md:text-sm text-slate-700 leading-tight">Assigned 3 tasks based on optimal skill matching.</p>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
