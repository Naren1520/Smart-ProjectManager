'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function JoinTeamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await fetch('/api/teams/join', {
            method: 'POST',
            body: JSON.stringify({ code: code.toUpperCase() }), // Or whatever format
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok)
        {
            toast.success("Joined team successfully!");
            router.push('/dashboard/teams');
        } else {
            toast.error("Could not find team or invalid code.");
        }
    } catch (error) {
        toast.error("An error occurred");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
        <Link href="/dashboard/teams" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Team Selection
        </Link>
        
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-xl">
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6">
                <Users className="w-6 h-6" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Join a Team</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8">
                Enter the invite code shared by your team administrator.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Invite Code</label>
                    <input 
                        type="text" 
                        required
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="e.g. A1B2C3-X9Y8Z7"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none focus:ring-2 focus:ring-violet-500 transition-all font-mono tracking-widest text-center text-lg uppercase"
                    />
                </div>

                <div className="bg-neutral-100 dark:bg-neutral-800/50 p-4 rounded-xl text-sm text-neutral-600 dark:text-neutral-400">
                    <p>Don't have a code? Ask your team leader to generate one from the team settings page.</p>
                </div>

                <button 
                    type="submit" 
                    disabled={loading || code.length < 6}
                    className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Joining Team...' : 'Join Workspace'}
                </button>
            </form>
        </div>
    </div>
  );
}