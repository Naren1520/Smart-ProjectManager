'use client';

import { Users, UserPlus, ArrowRight, Zap, Code2, Globe, Layout } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Team {
    _id: string;
    name: string;
    description: string;
    members: any[];
}

interface TeamsClientProps {
    teams: Team[];
}

export default function TeamsClient({ teams }: TeamsClientProps) {
  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
          Team Workspace
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
          Manage your teams and projects. Join or create new workspaces below.
        </p>
      </div>

      {teams.length > 0 && (
          <div className="mb-16">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 px-4">
                  <Layout className="w-5 h-5 text-black dark:text-white" />
                  Your Teams
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                  {teams.map((team) => (
                      <Link key={team._id} href={`/dashboard/teams/${team._id}`}>
                          <motion.div 
                              whileHover={{ y: -5 }}
                              className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                          >
                              <div className="h-12 w-12 rounded-xl bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-black dark:text-white mb-4 group-hover:scale-110 transition-transform">
                                  <Users className="w-6 h-6" />
                              </div>
                              <h3 className="font-bold text-lg mb-2 text-neutral-900 dark:text-white">{team.name}</h3>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4 h-10">
                                  {team.description || "No description provided."}
                              </p>
                              <div className="flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                                  <span>{team.members?.length || 1} Members</span>
                                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-black dark:text-white">
                                      Open <ArrowRight className="w-3 h-3" />
                                  </span>
                              </div>
                          </motion.div>
                      </Link>
                  ))}
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* Create Team Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="group relative bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden hover:shadow-2xl hover:border-black/30 dark:hover:border-white/30 transition-all"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 dark:bg-white/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-neutral-200 dark:bg-neutral-700 rounded-2xl flex items-center justify-center text-black dark:text-white mb-6 group-hover:scale-110 transition-transform">
              <UserPlus className="w-7 h-7" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-white">Create a New Team</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">
              Start a fresh workspace for your project. Invite members, set up AI workflows, and begin collaborating.
            </p>

            <Link href="/dashboard/teams/create" className="inline-flex items-center justify-center w-full px-6 py-4 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black rounded-xl font-semibold transition-all shadow-lg shadow-black/30 dark:shadow-white/30 gap-2 group-hover:translate-x-1">
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
              Have an invite code? Enter it to join your team's workspace and access shared projects.
            </p>

            <Link href="/dashboard/teams/join" className="inline-flex items-center justify-center w-full px-6 py-4 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-xl font-semibold transition-all gap-2 group-hover:translate-x-1">
              Enter Invite Code
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}