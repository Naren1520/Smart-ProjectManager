'use client';

import { FolderKanban, Plus, Search, MoreHorizontal, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      name: "AI Algorithm Optimization",
      status: "In Progress", 
      progress: 65,
      members: 4,
      dueDate: "Oct 24",
      description: "Optimizing the core neural network for 20% faster inference."
    },
    {
      id: 2,
      name: "Mobile App Redesign", 
      status: "Planning",
      progress: 15,
      members: 3,
      dueDate: "Nov 12",
      description: "Revamping the UI/UX for iOS and Android platforms."
    },
    {
      id: 3,
      name: "Cloud Migration",
      status: "Completed",
      progress: 100,
      members: 6,
      dueDate: "Sep 30",
      description: "Migrating legacy databases to AWS infrastructure."
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-neutral-500">Manage and track your team's ongoing projects.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search projects..." 
          className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:shadow-xl transition-all hover:border-blue-500/30 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <FolderKanban className="w-6 h-6" />
              </div>
              <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-xl font-bold mb-2">{project.name}</h3>
            <p className="text-neutral-500 text-sm mb-6 line-clamp-2">
              {project.description}
            </p>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-500">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Calendar className="w-4 h-4" />
                {project.dueDate}
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Users className="w-4 h-4" />
                {project.members} Members
              </div>
            </div>
          </div>
        ))}

        {/* Create New Project Card Placeholder */}
        <button className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center text-neutral-400 hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all gap-4 min-h-[280px]">
            <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
                <Plus className="w-6 h-6" />
            </div>
            <span className="font-medium">Create New Project</span>
        </button>
      </div>
    </div>
  );
}