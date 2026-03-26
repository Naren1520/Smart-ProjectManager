'use client';

import { signIn } from 'next-auth/react';
import { Shield, Layout, ArrowLeft, Activity, GitBranch, Terminal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion, useMotionValue, useTransform, useSpring, type MotionValue } from 'framer-motion';

// --- Background Components (Visual Only) ---
const AnimatedBar = ({ delay }: { delay: number }) => (
  <motion.div 
    initial={{ height: "20%" }}
    animate={{ height: ["20%", "60%", "30%", "80%", "40%"] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay, repeatType: "reverse" }}
    className="w-full bg-blue-500/20 rounded-t-sm relative overflow-hidden"
  >
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400/50" />
  </motion.div>
);

const DashboardBackground = ({ mouseX, mouseY }: { mouseX: MotionValue<number>; mouseY: MotionValue<number> }) => {
  // Parallax for background - moves slower
  const moveX = useTransform(mouseX, [0, 1], [-20, 20]);
  const moveY = useTransform(mouseY, [0, 1], [-20, 20]);

  return (
    <motion.div 
      style={{ x: moveX, y: moveY }}
      className="absolute inset-0 z-0 flex p-6 gap-6 select-none overflow-hidden pointer-events-none filter blur-[1.5px] scale-[1.02] opacity-60"
    >
      {/* Sidebar Mockup */}
      <div className="w-64 h-full rounded-2xl border border-white/10 bg-neutral-800/20 p-4 flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <div className="h-8 w-8 rounded-lg bg-blue-600/20 mb-4 flex items-center justify-center">
             <div className="w-4 h-4 rounded bg-blue-500/40" />
        </div>
        <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-full rounded-lg bg-white/5 flex items-center px-3 gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="h-2 w-12 rounded bg-white/10" />
                </div>
            ))}
        </div>
        
        {/* Fake Terminal in Sidebar */}
        <div className="mt-auto h-48 w-full rounded-lg bg-black/40 border border-white/5 p-3 flex flex-col gap-2 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/20 to-transparent" />
             {[1,2,3,4].map(i => (
                 <div key={i} className="flex gap-2 items-center opacity-50">
                     <span className="text-[8px] text-green-500 font-mono">➜</span>
                     <div className="h-1.5 w-2/3 rounded bg-white/10" />
                 </div>
             ))}
             <motion.div 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-1.5 h-3 bg-green-500/50 mt-1"
             />
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Top Bar */}
        <div className="h-16 w-full rounded-2xl border border-white/10 bg-neutral-800/20 flex items-center px-4 justify-between relative overflow-hidden">
            <div className="w-48 h-4 rounded bg-white/10" />
            <div className="flex gap-3 items-center">
                <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                     <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-green-400" 
                     />
                     <div className="w-12 h-2 rounded bg-green-400/20" />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10" />
            </div>
        </div>

        {/* Dashboard Grid */}
        <div className="flex-1 grid grid-cols-3 gap-6">
            {/* Big Chart Area */}
            <div className="col-span-2 rounded-2xl border border-white/10 bg-neutral-800/20 p-6 relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                     <div className="w-32 h-4 rounded bg-white/10" />
                     <div className="flex gap-2">
                        <div className="w-8 h-8 rounded bg-white/5" />
                        <div className="w-8 h-8 rounded bg-white/5" />
                     </div>
                </div>
                
                <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2 relative opacity-60">
                    {/* Animated Bars */}
                    {Array.from({ length: 16 }).map((_, i) => (
                        <AnimatedBar key={i} delay={i * 0.1} />
                    ))}
                    
                    {/* Glowing Line Chart Overlay */}
                     <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
                         <defs>
                             <linearGradient id="lineGap" x1="0" x2="0" y1="0" y2="1">
                                 <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
                                 <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                             </linearGradient>
                         </defs>
                        <motion.path 
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
                            d="M0,80 C50,70 100,40 150,50 C200,60 250,20 300,30 C350,40 400,90 450,10" 
                            fill="none" 
                            stroke="rgba(147, 197, 253, 0.5)" 
                            strokeWidth="3" 
                            vectorEffect="non-scaling-stroke"
                            style={{ filter: "drop-shadow(0 0 4px rgba(59,130,246,0.5))" }}
                        />
                         <motion.path 
                            d="M0,80 C50,70 100,40 150,50 C200,60 250,20 300,30 C350,40 400,90 450,10 V100 H0 Z" 
                            fill="url(#lineGap)" 
                            opacity="0.2"
                        />
                     </svg>
                </div>
            </div>

            {/* Right Side Stats */}
            <div className="col-span-1 flex flex-col gap-6">
                 {/* Stat Card 1 - Server Load */}
                 <div className="flex-1 rounded-2xl border border-white/10 bg-neutral-800/20 p-5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <div className="w-20 h-3 rounded bg-white/10" />
                    </div>
                    <div className="space-y-4">
                         <div className="flex justify-between items-end">
                             <div className="w-16 h-8 rounded bg-white/10" />
                             <span className="text-blue-400 text-xs font-mono">98%</span>
                         </div>
                         <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                             <motion.div 
                                animate={{ width: ["40%", "70%", "50%", "90%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" 
                             />
                         </div>
                    </div>
                 </div>
                 
                 {/* Stat Card 2 - Active Branches */}
                 <div className="flex-1 rounded-2xl border border-white/10 bg-neutral-800/20 p-5 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                        <GitBranch className="w-4 h-4 text-purple-400" />
                        <div className="w-24 h-3 rounded bg-white/10" />
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {[1,2,3,4,5,6,7,8].map(i => (
                             <motion.div 
                                key={i}
                                animate={{ opacity: [0.3, 0.7, 0.3] }}
                                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                                className="h-8 rounded bg-purple-500/20" 
                             />
                        ))}
                    </div>
                 </div>
            </div>

            {/* Bottom Row - Deployment Logs */}
            <div className="col-span-3 h-48 rounded-2xl border border-white/10 bg-neutral-800/20 p-6 relative overflow-hidden">
                 <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-2">
                     <Terminal className="w-3 h-3 text-neutral-500" />
                     <div className="w-32 h-2 rounded bg-white/10" />
                 </div>
                 <div className="flex flex-col gap-2 font-mono text-[10px] text-neutral-500 opacity-70">
                    <div className="flex gap-2 text-green-500/50">
                        <span>✓</span>
                        <span>Build completed in 420ms</span>
                    </div>
                    <div className="flex gap-2">
                        <span>➜</span>
                        <span>Deploying to production region us-east-1</span>
                    </div>
                    <div className="flex gap-2 text-blue-400/50">
                        <span>ℹ</span>
                        <span>Optimizing image assets (24/90)</span>
                    </div>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        className="w-2 h-4 bg-blue-500/50" 
                    />
                 </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard/teams';

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl });
  };

  // Parallax & Mouse Logic
  const x = useMotionValue(0.5); // Start center
  const y = useMotionValue(0.5);
  
  const springX = useSpring(x, { stiffness: 40, damping: 20 }); // Slightly softer
  const springY = useSpring(y, { stiffness: 40, damping: 20 });

  const rotateX = useTransform(springY, [0, 1], [5, -5]); // Subtle tilt
  const rotateY = useTransform(springX, [0, 1], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Normalized coordinates 0..1
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    x.set(clientX / innerWidth);
    y.set(clientY / innerHeight);
  };

  return (
    <div 
        className="min-h-screen bg-[#050505] text-white flex items-center justify-center overflow-hidden font-sans relative"
        onMouseMove={handleMouseMove}
    >
      {/* Background Dashboard Layer */}
      <DashboardBackground mouseX={springX} mouseY={springY} />
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

      {/* Main Login UI */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px] px-6"
        style={{ perspective: 1000 }}
      >
        <motion.div
            style={{ rotateX, rotateY }}
            className="transform-gpu group"
        >
            {/* Header Text - Floating above card */}
            <div className="text-center mb-8 space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                    TeamForge AI
                </h1>
                <p className="text-neutral-400 text-sm font-medium">
                    Analyze your repositories. Manage smarter.
                </p>
            </div>

            {/* Login Card */}
            <div className="relative bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 overflow-hidden shadow-[0_0_40px_-10px_rgba(37,99,235,0.3)] transition-all duration-500 group-hover:shadow-[0_0_60px_-10px_rgba(124,58,237,0.4)] group-hover:border-white/20">
                {/* Neon Glow Lines */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
                
                {/* Brand Logo */}
                <div className="flex justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border border-white/10 bg-neutral-900/50 group-hover:scale-105 transition-transform duration-500 shadow-2xl shadow-blue-500/10">
                        <Image 
                            src="/logo.png" 
                            alt="TeamForge AI" 
                            fill 
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Google Button */}
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full relative group/btn bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white rounded-xl py-4 px-6 font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98] overflow-hidden"
                >
                    <div className="flex items-center justify-center gap-3 relative z-10">
                        <div className="p-1 bg-white rounded-full">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                        </div>
                        <span>Login with Google</span>
                    </div>
                </button>

                {/* Analysis Fake Loader */}
                <div className="mt-6 flex flex-col items-center gap-2 h-8 justify-center">
                    <div className="flex gap-1">
                        <motion.div 
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-1 h-1 rounded-full bg-blue-500" 
                        />
                        <motion.div 
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                            className="w-1 h-1 rounded-full bg-blue-500" 
                        />
                        <motion.div 
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                            className="w-1 h-1 rounded-full bg-blue-500" 
                        />
                    </div>
                    <p className="text-[10px] text-neutral-500 font-mono animate-pulse">
                        Analyzing repository metrics...
                    </p>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
                    <div className="flex items-center gap-2">
                        <span>Enterprise Grade</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Systems Normal</span>
                    </div>
                </div>
            </div>

            {/* Back Link */}
            <div className="mt-12 text-center">
                 <Link href="/" className="text-neutral-500 hover:text-white transition-colors text-xs flex items-center justify-center gap-2 group">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Return to Homepage
                </Link>
            </div>
        </motion.div>
      </motion.div>
    </div>
  );
}