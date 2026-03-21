'use client';

import { motion } from 'framer-motion';

export function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50">
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            borderRadius: ["20%", "50%", "20%"]
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity
          }}
          className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-violet-500 rounded-xl blur-sm opacity-50 absolute top-0 left-0"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            borderRadius: ["50%", "20%", "50%"]
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity
          }}
          className="w-16 h-16 bg-gradient-to-bl from-blue-600 to-violet-600 rounded-xl shadow-lg shadow-blue-500/30"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
          AI
        </div>
      </div>
    </div>
  );
}