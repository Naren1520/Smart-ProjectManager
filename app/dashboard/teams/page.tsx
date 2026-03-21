'use client';

import { Users, UserPlus, ArrowRight, Zap, Code2, Globe } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TeamsPage() {
  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
          Welcome to TeamSpace
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
          Collaborate with your team, manage projects, and let AI optimize your workflow.
          Get started by creating a new team or joining an existing one.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* Create Team Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="group relative bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden hover:shadow-2xl hover:border-blue-500/30 transition-all"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <UserPlus className="w-7 h-7" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-white">Create a New Team</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">
              Start a fresh workspace for your project. Invite members, set up AI workflows, and begin collaborating instantly.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "AI Project Setup Assistant",
                "Custom Roles & Permissions",
                "Integrated GitHub Workflows",
                "Automated Sprint Planning"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-xs">✓</div>
                  {item}
                </li>
              ))}
            </ul>

            <Link href="/dashboard/teams/create" className="inline-flex items-center justify-center w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 gap-2 group-hover:translate-x-1">
              Create Team Workspace
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Join Team Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="group relative bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden hover:shadow-2xl hover:border-violet-500/30 transition-all"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-white">Join an Existing Team</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">
              Have an invite code? Enter it to join your team's workspace and access shared projects and chats.
            </p>

             <ul className="space-y-3 mb-8">
              {[
                "Instant Access to Projects",
                "Real-time Chat & Meetings",
                "Shared Resource Library",
                "Team Performance Metrics"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                  <div className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs">✓</div>
                  {item}
                </li>
              ))}
            </ul>

            <Link href="/dashboard/teams/join" className="inline-flex items-center justify-center w-full px-6 py-4 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-xl font-semibold transition-all gap-2 group-hover:translate-x-1">
              Enter Invite Code
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Featured Public Teams (Optional concept) */}
      <div className="mt-16 text-center">
        <p className="text-sm text-neutral-400 mb-6 uppercase tracking-wider font-semibold">Popular Open Source Teams</p>
        <div className="flex flex-wrap justify-center gap-4">
            {[{n:"Project Alpha", i: Zap, c:"text-amber-500"}, {n:"DevOps Core", i: Code2, c:"text-cyan-500"}, {n:"Global Web", i: Globe, c:"text-pink-500"}].map((t, i) => {
                const Icon = t.i;
                return (
                <div key={i} className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-neutral-900 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-sm cursor-pointer hover:scale-105 transition-transform">
                    <Icon className={`w-4 h-4 ${t.c}`} />
                    <span className="text-sm font-medium">{t.n}</span>
                </div>
            )})}
        </div>
      </div>
    </div>
  );
}