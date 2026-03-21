import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { SkillMap } from "@/components/SkillMap";
import { FolderKanban, TrendingUp, CheckCircle, Clock } from "lucide-react";
import Link from 'next/link';
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import Team from "@/models/Team";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return <div className="p-8 text-center text-red-500">Please sign in to view your dashboard.</div>;
  }

  await dbConnect();

  // Fetch real user data
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return <div className="p-8 text-center text-red-500">User profile not found.</div>;
  }

  // Fetch projects associated with user's teams
  // First, get team IDs the user is part of
  const userTeamIds = user.teams || [];
  
  // Find projects for these teams
  const projects = await Project.find({ team: { $in: userTeamIds } }).populate('team').sort({ createdAt: -1 });

  // Calculate stats
  let totalTasks = 0;
  let completedTasks = 0;
  let activeProjects = 0;
  let highPriorityTasks = 0;

  projects.forEach((project: any) => {
    if (project.status === 'InProgress' || project.status === 'Planning') {
      activeProjects++;
    }

    if (project.tasks) {
      project.tasks.forEach((task: any) => {
        // Count tasks assigned to this user
        // We compare ObjectIds as strings
        if (task.assignedTo && task.assignedTo.toString() === user._id.toString()) {
           totalTasks++;
           if (task.status === 'Completed') {
             completedTasks++;
           }
           if (task.priority === 'High' && task.status !== 'Completed') {
             highPriorityTasks++;
           }
        }
      });
    }
  });

  const efficiency = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Skills Data (using real user skills)
  // Assuming skills are stored as strings in user.skills
  // We mock the scores for now as they aren't in the schema, or maybe map them if they exist
  const userSkills = (user.skills && user.skills.length > 0) ? user.skills.map((s: string) => ({
    subject: s, 
    A: 80 + Math.floor(Math.random() * 20), // Placeholder score until we have assessments
    fullMark: 100
  })) : [
    { subject: 'No Skills Added', A: 0, fullMark: 100 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse-fade-in">
      {/* Welcome & Stats */}
      <div className="col-span-full md:col-span-2 lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Welcome back, {user.name}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            You have <span className="text-neutral-900 dark:text-neutral-100 font-medium">{activeProjects} active projects</span> and <span className="text-neutral-900 dark:text-neutral-100 font-medium">{totalTasks - completedTasks} pending tasks</span>.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/dashboard/projects/create" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-medium">
              Create New Project
            </Link>
            <Link href="/dashboard/teams/join" className="px-5 py-2.5 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-xl transition-all font-medium">
              Join a Team
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Pending Tasks', value: (totalTasks - completedTasks).toString(), icon: Clock, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
            { label: 'Completed', value: completedTasks.toString(), icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
            { label: 'Active Projects', value: activeProjects.toString(), icon: FolderKanban, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Efficiency', value: `${efficiency}%`, icon: TrendingUp, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 shadow-sm">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Radar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex flex-col">
        <h3 className="text-lg font-semibold mb-4">Skill Profile</h3>
        <div className="flex-1 flex items-center justify-center">
            <SkillMap data={userSkills} />
        </div>
      </div>
    
      {/* Recent Activity */}
      <div className="col-span-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Recent Projects</h3>
            <Link href="/dashboard/projects" className="text-sm text-blue-600 hover:underline">View All</Link>
        </div>
        <div className="space-y-4">
            {projects.length > 0 ? projects.slice(0, 3).map((project: any) => (
                <Link key={project._id.toString()} href={`/dashboard/projects/${project._id}`}>
                <div className="flex items-center gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-xl transition-colors border border-transparent hover:border-neutral-100 dark:hover:border-neutral-800 cursor-pointer">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                        {project.title.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">{project.title}</h4>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{project.team?.name || 'No Team'} • {project.status}</p>
                    </div>
                    <div className="text-right">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                            project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            project.status === 'InProgress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                            {project.status.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                    </div>
                </div>
                </Link>
            )) : (
                <div className="text-center py-8 text-neutral-500">
                    No projects found. Join a team or create a project to get started!
                </div>
            )}
        </div>
      </div>
    </div>
  );
}