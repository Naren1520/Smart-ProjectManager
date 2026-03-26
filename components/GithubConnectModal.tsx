'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Github, X, Link, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function GithubConnectModal() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [githubUsername, setGithubUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        const checkGithubStatus = async () => {
             if (session?.user?.email) {
                 try {
                     const res = await fetch('/api/user/me');
                     if (res.ok) {
                         const userData = await res.json();
                         // If no github profile, show modal
                         if (!userData.githubProfile?.username) {
                             setIsOpen(true);
                         }
                     }
                 } catch (e) {
                     console.error("Failed to check github status", e);
                 } finally {
                     setHasChecked(true);
                 }
             }
        };

        if (session && !hasChecked) {
             checkGithubStatus();
        }
    }, [session, hasChecked]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!githubUsername.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/user/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ githubUsername })
            });

            if (res.ok) {
                toast.success('GitHub Connected!');
                setIsOpen(false);
                router.refresh();
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-800 relative animate-in fade-in zoom-in duration-300">
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-neutral-500/20">
                        <Github className="w-8 h-8" />
                    </div>

                    <h2 className="text-2xl font-bold mb-2">Connect GitHub</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-8 text-sm">
                        To get the most out of TeamForge, link your GitHub account. We'll analyze your repositories to suggest relevant projects and highlight your skills.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={githubUsername}
                                onChange={(e) => setGithubUsername(e.target.value)}
                                placeholder="GitHub Username"
                                className="w-full pl-4 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading || !githubUsername}
                            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
                            ) : (
                                <>
                                    Connect Account
                                    <Link className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                    
                    <button 
                         onClick={() => setIsOpen(false)}
                         className="mt-4 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 underline"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
}