'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowRight, Check, Trash2, Shield, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Loader } from '@/components/Loader';

interface Member {
    _id: string;
    name: string;
    email: string;
    uniqueId: string;
    role: string;
    image?: string;
}

interface Team {
    _id: string;
    name: string;
    description: string;
    members: { user: Member; role: string }[];
}

export default function AddMembersPage({ params }: { params: Promise<{ teamId: string }> }) {
  const router = useRouter();
  const { teamId } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [team, setTeam] = useState<Team | null>(null);
  const [uniqueId, setUniqueId] = useState('');

  const fetchTeam = async () => {
    try {
        const response = await fetch(`/api/teams/${teamId}`);
        if (response.ok) {
            const data = await response.json();
            setTeam(data);
        } else {
            toast.error("Failed to load team details");
        }
    } catch (error) {
        toast.error("An error occurred");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniqueId.trim()) return;

    setAdding(true);
    try {
        const response = await fetch(`/api/teams/${teamId}/members`, {
            method: 'POST',
            body: JSON.stringify({ uniqueId }),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok) {
            toast.success("Member added successfully!");
            setUniqueId('');
            fetchTeam(); // Refresh list
        } else {
            toast.error(data.message || "Failed to add member");
        }
    } catch (error) {
        toast.error("An error occurred");
    } finally {
        setAdding(false);
    }
  };

  const handeFinish = () => {
      router.push(`/dashboard/teams/${teamId}`);
  };

  if (loading) {
      return <Loader />;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-4">
                    <UserPlus className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Add Team Members</h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Invite colleagues to join <span className="font-semibold text-neutral-900 dark:text-white">{team?.name}</span>
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
                {/* Add Member Form */}
                <div className="space-y-6">
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                             <UserPlus className="w-5 h-5 text-blue-500" />
                             Add by Unique ID
                        </h2>
                        <form onSubmit={handleAddMember}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-neutral-600 dark:text-neutral-300">User's Unique ID</label>
                                <input 
                                    type="text" 
                                    value={uniqueId}
                                    onChange={(e) => setUniqueId(e.target.value)}
                                    placeholder="e.g. user_12345"
                                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
                                />
                                <p className="text-xs text-neutral-500 mt-2">Users can find their Unique ID in their profile settings.</p>
                            </div>
                            <button 
                                type="submit" 
                                disabled={adding || !uniqueId}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {adding ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <><UserPlus className="w-4 h-4" /> Add Member</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Member List */}
                <div>
                     <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-green-500" />
                        Current Members ({team?.members?.length || 0})
                    </h2>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {team?.members?.map((member, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-700/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                                        {member.user.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-neutral-900 dark:text-white">{member.user.name}</p>
                                        <p className="text-xs text-neutral-500 font-mono">{member.user.uniqueId}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                     {member.role === 'Leader' && (
                                         <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs rounded-full font-medium flex items-center gap-1">
                                             <Shield className="w-3 h-3" /> Leader
                                         </span>
                                     )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <button 
                    onClick={handeFinish}
                    className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                    Finish Setup
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
  );
}
