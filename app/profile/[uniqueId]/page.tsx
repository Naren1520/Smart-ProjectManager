import { Github, FolderKanban, TrendingUp, CheckCircle, Clock } from "lucide-react";
import Link from 'next/link';
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Project from "@/models/Project";
import { getGithubProfile, getGithubLanguages } from "@/lib/github";
import { SkillMap } from "@/components/SkillMap";

export default async function PublicProfilePage({ params }: { params: Promise<{ uniqueId: string }> }) {
  const { uniqueId } = await params;
  await dbConnect();

  // 1. Fetch User by uniqueId (Case insensitive)
  const user = await User.findOne({ 
    uniqueId: { $regex: new RegExp(`^${uniqueId}$`, 'i') } 
  }).lean();

  if (!user) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <h1 className="text-4xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-neutral-500 mb-8">The Unique ID you entered does not exist.</p>
            <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Go Home</Link>
        </div>
    );
  }

  // 2. Fetch GitHub Data
  let githubStats = null;
  let githubLanguages: string[] = [];
  
  if (user.githubProfile?.username) {
      try {
          githubStats = await getGithubProfile(user.githubProfile.username);
          githubLanguages = await getGithubLanguages(user.githubProfile.username);
      } catch (e) {
          console.error("Failed Github fetch", e);
      }
  }

  // 3. Fetch User's Projects (Assuming public visibility logic or just listing)
  // For now, list projects they lead or are part of
  const projects = await Project.find({ 'members.user': user._id })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate('team')
    .lean();

  // 4. Calculate Skills
  const allSkills = Array.from(new Set([...(user.skills || []), ...githubLanguages]));
  const userSkills = allSkills.length > 0 ? allSkills.map((s: string) => ({
      subject: s,
      A: 80 + Math.floor(Math.random() * 20),
      fullMark: 100
  })) : [{ subject: 'No Skills', A: 0, fullMark: 100 }];


  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black font-sans text-neutral-900 dark:text-neutral-100">
      
      {/* Header / Hero */}
      <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-30">
         <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
             TeamForge AI
            </div>
            <div className="flex gap-4">
                <Link href="/login" className="px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                    Login
                </Link>
                <Link href="/register" className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    Join TeamForge
                </Link>
            </div>
         </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10" />
            
            <div className="relative flex flex-col md:flex-row gap-8 items-start pt-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center text-3xl font-bold shadow-inner border border-neutral-200 dark:border-neutral-700">
                    {user.name.charAt(0)}
                </div>
                
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                    <p className="text-neutral-500 text-lg mb-4 max-w-2xl">{user.bio || 'Building amazing things with code.'}</p>
                    
                    <div className="flex flex-wrap gap-3">
                        {user.uniqueId && (
                            <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs font-mono border border-neutral-200 dark:border-neutral-700">
                                ID: {user.uniqueId}
                            </span>
                        )}
                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium border border-blue-100 dark:border-blue-900/30">
                            Level {user.level || 1}
                        </span>
                        <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full text-xs font-medium border border-amber-100 dark:border-amber-900/30">
                            {user.points || 0} XP
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[140px]">
                    {/* Add to Team Action (Placeholder - would link to a generic team invite flow if implemented) */}
                    <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all">
                        Invite to Team
                    </button>
                    {user.githubProfile?.username && (
                        <Link 
                            href={`https://github.com/${user.githubProfile.username}`} 
                            target="_blank"
                            className="w-full py-2.5 text-center bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Github className="w-4 h-4" />
                            GitHub
                        </Link>
                    )}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Stats & Skills */}
            <div className="lg:col-span-1 space-y-6">
                 {/* GitHub Stats Mini */}
                 {user.githubProfile?.username && githubStats && (
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Github className="w-5 h-5" />
                            GitHub Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                                <span className="text-sm text-neutral-500">Repositories</span>
                                <span className="font-bold">{githubStats.public_repos}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                                <span className="text-sm text-neutral-500">Followers</span>
                                <span className="font-bold">{githubStats.followers}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                                <span className="text-sm text-neutral-500">Following</span>
                                <span className="font-bold">{githubStats.following}</span>
                            </div>
                        </div>
                    </div>
                 )}

                 {/* Skills */}
                 <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col h-[400px]">
                    <h3 className="font-bold text-lg mb-4">Skill Map</h3>
                    <div className="flex-1 -ml-4">
                        <SkillMap data={userSkills} />
                    </div>
                 </div>
            </div>

            {/* Right Column: Projects & Activity */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Recent Projects */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <FolderKanban className="w-5 h-5 text-blue-500" />
                        Recent Projects
                    </h3>
                    
                    <div className="space-y-4">
                        {projects.length > 0 ? (
                            projects.map((project: any) => (
                                <div key={project._id} className="group p-5 bg-neutral-50 dark:bg-neutral-800/30 hover:bg-white dark:hover:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-800 rounded-xl transition-all cursor-default">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{project.title}</h4>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            project.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                            project.status === 'InProgress' ? 'bg-blue-100 text-blue-700' : 
                                            'bg-neutral-200 text-neutral-600'
                                        }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{project.description || 'No description provided.'}</p>
                                    
                                    {project.techStack && project.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack.slice(0, 4).map((tech: string) => (
                                                <span key={tech} className="text-xs px-2 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-600 dark:text-neutral-400">
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.techStack.length > 4 && (
                                                <span className="text-xs px-2 py-1 text-neutral-400">+{project.techStack.length - 4}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-neutral-400 italic">No public projects found.</div>
                        )}
                    </div>
                </div>

                {/* Github Contribution Graph (if available) */}
                {user.githubProfile?.username && (
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                        <div className="text-sm font-medium mb-4 text-neutral-500 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Contribution Activity
                        </div>
                        <div className="scrollbar-hide overflow-x-auto pb-2">
                            <img 
                                src={`https://github-readme-activity-graph.vercel.app/graph?username=${user.githubProfile.username}&theme=react-dark-high-contrast&hide_border=true&area=true`} 
                                alt="GitHub Contributions"
                                className="w-full min-w-[600px] dark:opacity-90" 
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>

      </main>
    </div>
  );
}
