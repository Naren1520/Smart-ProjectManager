'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
    Users, Plus, Brain, Calendar, Clock, ArrowRight, UserPlus, FileText, CheckCircle, Trash2, Copy
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Team {
    _id: string;
    name: string;
    description: string;
    uniqueId?: string;
    members: { user: any; role: string }[];
}

interface Project {
    _id: string;
    title: string;
    description: string;
    status: string;
    deadline?: string;
    tasks: any[];
}

export default function TeamDetailsPage({ params }: { params: Promise<{ teamId: string }> }) {
    const { data: session } = useSession();
    const { teamId } = use(params);
    const router = useRouter();
    const [team, setTeam] = useState<Team | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    // Check if current user is leader
    const isLeader = team?.members?.some((m: any) => 
        m.user?.email === session?.user?.email && m.role === 'Leader'
    );

    const handleDeleteTeam = async () => {
        if (!confirm('Are you sure you want to delete this team? This action cannot be undone and will delete all associated projects.')) return;
        
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/teams/${teamId}`, {
                method: 'DELETE'
            });
            
            if (res.ok) {
                toast.success('Team deleted successfully');
                router.push('/dashboard/teams');
                router.refresh();
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to delete team');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        const fetchTeamData = async () => {
             // 1. Fetch Team Details
             try {
                const teamRes = await fetch(`/api/teams/${teamId}`);
                if (!teamRes.ok) throw new Error("Failed to load team");
                const teamData = await teamRes.json();
                setTeam(teamData);

                // 2. Fetch Projects linked to this team
                // Need an endpoint for this, implementing now... Done.
                const projRes = await fetch(`/api/teams/${teamId}/projects`);
                if (projRes.ok) {
                    const projData = await projRes.json();
                    setProjects(projData);
                }
             } catch (error) {
                 toast.error("Failed to load team details");
                 router.push('/dashboard/teams');
             } finally {
                 setLoading(false);
             }
        };

        fetchTeamData();
    }, [teamId]);

// We need to check leadership
    const currentUserRole = team?.members?.find((m: any) => 
        m.user?.email === session?.user?.email
    )?.role;
    
    // Check if the current user is the leader.
    // team?.members is array of { user: {...}, role: '..' } from API.
    // We can rely on API population.
    const amILeader = currentUserRole === 'Leader';

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!team) return <div>Team not found</div>;

    return (
        <div className="max-w-7xl mx-auto py-8 space-y-8 px-4">
            {/* Team Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white">{team.name}</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl">{team.description}</p>
                </div>
                <div className="flex gap-3">
                    <Link href={`/dashboard/teams/${teamId}/add-members`} className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                        <UserPlus className="w-4 h-4" />
                        Manage Members
                    </Link>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                        <Plus className="w-4 h-4" />
                        New Project
                    </button>
                    {amILeader && (
                        <button
                            onClick={handleDeleteTeam}
                            disabled={isDeleting}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-600 rounded-xl hover:bg-red-600/20 transition-colors"
                        >
                           <Trash2 className="w-4 h-4" /> 
                           {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Projects */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Brain className="w-5 h-5 text-indigo-500" />
                            Active Projects
                        </h2>
                    </div>

                    {projects.length === 0 ? (
                        <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-700">
                            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                                <FileText className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-medium mb-1">No projects yet</h3>
                            <p className="text-neutral-500 mb-6">Create your first project to start collaborating</p>
                            <button className="px-6 py-2 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors font-medium text-sm">
                                Create Project
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {projects.map((project) => (
                                <div key={project._id} className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/30 transition-all group shadow-sm hover:shadow-md">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                                            <p className="text-sm text-neutral-500 line-clamp-2">{project.description}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            project.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            project.status === 'InProgress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                                        }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-6 text-sm text-neutral-500">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>{project.tasks?.length || 0} Tasks</span>
                                        </div>
                                        {project.deadline && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(project.deadline).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar: Members */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        {/* Invite Code */}
                        <div className="mb-6 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-100 dark:border-violet-800">
                            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">
                                Invite Code
                            </p>
                            <div className="flex items-center justify-between gap-2">
                                <code className="text-lg font-mono font-bold text-neutral-800 dark:text-neutral-200">
                                    {team.uniqueId || 'Generating...'}
                                </code>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(team.uniqueId || '');
                                        toast.success('Copied to clipboard');
                                    }}
                                    className="p-2 hover:bg-violet-200 dark:hover:bg-violet-800/50 rounded-lg transition-colors text-violet-600"
                                    title="Copy Code"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-[11px] text-neutral-500 mt-2 leading-relaxed">
                                Share this with your team to check in.
                            </p>
                        </div>
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-500" />
                            Team Members
                            <span className="ml-auto text-xs font-normal text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
                                {team.members?.length}
                            </span>
                        </h2>
                        
                        <div className="space-y-4">
                            {/* We need to populate members properly in API to show names */}
                            {/* Assuming API returns populated members from previous file edit */}
                            {team.members?.map((member: any, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                                        {member.user?.name?.[0] || 'U'}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-medium text-sm truncate">{member.user?.name || 'Unknown User'}</p>
                                        <p className="text-xs text-neutral-500 truncate">{member.user?.email}</p>
                                    </div>
                                    {member.role === 'Leader' && (
                                        <span className="ml-auto text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200">
                                            LEAD
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Link 
                            href={`/dashboard/teams/${teamId}/add-members`}
                            className="mt-6 w-full py-2.5 flex items-center justify-center gap-2 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Member
                        </Link>
                    </div>

                    {/* Quick Stats or Info */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-lg text-white">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Sprint Status
                        </h3>
                        <p className="text-blue-100 text-sm mb-4">No active sprints. Plan your next sprint to track progress.</p>
                        <button className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors border border-white/20">
                            Start Sprint
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}