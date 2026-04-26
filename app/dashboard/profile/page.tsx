'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, RefreshCw, Share2, Search, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ProfileShareSettings() {
    const { data: session } = useSession();
    const router = useRouter();
    const [uniqueId, setUniqueId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState('');

    useEffect(() => {
        const fetchId = async () => {
            if (session?.user?.email) {
                try {
                    const res = await fetch('/api/user/me');
                    if (res.ok) {
                        const data = await res.json();
                        setUniqueId(data.uniqueId);
                    }
                } catch (e) {
                    toast.error("Failed to load profile ID");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchId();
    }, [session]);

    // Construct profile URL - prioritize production domain for consistent QR code
    const baseUrl = 'https://smart-projectmanager.vercel.app'; 
    const profileUrl = uniqueId ? `${baseUrl}/profile/${uniqueId}` : '';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success('Unique Profile Link Copied!');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchId.trim()) return;
        router.push(`/profile/${searchId.trim().toUpperCase()}`);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold mb-8">Share & Find Profiles</h1>
            
            {/* Find Others Section */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5 text-black dark:text-white" />
                    Find a Peer
                </h3>
                <p className="text-neutral-500 mb-6 max-w-xl">
                    Enter a unique ID to view a colleague's or candidate's public profile, skills, and GitHub stats.
                </p>
                <form onSubmit={handleSearch} className="flex gap-4 max-w-md">
                    <input 
                        type="text" 
                        placeholder="Enter Unique ID (e.g. 5X9A2B)"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono uppercase placeholder:normal-case"
                    />
                    <button 
                        type="submit"
                        disabled={!searchId.trim()}
                        className="px-6 py-2.5 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-black rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                        View
                        <ExternalLink className="w-4 h-4" />
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* QR Code Card */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-lg flex flex-col items-center justify-center text-center">
                    <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-inner mb-6">
                        <QRCodeSVG 
                            value={profileUrl} 
                            size={200}
                            level="H" 
                            className="w-full h-full max-w-[200px]"
                        />
                    </div>
                    <h2 className="text-xl font-bold mb-2">{session?.user?.name}</h2>
                    <p className="text-neutral-500 mb-6 text-sm">Scan to view profile & stats</p>
                    
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={copyToClipboard}
                            className="flex-1 py-2.5 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/20 dark:shadow-white/20"
                        >
                            <Copy className="w-4 h-4" />
                            Copy Link
                        </button>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-sm flex flex-col justify-center">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-black dark:text-white" />
                        Your Unique ID
                    </h3>
                    <p className="text-neutral-500 mb-6">
                        Share this ID with team leads to be added to projects manually, or send your profile link to showcase your GitHub stats and skills.
                    </p>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 flex justify-between items-center">
                            <code className="text-2xl font-mono font-bold tracking-widest text-neutral-900 dark:text-neutral-100">
                                {uniqueId || 'Generating...'}
                            </code>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(uniqueId);
                                    toast.success('ID Copied!');
                                }}
                                className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                            >
                                <Copy className="w-5 h-5 text-neutral-500" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl">
                        <h4 className="font-semibold text-black dark:text-white mb-1 text-sm">Pro Tip</h4>
                        <p className="text-xs text-black dark:text-white">
                            You can add this QR code to your resume or portfolio website so recruiters can instantly verify your skills and project history.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}