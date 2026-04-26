'use client';

import { FolderKanban, Plus, Search, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  members: number;
  dueDate: string;
  deadline?: string;
}

interface ProjectsClientProps {
  initialProjects: Project[];
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProjects = initialProjects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-neutral-500">Manage and track your team&apos;s ongoing projects.</p>
        </div>
        <Link href="/dashboard/projects/create" className="bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-black/20 dark:shadow-white/20 hover:shadow-black/30 dark:hover:shadow-white/30 transition-all">
          <Plus className="w-5 h-5" />
          New Project
        </Link>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search projects..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-black/50 dark:focus:ring-white/50 transition-all"
        />
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link href={`/dashboard/projects/${project._id}`} key={project._id} className="block group">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:shadow-xl transition-all hover:border-blue-500/30 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-black/10 dark:bg-white/10 text-black dark:text-white rounded-xl group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                  {/* <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                    <MoreHorizontal className="w-5 h-5" />
                  </button> */}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    project.status === 'InProgress' ? 'bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white' :
                    project.status === 'Planning' ? 'bg-purple-100 text-purple-700' :
                    project.status === 'OnHold' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {project.status.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-neutral-500 text-sm mb-6 line-clamp-2 flex-grow">
                  {project.description || 'No description provided.'}
                </p>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-500">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black dark:bg-white rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-auto">
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
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-neutral-500 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <FolderKanban className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
          <h3 className="text-lg font-medium mb-1">No projects found</h3>
          <p className="max-w-sm mx-auto mb-6">Get started by creating a new project for your team.</p>
            <Link href="/dashboard/projects/create" className="text-black dark:text-white hover:underline font-medium">
            Create your first project →
          </Link>
        </div>
      )}
    </div>
  );
}
