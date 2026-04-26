'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run on mount
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="initial-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.8, ease: "easeInOut" } }}
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden font-sans transition-colors ${
            theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900'
          }`}
        >
          {/* Background Gradient Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
               animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.15, 0.25, 0.15], 
                  rotate: [0, 90, 0]
               }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               className={`absolute top-[-20%] left-[-20%] w-[70vw] h-[70vw] rounded-full blur-[120px] ${
                 theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-400/30'
               }`}
            />
            <motion.div 
               animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.15, 0.25, 0.15],
                  rotate: [0, -90, 0]
               }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className={`absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vw] rounded-full blur-[120px] ${
                 theme === 'dark' ? 'bg-violet-600/20' : 'bg-violet-400/30'
               }`}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-8 relative"
            >
              <div className="inline-block relative">
                <div className={`w-32 h-32 bg-white rounded-full overflow-hidden shadow-2xl relative flex items-center justify-center ${
                  theme === 'dark' ? 'shadow-amber-500/20' : 'shadow-neutral-300/30'
                }`}>
                  <Image 
                    src="/logo.png" 
                    alt="TeamForge AI Logo" 
                    fill
                    sizes="128px"
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Golden round animation like certificate */}
                <div className={`absolute inset-0 rounded-full border-[3px] animate-spin ${
                  theme === 'dark' ? 'border-amber-300 border-t-amber-500' : 'border-blue-300 border-t-blue-500'
                }`} style={{ animationDuration: '3s' }} />
                <div className={`absolute inset-[-6px] rounded-full border animate-[spin_8s_linear_infinite_reverse] ${
                  theme === 'dark' ? 'border-amber-500/30' : 'border-blue-500/30'
                }`} />
              </div>
              
              {/* Ripple Effect */}
              <motion.div
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                className={`absolute inset-0 rounded-full z-[-1] ${
                  theme === 'dark' ? 'bg-amber-500/20' : 'bg-blue-400/20'
                }`}
              />
            </motion.div>

            {/* Text Reveal */}
            <div className="overflow-hidden">
                <motion.h1
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className={`text-4xl md:text-5xl font-bold tracking-tight text-center ${
                  theme === 'dark' 
                    ? 'bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-neutral-400' 
                    : 'text-black'
                }`}
                >
                TeamForge AI
                </motion.h1>
            </div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className={`mt-4 text-sm tracking-widest uppercase font-medium ${
                theme === 'dark' ? 'text-neutral-400' : 'text-black'
              }`}
            >
              Initializing Workspace
            </motion.p>

            {/* Progress Bar */}
            <motion.div 
                className={`mt-12 h-1 w-64 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                    className="h-full bg-blue-500"
                />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}