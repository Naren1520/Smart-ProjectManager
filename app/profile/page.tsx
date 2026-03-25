'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function PublicProfileSearch() {
  const router = useRouter();
  const [searchId, setSearchId] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      router.push(`/profile/${searchId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black font-sans text-neutral-900 dark:text-neutral-100 flex flex-col">
       {/* Header */}
       <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-30">
         <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
             TeamForge AI
            </Link>
            <div className="flex gap-4">
                <Link href="/login" className="px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                    Login
                </Link>
            </div>
         </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 mb-8 inline-block transform rotate-[-2deg]">
            <UserCircle className="w-12 h-12 text-blue-600" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Find a <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Profile</span>
        </h1>
        
        <p className="text-lg text-neutral-500 max-w-lg mb-10">
            Enter a unique TeamForge ID to verify skills, view GitHub stats, and explore project history.
        </p>

        <form onSubmit={handleSearch} className="w-full max-w-md relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative flex items-center bg-white dark:bg-neutral-900 rounded-2xl p-2 border border-neutral-200 dark:border-neutral-700 shadow-xl">
                <Search className="w-6 h-6 text-neutral-400 ml-4 mr-3" />
                <input 
                    type="text" 
                    placeholder="Enter Unique ID (e.g. 8AD4X9)" 
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none font-medium placeholder:font-normal text-lg h-12"
                />
                <button 
                    type="submit"
                    disabled={!searchId.trim()}
                    className="p-3 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </form>

        <div className="mt-12 flex gap-8 text-neutral-400 text-sm">
            <div className="flex flex-col items-center gap-2">
                <span className="font-bold text-neutral-600 dark:text-neutral-300">Fast Verification</span>
                <span>Instance skill check</span>
            </div>
            <div className="w-px h-10 bg-neutral-200 dark:bg-neutral-800" />
             <div className="flex flex-col items-center gap-2">
                <span className="font-bold text-neutral-600 dark:text-neutral-300">Live GitHub Data</span>
                <span>Real-time stats</span>
            </div>
        </div>
      </main>
    </div>
  );
}
