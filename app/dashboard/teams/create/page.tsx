'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CreateTeamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await fetch('/api/teams/create', {
            method: 'POST',
            body: JSON.stringify({ name, description: desc }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            toast.success("Team created successfully!");
            router.push('/dashboard');
        } else {
            toast.error("Failed to create team. Check your connection.");
        }
    } catch (error) {
        toast.error("An error occurred");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
        <Link href="/dashboard/teams" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Team Selection
        </Link>
        
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                <UserPlus className="w-6 h-6" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Create New Team</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8">
                Set up a new workspace for your project. You'll be the team leader.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Team Name</label>
                    <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Apollo Project"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                    <textarea 
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="What is this team working on?"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating Workspace...' : 'Create Team'}
                </button>
            </form>
        </div>
    </div>
  );
}